const Server = require('../../schemas/Server');
const { version } = require('../../package.json');

module.exports = {
  name: 'version',
  aliases: ['v'],
  description: 'Affiche la version du bot.',
  execute: (message, args) => {
    message.channel.send(
      `Version : **${version}**`
    );
  },
};
