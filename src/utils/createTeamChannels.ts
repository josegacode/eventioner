/**
 * @params An object which contains the team's and
 * guild data that will be 
 *
 * Generates the team's channels
 * */
export const createTeamPrivateChannels = (params) => {
  // Getting the mentor role
  const mentorRole = params.guild.roles.cache.find(
    (guildRole) => guildRole.name == "Mentorx"
  );

  const teamCategoryChannel = params.guild.channels.cache.find(
    (guildChannel) => guildChannel.name
      .trim()
      .toLowerCase() === `equipos`
  );
  console.log(JSON.stringify(teamCategoryChannel, null, 4));

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

