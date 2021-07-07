import { Command } from "discord.js-commando";
import { MessageEmbed } from "discord.js";

class Events extends Command {
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

  async run(message): Promise<any> {
    const { channel } = message;
    const serverId = message.guild.id;
    const serverName = message.guild.name;

		/* todo: orm
    checkIfThereAreActiveEvents(serverId)
      .then((thereAreActiveEvents) => {
        if (thereAreActiveEvents) {
          // First, get data from db
          getEventActiveInfo(message.guild.id).then((dbResult) => {
            console.log(`result ${JSON.stringify(dbResult)}`);
            const eventInfoEmbed = new MessageEmbed()
              .setTitle(`Estado del evento en ${serverName} 🚀`)
              .addField("\u200B", "\u200B")
              .addField(`Evento`, ` No hay eventos activos 😪`)
              .addFields([
                {
                  name: "Participantes 🦾",
                  value: `\`\``,
                  inline: true,
                },
                {
                  name: "\u200B",
                  value: "\u200B",
                  inline: true,
                },
                {
                  name: "Mentorxs  👩‍🏫",
                  value: `\`| Categorias: ${dbResult.mentor_types}\``,
                  inline: true,
                },
                {
                  name: "Categorias de Mentorxs  👩‍🏫",
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
              .setTimestamp();
            message.embed(eventInfoEmbed);
          });

          // Next, call Eventbrite API

          // Finally build, construct and
          // show event info
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
			*/
  } // run
}; // class
