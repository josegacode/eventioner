import { Command } from "discord.js-commando";

export class ClearChannel extends Command {
  constructor(client) {
    super(client, {
      name: "clearchannel",
      aliases: ["cc"],
      group: "utils",
      memberName: "clearchannel",
      description:
        "Deletes all messages per day from the channel where is executed",
      guildOnly: true, // Only works inside a server
      clientPermissions: ["ADMINISTRATOR"], // Only admins can perform it
    });
  }

  async run(message): Promise<any> {
    message.channel.messages.fetch().then((results) => {
      message.channel.bulkDelete(results);
    });
  }
};
