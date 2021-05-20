const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { checkIfThereAreActiveEvents } = require("../../db/read");

module.exports = class Events extends Command {
  constructor(client) {
    super(client, {
      name: "events",
      aliases: ["e"],
      group: "events",
      memberName: "events",
      description: `
      Shows the stats for the current active
      event (is exists) in the server
      `,
      guildOnly: true, // Only works inside a server
      clientPermissions: ["ADMINISTRATOR"], // Only admins can perform it
    });
  } // constructor

  async run(message) {
    const { channel } = message;
    const serverId = message.guild.id;
    const serverName = message.guild.name;

    checkIfThereAreActiveEvents(serverId)
      .then((thereAreActiveEvents) => {
        if (thereAreActiveEvents) {
          channel.send("Fetching event info ...");
          // Retrieve all information about it
          // Show feedback of event infomation
        } else {
          //channel.send('No events');

          // Show feedback of none event active
          return message
            .embed(
              new MessageEmbed()
                .setTitle(`Estado del evento en ${serverName} 🚀`)
                .setDescription(
                  `
                    Recuerda que puedes registrar un nuevo
                    evento de la siguiente forma:

                    !start-event <EVENTBRITE-EVENT-ID> ✅
                    !se <EVENTBRITE-EVENT-ID> ✅

                    !start-event<EVENTBRITE-EVENT-ID> ❌
                    !start-event ❌
                    !se ❌
                  `
                )
                .addField("\u200B", "\u200B")
                .addField(`Evento`, ` No hay eventos activos 😪`)
                .addFields([
                  {
                    name: "Participantes 🦾",
                    value: "N/A",
                    inline: true,
                  },
                  {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true,
                  },
                  {
                    name: "Mentorxs  👩‍🏫",
                    value: "N/A",
                    inline: true,
                  },
                  {
                    name: "Equipos  🤜🤛",
                    value: "N/A",
                    inline: true,
                  },
                  {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true,
                  },
                  {
                    name: "Verticales  🚀",
                    value: "N/A",
                    inline: true,
                  },
                ])
                .addField("\u200B", "\u200B")
                .setColor(process.env.PRIMARY)
                .setTimestamp()
            )
            .then((feedback) =>
              feedback.delete({ timeout: process.env.FEEDBACK_TIMEOUT })
            );
        }
      })
      .catch((error) => channel.send(error));
  } // run
}; // class
