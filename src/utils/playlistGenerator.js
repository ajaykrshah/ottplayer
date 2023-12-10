const CHANNELS_STORAGE_KEY = "channels";
const API_URL = "https://jiotv.data.cdn.jio.com/apis/v1.4/getMobileChannelList/get/?os=android&devicetype=phone";
const USER_AGENT = "plaYtv/7.0.8 (Linux;Android 7.1.2) ExoPlayerLib/2.11.7";
const CACHE_VALIDITY_PERIOD = 21600000; // 6 hours in milliseconds

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

    // if (![1, 6].includes(channelLanguageId)) {
      let channelInfo = `#EXTINF:-1 tvg-chno="${channel_id}" tvg-name="${channel_name}" tvg-logo="${channelLogoUrl}" tvg-language="${channelLanguage}" tvg-type="${channelCategory}" group-title="${channelCategory}"`;
      
      if (isCatchupAvailable) {
        channelInfo += ` catchup="vod" catchup-source="${ServerUrl}/catchup/getm3u8/\${start}/\${end}/${channel_id}/index.m3u8" catchup-days="7"`;
      }
      
      channelInfo += `, ${channel_name}\x20\x0a${ServerUrl}/getm3u8/${channel_id}/master.m3u8\x0a`;
      m3u8PlaylistFile += channelInfo;
    // }
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
    19: "JioDarshan",
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