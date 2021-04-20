/**
  * @author Jose Garcia
  * This module contains all commands
  * related to mentors in the server.
  * */

// Handler for use the structure
// predefined for declare commands
'use strict';
const command = require('./handler');
const { MessageEmbed } = require('discord.js');

// For lets perform Google Spreadsheet API 
// operations
const spreadsheetHandler = require('../spreadsheet-handler');
const config = require('../json/config');
const spreadsheetNames = Object.keys(config.spreadsheets);

// Exports outside this module
// the following commands:
module.exports = client => {

  // Give to any user the 'Mentor' role
  // taking its email and save it into
  // spreadsheet.
  command(client, 'mentor', message => {
    // Type of action
    const request = message.content.replace('!mentor ', '');
    const action = request.split(' ')[0];
    const params = request.split(' ').slice(1);
    const username = message.author.username;

    switch(action) {
      case 'enroll':
        // Await for spreadsheet api
        //spreadsheetHandler.getInfo(config.spreadsheets.mentors);
        spreadsheetHandler.saveMentorEmail(config.spreadsheets.mentors, params[0]);

        const userFeedback = new MessageEmbed()
          .setTitle(`Hey @${username}, you are now a Mentor! 👩‍🏫👨‍🏫`)
          .setDescription(`Thanks, your email was registered successfully and Mentor
            role was given to you, enjoy it ⚡`
          )
          .setColor(0x539BFF)

        message.channel.send(userFeedback);
        break;
      default:
        break;
    }

  })

/**
 *  Fetch all users with mentor role and save its data
 *  in a spreadsheet of Google.
  * @param client - The client where the bot is on
  * */
  command(client, [''], message => {
    // Maps in an array collection, all members with Mentor role
  })

}
