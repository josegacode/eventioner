const { getEventActiveInfo } = require("../db/read");

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
  let eventInformation = {};

  return new Promise((resolve, reject) => {
    getEventActiveInfo({
      serverId: reaction.message.guild.id,
    })
      .then((event) => {
        // Splits the min and max values from the string
        eventInformation = event;
        let membersPerTeam = event.members_per_team.split(",");

        // Fix members per team value
        if (membersPerTeam.length < 2) {
          if (reaction.count - 1 == membersPerTeam[0]) {
            resolve(true);
            //console.log("ready for team channels creation (no range)");
          } else resolve(false); // no more nor less members
        } else {
          // Range value for members per team
          if (
            reaction.count - 1 >= membersPerTeam[0] &&
            reaction.count - 1 <= membersPerTeam[1]
          ) {
            //console.log("ready for team channels creation (range)");
            resolve(true);
          } else resolve(false);
        }
      })
      .catch((error) => console.error(error));
  });
};

module.exports = {
  handleTeamBuild: handleTeamBuild,
};
