/*
 * Entry point of the bot,
 * this is the driver module.
 * */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./json/config');
const actions = require('./actions');
const app = require('./app');


app.listen(3000, () => {
  console.log(`Express is running on port ${app.port}`);
})

client.on('ready', () => {
  console.log('Eventioner is online! :D');

  // Loads all actions that eventioner
  // can perform through commands inside
  // discord
  actions(client);
})

// Loging the bot to the server
client.login(config.token);
