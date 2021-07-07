// TODO: update with db user defined roles per event
import { Command } from "discord.js-commando";

export class DeployRoles extends Command {
  constructor(client) {
    super(client, {
      name: "delete-role",
      aliases: ["dr"],
      group: "utils",
      memberName: "delete-role",
      description:
        "Deletes one or more roles that matches with the string parameter",
      guildOnly: true, // Only works inside a server
      userPermissions: ["ADMINISTRATOR"], // Only admins can perform it
      args: [
        {
          key: "roleName",
          prompt: `Role name to find and delete`,
          type: "string",
        },
      ],
    });
  } // constructor

  async run(message, { roleName }): Promise<any> {
    // Get all role names that matches
    message.guild.roles.cache.forEach((guildRole) => {
      if (guildRole.name.startsWith(roleName)) {
        let roleDeletedName = guildRole.name;
        guildRole
          .delete()
          .then((roleDeteled) => {
            return message.channel.send(`Role -> ${roleDeletedName} deleted ✔`);
          })
          .then((feedback) =>
            feedback.delete({ timeout: process.env.FEEDBACK_TIMEOUT })
          );
      }
    });
  } // run
}; // class
