const { Discord } = require('discord.js');

module.export = {
  name: 'helpDev',
  description: 'Shows a commands which can be included in future versions',
  execute(message, client) {
     const embed = new Discord.MessageEmbed()
      .setTitle('Funciones que pueden implementarse en futuras versiones! 🔜')
      //.setAuthor(message.author.username)
      .setColor('#00AAFF')
      .addFields(
        {
          name: '!saveMentorsData (dev)',
          value: `Recolecta la informacion de los usuarios con rol 'Mentor' en una hoja de calculo de Google`,
          inline: false,
        },
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
        {
          name: '!version | !v',
          value: 'Version of the bot',
          inline: false,
        },
        {
          name: '!clearchannel | !cc [CHANNEL-ID]',
          value: 'Deletes all messages in some channel',
          inline: false,
        },
      )

    message.channel.send(embed);
  }
}
