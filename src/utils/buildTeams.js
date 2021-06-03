// User imports
const { insertNewTeam } = require("../db/create/insertNewTeam");
const { getEventActiveInfo } = require("../db/read");
const { createTeamRole } = require("./createTeamRole");
const { createTeamPrivateChannels } = require("./createTeamChannels");
const { handleTeamBuild } = require("./handleTeamBuild");
const { MessageEmbed } = require("discord.js");

const buildTeams = (reaction) => {
  //console.log('reaction' + JSON.stringify(reaction, null, 4))
          console.log(JSON.stringify(
          reaction,
            null,
            4
        ))
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

          // Adding roles to team's members
          reaction.users.reaction.users.forEach((userId) => {
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

}

module.exports = {
  buildTeams: buildTeams
}
