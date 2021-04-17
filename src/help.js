const command = require('./command-handler');
const Discord = require('discord.js');

module.exports = (client) => {

  // Shows a card in discord that
  // tells to the user all available
  // commands
  command(client, 'help', (message) => {
     const embed = new Discord.MessageEmbed()
      .setTitle('Estos son los comandos que puedo hacer por ti Hacker! ⚡')
      //.setAuthor(message.author.username)
      .setColor('#00AAFF')
      .addFields(
        {
          name: '!help',
          value: 'Muestra los comandos disponibles',
          inline: false,
        },
        {
          name: '!helpDev',
          value: 'Muestra los comandos que pueden implementarse en proximas versiones',
          inline: false,
        },
        {
          name: '!cc',
          value: 'Elimina todos los mensajes dentro del canal donde se ejecute',
          inline: false,
        },
        {
          name: '!saveMentorsData (dev)',
          value: `Recolecta la informacion de los usuarios con rol 'Mentor' en una hoja de calculo de Google`,
          inline: false,
        },
      )

    message.channel.send(embed);
  })

  command(client, 'helpDev', (message) => {
     const embed = new Discord.MessageEmbed()
      .setTitle('Funciones que pueden implementarse en futuras versiones! 🔜')
      //.setAuthor(message.author.username)
      .setColor('#00AAFF')
      .addFields(
        {
          name: '!feedback <description>',
          value: 'Puedes sugerir en la descripcion alguna funcionalidad que quisieras que fuese implementada o eliminada en futuras versiones',
          inline: false,
        },
        {
          name: `!changePrivilegies <@role> <newPrivilegie1>, <newPrivilegie2>`,
          value: 'Cambiar los privilegios de un determinado rol',
          inline: false,
        },
        {
          name: `!stats`,
          value: 'Muestra las estadisticas del servidor',
          inline: false,
        },
      )

    message.channel.send(embed);
  })
}
