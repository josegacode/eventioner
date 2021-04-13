/*
 * Entry point of the bot,
 * this is the driver module.
 * */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log('Eventioner is online! :D');
})

// Loging the bot to the server
client.login(config.token);
