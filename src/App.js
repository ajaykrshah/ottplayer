import React, { useState, useEffect } from 'react';
import './App.css';
import ThemeToggle from './ThemeToggle';
import fetchM3UPlaylist from './utils/m3uFetcher';
import StreamList from './StreamList';
import StreamFilter from './StreamFilter';
import Player from './Player';

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

  const handleClosePlayer = () => {
    setSelectedStream(null);
  };


  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="app-container">
        <h1>React M3U Player</h1>
        <StreamFilter streams={streams} setFilteredStreams={setFilteredStreams} />
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {selectedStream ? (
          <Player selectedStream={selectedStream} handleClosePlayer={handleClosePlayer} />
        ) : (
          <StreamList streams={filteredStreams} handleStreamClick={handleStreamClick} />
        )}

      </div>
    </div>
  );
};

export default App;
