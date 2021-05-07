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
const {validateMentorEmail} = require('../../spreadsheet-handler');

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
            return getAttendeeByTicket('153653721417', ticketId)
          case '2': console.log(`General attendee`);
        } // Type of attende switch()
      }) //type of attendee
      .then(attendee => {
        //console.log(`ATTENDE: ${attendee.profile.email}`);
        return validateMentorEmail(attendee.profile.email);
      }) // mentor validation
      .then(emailValidated => {
        if(emailValidated) {
          message.embed(new MessageEmbed()
            .setTitle(`What kind of mentor do you want to be @${message.author.username}?`)
            .setDescription(
              `1) Branding \n 2) Capital \n 3) Tech`
            )
            .setColor(0x539BFF)
          ) 


          // Awaits for type of mentor role
          return message.channel.awaitMessages(
            response => ['1', '2', '3'].some(element => element == response.content),
            { max: 1, time: 30000, errors: ['time'] }
          ) 
        } else {
          message.embed(new MessageEmbed()
            .setTitle(`Mentor isn't in our database`)
            .setDescription(
              `We sorry, buy apparently your aren't in our database
              of mentors, contact the event organizer for help.`
            )
            .setColor(0x539BFF)
          ) 
        } // if-else email validation
      }) // email validation

      .then(typeOfMentor => {
         const user = message.author;
         const member = message.guild.members.cache.find((member) => member.id === user.id);
            // Base mentor role
            member.roles.add('755528558838939648');

            let mentorTypeName;

            // Category of mentor
            switch(typeOfMentor.first().content) {
              case '1':
                member.roles.add('759996826493124608');
                mentorTypeName = 'Mentor Branding';
                break;
              case '2':
                member.roles.add('759996884135313459');
                mentorTypeName = 'Mentor Capital';
                break;
              case '3':
                member.roles.add('759996935154958366');
                mentorTypeName = 'Mentor Tech';
                break;
            }

                   return message.embed( 
              new MessageEmbed()
                .setTitle(`Hey @${message.author.username}, you are now a ${mentorTypeName}! 👩‍🏫👨‍🏫`)
                .setDescription(`Thanks, your email was registered successfully and ${mentorTypeName}
                role was given to you, enjoy it ⚡`)
                .setColor(0x539BFF)
            );
      })
      
      // Type of mentor
      .catch(error => console.error(error))
  }; // End fo run()
} // end of class definition
