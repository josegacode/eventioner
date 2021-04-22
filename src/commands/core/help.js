
module.exports = {
  name: 'help',
  description: 'Shows the available commands that Eventioner can perform',
  execute(message, args) {
     const embed = new Discord.MessageEmbed()
      .setTitle('How can I help you Hacker? ⚡')
      //.setAuthor(message.author.username)
      .setColor('#00AAFF')
      .addFields(
        {
          name: '!help | !h',
          value: 'Shows a list of all commands available',
          inline: false,
        },
        {
          name: '!helpDev | !hd',
          value: 'Commands which are in development and may be included in future versions',
          inline: false,
        },
      )

    message.channel.send(embed);
  }
}
