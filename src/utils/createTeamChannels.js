/**
 * @params An object which contains the team's and
 * guild data.
 *
 * Generates the team's channels
 * */
const createTeamPrivateChannels = (params) => {
  // Getting the mentor role
  const mentorRole = params.guild.roles.cache.find(
    (guildRole) => guildRole.name == "Mentorx"
  );

  const teamCategoryChannel = params.guild.channels.cache.find(
    (guildChannel) => guildChannel.name
      .trim()
      .toLowerCase() === `equipos`
  );
  console.log("category to publish team channels: " + teamCategoryChannel);

  params.guild.channels
    .create(params.team.role.name, {
      // TODO: change this channel in production
      // or find category by name
      type: "text",
      parent: teamCategoryChannel.id,
      //parent: "841372343926390837",
      permissionOverwrites: [
        {
          id: params.guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: params.team.role.id,
          allow: ["VIEW_CHANNEL"],
        },
      ],
    })
    .catch(console.error);

  // voice channel
  params.guild.channels
    .create(params.team.role.name, {
      type: "voice",
      parent: teamCategoryChannel.id,
      //parent: "841372343926390837",
      permissionOverwrites: [
        {
          id: params.guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: params.team.role.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: mentorRole.id,
          allow: ["VIEW_CHANNEL"],
        },
      ],
    })
    .catch(console.error);
};

module.exports = {
  createTeamPrivateChannels: createTeamPrivateChannels,
};
