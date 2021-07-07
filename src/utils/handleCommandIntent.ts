import stringEvaluator from 'string-similarity';
import { MessageEmbed } from 'discord.js';

const includesPrefix = async (client, message) => {
  const { content } = message;
  if(content.includes(client.commandPrefix))
    return true;
  else
    return false;
}

const handleCommandIntent = async (client, message) => {
  if(!includesPrefix(client, message)) {
      try {
        const feedback = await message.embed(
          new MessageEmbed()
            .setTitle('Falta el prefijo')
            .setDescription(
            `
             Olvidaste colocar el prefijo \`${client.commandPrefix}\` 
             antes del comando.
             `
            )
          .addField("\u200B", "\u200B")
          .addFields([
            {
              name: 'Mira estos ejemplos ✅',
              value: 'command.examples'
            }
          ])
          .addField("\u200B", "\u200B")
          .setColor(process.env.WARNING)
          .setTimestamp()
          .setFooter(process.env.FOOTER_MESSAGE)
        )

      feedback
        .delete({ timeout: process.env.SHORT_AWAIT_RESPONSE_TIMEOUT })
      } catch(error) {
        console.log(error);
      }
  } else {
    // Clients commands
    const clientCommandNames = client.registry.commands
      .map(command => command.name);

    // Member message 
    const { content } = message;

    // cache the command match names 
    const commandCandidate = stringEvaluator
      .findBestMatch(content, clientCommandNames)

  console.log(JSON.stringify(commandCandidate, null, 2))
  if(
    commandCandidate.bestMatch.rating > 0.5 && 
    commandCandidate.bestMatch.rating < 1
  ) {
      const commandIntent = client.registry.commands
      .find(clientCommand =>  {
        return clientCommand.name === commandCandidate.bestMatch.target
      })

      const feedback = await message.embed(
            new MessageEmbed()
              .setTitle('Solicitud no valida 😅')
              .setDescription(
              `
                Uso correcto del comando 
                \`${client.commandPrefix}${commandIntent.name}\` \u200B \u200B ⤵

                ${commandIntent.examples}
               `
              )
                  .addField("\u200B", "\u200B")
                  //.setColor(process.env.PRIMARY)
                  .setTimestamp()
                  .setFooter(process.env.FOOTER_MESSAGE)
          )

      feedback
        .delete({ timeout: process.env.SHORT_AWAIT_RESPONSE_TIMEOUT })
  } 
  }
}

module.exports = {
  handleCommandIntent: handleCommandIntent,
}
