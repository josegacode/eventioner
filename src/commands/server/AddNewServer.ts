/**
 * This command check if the server
 * exists in known database, if not,
 * registered it, else, just skip the action
 * and feedback is send to the user who
 * executes the command.
 * */
import { Command } from "discord.js-commando";
import { MessageEmbed } from "discord.js";

export class AddServer extends Command {
  constructor(client) {
    super(client, {
      name: "addserver",
      aliases: ["as"],
      group: "server",
      memberName: "addserver",
      description: `Add new discord server to the known 
      database or omit if this is already added.`,
      guildOnly: true, // Only works inside a server
    });
  } // constructor

  async run(message): Promise<any> {
    // Take server guild id
    const serverId = message.guild.id;
    const serverName = message.guild.name;
    const botId = message.client.user.id;

		/*
    checkIfServerExists(serverId).then((exists) => {
      // Checks if another bot
      // registered the server.
      if (exists) {
        // Server is in db,
        // so now we check if is linked
        // with the bot.
        checkIfServerIsLinkedWithBot(botId, serverId)
          .then((isLinked) => {
            console.log(isLinked);

            // Is linked, null value is returned
            if (isLinked) {
              message.author
                .send(
                  new MessageEmbed()
                    .setTitle(`El servidor ya esta vinculado conmigo 👀`)
                    .setDescription(
                      `Ooops, parece que este servidor ya esta
                      registrado en mi base de datos y vinculado conmigo! 🤖`
                    )
                    .addField("\u200B", "\u200B")
                    .setColor(process.env.WARNING)
                    .setTimestamp()
                )
                .then((feedback) =>
                  feedback.delete({ timeout: process.env.FEEDBACK_TIMEOUT })
                );
            }

            // If not, just link it
            else return linkBotWithServer(botId, serverId);
          })
          .then((linked) => {
            console.log(linked);

            // The server exists and also bot is linked
            // (null value was sent from the previous then)
            // with it, so no action is needed to perform
            if (linked != undefined && linked) {
              // User feedback
              message.author
                .send(
                  new MessageEmbed()
                    .setTitle(`Servidor registrado ✅`)
                    .setDescription(
                      `Parece que este servidor ya lo conocian mis colegas, y ahora yo tambien 😁`
                    )
                    .addField("\u200B", "\u200B")
                    .setColor(process.env.PRIMARY)
                    .setTimestamp()
                )
                .then((feedback) =>
                  feedback.delete({ timeout: process.env.FEEDBACK_TIMEOUT })
                );
            }
          });
      } else {
        // Server isnt on db
        // Then save new server
        addNewServer(serverId, serverName)
          .then((serverAdded) => {
            if (serverAdded)
              // Then generate its configuration
							console.log('Generating default configuration for this server ...');
              //return generateServerDefaultConfiguration();
          })
          .then((configurationGenerated) => {
            if (configurationGenerated)
              // Then link with the bot
              return linkBotWithServer(serverId, botId);
          })
          .then((isLinked) => {
            if (isLinked) {
              // Then show feedback
              message.author
                .send(
                  new MessageEmbed()
                    .setTitle(`Servidor registrado ✅`)
                    .setDescription(
                      `He registrado un tu nuevo servidor, ahora
                      puedes configurar eventos y mucha mas informacion! 🤩`
                    )
                    .addField("\u200B", "\u200B")
                    .setColor(0xffd56b)
                    .setTimestamp()
                )
                .then((feedback) =>
                  feedback.delete({ timeout: process.env.FEEDBACK_TIMEOUT })
                );
            }
          });
      }
    });
	*/
    // Query if exist in db
  } // run
}; // class
