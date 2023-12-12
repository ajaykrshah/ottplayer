const CHANNELS_STORAGE_KEY = "channels";
const API_URL = "https://jiotv.data.cdn.jio.com/apis/v1.4/getMobileChannelList/get/?os=android&devicetype=phone";
const USER_AGENT = "plaYtv/7.0.8 (Linux;Android 7.1.2) ExoPlayerLib/2.11.7";
const CACHE_VALIDITY_PERIOD = 21600000; // 6 hours in milliseconds
const IMG = "https://jiotv.catchup.cdn.jio.com/dare_images";

export async function fetchChannelsJSON() {
  try {
    const storedData = JSON.parse(localStorage.getItem(CHANNELS_STORAGE_KEY) || '{}');

    if (isCacheValid(storedData)) {
      return storedData;
    }

    const options = {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent": USER_AGENT,
      },
    };

    const response = await fetch(API_URL, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    responseData["genrateDate"] = new Date().getTime();
    
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(responseData));
    
    return responseData;
  } catch (error) {
    console.error("Error fetching channels:", error.message);
    throw new Error("Failed to fetch channels");
  }
}

export function isCacheValid(data) {
  return data && data.genrateDate && (new Date().getTime() - data.genrateDate < CACHE_VALIDITY_PERIOD);
}

export async function jsonToM3UPlaylist(){
  var m3u8PlaylistFile = '#EXTM3U  x-tvg-url="https://tobalan.github.io/epg.xml.gz"\x0a';
  const response = await fetchChannelsJSON();
  const ServerUrl = process.env.REACT_APP_BASE_URL || 'http://192.168.101.30:3500';


  for (let resData of response["result"]) {
    const { channel_name, channel_id, logoUrl, channelCategoryId, channelLanguageId, isCatchupAvailable } = resData;
    const channelLogoUrl = `https://jiotv.catchup.cdn.jio.com/dare_images/images/${logoUrl}`;
    const channelCategory = genreMap[channelCategoryId];
    const channelLanguage = langMap[channelLanguageId];

    if ([1, 6, 12].includes(channelLanguageId)) {
      let channelInfo = `#EXTINF:-1 tvg-chno="${channel_id}" tvg-name="${channel_name}" tvg-logo="${channelLogoUrl}" tvg-language="${channelLanguage}" tvg-type="${channelCategory}" group-title="${channelCategory}"`;
      
      if (isCatchupAvailable) {
        channelInfo += ` catchup="vod" catchup-source="${ServerUrl}/catchup/getm3u8/\${start}/\${end}/${channel_id}/index.m3u8" catchup-days="7"`;
      }
      
      channelInfo += `, ${channel_name}\x20\x0a${ServerUrl}/getm3u8/${channel_id}/master.m3u8\x0a`;
      m3u8PlaylistFile += channelInfo;
    }
  }
  
  return m3u8PlaylistFile;
}

export const genreMap = {
    8: "Sports",
    5: "Entertainment",
    6: "Movies",
    12: "News",
    13: "Music",
    7: "Kids",
    9: "Lifestyle",
    10: "Infotainment",
    15: "Devotional",
    0x10: "Business",
    17: "Educational",
    18: "Shopping",
};

export const langMap = {
    6: "English",
    1: "Hindi",
    2: "Marathi",
    3: "Punjabi",
    4: "Urdu",
    5: "Bengali",
    7: "Malayalam",
    8: "Tamil",
    9: "Gujarati",
    10: "Odia",
    11: "Telugu",
    12: "Bhojpuri",
    13: "Kannada",
    14: "Assamese",
    15: "Nepali",
    16: "French",
};

export const extractChannelName = async ()=>{
  
  // Initialize an empty array to store objects that meet the condition
  let jsonArray = [];
  const response = await fetchChannelsJSON();
  for (let resData of response["result"]) {
       // Check if the channelLanguageId is not in [1, 6]
       if ([1, 6].includes(resData["channelLanguageId"] )) {
        // Create an object based on the condition and push it to the jsonArray
        jsonArray.push({ channel_id: resData["channel_id"], channel_name : resData["channel_name"] });
    }
  };
  return jsonArray;
} 

// Function to fetch EPG data for a channel
export async function fetchEPGForChannel(channelInfo) {
  // Define API endpoints
  const API = "https://jiotv.data.cdn.jio.com/apis";
  const MAX_RETRY = 1;
  const channelData = [];
  const programmes = [];
  // Loop through days for EPG data retrieval
  for (let day = 0; day < 1; day++) {
      let retryCount = 0;
      // Retry fetching data for a channel if unsuccessful
      while (retryCount < MAX_RETRY) {
          try {

            const params = new URLSearchParams({
              offset: day,
              channel_id: channelInfo.channel_id,
              langId: "6"
            });
              // Make an API call to fetch EPG data
              const resp = await fetch(`${API}/v1.3/getepg/get?${params}`);
              const data = await resp.json();

              // Process EPG data for today (day === 0)
              if (day === 0) {
                  channelData.push({
                      "@id": channelInfo.channel_id,
                      "display-name": channelInfo.channel_name,
                      "icon": {
                          "@src": `${IMG}/images/${channelInfo.logoUrl}`
                      }
                  });
              }

              // Process each EPG entry from the API response
              data.epg.forEach(eachEPG => {
                  const pdict = parseEPGData(eachEPG); // Parse the EPG entry using the parseEPGData function
                  programmes.push(pdict); // Add the parsed data to the programme array
              });
              break; // Break out of the retry loop if successful
          } catch (error) {
              console.log(`Retry failed (Retry Count: ${retryCount + 1}): ${error}`);
              retryCount++;
              // Handle errors and retry after a delay
              if (retryCount === MAX_RETRY) {
                 // errorChannels.push(channelInfo.channel_id);
              } else {
                  await new Promise(resolve => setTimeout(resolve, 2000)); // Retry after waiting for 2 seconds
              }
          }
      }
  }

  return { channelData, programmes };
}


// Function to parse and format each EPG entry
const parseEPGData = eachEPG => {
  // Initialize the dictionary object to store parsed EPG data
  const options = { timeZone: 'Asia/Kolkata' };
  const pdict = {
      "@start": new Date(eachEPG.startEpoch).toLocaleString('en-IN', options),
      "@stop": new Date(eachEPG.endEpoch).toLocaleString('en-IN', options),
      "@channel": eachEPG.channel_id,
      "@catchup-id": eachEPG.srno,
      "title": eachEPG.showname,
      "desc": eachEPG.description,
      "category": eachEPG.showCategory,
      "icon": {
          "@src": `${IMG}/shows/${eachEPG.episodePoster}`
      }
  };

  // Include episode number if available
  if (eachEPG.episode_num > -1) {
      pdict["episode-num"] = {
          "@system": "xmltv_ns",
          "#text": `0.${eachEPG.episode_num}`
      };
  }

  // Include director and actors' information if available
  if (eachEPG.director || eachEPG.starCast) {
      pdict["credits"] = {
          "director": eachEPG.director,
          "actor": eachEPG.starCast && eachEPG.starCast.split(', ')
      };
  }

  // Include episode description if available
  if (eachEPG.episode_desc) {
      pdict["sub-title"] = eachEPG.episode_desc;
  }

  return pdict; // Return the formatted EPG entry
};
