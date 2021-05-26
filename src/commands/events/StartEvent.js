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
    // Specific data from all
    // events, like name, id, image,
    // dates, etc.
    let eventsList = [];
    let eventSelectedIndex;

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
          eventsList.push({
            id: eventInfo.id,
            name: eventInfo.name.text,
          });
        }); // end foreach

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
        return message.embed(eventsOptionsEmbed);
      })
      .then((guildMessage) => {
        // Waits for the
        // user choice
        const eventsIndexesOptions = Array.from(eventsList.keys());

        return message.channel.awaitMessages(
          (input) => eventsIndexesOptions.includes(input.content - 1),
          { max: 1, time: process.env.AWAIT_RESPONSE_TIMEOUT, errors: ["time"] }
        );
      })
      .then((eventSelected) => {
        // Checking if the event is
        // already active
        eventSelectedIndex = eventSelected.first().content - 1;
        return checkIfEventIsActive({
          eventId: eventsList[eventSelectedIndex].id,
        });
      })
      .then((eventIsActive) => {
        // Saving into db if
        // the event isn't active
        if (eventIsActive) {
          const eventAlreadyActiveEmbed = new MessageEmbed()
            .setTitle(`Evento no registrado ⚠`)
            .setDescription(
              `
              ➡  Parece que alguien mas ya ha registrado \`${eventsList[eventSelectedIndex].name}\`, intenta registra otro evento 😄 
            `
            )
            .addField("\u200B", "\u200B")
            .setColor(process.env.WARNING)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE);
          // Feedback
          message.embed(eventAlreadyActiveEmbed);

          // Breaking the promise chain
          throw new Error("The event is already active");
        } else return false;
      })
      .then((eventLinked) => {
        if (!eventLinked) {
          const nextSteps = new MessageEmbed()
            .setTitle(`Evento seleccionado ✅`)
            .addField("\u200B", "\u200B")
            .setDescription(
              `
              ➡  Evento elegido \`${eventsList[eventSelectedIndex].name}\` 
              🚀 Verticales: ❔
              ⚔ Integrantes por cada equipo: ❔
              🤝 Canal para publicar ideas/armar equipos: ❔
              👩‍🏫 Categorias de mentores: ❔

              Ahora debes configurar unos detalles
              extras, comencemos por las verticales,
              escribelas separadas por una coma,
              ejemplos:

              ➡ Vertical 1, Vertical 2, ... ✅
              ➡ Vertical 1,Vertical 2,... ✅

              ➡ Vertical 1Vertical 2... ❌
              
              `
            )
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE);

          // Feedback
          return message.embed(nextSteps);
        } else {
          // Feedback
          message.channel.send(``);

          //TODO: let user choose another
          // event
        }
      })
      .then((eventActivatedFeedback) => {
        return message.channel.awaitMessages((input) => true, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })
      .then((verticals) => {
        eventsList[eventSelectedIndex].verticals = verticals.first().content;
        console.log(JSON.stringify(eventsList[eventSelectedIndex], null, 2));
      })
      .then((result) => {
        const membersPerTeamEmbed = new MessageEmbed()
          .setTitle(`Evento seleccionado ✅`)
          .addField("\u200B", "\u200B")
          .setDescription(
            `
              ➡  Evento elegido \`${eventsList[eventSelectedIndex].name}\`  ✅
              🚀 Verticales: \`${eventsList[eventSelectedIndex].verticals}\` ✅
              ⚔ Integrantes por cada equipo: ❔
              🤝 Canal para publicar ideas/armar equipos: ❔
              👩‍🏫 Categorias de mentores: ❔

              Cuantos integrantes debe tener cada
              equipo? 🤔 (puedes definir un rango 😉)

              Ejemplos:
              ➡ 3 ✅
              ➡ 3, 5 ✅ 
              ➡ 3,5 ✅

              ➡ 3.4 ❌
              ➡ n ❌
              ➡ de 3 a 4 ❌
              
              `
          )
          .addField("\u200B", "\u200B")
          .setColor(process.env.PRIMARY)
          .setTimestamp()
          .setFooter(process.env.FOOTER_MESSAGE);

        // Feedback
        return message.embed(membersPerTeamEmbed);
      })
      .then((membersPerTeamMessage) => {
        return message.channel.awaitMessages((input) => true, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })
      .then((membersPerTeam) => {
        eventsList[eventSelectedIndex].membersPerTeam =
          membersPerTeam.first().content;
        const teamBuildChannel = new MessageEmbed()
          .setTitle(`Configura el canal para armar equipos ✅`)
          .addField("\u200B", "\u200B")
          .setDescription(
            `
              ➡  Evento elegido \`${eventsList[eventSelectedIndex].name}\`  ✅
              🚀 Verticales: \`${eventsList[eventSelectedIndex].verticals}\` ✅
              ⚔ Integrantes por cada equipo: \`${eventsList[eventSelectedIndex].membersPerTeam}\` ✅
              🤝 Canal para publicar ideas/armar equipos: ❔
              👩‍🏫 Categorias de mentores: ❔

              Cual es el id del canal donde
              los equipos se formaran? 🤔 

              Ejemplos:
              ➡ 8927345028947520987
              ➡ arma-tu-equipo ✅ 

              ➡ arma-tu-equipo 1289374018934708 ❌
              ➡ 179649781643921 arma-tu-equipo ❌
              
              `
          )
          .addField("\u200B", "\u200B")
          .setColor(process.env.PRIMARY)
          .setTimestamp()
          .setFooter(process.env.FOOTER_MESSAGE);

        // Feedback
        return message.embed(teamBuildChannel);
      })
      .then((result) => {
        return message.channel.awaitMessages((input) => true, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })
      .then((teamBuildChannel) => {
        eventsList[eventSelectedIndex].teamBuildChannel =
          teamBuildChannel.first().content;
        const mentorsTypesEmbed = new MessageEmbed()
          .setTitle(`Configura los tipos de mentores ✅`)
          .addField("\u200B", "\u200B")
          .setDescription(
            `
              ➡  Evento elegido \`${eventsList[eventSelectedIndex].name}\`  ✅
              🚀 Verticales: \`${eventsList[eventSelectedIndex].verticals}\` ✅
              ⚔ Integrantes por cada equipo: \`${eventsList[eventSelectedIndex].membersPerTeam}\` ✅
              🤝 Canal para publicar ideas/armar equipos: \`${eventsList[eventSelectedIndex].teamBuildChannel}\` ✅
              👩‍🏫 Categorias de mentores: ❔

              Cuales son las categorias de mentores
              que participaran en este evento? 🤔

              Ejemplos:
              ➡ Mentorx Capital, Mentorx Tech, ... ✅ 
              ➡ Mentorx Capital,Mentorx Tech,... ✅ 

              ➡ Mentorx Capital Mentorx Tech... ❌
              ➡ Mentorx CapitalMentorx Tech... ❌ 
              ➡ Mentorx Capital.Mentorx Tech.... ❌ 
              
              `
          )
          .addField("\u200B", "\u200B")
          .setColor(process.env.PRIMARY)
          .setTimestamp()
          .setFooter(process.env.FOOTER_MESSAGE);

        // Feedback
        return message.embed(mentorsTypesEmbed);
      })
      .then((mentorsTypesEmbed) => {
        return message.channel.awaitMessages((input) => true, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })
      .then((mentorsTypes) => {
        eventsList[eventSelectedIndex].mentorsTypes =
          mentorsTypes.first().content;
        eventsList[eventSelectedIndex].server = message.guild.id;

        return linkEventWithServer(eventsList[eventSelectedIndex]);
      })
      .then((eventInserted) => {
        if (eventInserted) {
          const eventStartedFeedback = new MessageEmbed()
            .setTitle(`Evento iniciado ✅`)
            .setDescription(
              `
                Felicidades, has inciado \`${eventsList[eventSelectedIndex].name}\`
                en \`${message.guild.name}\`

              `
            )
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE);

          return message.embed(eventStartedFeedback);
        }
      })
      .catch((error) => console.log(error));
  } // run
}; // class
