import React, { useState, useEffect } from 'react';
import './App.css';
import ThemeToggle from './ThemeToggle';
import fetchM3UPlaylist from './utils/m3uFetcher';
import StreamList from './StreamList';
import StreamFilter from './StreamFilter';
import Player from './Player';
import { extractChannelName, fetchEPGForChannel } from './utils/playlistGenerator';
import ReactPlayer from 'react-player';
const App = () => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Save the theme preference in localStorage
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };
  
  useEffect(() => {
    // Get the theme preference from localStorage on component mount.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }

    // Fetch playlistand set it to view.
    fetchM3UPlaylist(setStreams);
  }, []);

  const handleStreamClick = (tvgChno) => {
    const index = streams.findIndex((stream) => stream.tvgChno === tvgChno);
    setSelectedStream(streams[index]);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="app-container">
        <h1>React M3U Player</h1>
        <StreamFilter streams={streams} setFilteredStreams={setFilteredStreams} />
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {selectedStream ? (
          <Player selectedStream={selectedStream} goBack={() => setSelectedStream(null)}/>
        ) : (
          <StreamList streams={filteredStreams} handleStreamClick={handleStreamClick} />
        )}

      </div>
    </div>
  );
};

const App2 = () => {
  const [channelListData, setChannelListData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
          
        const channelInfo = {
            "channel_id": "144",
            "channel_name": "Colors HD",
            "logoUrl": "http://jiotv.catchup.cdn.jio.com/dare_images/images/Colors_HD.png"
          };
          
      
        const data = await fetchEPGForChannel(channelInfo);
        setChannelListData(data);
      } catch (error) {
        // Handle errors if necessary
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Your React App</h1>
      {/* <ReactPlayer url='http://192.168.101.30:3500/getm3u8/173/master.m3u8' controls={true} playing={true}/> */}

      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          url='http://192.168.101.30:3500/getm3u8/173/master.m3u8'
          width="100%"
          height="100%"
          controls // Add other props like controls, playing, etc. as needed
        />
      </div>
    </div>
  );
};

export default App;
