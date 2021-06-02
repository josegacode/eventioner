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
const { CommandoClient } = require("discord.js-commando");

// User imports
const { insertNewTeam } = require("./db/create/insertNewTeam");
const { getEventActiveInfo } = require("./db/read");
const { createTeamRole } = require("./utils/createTeamRole");
const {
  createTeamTextChannel,
  createTeamVoiceChannel,
} = require("./utils/createTeamChannels");
const { handleTeamBuild } = require("./utils/handleTeamBuild");
const { MessageEmbed } = require("discord.js");

// Client setup
const client = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  owner: process.OWNER,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
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
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity(`Enrolled in hacker's events ⚡`);
});

client.on("error", console.error);

client.on("messageReactionAdd", async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  // (uncached locally) then get it from api call
  // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
  if (reaction.message.partial) {
    try {
      reaction.fetch().then((reactionFetch) => {
        switch (reaction.emoji.name) {
          case `⚔`:
            let teamInformation = {};
            // Check if team is ready
            handleTeamBuild(reaction)
              .then((teamIsBuilt) => {
                //console.log("team is ready? (fetch): " + teamIsBuilt);
                if (teamIsBuilt) {
                  // Creates and returns a team role
                  return createTeamRole({
                    serverId: reaction.message.guild.id,
                    reaction: reaction,
                  });
                }
              })
              .then((roleCreated) => {
                // Save into db (once)
                teamInformation.role = roleCreated;
                return getEventActiveInfo({
                  serverId: reaction.message.guild.id,
                });

                // TODO: check if is first time
                // team creation or just new
                // team member joined (update
                // member count).
              })
              .then((eventInformation) => {
                // Save into db
                insertNewTeam({
                  event: eventInformation,
                  team: teamInformation,
                });

                //console.log(JSON.stringify(teamInformation.role, null ,4))

                // Create team's private channels
                createTeamTextChannel({
                  guild: reaction.message.guild,
                  team: teamInformation,
                });
                /*
                createTeamVoiceChannel({
                  guild: reaction.message.guild,
                  team: teamInformation,
                });
                */

            // Updates team information message
                reaction.message.edit(
                  new MessageEmbed()
                    .setTitle(
                      `
                  ${teamInformation.role.name} 
                `
                    )
                    .setDescription("jkashflakjhf")
                    .addField("\u200B", "\u200B")
                    .addFields([])
                    .setColor(process.env.PRIMARY)
                    .setTimestamp()
                    .setFooter(process.env.FOOTER_MESSAGE)
                );
              });


            break;
        }
      }); // Fetch
    } catch (e) {
      console.error(e);
    } // try-catch reaction partial
  } // if partial
}); // reaction event

// Global check for wrong commands typed
//client.on('message', async () => {})

// Loging the bot to the server
client.login(process.env.TOKEN);
