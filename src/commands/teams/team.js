const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { logEvent } = require("../../utils/logger");

module.exports = class Team extends Command {
  constructor(client) {
    super(client, {
      name: "team",
      aliases: ["t"],
      group: "teams",
      memberName: "team",
      description: `A wizard for make a reaction collector where
      another attendees can react a enroll to that team,
      when the reaction reach the MAX_HACKERS number of members
      a new text channel is open to they.`,
      guildOnly: true, // Only works inside a server
    });
  } // constructor

  async run(message) {
    let team = {};

    // Message asking for the title
    message.author
      .send(
        new MessageEmbed()
          .setTitle(`😄 Me encantaria conocerte!`)
          .setDescription(
            `
              ➡ Instrucciones:

              \> Hola, soy Eventioner y te ayudare a 
              \> formar un equipo ⚔, comencemos por  
              \> presentarte, escribe una breve descripcion sobre
              \> sobre ti, quien eres, cual es tu trayectoria
              \> profesional, etc. 
            `
          )
          .addField("\u200B", "\u200B")
          .setColor(process.env.PRIMARY)
          .setFooter(process.env.FOOTER_MESSAGE)
          .setTimestamp()
      )
      // Waiting the team title (also it will be the role)
      .then((mdMessage) => {
        const filter = (title) => title.content.length <= 200;

        return message.author.dmChannel.awaitMessages(filter, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })

      // Asking for the idea
      .then((title) => {
        team.title = title.first().content;

        return message.author.send(
          new MessageEmbed()
            .setTitle(`🦾 Invitacion al equipo`)
            .setDescription(
              `
              ➡ Instrucciones:

              \> Escribe la problematica que te gustaria
              \> solucionar en este evento, de forma que
              \> motive a los demas participantes a formar
              \> parte de tu equipo! 
            `
            )
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setFooter(process.env.FOOTER_MESSAGE)
            .setTimestamp()
        );
      })

      // Waiting for the idea
      .then((ideaMessage) => {
        const filter = (idea) => idea.content.length <= 512;

        return message.author.dmChannel.awaitMessages(filter, {
          max: 1,
          time: 60000,
          errors: ["time"],
        });
      })

      // Asking for the verticals
      .then((title) => {
        team.title = title.first().content;

        return message.author.send(
          new MessageEmbed()
            .setTitle(`🔬 Verticales de tu problematica`)
            .setDescription(
              `
              ➡ Instrucciones:

              \> A continuacion te muestro la lista de  
              \> verticales disponibles para el evento,
              \> ingresa el numero que corresponda a la 
              \> vertical relacionada con tu problematica
              \> (puedes seleccionar varias problematicas
              \> separandolas con una coma: 1, 4, 6)
            `
            )
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setFooter(process.env.FOOTER_MESSAGE)
            .setTimestamp()
        );
      })

      // Waiting for the idea
      .then((ideaMessage) => {
        const filter = (idea) => idea.content.length <= 512;

        return message.author.dmChannel.awaitMessages(filter, {
          max: 1,
          time: 60000,
          errors: ["time"],
        });
      })

      // Final feedback an publication of idea collector
      .then((idea) => {
        team.idea = idea.first().content;

        return message.author.send(
          new MessageEmbed()
            .setTitle(` Tu idea esta lista 🎉`)
            .setDescription(
              `Tu idea ha sido publicada
              en el canal correspondiente, ahora solo
              espera a que alguien mas se integre a
              tu equipo 🤩`
            )
            .addField("\u200B", "\u200B")
            .addFields([
              { name: "Equipo 🚀", value: team.title },
              { name: "Idea 💡", value: team.idea },
            ])
            .addField("\u200B", "\u200B")
            .setColor(0x00aed6)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE)
        );
      })
      .then((finalFeedback) => {
        return message.client.channels.cache
          .get("842429651171278918")
          .send(
            new MessageEmbed()
              .setTitle(`Se parte de "${team.title}" 🚀`)
              .setDescription(team.idea)
              .addField("\u200B", "\u200B")
              .setColor(0x00aed6)
              .setTimestamp()
              .setFooter("Made with 💙 by Legion Hack")
          );
      })
      .then((message) => {
        message.react("⚔");
      })
      .catch((error) => console.error(error));
  } // run
}; // class
