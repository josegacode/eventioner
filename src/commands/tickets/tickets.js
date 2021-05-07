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

// For lets perform Google Spreadsheet API 
// operations
const spreadsheetHandler = require('../../spreadsheet-handler');

// Info of usable spreadsheets
const spreadsheets = require('../../json/spreadsheets');

const {getAttendeeByTicket, retrieveEventInformation, validateAttendee} = require('../../utils/eventbriteHandler');

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
    validateAttendee('153653721417', ticketId)
      
      // Pucharse check
      .then(response => {
        // Destructs the attendees arrays
        const { attendees } = response;

        // Returning the profile which buy the ticket
        return attendees.find(attendee => attendee.order_id == ticketId);
      })

      // Knowing the type of attendee 
      .then(attendee => {
        if(attendee != undefined) {
            message.embed(
              new MessageEmbed()
              .setTitle(`What kind of attendee do you want to be? 🤔`)
              .setDescription(`1) Mentor \n 2) Attendee`)
              .setColor(0x539BFF)
            )

            return message.channel.awaitMessages(
              //typeOfAttendeeFilter,
              response => response.content == '1' || response.content == '2',
              { max: 1, time: 5000, errors: ['time'] }
            )
        } else {
            message.embed( 
              new MessageEmbed()
                .setTitle(`⚠ TICKER ORDER INS'T VALID ⚠`)
                .setDescription(`If you already buy a ticket for the event, check if was 
                  typed correctly 😁`)
                .setColor(0x539BFF)
            );
        }
      }) // End type of attendee validation
      .then(typeOfAttendee => {
        switch(typeOfAttendee.first().content) {
          case '1':
            // Validate mentor email
            getAttendeeByTicket('153653721417', ticketId)
              .then(attendee => {
                console.log(`ATTENDE: ${attendee.profile.email}`);
              })

            // Ask for type of mentor
        }
      })
      .catch(error => console.error(error))
  }; // End fo run()
} // end of class definition
