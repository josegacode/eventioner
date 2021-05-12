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
const {validateTicket, getAttendeesPage, getAttendees, getAttendeesPagesCount, getAttendeesTickets} = require('../../utils/eventbriteHandler');

module.exports = class EnrollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enroll',
			aliases: ['en'],
			group: 'tickets',
			memberName: 'enroll',
			description: `Validates that the user already buy a ticket and then let it
      choose a rol for the event`,
      args: [
        {
          key: 'ticketId',
          prompt: ` you forgot to provide your ticketId, usage 👉 !enroll| !enr <TICKET-ID> ✅`,
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

  async run(message, {ticketId}) {
      getAttendeesTickets()
        .then(allTickets => {
        console.log(`response tickets: ${allTickets.length}`);
        //const ticketFound = allTickets.find(ticket => ticket == ticketId);

        let ticketFound = true;
                // Ticket validation per page
                if(ticketFound) {
                  console.log(ticketFound);

                message.member.roles.add(message.guild.roles.cache.find(guildRole => 
                      guildRole.name == 'Participante'));
                 message.embed( 
                  new MessageEmbed()
                    .setTitle(`Registro exitoso ✅`)
                    .setDescription(`@${message.author.username} tu registro como participante ⚡ ha sido validado,
                      y ahora tienes el rol de participante, gracias!`)
                    .setColor(0x539BFF)
                )
                  .then(attendeeFeedback => attendeeFeedback.delete({timeout: 10000}))
                } 
                else {
                  message.embed( 
                    new MessageEmbed()
                      .setTitle(`⚠ BOLETO NO VALIDO ⚠`)
                      .setDescription(`Al parecer el ticket de Evenbrite que me diste
                        no existe, verifica que lo has escrito correctamente 🤔`)
                      .setColor(0x539BFF)
                  )
                  .then(attendeeFeedback => attendeeFeedback.delete({timeout: 10000}))

                } 
      })
      .catch(error => console.error(error))
      .then(() => {
        message.delete({ timeout: 2000 });
      })
  }; // End fo run()
} // end of class definition
