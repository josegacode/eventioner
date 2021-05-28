/*
 * Entry point of the bot,
 * this is the driver module.
 * */

/** User modules */

// Loads the environment variables
require("dotenv").config();

// Commando framework manages most
// of the discordjs core
const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const client = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  owner: process.OWNER,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const { handleTeamBuild } = require("./utils/handleTeamBuild");

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
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity(`Enrolled in hacker's events ⚡`);
});

client.on("error", console.error);

client.on("messageReactionAdd", async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  // (uncached locally) then get it from api call
  if (reaction.message.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      reaction.fetch().then((reactionFetch) => {
        switch (reactionFetch.emoji.name) {
          case `⚔`:
            handleTeamBuild(reactionFetch);
            break;
        }
      });
    } catch (error) {
      reaction.message.channel.send("Error trying to recolect reactions");
      return;
    }
  } else {
    switch (reaction.emoji.name) {
      case `⚔`:
        handleTeamBuild(reaction);
        break;
    }
  }
});

// Global check for wrong commands typed
//client.on('message', async () => {})

// Loging the bot to the server
client.login(process.env.TOKEN);
