/**
  * @author Jose Garcia
  * This module contains all commands
  * related to mentors in the server.
  * */

// Handler for use the structure
// predefined for declare commands
'use strict';

const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

// For lets perform Google Spreadsheet API 
// operations
const spreadsheetHandler = require('../../spreadsheet-handler');

// Info of usable spreadsheets
const spreadsheets = require('../../json/spreadsheets');

module.exports = class EnrollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bementor',
			aliases: ['bmnt'],
			group: 'mentors',
			memberName: 'bementor',
			description: 'Gives to any user the Mentor role',
      args: [
        {
          key: 'email',
          prompt: ` looks like you forgot to type your email, usage 👉 !bementor | !bmnt <EMAIL> ✅`,
          type: 'string',
        },
      ],
      guildOnly: true, // Only works inside a server

      // Avoids spam
      throttling: {
        usages: 2, // Times in per rate of usage
        duration: 10, // Time in seconds to cooldown
      },
		});
	}

  async run(message, {email}) {
    console.log(`email: ${email}`);
    spreadsheetHandler.saveMentorEmail(
      spreadsheets.mentorsRegistration.id, 
      email
    );

    // User who executed the message
    const user = message.author;

    // User member 
    const member = message.guild.members.cache.find((member) => member.id === user.id);

    // Shows a embed message asking
    // for a type of mentor that the
    // member wants to be.
    const question = new MessageEmbed()
        .setTitle(`What kind of mentor do you want to be @${user.username}?`)
        .setDescription(
          `1) Branding \n 2) Capital \n 3) Tech`
        )
        .setColor(0x539BFF)

    // Checks if the option choosed
    // are listed.
    const options = ['1', '2', '3'];
    const filter = response => {
      return options.some(choose => choose.toLowerCase() === response.content.toLowerCase());
    };

    message.channel.send(question)
      .then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            //message.channel.send(`${collected.first().author} got the correct answer!`);
            //console.log(`Colleted object: ${JSON.stringify(collected)}`);

            // Base mentor role
            member.roles.add('755528558838939648');

            // Category of mentor
            let mentorTypeName;
            switch(collected.first().content) {
              case '1':
                member.roles.add('759996826493124608');
                mentorTypeName = 'Mentor Branding';
                break;
              case '2':
                member.roles.add('759996884135313459');
                mentorTypeName = 'Mentor Capital';
                break;
              case '3':
                member.roles.add('759996935154958366');
                mentorTypeName = 'Mentor Tech';
                break;
            }
            
            //config.config.spreadsheets.mentors.nextRowAvailable++;
            // Await for spreadsheet api
            

            
            return message.embed( 
              new MessageEmbed()
                .setTitle(`Hey @${user.username}, you are now a ${mentorTypeName}! 👩‍🏫👨‍🏫`)
                .setDescription(`Thanks, your email was registered successfully and ${mentorTypeName}
                role was given to you, enjoy it ⚡`)
                .setColor(0x539BFF)
            );
          })
          .catch(collected => {
            message.channel.send(`Sorry, ${collected.first().content} isn't an option`);
          });
      })


  };
}
