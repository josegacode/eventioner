
const buildTeamsEnvironment = (messageReaction) => {
  console.log('hi');
  if(messageReaction.count < 4) {
    console.log(`not time to build teams`)
    return;
  } else {
    console.log(`ready for build teams`)
  }
}

module.exports = {
  buildTeamsEnvironment: buildTeamsEnvironment,
}
