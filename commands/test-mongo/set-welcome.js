const Welcome = require('../../schemas/Welcome');

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
      let welcome = await Welcome.findById(guild.id);
      if (!welcome) {
        return message.reply(
          "Aucun message de bienvenue n'est configuré pour ce serveur."
        );
      }

      return message.reply(
        `Le message de bienvenue actuel pour ce serveur est : "${welcome.text}", sur le channel <#${welcome.channelId}>.`
      );
    }

    let welcome = await Welcome.findById(guild.id);
    if (!welcome) {
      welcome = new Welcome({
        _id: guild.id,
        text: args.join(' '),
        channelId: channel.id,
      });

      await welcome.save();
    } else {
      welcome.set({ text: args.join(' ') });
      await welcome.save();
    }

    message.reply('Le message de bienvenue a été mis à jour.');
  },
};
