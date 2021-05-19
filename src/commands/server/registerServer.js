/**
  * This command check if the server
  * exists in known database, if not,
  * registered it, else, just skip the action
  * and feedback is send to the user who
  * executes the command.
  * */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { logEvent } = require('../../utils/logger');
const { checkIfServerExists } = require('../../db/read');
const { addNewServer } = require('../../db/create');

module.exports = class AddServer extends Command {
	constructor(client) {
		super(client, {
			name: 'addserver',
			aliases: ['as'],
			group: 'server',
			memberName: 'addserver',
			description: `Add new discord server to the known 
      database or omit if this is already added.`,
      guildOnly: true, // Only works inside a server
		});
  } // constructor

  async run(message) {
    // Take server guild id
    const serverId = message.guild.id;
    const serverName = message.guild.name;
    const botId = message.client.user.id;

    let exists = await checkIfServerExists(serverId);
    //console.log(`exists server: ${exists}`);
    // Query if exist in db
    if(exists) {
      message.author.send(
        new MessageEmbed()
          .setTitle(`El servidor ya esta registrado 👀`)
          .setDescription(`Ooops, parece que este servidor ya esta
            registrado en mi base de datos! 🤖`)
          .addField('\u200B', '\u200B')
          .setColor(0xffd56b)
          .setTimestamp()
      ).then(feedback => feedback.delete({timeout: process.env.FEEDBACK_TIMEOUT}))
    } else {
      // Not exists
      // Save server data in db
      let serverAdded = addNewServer(serverId, serverName);
      //console.log(`agregando server: ${serverAdded}`);
      if(serverAdded) {
        // Feedback
        message.author.send(
          new MessageEmbed()
            .setTitle(`Servidor registrado ✅`)
            .setDescription(`He registrado un tu nuevo servidor, ahora
              puedes configurar eventos y mucha mas informacion! 🤩`)
            .addField('\u200B', '\u200B')
            .setColor(0xffd56b)
            .setTimestamp()
        ).then(feedback => feedback.delete({timeout: process.env.FEEDBACK_TIMEOUT}))
      } else {
        return message.author.send(
          `Error inserting new server into db`
        ).then(feedback => feedback.delete({timeout: process.env.FEEDBACK_TIMEOUT}))

      }
    }
  } // run
} // class

