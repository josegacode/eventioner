/**
 * Handles the team creation:
 *   > Calls a check function for know if team is ready to be build
 *   > Calls a function for create the team's role
 *   > Provides team's role
 *   > Calls a function to save team's role
 *   > Calls a function for create team's channels
 *   > Update team's invitation message
 * */

// User imports
const { insertNewTeam } = require("../db/create/insertNewTeam");
const { getEventActiveInfo } = require("../db/read");
const { createTeamRole } = require("./createTeamRole");
const { createTeamPrivateChannels } = require("./createTeamChannels");
const { handleTeamBuild } = require("./handleTeamBuild");
const { MessageEmbed } = require("discord.js");

const buildTeams = (reaction) => {
  let teamInformation = {};
  // Check if team is ready
  // (members per team has been reached or
  // are in range)
  
  console.log('users ' + reaction.users.cache.last());
  const memberOfAnotherTeam = reaction.message.guild.members.cache
    .get(reaction.users.cache.last().id)
    .roles.cache.find((memberRole) => {
      return memberRole.name.startsWith("Equipo")
      })

  if (reaction.message.embeds[0].title.includes("Equipo")) {
    if(memberOfAnotherTeam) {
      console.log('New member request, but is member of another team!');
      return;
    }
    handleTeamBuild(reaction).then((teamStillAcceptingMembers) => {
      if (teamStillAcceptingMembers) {
        // This code is executed many times
        // once the team was built, just adding
        // the team role to the new members
        //console.log("Just providing roles");
        const titleSpplited = reaction.message.embeds[0].title.split(" ");

        // Extracts the role name from the embed
        // TODO: improve the way of extraction
        // in order to be more scalable
        const teamRoleName =
          titleSpplited[titleSpplited.length - 3] +
          " " +
          titleSpplited[titleSpplited.length - 2];

        // Gets the team role object using
        // the role name extracted from the embed
        const teamRole = reaction.message.guild.roles.cache.find(
          (guildRole) => guildRole.name === teamRoleName
        );

        // Checking if the user is already
        // member of another team
        const otherTeamRole = reaction.message.guild.members.cache
          .get(reaction.users.cache.last().id)
          .roles.cache.find((memberRole) => {
            return memberRole.name.startsWith("Equipo");
          });

        //let newMember;
        if (otherTeamRole == null) {
          // This member has no team
          // Check if we can still providing roles
          // by checking the member who belongs
          // to the team role and comparing with
          // the maximum and minimum number of members
          // per team for the current event.
          reaction.users.cache.forEach((user) => {
            if (user.id != reaction.message.client.user.id) {
              const hasTeamRole = reaction.message.guild.members.cache
                .get(user.id)
                .roles.cache.find((memberRole) => memberRole === teamRole);
              // Check if the member has already the role
              // then skip it
              if (!hasTeamRole) {
                newMember = reaction.message.guild.members.cache.get(user.id);
                newMember.roles.add(teamRole);
                // Adding roles to new team
                // members
                console.log("new member joined!");
              }
            }
          });
        } else {
          // The member is in another team
          // TODO: add feedback
          /*
          return reaction.message.channel
            .send(
              `Los participantes solo pueden estar en un equipo a la vez!`
            )
            // There is a max timeout?
            .then(feedback => { feedback.delete({timeout: process.env.FEEDBACK_TIMEOUT}) })
            */
        }
      } else {
        console.log("new team member request: TEAM FULL!");
      }
    });
  } else {
    if(memberOfAnotherTeam) {
      console.log('New member request, but is member of another team!');
      return;
    }

    // This code is executed only once
    // when the team is being building
    console.log("Creating a new team process");
    handleTeamBuild(reaction)
      .then((teamIsReadyToBeBuilt) => {
        if (teamIsReadyToBeBuilt) {
          // Creates and returns a team role
          return createTeamRole({
            serverId: reaction.message.guild.id,
            reaction: reaction,
          });
        }
      })
      .then((roleCreated) => {
        // Save into db (from here, code needs
        // to be executed once)
        teamInformation.role = roleCreated;

        // Adding roles to team's members
        reaction.users.cache.forEach((user) => {
          // Check fot no provide team
          // role to the bot
          if (user.id != reaction.message.client.user.id) {
            reaction.message.guild.members.cache
              .get(user.id)
              .roles.add(teamInformation.role);
          }
        });

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

        // Extracting data from the
        // previous embed in oder to use it
        // to edit the new team invitation message.

        reaction.message.edit(
          new MessageEmbed()
            .setTitle(
              `
              ⚔ Únete al ${teamInformation.role.name} ⚔ 
            `
            )
            .addField("\u200B", "\u200B")
            .addFields([
              {
                name: `💥 Nuestra problemática`,
                value: reaction.message.embeds[0].fields[1].value,
              },
              {
                name: `🧪 Verticales`,
                value: reaction.message.embeds[0].fields[2].value,
              },
            ])
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE)
        );
      });
  }
};

module.exports = {
  buildTeams: buildTeams,
};
