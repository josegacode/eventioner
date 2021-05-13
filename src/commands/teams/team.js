const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { roles , permissions } = require('../../json/baseRoles');
//const { getRoleByName } = require('../../utils/checkPermissions');

module.exports = class Team extends Command {
	constructor(client) {
		super(client, {
			name: 'team',
			aliases: ['t'],
			group: 'teams',
			memberName: 'team',
			description: `A wizard for make a reaction collector where
      another attendees can react a enroll to that team,
      when the reaction reach the MAX_HACKERS number of members
      a new text channel is open to they.`,
      guildOnly: true, // Only works inside a server
		});
  } // constructor

  async run(message) {
    let team = {
      title: '',
      idea: '',
    };

    // Message asking for the title
    message.author.send(
      new MessageEmbed()
        .setTitle(`Paso 1: Informacion sobre tu equipo 🚀`)
        .setDescription(`Como deseas llamar a tu equipo?`)
        .addField('\u200B', '\u200B')
        .setColor(0x00AED6)
        .setTimestamp()
        .setFooter('Made with 💙 by Legion Hack')
    )
      // Waiting the team title (also it will be the role)
      .then(mdMessage => {

        const filter = title => title.content.length <= 200;

        return message.author.dmChannel.awaitMessages(
          filter,
          {max: 1, time: 60000, 
            errors: ['time']}
        )
      })

      // Asking for the idea
      .then(title => {
        team.title = title.first().content;

        return message.author.send(
          new MessageEmbed()
            .setTitle(`Paso 2: Cual es tu idea? 💡`)
            .setDescription(`Describe brevemente la idea que
              deseas desarrollar con tu equipo`)
            .addField('\u200B', '\u200B')
            .setColor(0x00AED6)
            .setTimestamp()
            .setFooter('Made with 💙 by Legion Hack')
        )
      })

      // Waiting for the idea
      .then(ideaMessage => {
        const filter = idea => idea.content.length <= 512;

        return message.author.dmChannel.awaitMessages(
          filter,
          {max: 1, time: 60000, 
            errors: ['time']}
        )
      })

      // Final feedback an publication of idea collector
      .then(idea => {
        team.idea = idea.first().content;

        return message.author.send(
          new MessageEmbed()
            .setTitle(` Tu idea esta lista 🎉`)
            .setDescription(`Tu idea ha sido publicada
              en el canal correspondiente, ahora solo
              espera a que alguien mas se integre a
              tu equipo 🤩`)
            .addField('\u200B', '\u200B')
            .addFields([
              {name: 'Equipo 🚀', value: team.title},
              {name: 'Idea 💡', value: team.idea}
            ])
            .addField('\u200B', '\u200B')
            .setColor(0x00AED6)
            .setTimestamp()
            .setFooter('Made with 💙 by Legion Hack')
        )
      })
      .then(finalFeedback => {
        message.client.channels.cache.get('842429651171278918').send(
          new MessageEmbed()
            .setTitle(`Se parte de "${team.title}" 🚀`)
            .setDescription(team.idea)
            .addField('\u200B', '\u200B')
            .setColor(0x00AED6)
            .setTimestamp()
            .setFooter('Made with 💙 by Legion Hack')
        )
        .then(message => {
          message.react('⚔');
          const filter = (reaction, user) => true;
          const collector = message.createReactionCollector(filter, { dispose: true});
          collector.on('collect', (reaction, reactionCollector) => {
            console.log(`response: ${reaction.emoji}`)
               //do stuff
          });
        })
      })
      .catch(error => console.error(error))
  } // run
} // class

