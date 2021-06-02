/**
 * @params An object which contains the team's and
 * guild data.
 *
 * Generates the team's channels
 * */
const createTeamTextChannel = (params) => {

  // Getting the mentor role
  const mentorRole = params.guild.roles.cache
    .find((guildRole) => guildRole.name == "Mentorx")
  console.log(
    'mentor role found:' +
    JSON.stringify(mentorRole, null, 4)
  )

  params.guild.channels
    .create(params.team.role.name, {
      // TODO: change this channel in production
      // or find category by name
      type: 'text',
      parent: "849309232871374878",
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
  createTeamTextChannel: createTeamTextChannel,
};
