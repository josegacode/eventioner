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
//const { getMentorByName } = require('../../utils/eventRolesManager')

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
    validateAttendee(ticketId)
      
      // Pucharse check
      .then(response => {
        // Destructs the attendees arrays
        const { attendees } = response;
        attendees.forEach(attendee => console.log(attendee.profile));
        //console.log(response);
        // Returning the profile which buy the ticket
        return attendees.find(attendee => attendee.order_id == ticketId);
      })

      // Knowing the type of attendee 
      .then(attendee => {
        if(attendee != undefined) {
            message.embed(
              new MessageEmbed()
              .setTitle(`Que tipo de participante quieres ser? 🤔`)
              .setDescription(`1) Mentorx \n 2) Solo participante`)
              .setColor(0x539BFF)
            )

            return message.channel.awaitMessages(
              //typeOfAttendeeFilter,
              response => response.content == '1' || response.content == '2',
              { max: 1, time: 30000, errors: ['time'] }
            )
        } else {
            message.embed( 
              new MessageEmbed()
                .setTitle(`⚠ BOLETO NO VALIDO ⚠`)
                .setDescription(`Al parecer el ticket de Evenbrite que me diste
                  no existe, verifica que lo has escrito correctamente 🤔`)
                .setColor(0x539BFF)
            );
        }
      }) // End type of attendee validation
      .then(typeOfAttendee => {
        switch(typeOfAttendee.first().content) {
          case '1':
            return getAttendeeByTicket(ticketId)

          // Gives Participante role and finishes
          break;
          case '2':
            console.log(`General attendee`);
            message.member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Participante'));
             message.embed( 
              new MessageEmbed()
                .setTitle(`Registro validado ✅`)
                .setDescription(`@${message.author.username} tu registro ha sido validado,
                  y ahora tienes el rol de participante, gracias! 😄`)
                .setColor(0x539BFF)
            )
              .then(attendeeFeedback => attendeeFeedback.delete({timeout: 10000}))
            break;
        } // Type of attende switch()
      }) //type of attendee
      .then(attendee => {
        //console.log(`ATTENDE: ${attendee.profile.email}`);
        return validateMentorEmail(attendee.profile.email);
      }) // mentor validation
      .then(emailValidated => {
        
        console.log(`emailValidated ${emailValidated}`)
        if(emailValidated) {
          message.embed(new MessageEmbed()
            .setTitle(`Que tipo de mentorx quieres ser @${message.author.username}?`)
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
            .setTitle(`⚠ Mentorx no conocido ⚠`)
            .setDescription(
              `Lo siento, al parecer no formas parte de la base de datos de
              mentorxs conocidos, ponte en contacto con los organizadores del
              evento para solicitar apoyo 😉`
            )
            .setColor(0x539BFF)
          ) 
        } // if-else email validation
      }) // email validation

      .then(typeOfMentor => {
         const user = message.author;
         const member = message.guild.members.cache.find((member) => member.id === user.id);
            // Base mentor role
            member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Mentorx'));

            let mentorTypeName;

            // Category of mentor
            switch(typeOfMentor.first().content) {
              case '1':
                member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Mentorx'));
                mentorTypeName = 'Mentorx Branding';
                break;
              case '2':
                member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Mentorx Capital'));
                mentorTypeName = 'Mentorx Capital';
                break;
              case '3':
                member.roles.add(message.guild.roles.cache.find(guildRole => 
                  guildRole.name == 'Mentorx Tech'));
                mentorTypeName = 'Mentorx Tech';
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
      .then(() => {
        message.delete({ timeout: 5000 });
      })
  }; // End fo run()
} // end of class definition
