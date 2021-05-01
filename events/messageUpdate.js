const JSONdb = require('simple-json-db');
module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.author.bot) {
      if (newMessage.content !== oldMessage.content) {
        console.log('[+] Reacting to edited message.');
        newMessage
          .react('834319455450300419')
          .then(() => newMessage.react('👀'))
          .then(() => newMessage.react('👎'))
          .catch((err) => console.log('[-] Error reacting ==>', err));
      } else newMessage.react('👀');
    }
  },
};
