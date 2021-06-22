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
const handleTeamBuild = async (reaction) => {
  let event;
  try {
    event = await getEventActiveInfo(reaction.message.guild.id);
  console.log(JSON.stringify(event, null ,4))
  } catch(error) {
    console.error(error);
  }
    let membersPerTeam = event.members_per_team.split(",");

    // Fix members per team value
    if (membersPerTeam.length < 2) {
      if (reaction.count - 1 == membersPerTeam[0]) {
        //console.log("ready for team channels creation (no range)");
        return true;
      } else return false; // no more nor less members
    } else {
      // Range value for members per team
      if (
        reaction.count - 1 >= membersPerTeam[0] &&
        reaction.count - 1 <= membersPerTeam[1]
      ) {
        //console.log("ready for team channels creation (range)");
        return true;
      } else return false;
    }

};

module.exports = {
  handleTeamBuild: handleTeamBuild,
};
