const stringEvaluator = require('string-similarity');
const { MessageEmbed } = require('discord.js');

const handleCommandIntent = (client, message) => {

    // Clients commands
    const clientCommandNames = client.registry.commands
      .map(command => command.name);

    // Member message
    const { content } = message;

    // cache the command names 
    const commandCandidate = stringEvaluator
      .findBestMatch(content, clientCommandNames)

  //console.log(JSON.stringify(commandCandidate, null, 2))
  if(
    commandCandidate.bestMatch.rating > 0 && 
    commandCandidate.bestMatch.rating < 1
  ) {
      const commandIntent = client.registry.commands
      .find(clientCommand =>  {
        return clientCommand.name === commandCandidate.bestMatch.target
      })

          message.embed(
            new MessageEmbed()
              .setTitle('Solicitud no valida 😅')
              .setDescription(
              `
                Uso correcto del comando \`${client.commandPrefix}${commandIntent.name}\` \u200B \u200B ⤵

                ${commandIntent.examples}
               `
              )
                  .addField("\u200B", "\u200B")
                  //.setColor(process.env.PRIMARY)
                  .setTimestamp()
                  .setFooter(process.env.FOOTER_MESSAGE)
          ).then(feedback => feedback.delete({ timeout: process.env.SHORT_AWAIT_RESPONSE_TIMEOUT }))
  } else if(!commandCandidate.bestMatch.target
      .includes(client.commandPrefix)) {
          message.embed(
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
                value: 'command.examples',
              }
            ])
                  .addField("\u200B", "\u200B")
                  //.setColor(process.env.PRIMARY)
                  .setTimestamp()
                  .setFooter(process.env.FOOTER_MESSAGE)
          ).then(feedback => feedback.delete({ timeout: process.env.SHORT_AWAIT_RESPONSE_TIMEOUT }))

    }
  //console.log(commandCandidate);

    // Searching for match command
  /*
    const badCommandIntent = commands.find((command) => {

        // Forget the prefix check
        if(!content.includes(client.commandPrefix)) {
          message.embed(
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
                value: command.examples,
              }
            ])
                  .addField("\u200B", "\u200B")
                  //.setColor(process.env.PRIMARY)
                  .setTimestamp()
                  .setFooter(process.env.FOOTER_MESSAGE)
          ).then(feedback => feedback.delete({ timeout: process.env.SHORT_AWAIT_RESPONSE_TIMEOUT }))

        }

    })

    // If there was a command similar 
    // on the client, then show user feedback
    // about how to type correctly the 
    // command.
    if(badCommandIntent)
      message.reply(badCommandIntent.examples);
    else
      console.log('ok');
      */
}

module.exports = {
  handleCommandIntent: handleCommandIntent,
}
