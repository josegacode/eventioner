const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { checkIfThereAreActiveEvents } = require('../../db/read');

module.exports = class Events extends Command {
	constructor(client) {
		super(client, {
			name: 'events',
			aliases: ['e'],
			group: 'events',
			memberName: 'events',
			description: 
      `
      Shows the stats for the current active
      event (is exists) in the server
      `,
      guildOnly: true, // Only works inside a server
      clientPermissions: ['ADMINISTRATOR'], // Only admins can perform it
		});
  } // constructor

  async run(message) {
    const { channel } = message;
    const serverId = message.guild.id;

    checkIfThereAreActiveEvents(serverId)
      .then(thereAreActiveEvents => {
        if(thereAreActiveEvents) {
          channel.send('Fetching event info ...');
          // Retrieve all information about it
          // Show feedback of event infomation 

        } else {
          //channel.send('No events');

          // Show feedback of none event active 
            return message.embed(
              new MessageEmbed()
                .setTitle(`No hay eventos activos 🔎`)
                .setDescription(
                  `
                    Ooops, parece que este servidor
                    no tiene eventos activos por el
                    momento. Recuerda que puedes activar
                    un evento con el comando !start-event
                    <EVENTBRITE-EVENT-ID>
                  `)
                .addField('\u200B', '\u200B')
                .setColor(process.env.WARNING)
                .setTimestamp()
            ).then(feedback => feedback.delete({timeout: process.env.FEEDBACK_TIMEOUT}))

        }
      })
      .catch(error => channel.send(error));


  } // run
} // class
