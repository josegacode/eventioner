const { getEventActiveInfo, getTeams } = require("../db/read");
/**
 * @params reaction Any object which contains the reaction object
 * and the serverId.
 *
 * Creates the specific roles for some
 * team. These roles will be use
 * to create team's private channels.
 * */
const createTeamRole = async (params) => {
  // Naming the team:
  // Check if there is teams created
  let teamRoleName;
  return new Promise((resolve, reject) => {
    getEventActiveInfo({ serverId: params.serverId })
      .then((result) => getTeams({ eventId: result.event_id }))
      .then((result) => {
        // Dinamically generates
        // the team's role name
        if (result) teamRoleName = `Equipo ${result.length + 1}`;
        else teamRoleName = `Equipo 1`;

        resolve(
          params.reaction.message.guild.roles.create({
            data: {
              name: teamRoleName,
              color: process.env.PRIMARY,
              permissions: ["VIEW_CHANNEL"],
            },
          })
        );
      });
  });
};

module.exports = {
  createTeamRole: createTeamRole,
};
