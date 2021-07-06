/**
 * @author Jose Garcia
 * This module contains all commands
 * related to mentors in the server.
 * */

// Handler for use the structure
// predefined for declare commands
"use strict";

import { MessageEmbed } from "discord.js";
const { Command } = require("discord.js-commando");
import { validateMentorEmail } from "../../SpreadSheetHandler";

module.exports = class BeMentor extends Command {
  constructor(client) {
    super(client, {
      name: "bementor",
      aliases: ["bm"],
      group: "tickets",
      memberName: "bementor",
      description: `Validates registry`,
      args: [
        {
          key: "email",
          prompt: ` you forgot to provide your mentor email, usage 👉 !bementor| !bm <email> ✅`,
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

  async run(message, { email }) {
    //ping();

    // Getting the promise
    validateMentorEmail(email)
      // Pucharse check
      .then((emailIsValid) => {
        if (emailIsValid) {
          message.member.roles.add(
            message.guild.roles.cache.find(
              (guildRole) => guildRole.name == "Mentorx"
            )
          );
          return message.embed(
            new MessageEmbed()
              .setTitle(`Mentorx registradx ✅`)
              .setDescription(
                `@${message.author.username} tu registro como mentorx ha sido validado,
                  disfruta del evento! 🚀`
              )
              .addField("\u200B", "\u200B")
              .setColor(0x00aed6)
              .setTimestamp()
              .setFooter(process.env.FOOTER_MESSAGE)
          );
        } else {
          return message.embed(
            new MessageEmbed()
              .setTitle(`Mentorx desconocido ⚠`)
              .setDescription(
                `@${message.author.username} al parecer tu correo electronico no aparece en nuestra
                  base de datos de mentores conocidos, ponte en contacto
                  con los organizadores del evento para dar seguimiento a tu caso.`
              )
              .addField("\u200B", "\u200B")
              .setColor(0xffd56b)
              .setTimestamp()
              .setFooter(process.env.FOOTER_MESSAGE)
          );
        }
      }) // End type of attendee validation
      .then((mentorFeedback) => {
        message.delete({ timeout: 500 });
        mentorFeedback.delete({ timeout: 15000 });
      })
      .catch((error) => console.error(error));
  } // End fo run()
}; // end of class definition
