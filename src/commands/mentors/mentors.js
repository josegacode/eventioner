/**
  * @author Jose Garcia
  * This module contains all commands
  * related to mentors in the server.
  * */

// Handler for use the structure
// predefined for declare commands
'use strict';
//const command = require('./handler');
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

// For lets perform Google Spreadsheet API 
// operations
const spreadsheetHandler = require('../../spreadsheet-handler');
//const config = require('../../json/config');
const config = require('../../json/json-handler');
//console.log(`typeof config: ${typeof config}`);
//const spreadsheetNames = Object.keys(config.spreadsheets);

module.exports = class EnrollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mentor',
			aliases: ['mnt'],
			group: 'mentors',
			memberName: 'mentor',
			description: 'Gives to any user the Mentor role',
      args: [
        /*
        {
          key: 'typeOfMentor',
          prompt: 'The type of mentor available in the server',
          type: 'string',
        },
        {
          key: 'email',
          prompt: 'An email to validate your registration',
          type: 'string',
        },
        */
      ],
      guildOnly: true, // Only works inside a server

      // Avoids spam
      throttling: {
        usages: 2, // Times in per rate of usage
        duration: 10, // Time in seconds to cooldown
      },
		});
	}

  async run(message/*, {typeOfMentor, email}*/) {

    // User who executed the message
    const user = message.author;

    // User member 
    const member = message.guild.members.cache.find((member) => member.id === user.id);
    const question = new MessageEmbed()
        .setTitle(`What kind of mentor do you want to be @${user.username}?`)
        .setDescription(
          `1) Branding \n 2) Capital \n 3) Tech`
        )
        .setColor(0x539BFF)

    const options = ['1', '2', '3'];
    const filter = response => {
      return options.some(choose => choose.toLowerCase() === response.content.toLowerCase());
    };

    message.channel.send(question)
      .then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            //message.channel.send(`${collected.first().author} got the correct answer!`);
            console.log(`Colleted object: ${JSON.stringify(collected)}`);

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

            return message.embed( 
              new MessageEmbed()
                .setTitle(`Hey @${user.username}, you are now a ${mentorTypeName}! 👩‍🏫👨‍🏫`)
                .setDescription(`Thanks, your email was registered successfully and ${mentorTypeName}
                role was given to you, enjoy it ⚡`)
                .setColor(0x539BFF)
            );
          })
          .catch(collected => {
            message.channel.send(`Sorry, that isn't an option`);
          });
      })

    // Await for spreadsheet api
    /*
    spreadsheetHandler.saveMentorEmail(
      config.config.spreadsheets.mentors.id, 
      email,
      'A2'
    );
    */

  };
}
