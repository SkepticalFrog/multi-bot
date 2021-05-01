const JSONdb = require('simple-json-db');
module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (newMessage.author.id !== client.id) {
      if (newMessage.content !== oldMessage.content)
        newMessage
          .react('834319455450300419')
          .then(() => newMessage.react('👀'))
          .then(() => newMessage.react('👎'))
          .catch((err) => console.log('[-] Error ==>', err));
      else newMessage.react('👀');
    }
  },
};
 