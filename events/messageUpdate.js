const onMessage = require('./message');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    console.log(`[+] Message has been updated!!`)

    if (!newMessage.author.bot) {
      if (newMessage.content !== oldMessage.content) {
        const res = onMessage.execute(newMessage);
        console.log(`[+] Result of operation is ${res}`)
        if (res === -1) {
          console.log('[+] Reacting to edited message.');
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
