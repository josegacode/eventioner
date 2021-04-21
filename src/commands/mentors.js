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

    switch(action) {
      /**
        * Lets the member be a Mentor by giving 
        * its e-mail
        * */
      case 'enroll':
        // Await for spreadsheet api
        //spreadsheetHandler.getInfo(config.spreadsheets.mentors);
        spreadsheetHandler.saveMentorEmail(config.spreadsheets.mentors, params[0]);

        console.log(`Bot manage roles permissions: ${message.guild.me.hasPermission('MANAGE_ROLES')}`);
        console.log(`Member manage roles permissions: ${member.hasPermission('MANAGE_ROLES')}`);
        
        //console.log(`Roles of ${member}: ${member.roles}`);
        member.roles.add('828742601137717290');


        // Feedback to member in discord channel
        const userFeedback = new MessageEmbed()
          .setTitle(`Hey @${user.username}, you are now a Mentor! 👩‍🏫👨‍🏫`)
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
