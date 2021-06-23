/*
 * Entry point of the bot,
 * this is the driver module.
 * */

/** User modules */

// Loads the environment variables
require("dotenv").config();
const path = require("path");

// Commando framework manages most
// of the discordjs core
import { CommandoClient } from "discord.js-commando";

// User imports
import { buildTeams } from "./utils/buildTeams";
//import { handleCommandIntent } from './utils/handleCommandIntent';
import 'reflect-metadata';

// Client setup
const client: CommandoClient = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  owner: process.env.OWNER,
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
