// TODO: update with db user defined roles per event
const { Command } = require('discord.js-commando');
const { roles , permissions } = require('../../json/baseRoles');
//const { getRoleByName } = require('../../utils/checkPermissions');

module.exports = class DeployRoles extends Command {
	constructor(client) {
		super(client, {
			name: 'deployroles',
			aliases: ['dr'],
			group: 'events',
			memberName: 'deployroles',
			description: 'Creates (if not exists) the basic roles for Mentors and Attendees',
      guildOnly: true, // Only works inside a server
      clientPermissions: ['ADMINISTRATOR'], // Only admins can perform it
		});
  } // constructor

  async run(message) {
    roles.forEach( role => {
      if(message.guild.roles.cache.find(guildRole => 
        guildRole.name == role) == undefined) {
        message.guild.roles.create({ // Creating the role.
          data: {
            name: role, 
            color: 0x1089ff,
            permissions: permissions
          }
        })
          .then(newRole => {
            return message.reply(`${newRole} created ✔`)
          })
          .then(feedback => feedback.delete({ timeout: 10000 }))
      } else {
          message.reply(`\`@${role}\` role already exists ⚠`)
            .then(feedback => feedback.delete({ timeout: 10000 }))
      }
    }) 
    //message.reply(`${roleFound}`);

  } // run
} // class
