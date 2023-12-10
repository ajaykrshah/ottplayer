import React from 'react';
import ReactPlayer from 'react-player';

const Player = ({ selectedStream, handleClosePlayer }) => {
  return (
    <div>
      <button className="close-btn" onClick={handleClosePlayer}>Close Player</button>
      <ReactPlayer url={selectedStream.url} controls={true} />
    </div>
  );
};

export default Player;
