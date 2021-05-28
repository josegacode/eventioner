const { getMembersPerTeam } = require("../db/read");
const { createTeamRoles } = require("./buildTeamChannels");

/**
 * @params reaction The reaction object triggered in some server
 *
 * This method handles the team build
 * for the events by cheking the number
 * of reactions (members who want to be part
 * of some team) and creating or not they
 * text and voice channels.
 * */
const handleTeamBuild = (reaction) => {
  //console.log(JSON.stringify(reaction.message, null ,4))
  getMembersPerTeam({
    serverId: reaction.message.guild.id,
  }).then((queryResult) => {
    // Splits the min and max values from the string
    let membersPerTeam = queryResult.members_per_team.split(",");

    if (membersPerTeam.length < 2) {
      // There is no range
      if (reaction.count - 1 == membersPerTeam[0]) {
        console.log("ready for team channels creation (no range)");
        createTeamRoles({
          reaction: reaction,
          serverId: reaction.message.guild.id
        });
      } else
        console.log(
          `One member added (nr), ${reaction.count}, ${membersPerTeam[0]}`
        );
    } else {
      // There is a range
      if (
        reaction.count - 1 >= membersPerTeam[0] &&
        reaction.count - 1 <= membersPerTeam[1]
      ) {
        console.log("ready for team channels creation (range)");
        createTeamRoles({
          reaction: reaction,
          serverId: reaction.message.guild.id
        });
      } else
        console.log(
          `One member added (r), ${reaction.count}, ${membersPerTeam[0]} - ${membersPerTeam[1]}`
        );
    }
  });
};

module.exports = {
  handleTeamBuild: handleTeamBuild,
};
