/**
  * @author Jose Garcia
  * This module contains all commands
  * related to mentors in the server.
  * */

// Handler for use the structure
// predefined for declare commands
const command = require('./handler');

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
    //console.log(`request: ${request} \n action: ${action} \n params: ${params}`);
    switch(action) {
      case 'validate-mail':
        // Await for spreadsheet api
        //spreadsheetHandler.getInfo(config.spreadsheets.mentors);
        spreadsheetHandler.saveMentorEmail(config.spreadsheets.mentors, params[0]);
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
