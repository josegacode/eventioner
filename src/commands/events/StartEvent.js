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
const { linkBotWithServer, linkEventWithServer } = require("../../db/create");
const { checkIfEventIsActive } = require("../../db/read");

module.exports = class StartEvent extends Command {
  constructor(client) {
    super(client, {
      name: "start-event",
      aliases: ["st"],
      group: "events",
      memberName: "start-event",
      description: `
        Shows a list of
        live or coming soon
        events in order to let
        to the user choose one of
        them for activate in the
        current server.
      `,
      guildOnly: true,
      userPermissions: ["ADMINISTRATOR"], // Only admins can perform it
    });
  } // constructor

  async run(message) {
    // Info for register the choice
    // of the user
    const eventsList = [];

    // Info for embed message
    const eventsListEmbed = [];


    getAvailableEvents(message.guild.id)
      .then((eventsAvailable) => {
        const { events } = eventsAvailable;

        const dateRegex = /\d+-\d+-\d+/gm;
        events.forEach((eventInfo, index) => {
          eventsListEmbed.push({
            name: `( ${index + 1} )  ➡  ${eventInfo.name.text}`,
            value: `
              ${eventInfo.description.text}

              🗓 Inicia: ${eventInfo.start.local.match(dateRegex)}
              🗓 Termina: ${eventInfo.end.local.match(dateRegex)}
            `,
          });

          // List of events id
          // [0] -> <EVENT-ID>
          eventsList.push(eventInfo.id);
        });

        // Check if the event already was
        // linked with another server (tempo-
        // raly optinal)

        // Select one:
        // Build the embed
        const eventsOptionsEmbed = new MessageEmbed()
          .setTitle(`Eventos disponibles 🚀`)
          .setDescription(
            `➡  Ingresa el numero que corresponda al evento que deseas activar en este servidor.`
          )
          .addField("\u200B", "\u200B")
          .addFields(eventsListEmbed)
          .addField("\u200B", "\u200B")
          .setColor(0x00aed6)
          .setTimestamp()
          .setFooter(process.env.FOOTER_MESSAGE);

        // Feedback
        return message.author.send(eventsOptionsEmbed);
      })
      .then((guildMessage) => {
        // Waits for the
        // user choice
        const eventsIndexesOptions = Array.from(eventsList.keys());

        return message.author.dmChannel.awaitMessages(
          (input) => eventsIndexesOptions.includes(input.content - 1),
          { max: 1, time: 5000, errors: ["time"] }
        );
      })
      .then((eventSelected) => {
        // Checking if the event is
        // already active
        const eventIndex = eventSelected.first().content - 1;
        return checkIfEventIsActive({
          eventId: eventsList[eventIndex],
        });
      })
      .then((eventIsActive) => {
        // Saving into db if
        // the event isn't active
        if (!eventIsActive) {
          message.author.send("no active");
          return linkEventWithServer({
            eventId: eventsList[eventIndex],
            serverId: message.guild.id,
          });
        } else {
          // Feedback
          message.author
            .send(`Lo siento, el evento que intentas registrar ya se encuentra activo en uno de mis servidores, prueba con otro! 😄
          `);

          //TODO: let user choose another
          // event
        }
      })
      .then((eventLinked) => {
        if (eventLinked) {
        const nextSteps = new MessageEmbed()
          .setTitle(`Evento registrado ✅`)
          .setDescription(
            `➡  Has registrado `
          )
          .addField("\u200B", "\u200B")
          .addFields(eventsListEmbed)
          .addField("\u200B", "\u200B")
          .setColor(0x00aed6)
          .setTimestamp()
          .setFooter(process.env.FOOTER_MESSAGE);

        // Feedback
        return message.author.send(eventsOptionsEmbed);
          message.author.send("no active");
        } else {
          // Feedback
          message.author
            .send(`Lo siento, el evento que intentas registrar ya se encuentra activo en uno de mis servidores, prueba con otro! 😄
          `);

          //TODO: let user choose another
          // event
        }
      })
      .catch((error) => console.log(error));
  } // run
}; // class
