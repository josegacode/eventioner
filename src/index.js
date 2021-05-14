/*
 * Entry point of the bot,
 * this is the driver module.
 * */

// Node modules
// For manage system files
const fs = require('fs');

/** User modules */
const config = require('./json/config');

// Commando framework manages most
// of the discordjs core
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const client = new CommandoClient({
	commandPrefix: config.prefix, 
	owner: config.owner,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utils', 'Essentials Eventioner commands'],
		['tickets', 'Commands for validate the tickets for the events'],
		['teams', 'Commands related to make teams'],
		['announces', 'Commands related to publish announces (dev)'],
		['events', `Commands related to deploy, configure and manage
      events environments`],
	])
	.registerDefaultGroups()
  .registerDefaultCommands({

    // To improve await message experience
    // in dm.
    unknownCommand: false,

    // Disables built-in help command
    help: false,
  })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`Enrolled in hacker's events ⚡`);
});

client.on('error', console.error);

client.on('messageReactionAdd', async (reaction, user) => { 
  	// When a reaction is received, check if the structure is partial
	if (reaction.message.partial || reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
			reaction.fetch()
        .then(messageReaction => {
          console.log(`Uncached: ${messageReaction.message.embeds[0].title}`)
        })
		} catch (error) {
      reaction.message.channel.send('Error trying to recolect reactions')
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
  } else {
      console.log(`Cached: ${reaction.message.embeds[0].title}`)

  }
})


// Global check for wrong commands typed
//client.on('message', async () => {})

// Loging the bot to the server
client.login(config.token);
