const { Command } = require('discord.js-commando');
const { roles } = require('../../json/baseRoles');

module.exports = class DeployRoles extends Command {
	constructor(client) {
		super(client, {
			name: 'deleteroles',
			aliases: ['delr'],
			group: 'events',
			memberName: 'deleteroles',
			description: 'Deletes (if exists) the basic roles for Mentors and Attendees',
      guildOnly: true, // Only works inside a server
      clientPermissions: ['ADMINISTRATOR'], // Only admins can perform it
		});
  } // constructor

  async run(message) {
    // Confirmation

    // Deletes the roles
    roles.forEach( role => {
      if(message.guild.roles.cache.find(guildRole => 
        guildRole.name == role) != undefined) {
        const roleToBeDeleted = message.guild.roles.cache.find(guildRole => {
          guildRole.name == role;
        })
        roleToBeDeleted.delete()
          .then(roleDeteled => {
            return message.reply(`${roleDeteled} deleted ✔`)
          })
          .then(feedback => feedback.delete({ timeout: 10000 }))
      } else {
          message.reply(`\`@${role}\` not exists ❌`)
            .then(feedback => feedback.delete({ timeout: 10000 }))
      }
    }) 
    //message.reply(`${roleFound}`);

  } // run
} // class
