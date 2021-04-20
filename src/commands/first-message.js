// Adds to some message the people's reaction to an emoji,
// recursively.
// message: the message that contains the emojis
// reactions: the emojis
const addReactions = (message, reactions) => {

  // Adds an emoji to some message
  message.react(reactions[0]);
  reactions.shift();

  // while left reactions to add, pause by 750ms 
  // until the next iteration
  if(reactions.length > 0) {
    setTimeout(() => addReactions(message, reactions), 750);
  }
}

module.exports = async (client, id, text, reactions = []) => {
  // request the channel id to api
  const channel = await client.channels.fetch(id);

  // Performs a promise to the channel and then
  channel.messages
    .fetch()
    .then((messages) => {
      // If there is no messages in the channel
      // adds one with the emojis
      if(messages.size === 0) {
        channel.send(text)
          .then((message) => {
            addReactions(message, reactions);
          })
      } else {
        // Updates the message in some channel
        for(const message in messages) {
          messages[1].edit(text);
          addReactions(message[1], reactions);
        }
      }
    } )
}
