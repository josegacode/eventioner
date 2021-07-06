/**
 * @author Jose Garcia
 * This module is responsable of
 * perform the actions to
 * publish announces in the
 * servers.
 * */

// Handler for use the structure
// predefined for declare commands
"use strict";

import { MessageEmbed } from "discord.js";
const { Command } = require("discord.js-commando");

// For lets perform Google Spreadsheet API
// operations
//const spreadsheetHandler = require("../../spreadsheet-handler");

// Info of usable spreadsheets
const spreadsheets = require("../../json/spreadsheets");

module.exports = class Announce extends Command {
  constructor(client) {
    super(client, {
      name: "announce",
      aliases: ["ann"],
      group: "announces",
      memberName: "announce",
      description: "A wizard which guide through a event/announce creation",
      guildOnly: true, // Only works inside a server
    });
  }

  async run(message) {
    //const directMessage = message.author.dmChannel;

    // Starts the announce wizard
    message.author
      .send(
        new MessageEmbed().setTitle(
          `Where do you like to publish the announce? 🤔`
        ).setDescription(`1) Same channel where I executed the command \n
          2) Another channel`)
      )
      .then((botMessageSent) => {
        console.log(`Announce wizard started!`);

        // Channel filter
        const options = ["1", "2"];
        const channelFilter = (response) => {
          return options.some(
            (choose) => choose.toLowerCase() === response.content.toLowerCase()
          );
        };

        return message.author.dmChannel.awaitMessages(channelFilter, {
          max: 1,
          time: 10000,
          errors: ["time"],
        });
      })
      .then((channelToPublish) => {
        message.author.send(`Channel: ${channelToPublish.first().content}`);

        message.author.send(
          new MessageEmbed()
            .setTitle(`Title for the announce 🤔`)
            .setDescription(`Limit to 200 characters`)
        );

        return message.author.dmChannel.awaitMessages(
          (response) => response.length <= 200,
          { max: 1, time: 10000, errors: ["time"] }
        );
      })
      .then((title) => {
        message.author.send(`Title: ${title.first().content}`);
      })
      .catch((error) => {
        //console.log(`Error starting announce wizard: ${Object.toString(error)}`);
        console.log(error);
      });
  } // End of run
}; // End of class
