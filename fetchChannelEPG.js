// fetchChannelEPG.js

const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://jiotv.data.cdn.jio.com/apis/v1.3/getepg/get?channel_id=143&offset=0';

axios.get(apiUrl)
  .then(response => {
    const data = response.data;

    fs.writeFileSync('data.txt', JSON.stringify(data));

    console.log('Data written to data.txt');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
