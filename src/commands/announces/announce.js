
/**
  * @author Jose Garcia
  * This module is responsable of
  * perform the actions to 
  * publish announces in the 
  * servers.
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


module.exports = class Announce extends Command {
  constructor(client) {
		super(client, {
			name: 'announce',
			aliases: ['ann'],
			group: 'announces',
			memberName: 'announce',
			description: 'A wizard which guide through a event/announce creation',
      guildOnly: true, // Only works inside a server
		});
  }

  async run(message) {

    // Channel filter
    const options = ['1', '2'];
    const channelFilter = response => {
      return options.some(
        choose => choose.toLowerCase() === response.content.toLowerCase()
    );
    };

    message.author.send(
      new MessageEmbed()
        .setTitle(`Where do you like to publish the announce? 🤔`)
        .setDescription(`1) Same channel where I executed the command \n
          2) Another channel`)
    ).then(() => {
      message.author.dmChannel.awaitMessages(channelFilter, {max: 1, time: 60000, errors: ['time']})
        .then( (collected) => message.author.send(`Got it!: ${collected.first().content}`) )
    })
  }
}
