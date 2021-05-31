/**
 * @params An object which contains the team's roles
 *
 * Generates the team's channels
 * */
const createTeamChannels = (params) => {
  const everyoneRole = client.guilds
    .get("SERVER ID")
    .roles.find("name", "@everyone");

  const name = message.author.username;
  message.guild
    .createChannel(name, "text")
    .then((r) => {
      r.overwritePermissions(message.author.id, { VIEW_CHANNEL: true });
      r.overwritePermissions(client.id, { VIEW_CHANNEL: true });
      r.overwritePermissions(everyoneRole, { VIEW_CHANNEL: false });
    })
    .catch(console.error);
};

module.exports = {
  createTeamChannels: createTeamChannels,
};
