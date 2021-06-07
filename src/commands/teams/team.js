const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { logEvent } = require("../../utils/logger");
const { getVerticals } = require("../../db/read");

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
    let verticalsArray = [];
    let verticalsEmbedOptions = [];

    // Message asking for the idea/challenge
    message.author
      .send(
        new MessageEmbed()
          .setTitle(`🦾 Invitación al equipo`)
          .setDescription(
            `
              ➡ Instrucciones:

              \> Escribe la idea que quieres desarrollar
              \> en este evento para dar solución a una
	      \> problematica, recuerda motivar a los demás
	      \> para que sean parte de tu equipo! ✅ 
            `
          )
          .addField("\u200B", "\u200B")
          .setColor(process.env.PRIMARY)
          .setFooter(process.env.FOOTER_MESSAGE)
          .setTimestamp()
      )
      // Waiting the team title (also it will be the role)
      // Waiting for the idea
      .then((ideaMessage) => {
        const filter = (idea) => idea.content.length <= 512;

        return message.author.dmChannel.awaitMessages(filter, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })

      // Asking for the verticals
      .then((idea) => {
        team.idea = idea.first().content;
        return getVerticals({ serverId: message.guild.id });
      })
      .then((verticals) => {
        verticalsArray = verticals.verticals.split(",");
        verticalsArray.forEach((vertical, index) => {
          verticalsEmbedOptions.push({
            name: `\> ${index + 1}`,
            value: `${vertical}`,
            inline: true,
          });
        });

        message.author.send(
          new MessageEmbed()
            .setTitle(`🔬 Verticales de tu problemática`)
            .setDescription(
              `
              ➡ Instrucciones:

              \> Ingresa el numero que corresponda a la 
              \> vertical relacionada con tu problemática
              \> 
              \> (puedes seleccionar varias problemáticas
              \> separandolas con una coma: 1, 4, 6)
            `
            )
            .addField("\u200B", "\u200B")
            .addFields(verticalsEmbedOptions)
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setFooter(process.env.FOOTER_MESSAGE)
            .setTimestamp()
        );
      }) // verticals

      // Waiting for the idea
      .then((verticalChoiceEmbed) => {
        //console.log("ok 2: " + verticalsArray);

        const filter = (choice) =>
          parseInt(choice) > 0 && parseInt(choice) <= verticalsArray.length;

        return message.author.dmChannel.awaitMessages(filter, {
          max: 1,
          time: process.env.AWAIT_RESPONSE_TIMEOUT,
          errors: ["time"],
        });
      })

      // Final feedback an publication of idea collector
      .then((verticalChoice) => {
        // Gets each vertical choosed
        // transforming its values in
        // order to match with the
        // verticalsArray indexes

        team.verticals = [];
        verticalChoice
          .first()
          .content.split(",")
          .map((vertical) => vertical - 1)
          .forEach((verticalIndex) => {
            team.verticals.push(verticalsArray[verticalIndex]);
          });

        // Insert team
        return message.author.send(
          new MessageEmbed()
            .setTitle(`Invitación publicada ✅`)
            .setDescription(
              `
              Tu invitación ha sido publicada
              en el canal de equipos, ahora solo
              reacciona a ella con el emoji de ⚔
              y espera a que más personas se unan.
              `
            )
            .addField("\u200B", "\u200B")
            .addFields([
              { name: "Problemática 💥", value: team.idea },
              { name: "Verticales 🧪", value: team.verticals },
            ])
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE)
        );
      })
      .then((finalFeedback) => {
        // TODO: Dinamically channel to make teams
        // of find by name
        const teamBuildChannel = message.guild.channels.cache.find(
          (guildChannel) => guildChannel.name === "arma-tu-equipo"
        );
        return teamBuildChannel.send(
          new MessageEmbed()
            .setTitle(
              `
                  \@${message.author.username} los invita a su equipo! 🚀
                `
            )
            .addField("\u200B", "\u200B")
            .addFields([
              {
                name: `Líder de equipo 🐺`,
                value: message.author.username,
              },
              {
                name: `Problemática o idea 💥`,
                value: team.idea,
              },
              {
                name: `Verticales de nuestra problemática 🧪`,
                value: team.verticals,
              },
              {
                name: "\u200B",
                value: "\u200B",
              },
              {
                name: `🤔 ¿Como me uno al equipo?`,
                value: 
		      `
		      	Reacciona al emoji de ⚔ y cuando
			el equipo cuente con los integrantes
			mínimos yo me encargaré de crear:

			👉 Un rol especial para el equipo
			👉 Un canal de texto para el equipo
			👉 Un canal de audio para el equipo
		      `
              },
            ])
            .addField("\u200B", "\u200B")
            .setColor(process.env.PRIMARY)
            .setTimestamp()
            .setFooter(process.env.FOOTER_MESSAGE)
        );
      })
      .then((message) => {
        message.react("⚔");
      })
      .catch((error) => console.error(error))

      // Cleans user command execution
      .then(() => message.delete({ timeout: 1000 }));
  } // run
}; // class
