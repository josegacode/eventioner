/**
 * @author Jose Garcia
 * This module contains all commands
 * related to mentors in the server.
 * */

// Handler for use the structure
// predefined for declare commands
"use strict";

import { MessageEmbed } from "discord.js";
import { Command } from "discord.js-commando";
//import { getEventActiveInfo } from "../../db/read";
import {
  getAttendeesPage,
  getAttendees,
  getAttendeesTickets,
} from "../../utils/eventbriteHandler";

export class EnrollCommand extends Command {
  constructor(client) {
    super(client, {
      name: "enroll",
      aliases: ["en"],
      group: "tickets",
      memberName: "enroll",
      description: `Validates that the user already buy a ticket and then let it
      choose a rol for the event`,
      examples: [
        `
          ${client.commandPrefix}enroll [AQUI-TU-NUMERO-DE-TICKET] ✅
          ${client.commandPrefix}enr [AQUI-TU-NUMERO-DE-TICKET] ✅
        `
      ], 
      args: [
        {
          key: "ticketId",
          prompt: ` olvidaste poner tu ticket de Eventbrite, `,
          type: "string",
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

  async run(message, { ticketId }): Promise<any> {
		/*
    getEventActiveInfo({
      serverId: message.guild.id,
    })
      .then((eventInformation) => {
        getAttendeesTickets({
          event: eventInformation
        })
          .then((allTickets) => {
            // Gets all pages [pagination{}, attendees[]]

            let attendeeFound;
            let pageArrayIndex = 0;
            do {
              if (
                allTickets[pageArrayIndex].attendees.some(
                  (attendee) => attendee.order_id == ticketId
                )
              ) {
                attendeeFound = true;
                //console.log(`found on page ${pageArrayIndex}`);
              }
              //console.log(`on page #${pageArrayIndex}`);
              pageArrayIndex++;
            } while (!attendeeFound && pageArrayIndex < allTickets.length);

            // Ticket validation per page
            // TODO: add role exists validation
            if (attendeeFound) {
              message.member.roles.add(
                message.guild.roles.cache.find(
                  (guildRole) => guildRole.name == "Participante"
                )
              );
              return message.embed(
                new MessageEmbed()
                  .setTitle(`Registro exitoso ✅`)
                  .setDescription(
                    `@${message.author.username} tu boleto ha sido confirmado con éxito y tienes el rol de Participante,
                disfruta del evento! 🚀`
                  )
                  .addField("\u200B", "\u200B")
                  .setColor(process.env.PRIMARY)
                  .setTimestamp()
                  .setFooter(process.env.FOOTER_MESSAGE)
              );
            } else {
              return message.embed(
                new MessageEmbed()
                  .setTitle(`El registro ha fallado ⚠`)
                  .setDescription(
                    `Tu boleto no se ha podido validar por las siguientes razones:
                  
                  👉  Lo has escrito incorrectamente
                  👉  Ingresaste un boleto inexistente (debes registrate en Eventbrite previamente) 
                  👉  Ingresaste un boleto que no corresponde a este evento 
                  👉  Tu boleto ya fue registrado por otra persona 
                  `
                  )
                  .addField("\u200B", "\u200B")
                  .setColor(process.env.PRIMARY)
                  .setTimestamp()
                  .setFooter(process.env.FOOTER_MESSAGE)
              );
            }
          })
          .then((attendeeFeedback) => {
            message.delete({ timeout: 500 });
            attendeeFeedback.delete({ timeout: 50000});
          });
      })
      .catch((error) => console.error(error));
			*/
  } // End fo run()
}; // end of class definition
