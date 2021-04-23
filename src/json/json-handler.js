'use strict';

const fs = require('fs');
const path = require('path');

let config;

// Async read
/*
const getFileContent = async () => {
  return new Promise(resolve, rejected) => {
    fs.readFile(path.join(__dirname, 'config.json'), (err, data) => {
        if (err) throw err;
        config = JSON.parse(data);
        console.log(`Config in handler: ${JSON.stringify(config)}`);
    });
  }
}
*/

// Sync read
let configRaw = fs.readFileSync(path.join(__dirname, 'config.json'));
config = JSON.parse(configRaw);

const updateJson = (newJson) => {
  fs.writeFile(path.join(__dirname, 'config.json'), json, 'utf8', callback);
}

module.exports = {
  config: config,
}
