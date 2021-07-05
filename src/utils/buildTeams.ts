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
import { insertNewTeam } from "../db/create/insertNewTeam";
import { createTeamPrivateChannels } from "./createTeamChannels";
import { handleTeamBuild } from "./handleTeamBuild";
import { MessageEmbed } from "discord.js";
import { getEventActiveInfo, getTeams } from "../db/read";

let event;
let teamRoleName;

const createTeamRole = async (reaction) => {
  // Naming the team:
  // Check if there is teams created
  const { id } = reaction.message.guild;
  event = await getEventActiveInfo(id);
  let teams = await getTeams(event.event_id);

  // Dinamically generates
  // the team's role name
  if (teams && teams.length > 0) 
    teamRoleName = `Equipo ${teams.length + 1}`;
  else teamRoleName = `Equipo 1`;

  return reaction.message.guild.roles.create({
    data: {
      name: teamRoleName,
      color: process.env.PRIMARY,
      permissions: ["VIEW_CHANNEL"],
    },
  })
};


// Checks all member who reacted
// to the team invitation embed
// in order to know if they belongs
// to any team.
const checkDuplicateTeamRequest = (reaction) => { 
  // TODO: cache issue with the order of users fetched
  const { cache } = reaction.message.guild.members;
  //console.log('members: ' + JSON.stringify(cache, null, 2))
  const lastUserReacted = reaction.users.cache.first();
  console.log('last reaction by: ' + JSON.stringify(lastUserReacted.id, null, 2))

  const memberReacted = reaction.message.guild.members.cache.find((member) => {
    return member.user.id == lastUserReacted.id; 
  })

  //console.log('member match: ' + JSON.stringify(memberReacted,null,2));

  const role = memberReacted.roles.cache.find((role) => {
    return role.name.startsWith("Equipo")
  })

  return role ? true : false;
}

// Handles the team build
// > role creation / providing
// > channels creation
// > db insertion
export const buildTeams = async (reaction) => {
  let teamInformation = {};
  // Check if team is already built or are ready to be
  // (minimum members per team has been reached or
  // are in range)
  if (!reaction.message.embeds[0].title.includes("formando")) {
    //console.log('new member')
    // Checker for member in multiple teams
    if(!checkDuplicateTeamRequest(reaction))  {
      // Checker for valid miminum or in rage
      // members per team
      if (await handleTeamBuild(reaction)) {
          // This code is executed many times
          // once the team was built, just adding
          // the team role to the new members
          //console.log("Just providing roles");
          const titleSpplited = reaction.message.embeds[0].title.split(" ");

          // Extracts the role name from the embed
          // TODO: improve the way of extraction
          // in order to be more scalable
          teamRoleName =
            titleSpplited[titleSpplited.length - 3] +
            " " +
            titleSpplited[titleSpplited.length - 2];

          // Gets the team role object using
          // the role name extracted from the embed
          const teamRole = reaction.message.guild.roles.cache.find(
            (guildRole) => guildRole.name === teamRoleName
          );

          // Providing the team role for each
          // team
					let newMember;
          reaction.users.cache.forEach((user) => {
            if (user.id != reaction.message.client.user.id) {
							newMember = reaction.message.guild.members.cache
                .get(user.id);

							const hasTeamRole = newMember
								.roles
								.cache
								.find((memberRole) => memberRole === teamRole);

              // Check if the member has already the role
              // then skip it
              if (!hasTeamRole) 
                newMember.roles.add(teamRole);
            }
          });
        } else {
          //await reaction.message.reply('This team is full')
          //console.log("new team member request: TEAM FULL!");
        }
    }
  } else {
    // New team creation
    //console.log('formando')
    if(checkDuplicateTeamRequest(reaction)) 
      return;

		let teamInformation;

    // This code is executed only once
    // when the team is being building
    if (await handleTeamBuild(reaction)) {
      teamInformation.role = await createTeamRole(reaction);

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

    // Save into db
    await insertNewTeam(
      teamInformation.role.name,
      event.event_id,
    );

    // Create team's private channels
    createTeamPrivateChannels({
      guild: reaction.message.guild,
      team: teamInformation,
    });

    // Extracting data from the
    // previous embed in oder to use it
    // to edit the new team invitation message.

    await reaction.message.edit(
      new MessageEmbed()
        .setTitle(
          `
          ⚔ Únete al ${teamInformation.role.name} ⚔ 
        `
        )
        .addField("\u200B", "\u200B")
        .addFields([
          {
            name: `Líder de equipo 🐺`,
            value: reaction.message.embeds[0].fields[1].value,
          },
          {
            name: `Nuestra problemática / idea 💥`,
            value: reaction.message.embeds[0].fields[2].value,
          },
          {
            name: `Verticales de nuestra problemática 🧪`,
            value: reaction.message.embeds[0].fields[3].value,
          },
        ])
        .addField("\u200B", "\u200B")
        .setColor(process.env.PRIMARY)
        .setTimestamp()
        .setFooter(process.env.FOOTER_MESSAGE)
      ); // Invitation edition
    } // new team build
  } // new team case
};

module.exports = {
  buildTeams: buildTeams,
};
