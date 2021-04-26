/*
 * Entry point of the bot,
 * this is the driver module.
 * */

// Node modules
// For manage system files
const fs = require('fs');

// User modules
const config = require('./json/config');

// Commando framework manages most
// of the discordjs core
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const client = new CommandoClient({
	commandPrefix: config.prefix, 
	owner: config.owner,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['core', 'Essentials Eventioner commands'],
		['mentors', 'Commands related to mentors'],
	])
	.registerDefaultGroups()
  .registerDefaultCommands({
    // Disables built-in help command
    //help: false,
  })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`Enrolled in hacker's events ⚡`);
});

client.on('error', console.error);

// Loging the bot to the server
client.login(config.token);
