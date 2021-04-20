const firstMessage = require('./first-message')
//const serverChannelsInfo = require('./first-message')

module.exports = (client) => {
  // Channel where the message will be send
  //const channelId =  '760766468781506570';
  const channelId =  '824791914329931830';

  // Returns an emoji object that matchs with the given string if 
  // this exists as emoji id in the server, example, :nerd:
  const getEmoji = emojiName => 
    client.emojis.cache.find(emoji => emoji.name === emojiName)
  
  // Contains the emojis and roles, like EMOJI_KEY: 'ROLE_NAME' 
  const emojis = {
    nerd: 'Mentors',
    thumbsup: 'Mentors Branding',
  }

  // user reactions claims?
  const reactions = [];

  // Title of the reactions claim message
  let emojiText = 'Que tipo de mentor eres?\n\n'

  for(const key in emojis) {
    // Gets the emoji object which match
    // whitin given key
    const emoji = getEmoji(key)

    console.log(`Emoji found: ${emoji}`);

    // Inserts that emoji in reactions for claim role message
    reactions.push(emoji);

    // Holds the role name 
    const role = emojis[key];

    console.log(`Role defined: ${role}`);

    // Sets a new role using the emoji
    emojiText += `${emoji} = ${role}\n`
  }

  firstMessage(client, channelId, emojiText, reactions);

  // Error up
  // Adds or not a reaction
  const handleReaction = (reaction, user, add) => {

    // Avoids to the bot can claim a role
    if(user.id === '831626893085114428') {
      console.log('The bot cannot assing or remove roles itself!');
      return
    }

    // Gets the emoji name
    const emoji = reaction._emoji.name;

    // Gets the guild from the message
    const { guild } = reaction.message;

    const roleName = emojis[emoji];

    // Goes out if the user tries to claim
    // a role that doesn't exists
    if(!roleName) {
      console.log('That role dont exist!');
      return;
    }

    // Getting the exactly role object 
    const role = guild.roles.cache.find((role) => role.name === roleName)

    // Getting the exactly member (not user) object
    const member = guild.members.cache.find((member) => member.id === user.id)

    if(add) {
      member.roles.add(role)
    } else {
      member.roles.remove(role)
    }
  }

    client.on('messageReactionAdd', (reaction, user) => {
      if(reaction.message.channel.id === channelId) {
        handleReaction(reaction, user, true)
      }
    })

    client.on('messageReactionRemove', (reaction, user) => {
      if(reaction.message.channel.id === channelId) {
        handleReaction(reaction, user, false)
      }
    })

}
