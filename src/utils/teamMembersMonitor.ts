const { getEventActiveInfo, getTeams } = require("../db/read");
/**
 * @params Object which contains the team's role and the guild
 * object.
 *
 * Checks if the team stills
 * accepting members.
 * */
const checkIfTeamStillBuild = (params) => {
  // Get the number of members for N role
  const { guild } = params;
  const { role } = params;

  // guild.roles.cache.find((guildRole) => guildRole.name == role) ==
  // Query to DB the max, min members per team
  //  Then compare if still no reach the limit
  //  Return a boolean result
};

module.exports = {
  checkIfTeamStillBuild: checkIfTeamStillBuild,
};
