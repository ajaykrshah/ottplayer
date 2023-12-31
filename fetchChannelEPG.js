// fetchChannelEPG.js

const axios = require('axios');
const fs = require('fs');

//const apiUrl = 'http://jiotv.data.cdn.jio.com/apis/v1.3/getepg/get?channel_id=143&offset=0';
//const apiUrl = 'http://jsonplaceholder.typicode.com/todos/1';
const apiUrl = 'https://jiotv.data.cdn.jio.com/apis/v1.4/getMobileChannelList/get/?os=android&devicetype=phone';

axios.get(apiUrl)
  .then(response => {
    const data = response.data;

    fs.writeFileSync('data.txt', JSON.stringify(data));

    console.log('Data written to data.txt');
  })
  .catch(error => {
    fs.writeFileSync('data.txt', JSON.stringify(error));
    console.error('Error fetching data:', error);
  });
