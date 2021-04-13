const command = require('./command-handler');

module.exports = (client) => {
  command(client, 'ping', (message) => {
    message.channel.send('pong');
  })
}
