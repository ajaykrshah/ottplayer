import React from 'react';

const StreamList = ({ streams, handleStreamClick }) => {
  return (
    <div className="streams">
      {streams.map((stream, index) => (
        <div key={index} onClick={() => handleStreamClick(stream.tvgChno)} className="stream-card">
          <img src={stream.logo} alt={stream.name} />
          <h3>{stream.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default StreamList;
