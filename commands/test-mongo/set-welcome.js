const Server = require('../../schemas/Server');

module.exports = {
  name: 'set-welcome',
  aliases: ['sw'],
  description: "Sets server's welcome message",
  usage: '[new description]',
  cooldown: 10,
  permissions: 'ADMINISTRATOR',
  execute: async (message, args) => {
    const { channel, guild } = message;

    if (!args.length) {
      let server = await Server.findById(guild.id);
      if (!server.welcome) {
        return message.reply(
          "Aucun message de bienvenue n'est configuré pour ce serveur."
        );
      }

      return message.reply(
        `Le message de bienvenue actuel pour ce serveur est : "${server.welcome}", sur le channel <#${server.defaultChannel}>.`
      );
    }

    await Server.findByIdAndUpdate(
      guild.id,
      {
        $set: {
          welcome: args.join(' '),
        },
      },
      { new: true }
    );

    message.reply('Le message de bienvenue a été mis à jour.');
  },
};
