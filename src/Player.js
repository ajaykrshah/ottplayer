import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import './Player.css';
import { fetchEPGForChannel } from './utils/playlistGenerator';
import IconButton from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const Player = ({ selectedStream ,goBack}) => {
  
  const [dataList, setDataList] = useState([]);
  const listRef = useRef(null);
  
  useEffect(() => {
    // Fetch data from your API endpoint
    const fetchData = async () => {
      try {
        const channelInfo = {
          "channel_id": selectedStream.tvgChno,
          "channel_name": selectedStream.name.trim(),
          "logoUrl": selectedStream.logo
        };
        const data = await fetchEPGForChannel(channelInfo);
        // Set the fetched data to the state variable
        setDataList(data);
      } catch (error) {
        console.error('Error fetching EPG data:', error);
      }
    };

    fetchData();
  }, []);

  const scrollToCurrentItem = () => {
    if (listRef.current && dataList?.programmes) {
      const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      const indexToScroll = dataList.programmes.findIndex((program) => {
        // Replace with your logic to check if the program is currently airing
        return program["@start"] <= now && program["@stop"] >= now;
      });

      if (indexToScroll !== -1) {
        scrollToItem(indexToScroll);
      }
    }
  };

  const scrollToItem = (index) => {
    if (listRef.current && dataList?.programmes && dataList.programmes[index]) {
      const listItem = listRef.current.querySelectorAll('.program-item')[index];
      if (listItem) {
        listItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    scrollToCurrentItem();
  }, [dataList]); // Update the dependency array as needed

  return (
    <div id='Player'>
      <IconButton className="back-btn" onClick={goBack}>
        <ArrowBackIcon /> Back
      </IconButton>
      
      <div className="container">
        <div className="player-wrapper">
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url={selectedStream.url}
                  controls={true} playing={true}
                />
        </div>
      
        <div className="program-list" ref={listRef}>
          <ul className="scrollable-list">
            {dataList?.programmes?.map((program, index) => (
              <li key={index} className="program-item">
                <div className="program-details">
                  <img
                    src={program.icon['@src']}
                    alt={program.title}
                    className="program-icon"
                  />
                  <div className="program-info">
                    <h3>{program.title}</h3>
                    <p>{program.desc}</p>
                    <p>Start Date: {program["@start"]}</p>
                    <p>Stop Date: {program["@stop"]}</p>
                    <p>Category: {program.category}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

  );
  
};

export default Player;
