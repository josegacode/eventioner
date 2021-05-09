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
    validateMentorEmail(ticketId)
      
      // Pucharse check
      .then(ticketIsValid => {
        console.log(`Final response in tickets: ${response}`);
        if(ticketIsValid) {
           // Give atte role 
            message.member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Participante'));
             return message.embed( 
              new MessageEmbed()
                .setTitle(`Registro exitoso ✅`)
                .setDescription(`@${message.author.username} tu registro ha sido validado,
                  y ahora tienes el rol de participante, gracias! 😄`)
                .setColor(0x539BFF)
            )
              //.then(attendeeFeedback => attendeeFeedback.delete({timeout: 10000}))
        } else {
            return message.embed( 
              new MessageEmbed()
                .setTitle(`⚠ BOLETO NO VALIDO ⚠`)
                .setDescription(`Al parecer el ticket de Evenbrite que me diste
                  no existe, verifica que lo has escrito correctamente 🤔`)
                .setColor(0x539BFF)
            )
        }
      }) // End type of attendee validation
      .then(ticketFeedback => ticketFeedback.delete({ timeout: 15000 }))
      .catch(error => console.error(error))
      .then(() => {
        message.delete({ timeout: 2000 });
      })
  }; // End fo run()
} // end of class definition
