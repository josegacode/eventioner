const command = require('./command-handler');
const spreedsheetHandler = require('./spreadsheet-handler');
const roleClaim = require('./role-claim');

module.exports = (client) => {
  command(client, 'openMentors', () => {
  //roleMessage(client, '759975046940065832', 'Que tipo de mentor eres?', )
  roleClaim(client);
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
