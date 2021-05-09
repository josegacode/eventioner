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
const {validateTicket, getAttendeesPage, getAttendees} = require('../../utils/eventbriteHandler');

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
    //ping();

    // Getting the promise 
    //validateTicket(ticketId)
    getAttendees()
      
      // Pagination check 
      .then(response => {
        //const { attendees } = ticketIsValid;
        const { pagination } = response;

        //console.log(pagination.page_count);
        if(pagination.has_more_items) {
          for(let page = 1; page <= pagination.page_count; page++) {
            getAttendeesPage(page)
              .then(pageResult => {
                const { attendees } = pageResult;
                const ticketFound = attendees.find(attendee => attendee.order_id == ticketId);

                // Ticket validation per page
                if(ticketFound) {
                  console.log(ticketFound);

                message.member.roles.add(message.guild.roles.cache.find(guildRole => 
                      guildRole.name == 'Participante'));
                 return message.embed( 
                  new MessageEmbed()
                    .setTitle(`Registro exitoso ✅`)
                    .setDescription(`@${message.author.username} tu registro ha sido validado,
                      y ahora tienes el rol de participante, gracias! 😄`)
                    .setColor(0x539BFF)
                )
                } 
                else if(page == 4) {
                  return message.embed( 
                    new MessageEmbed()
                      .setTitle(`⚠ BOLETO NO VALIDO ⚠`)
                      .setDescription(`Al parecer el ticket de Evenbrite que me diste
                        no existe, verifica que lo has escrito correctamente 🤔`)
                      .setColor(0x539BFF)
                  )

                } else console.log(`still searching, readed page ${page}`)
              }) // then
          }
        } else {
          console.log('just one page')
        } 
      })
  }; // End fo run()
} // end of class definition
