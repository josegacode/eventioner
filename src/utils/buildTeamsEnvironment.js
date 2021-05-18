const buildTeamsEnvironment = (messageReaction) => {
  client.channels.create
}

const checkTeamCreationStatus = messageReaction => {
    if(messageReaction.count-1 < process.env.MAX_TEAM_MEMBERS) {
      //console.log(`Uncached: ${messageReaction.message.embeds[0].title}`)
      console.log(`Team still increased`);
      // Check the number of teams registered
    } else {
      console.log(`Team are ready!`);
      provideTeamRole()

    }
}

const createTeamChannels = (teamName) => {
  // create a text-channel
  // create a channel voice

}

// Saves team data in db
const saveTeamData = () => {
  // saves registry
  // count number of teams
  // create a new role for the last team
  // provideTeamRole(teamRoleName, teamMembers)
}

const provideTeamRole = (teamRoleName, teamMembers) => {
  // give role to each one
  // createTeamChannels(teamRoleName)
}

module.exports = {
  buildTeamsEnvironment: buildTeamsEnvironment,
  checkTeamCreationStatus: checkTeamCreationStatus,
}
