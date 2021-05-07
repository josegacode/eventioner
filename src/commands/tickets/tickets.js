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

const {ping, retrieveEventInformation, validateAttendee} = require('../../utils/eventbriteHandler');

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
      .then(response => {
        // Destructs the attendees arrays
        const { attendees } = response;

        // Returning the profile which buy the ticket
        return attendees.find(attendee => attendee.order_id == ticketId);
      })
      .then(attendee => {
        if(attendee != undefined) {
    // User who executed the message
    const user = message.author;

    // User member 
    const member = message.guild.members.cache.find((member) => member.id === user.id);
    // Shows a embed message asking
    // for a type of mentor that the
    // member wants to be.
    const question = new MessageEmbed()
        .setTitle(`What kind of mentor do you want to be @${user.username}?`)
        .setDescription(
          `1) Branding \n 2) Capital \n 3) Tech`
        )
        .setColor(0x539BFF)

    // Checks if the option choosed
    // are listed.
    const options = ['1', '2', '3'];
    const filter = response => {
      return options.some(
        choose => choose.toLowerCase() === response.content.toLowerCase()
    );
    };

    let mentorTypeName;

    message.channel.send(question)
      .then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            //message.channel.send(`${collected.first().author} got the correct answer!`);
            //console.log(`Colleted object: ${JSON.stringify(collected)}`);

            // Base mentor role
            member.roles.add('755528558838939648');

            // Category of mentor
            switch(collected.first().content) {
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
                .setTitle(`Hey @${user.username}, you are now a ${mentorTypeName}! 👩‍🏫👨‍🏫`)
                .setDescription(`Thanks, your email was registered successfully and ${mentorTypeName}
                role was given to you, enjoy it ⚡`)
                .setColor(0x539BFF)
            );
          })
          .then(() => {
      // Await for spreadsheet api
      spreadsheetHandler.saveMentorEmail(
        spreadsheets.mentorsRegistration.id, 
        {
          email: email,
          username: user.username,
          typeOfMentor: mentorTypeName,
          server: message.guild.name,
        } 
      );

          })
          .catch(collected => {
            message.channel.send(`Sorry, ${collected.first().content} isn't an option`);
          });
      }) // end of first then

        } else {
            return message.embed( 
              new MessageEmbed()
                .setTitle(`⚠ TICKER ORDER INS'T VALID ⚠`)
                .setDescription(`If you already buy a ticket for the event, check if was 
                  typed correctly 😁`)
                .setColor(0x539BFF)
            );

        } // end of attendee ticket check
      })
  }; // End fo run()
} // end of class definition
