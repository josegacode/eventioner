const buildTeamsEnvironment = (messageReaction) => {
  client.channels.create
}

const checkTeamCreationStatus = messageReaction => {
    if(messageReaction.count-1 < process.env.MAX_TEAM_MEMBERS) {
      //console.log(`Uncached: ${messageReaction.message.embeds[0].title}`)
      console.log(`role request`);
      // Check the number of teams registered
    } else {
      console.log(`last role request createTeamChannels`);

    }
}

const createTeamChannels = () => {

}

const provideTeamRole = () => {

}

module.exports = {
  buildTeamsEnvironment: buildTeamsEnvironment,
  checkTeamCreationStatus: checkTeamCreationStatus,
}
