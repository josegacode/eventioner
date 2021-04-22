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
const config = require('../../json/config');
const spreadsheetNames = Object.keys(config.spreadsheets);

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
    console.log(JSON.stringify(message.content));
    // Type of action
    const request = message.content.replace('!enroll ', '');

    // Type of action that the user wants to perform
    const action = request.split(' ')[0];

    // Params that will be used with the command
    const params = request.split(' ').slice(1);

    // User who executed the message
    const user = message.author;

    // User member 
    const member = message.guild.members.cache.find((member) => member.id === user.id);

    // DEBUG
    //console.log(JSON.stringify(member.roles, null, 4));

      /**
        * Lets the member be a Mentor by giving 
        * its e-mail
        * */
        // Await for spreadsheet api
        //spreadsheetHandler.getInfo(config.spreadsheets.mentors);
        spreadsheetHandler.saveMentorEmail(
          config.spreadsheets.mentors.id, 
          params[0],
          config.spreadsheets.mentors.emailRow + 
          config.spreadsheets.mentors.nextRowAvailable
        );

        //console.log(`Roles of ${member}: ${member.roles}`);
        member.roles.add('828742601137717290');

        // Feedback to member in discord channel
      /*
        const userFeedback = new MessageEmbed()
          .setTitle(`Hey @${user.username}, you are now a Mentor! 👩‍🏫👨‍🏫`)
          .setDescription(`Thanks, your email was registered successfully and Mentor
            role was given to you, enjoy it ⚡`
          )
          .setColor(0x539BFF)
*/
        return message.say('Role added');
  };
}
