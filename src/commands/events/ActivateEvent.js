/**
  * Shows the list of active or
  * coming soon events from eventbrite
  * organizations and then let the user
  * choose one in order to link that 
  * event to the server where the command
  * is executed.
  * */

const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { getAvailableEvents } = require("../../utils/eventbriteHandler");

module.exports = class StartEvent extends Command {
  constructor(client) {
    super(client, {
      name: "start-event",
      aliases: ["st"],
      group: "events",
      memberName: "start-event",
      description: 
      `
        Shows a list of
        live or coming soon
        events in order to let
        to the user choose one of
        them for activate in the
        current server.
      `,
      guildOnly: true, // Only works inside a server
      clientPermissions: ["ADMINISTRATOR"], // Only admins can perform it
    });
  } // constructor

  async run(message) {
    const { channel } = message;
    const serverId = message.guild.id;
    const serverName = message.guild.name;

    getAvailableEvents(serverId)
      .then(eventsAvailable => {
        const { events } = eventsAvailable;
        console.log(events[0].name.text);
        channel.send(events[0].name.text);
      })
      .catch((error) => channel.send(error));
  } // run
}; // class
