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
          // Gets all pages [pagination{}, attendees[]]

          let attendeeFound;
          let pageArrayIndex = 0;
          do {
            if(allTickets[pageArrayIndex].attendees.some(attendee => attendee.order_id == ticketId)) {
              attendeeFound = true; 
              console.log(`found on page ${pageArrayIndex}`);
            }
            console.log(`on page #${pageArrayIndex}`)
            pageArrayIndex++;
          } while(!attendeeFound && pageArrayIndex < allTickets.length)

          // Ticket validation per page
          // TODO: add role exists validation
          if(attendeeFound) {
          message.member.roles.add(message.guild.roles.cache.find(guildRole => 
                guildRole.name == 'Participante'));
           return message.embed( 
            new MessageEmbed()
              .setTitle(`Registro exitoso ✅`)
              .setDescription(`@${message.author.username} tu boleto ha sido confirmado con exito,
                disfruta del evento! 🚀`)
              .addField('\u200B', '\u200B')
              .setColor(0x00AED6)
              .setTimestamp()
              .setFooter('Made with 💙 by Legion Hack')
          )
          } 
          else {
            return message.embed( 
              new MessageEmbed()
                .setTitle(`El registro ha fallado ⚠`)
                .setDescription(`Tu boleto no se ha podido validar por las siguientes razones:
                  
                  👉  Lo has escrito incorrectamente
                  👉  Ingresaste un boleto inexistente (debes registrate en Eventbrite previamente) 
                  👉  Ingresaste un boleto que no corresponde a este evento 
                  👉  Tu boleto ya fue registrado por otra persona 
                  `)
                .addField('\u200B', '\u200B')
                .setColor(0xffd56b)
                .setTimestamp()
                .setFooter('Made with 💙 by Legion Hack')
            )

          } 
      })
      .then(attendeeFeedback => {
        message.delete({ timeout: 500});
        attendeeFeedback.delete({timeout: 15000})
      }) 
      .catch(error => console.error(error))
  }; // End fo run()
} // end of class definition
