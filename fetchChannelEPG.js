// fetchChannelEPG.js

const axios = require('axios');
const fs = require('fs');

const apiUrl = 'http://jsonplaceholder.typicode.com/todos/1';

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
