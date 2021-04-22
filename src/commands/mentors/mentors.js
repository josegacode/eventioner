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
//const spreadsheetNames = Object.keys(config.spreadsheets);

module.exports = class EnrollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enroll',
			aliases: ['enr'],
			group: 'mentors',
			memberName: 'enroll',
			description: 'Gives to any user the Mentor role',
		});
	}

  async run(message) {
    //console.log(JSON.stringify(message.content));
    // Type of action
    console.log(`Config data in mentors.js: ${JSON.stringify(config, null, 4)}`);
    const request = message.content.replace('!enroll ', '');

    // Type of action that the user wants to perform
    const action = request.split(' ')[0];

    // Params that will be used with the command
    const params = request.split(' ').slice(1);

    // User who executed the message
    const user = message.author;

    // User member 
    const member = message.guild.members.cache.find((member) => member.id === user.id);

    // Await for spreadsheet api
    spreadsheetHandler.saveMentorEmail(
      config.config.spreadsheets.mentors.id, 
      params[0],
      'A2'
    );

    member.roles.add('828742601137717290');

    return message.embed( 
      new MessageEmbed()
        .setTitle(`Hey @${user.username}, you are now a Mentor! 👩‍🏫👨‍🏫`)
        .setDescription(`Thanks, your email was registered successfully and Mentor
          role was given to you, enjoy it ⚡`)
        .setColor(0x539BFF)
    );
  };
}
