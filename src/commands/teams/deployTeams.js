/**
 * Creates a text chanel
 * where the attendees can
 * make their teams with a
 * initial instructions
 * message.
 * */

const { Command } = require("discord.js-commando");
const { roles, permissions } = require("../../json/baseRoles");
//const { getRoleByName } = require('../../utils/checkPermissions');

module.exports = class DeployTeams extends Command {
  constructor(client) {
    super(client, {
      name: "deployteams",
      aliases: ["dt"],
      group: "teams",
      memberName: "deployteams",
      description: "Creates a channel where attendees can make a team",
      guildOnly: true, // Only works inside a server
      clientPermissions: ["ADMINISTRATOR"], // Only admins can perform it
    });
  } // constructor

  async run(message) {} // run
}; // class
