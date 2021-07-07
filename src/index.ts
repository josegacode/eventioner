/*
 * Entry point of the bot,
 * this is the driver module.
 * */

// Loads the environment variables
import dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
//import path = require("path");
//import { dirname } from "path";
//import { fileURLToPath } from 'url';
import "reflect-metadata";
import { connection } from 'ORMConnection';
import { CommandoClient } from "discord.js-commando";
import { buildTeams } from "./utils/buildTeams.js";
//import { handleCommandIntent } from './utils/handleCommandIntent';

// Client setup
//const { CommandoClient } = commandoClient;
//const __dirname = dirname(fileURLToPath(import.meta.url));
try {
	await connection.runMigrations();
}
const client = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  partials: ["GUILD_MEMBER", "REACTION", "MESSAGE", "USER", "CHANNEL"],
});
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["utils", "Essentials Eventioner commands"],
    ["tickets", "Commands for validate the tickets for the events"],
    ["teams", "Commands related to make teams"],
    ["announces", "Commands related to publish announces (dev)"],
    [
      "server",
      "Commands related to manage the server where the bot is enrolled",
    ],
    [
      "events",
      `Commands related to deploy, configure and manage
      events environments`,
    ],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    // To improve await message experience
    // in dm.
    unknownCommand: false,

    // Disables built-in help command
    help: false,
  })
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  console.log(`En linea ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity(`Type !help evnt`);
});

client.on("error", console.error);


client.on("messageReactionAdd", async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  // (uncached locally) then get it from api call
  // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
  if (reaction.partial || reaction.message.partial) {
    try {
      // TODO: we cant access to its value (users), only
      // after fetch but no in on it
      await reaction.fetch();
      await reaction.users.fetch();
    } catch (e) {
      console.error(e);
    }
  }

  switch (reaction.emoji.name) {
    case `⚔`:
      buildTeams(reaction);
      break;
  }
}); // reaction event

// Global check for wrong commands typed
/*
client.on('message', async (message) => {
  // Check if the message wasn't sent 
  // by the bot or through a direct message
  // channel
  if(!message.author.bot && message.channel.type != 'dm')
    await handleCommandIntent(client, message);
})
*/
// Loging the bot to the server
client.login(process.env.TOKEN);
