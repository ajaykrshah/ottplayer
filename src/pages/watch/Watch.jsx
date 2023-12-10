import React, { useRef, useEffect } from 'react';
import '@vime/core/themes/default.css';
import { Player, Hls } from '@vime/react';
// import { useHistory } from 'react-router-dom';

export default function Watch() {
  // const history = useHistory();
  const videoRef = useRef(null);
  const hlsConfig = {
    // HLS specific configuration options
    autoStartLoad: true, // Start loading the video automatically
    maxBufferLength: 30, // Maximum buffer length in seconds
    maxMaxBufferLength: 60, // Maximum buffer length in seconds (upper limit)
    startLevel: -1, // Initial quality level index
  };
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Your video initialization code remains unchanged
      if (window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource('http://192.168.101.30:3500/getm3u8/173/master.m3u8');
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'http://192.168.101.30:3500/getm3u8/173/master.m3u8';
        video.play(); // Start playing for non-HLS supported browsers
      }
    }
  }, []);

  const handleBack = () => {
    // history.push('/');
  };

  return (
    <div className="watch">
    <Player controls>
      <Hls version="latest" config={hlsConfig}>
        <source
          data-src="http://192.168.101.30:3500/getm3u8/173/master.m3u8"
          type="application/x-mpegURL"
        />
      </Hls>
    </Player>
    <div className="back-button" onClick={handleBack}>
      Back to Home
    </div>
  </div>
  );
}
