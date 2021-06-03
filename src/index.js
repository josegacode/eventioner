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
const { createTeamPrivateChannels } = require("./utils/createTeamChannels");
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

  /*
          console.log(JSON.stringify(
          reaction,
            null,
            4
        ))
        */

  if (reaction.message.partial) {
    try {
      reaction.fetch();
    } catch (e) {
      console.error(e);
    } // try-catch reaction partial
  } // if partial

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
          } else throw new Error('The team is not ready');
        })
        .then((roleCreated) => {
          // Save into db (once)
          teamInformation.role = roleCreated;

          console.log('users' + JSON.stringify(reaction.users, null, 4))
          // Adding roles to team's members
          reaction.users.forEach((userId) => {
            const memberFound = reaction.message.guild.members.cache
              .find(member => {
                return member.userId == userId;
              })
            console.log(JSON.stringify(memberFound,null,4))
          })

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

          // Create team's private channels
          createTeamPrivateChannels({
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
          console.log(JSON.stringify(
          reaction.message.embeds,
            null,
            4
        ))
          // Extracting data from the
          // previous embed in oder to use it
          // to edit the new team invitation message.
          const problem =  
            reaction.message.embeds[0].fields
              .find((field) => field.name == '¿Que problematica quiero solucionar?')

          reaction.message.edit(
          new MessageEmbed()
            .setTitle(
              `
                  Forma parte del equipo ${teamInformation.role.name}! 🚀
                `
            )
            .addField("\u200B", "\u200B")
            .addFields([
                {
                  name: `¿Que problematica quiero solucionar?`,
                  value: problem
                },
                {
                  name: `¿Que verticales comprende mi problematica?`,
                  value: ''
                },
              ])
            .setColor(process.env.PRIMARY)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE)
          );
        });

      break;
  }
}); // reaction event

// Global check for wrong commands typed
//client.on('message', async () => {})

// Loging the bot to the server
client.login(process.env.TOKEN);
