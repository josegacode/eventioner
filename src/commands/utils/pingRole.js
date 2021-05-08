//const command = require('./handler');
const { Command } = require('discord.js-commando');

/**
 *  Fetch all users with mentor role and save its data
 *  in a spreadsheet of Google.
  * @param client - The client where the bot is on
  * */
module.exports = class PingRole extends Command {
	constructor(client) {
		super(client, {
			name: 'pingrole',
			aliases: ['pr'],
			group: 'utils',
			memberName: 'pingrole',
			description: 'Retrieves information about a role',
      guildOnly: true, // Only works inside a server
      clientPermissions: ['ADMINISTRATOR'], // Only admins can perform it
      args: [
        {
          key: 'roleName',
          prompt: ` Role name to find`,
          type: 'string',
        },
      ]
		});
  }

    async run(message, {roleName}) {
      const roleFound = message.guild.roles.cache.find(guildRole => 
        guildRole.name == roleName);
      if(roleFound != undefined) {
           message.reply(JSON.stringify(roleFound.permissions))
            .then(feedback => feedback.delete({ timeout: 10000 }))
      } else {
          message.reply(`\`@${roleName}\` role not exists ⚠`)
            .then(feedback => feedback.delete({ timeout: 10000 }))
      }
    }
}
