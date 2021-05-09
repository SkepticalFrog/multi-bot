const Server = require('../../schemas/Server');

module.exports = {
  name: 'call',
  trigger: [],
  execute: async (message) => {
    const server = await Server.findById(message.guild.id);

    if (!server.botreplies.length) {
      return message.reply('...Encore du travail ?');
    }

    const rand =
      server.botreplies[Math.floor(Math.random() * server.botreplies.length)];
    return message.reply(rand);
  },
};
