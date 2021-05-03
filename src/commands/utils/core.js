//const command = require('./handler');
const { Command } = require('discord.js-commando');

/**
 *  Fetch all users with mentor role and save its data
 *  in a spreadsheet of Google.
  * @param client - The client where the bot is on
  * */
module.exports = class ClearChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'clearchannel',
			aliases: ['cc'],
			group: 'utils',
			memberName: 'clearchannel',
			description: 'Deletes all messages per day from the channel where is executed',
      guildOnly: true, // Only works inside a server
      clientPermissions: ['ADMINISTRATOR'], // Only admins can perform it
		});
  }

    async run(message) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
      })

    }
}
