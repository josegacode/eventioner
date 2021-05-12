/**
  * @author Jose Garcia
  * This module contains all commands
  * related to mentors in the server.
  * */

// Handler for use the structure
// predefined for declare commands
'use strict';

const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { validateMentorEmail } = require('../../spreadsheet-handler');

module.exports = class BeMentor extends Command {
	constructor(client) {
		super(client, {
			name: 'bementor',
			aliases: ['bm'],
			group: 'tickets',
			memberName: 'bementor',
			description: `Validates registry`,
      args: [
        {
          key: 'email',
          prompt: ` you forgot to provide your mentor email, usage 👉 !bementor| !bm <email> ✅`,
          type: 'string',
        },
      ],
      guildOnly: true, // Only works inside a server

      // Avoids spam
      throttling: {
        usages: 2, // Times in per rate of usage
        duration: 10, // Time in seconds to cooldown
      },
		});
	}

  async run(message, {email}) {
    //ping();

    // Getting the promise 
    validateMentorEmail(email)
      
      // Pucharse check
      .then(emailIsValid => {
        if(emailIsValid) {
            message.member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Mentorx'));
             message.embed( 
              new MessageEmbed()
                .setTitle(`Mentorx registradx ✅`)
                .setDescription(`@${message.author.username} tu registro como mentorx ha sido validado,
                  disfruta del evento! 🚀`)
                .addField('\u200B', '\u200B')
                .setColor(0x00AED6)
                .setTimestamp()
                .setFooter('Develop with 💙 by Legion Hack')
            )
              .then(mentorFeedback => mentorFeedback.delete({timeout: 10000}))
        } else {
            message.embed( 
              new MessageEmbed()
                .setTitle(`Mentorx desconocido ⚠`)
                .setDescription(`@${message.author.username} al parecer tu correo electronico no aparece en nuestra
                  base de datos de mentores conocidos, ponte en contacto
                  con los organizadores del evento para dar seguimiento a tu caso.`)
                .addField('\u200B', '\u200B')
                .setColor(0xffd56b)
                .setTimestamp()
                .setFooter('Develop with 💙 by Legion Hack')
            )
              .then(mentorFeedback => mentorFeedback.delete({timeout: 20000}))
        }
      }) // End type of attendee validation
      .catch(error => console.error(error))
      .then(() => {
        message.delete({ timeout: 500});
      })
  }; // End fo run()
} // end of class definition
