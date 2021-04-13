const command = require('./command-handler');

module.exports = (client) => {
  // Lets to some user gets the role ----------------------------
  // of "Mentor"
  command(client, 'bementor', (message) => {
    message.channel.send('pong');

    // Name of the menor role defined in the server
    const mentorRoleName = 'mentor';

    //const mentorRole = guild.roles.cache.find((role) => role.name === roleName)
    const member = guild.members.cache.find((member) => member.id === user.id)

    const { guild } = message;

    if (add) {
      member.roles.add(role)
    } else {
      member.roles.remove(role)
    }
  })

  // Cleans all messages from current channel. --------------------
  // The user whos invokes this command must to be
  // administrator of the server.
  command(client, ['cc', 'clearchannel'], (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
      })
    }
  })

  // Ping for known if bot can bot
  command(client, 'ping', (message) => {
    message.channel.send('pong');
  })
}
