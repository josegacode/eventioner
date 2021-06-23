// TODO: update with db user defined roles per event
const { Command } = require("discord.js-commando");
module.exports = class DeployRoles extends Command {
    constructor(client) {
        super(client, {
            name: "delete-role",
            aliases: ["dr"],
            group: "utils",
            memberName: "delete-role",
            description: "Deletes one or more roles that matches with the string parameter",
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "roleName",
                    prompt: `Role name to find and delete`,
                    type: "string",
                },
            ],
        });
    } // constructor
    async run(message, { roleName }) {
        // Get all role names that matches
        message.guild.roles.cache.forEach((guildRole) => {
            if (guildRole.name.startsWith(roleName)) {
                let roleDeletedName = guildRole.name;
                guildRole
                    .delete()
                    .then((roleDeteled) => {
                    return message.channel.send(`Role -> ${roleDeletedName} deleted ✔`);
                })
                    .then((feedback) => feedback.delete({ timeout: process.env.FEEDBACK_TIMEOUT }));
            }
        });
    } // run
}; // class
//# sourceMappingURL=DeleteRole.js.map