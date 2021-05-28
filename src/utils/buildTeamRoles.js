const { getEventActiveInfo, getTeams } = require("../db/read");
/**
 * @params reaction The reaction object triggered in some server
 *
 * Creates the specific roles for some
 * team. These roles will be use
 * to create team's private channels.
 * */
const createTeamRoles = (params) => {
  // Naming the team:
  // Check if there is teams created
  let teamRoleName;
  getEventActiveInfo({ serverId: params.serverId })
    .then((result) => getTeams({ eventId: result.event_id }))
    .then((result) => {
      if (result) teamRoleName = `Equipo ${result.length + 1}`;
      else teamRoleName = `Equipo 1`;

      params.reaction.message.guild.roles.create({
        data: {
          name: teamRoleName,
          color: process.env.PRIMARY,
          permissions: ["VIEW_CHANNEL"],
        },
      });
    });

  /*
  checkIfThereAreTeams() 
    .then(teamsCount => {
      console.log(JSON.stringify(teamsCount))
    })
    */
  // If true
  //  Takes the last created team id
  //  Create the roles for the new team
  //  using the last id value + 1
  // Else
  //  Create the roles for the new team
  //  naming as [STRING]-0
};

module.exports = {
  createTeamRoles: createTeamRoles,
};
