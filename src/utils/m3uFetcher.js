import parseM3UData from './m3uParser';
import { jsonToM3UPlaylist } from './playlistGenerator';

const fetchM3UPlaylist = async (setStreams) => {
  try {
    // Assuming jsonToM3UPlaylist is an asynchronous function, use await here
    const playlistData = await jsonToM3UPlaylist();
    const parsedStreams = parseM3UData(playlistData);
    setStreams(parsedStreams);
  } catch (error) {
    console.error("Error fetching or parsing playlist:", error);
    // Handle error state or inform the user about the issue
  }
};

export default fetchM3UPlaylist;
