/**
  * Shows the list of active or
  * coming soon events from eventbrite
  * organizations and then let the user
  * choose one in order to link that 
  * event to the server where the command
  * is executed.
  * */

const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { getAvailableEvents } = require("../../utils/eventbriteHandler");

module.exports = class StartEvent extends Command {
  constructor(client) {
    super(client, {
      name: "start-event",
      aliases: ["st"],
      group: "events",
      memberName: "start-event",
      description: 
      `
        Shows a list of
        live or coming soon
        events in order to let
        to the user choose one of
        them for activate in the
        current server.
      `,
      guildOnly: true, // Only works inside a server
      clientPermissions: ["ADMINISTRATOR"], // Only admins can perform it
    });
  } // constructor

  async run(message) {

    getAvailableEvents(message.guild.id)
      .then(eventsAvailable => {
        const { events } = eventsAvailable;

        const eventsList = [];
        const dateRegex = /\d+-\d+-\d+/gm;
        events.forEach((eventInfo, index) => {
          eventsList.push({
            name: `( ${index+1} )  ➡  ${eventInfo.name.text}`,
            value: 
            `
              ${eventInfo.description.text}

              🗓 Inicia: ${eventInfo.start.local.match(dateRegex)}
              🗓 Termina: ${eventInfo.end.local.match(dateRegex)}
            `
          })
        })

        // Check if the event already was
        // linked with another server (tempo-
        // raly optinal)

        // Select one:
        // Build the embed
        const eventsOptionsEmbed = new MessageEmbed()
                .setTitle(`Eventos disponibles 🚀`)
                .setDescription(`➡  Ingresa el numero que corresponda al evento que deseas activar en este servidor.`)
                .addField('\u200B', '\u200B')
                .addFields(eventsList)
                .addField('\u200B', '\u200B')
                .setColor(0x00AED6)
                .setTimestamp()
                .setFooter(process.env.FOOTER_MESSAGE)

        // Link in db with current server

        // Feedback
        message.author.send(eventsOptionsEmbed)
      })
      .catch((error) => console.log(error));
  } // run
}; // class
