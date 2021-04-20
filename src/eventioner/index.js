/*
 * Entry point of the bot,
 * this is the driver module.
 * */
const Discord = require('discord.js');
const client = new Discord.Client();

// User modules
const config = require('./json/config');

// Basic commands related to the bot
const core = require('./commands/core');

// Commands related with mentors
const mentors = require('./commands/mentors');

client.on('ready', () => {
  console.log('Eventioner is online! :D');

  // Command modules load
  core(client);
  mentors(client);
})

// Loging the bot to the server
client.login(config.token);
