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
		});
	}

  async run(message) {
    //console.log(JSON.stringify(message.content));
    // Type of action
    //console.log(`Config data in mentors.js: ${JSON.stringify(config, null, 4)}`);
    const request = message.content.replace(`!mentor `, '');
    

    // Params that will be used with the command
    // [0] -> type of mentor requested
    // [1] -> mentor email
    const params = request.split(' ');
    //console.log(`Params: ${params}`);

    // User who executed the message
    const user = message.author;

    // User member 
    const member = message.guild.members.cache.find((member) => member.id === user.id);

    // Await for spreadsheet api
    spreadsheetHandler.saveMentorEmail(
      config.config.spreadsheets.mentors.id, 
      params[1],
      'A2'
    );

    // Base mentor role
    member.roles.add('755528558838939648');

    // Category of mentor
    let mentorTypeName;
    switch(params[0]) {
      case 'branding':
        member.roles.add('759996826493124608');
        mentorTypeName = 'Mentor Branding';
        break;
      case 'capital':
        member.roles.add('759996884135313459');
        mentorTypeName = 'Mentor Capital';
        break;
      case 'tech':
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
  };
}
