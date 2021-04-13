/*
 * Entry point of the bot,
 * this is the driver module.
 * */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const actions = require('./actions');

client.on('ready', () => {
  console.log('Eventioner is online! :D');

  // Loads all actions that eventioner
  // can perform through commands inside
  // discord
  actions(client);
})

// Loging the bot to the server
client.login(config.token);
