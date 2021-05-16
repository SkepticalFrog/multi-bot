const onMessage = require('./message');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.author.bot) {
      if (newMessage.content !== oldMessage.content) {
        // const res = onMessage.execute(newMessage, true);
        const res = 0;
        if (res === -1) {
          newMessage
            .react('834319455450300419')
            .then(() => newMessage.react('👀'))
            .then(() => newMessage.react('👎'))
            .catch((err) => console.log('[-] Error reacting ==>', err));
        } else newMessage.react('👀');
      }
    }
  },
};
