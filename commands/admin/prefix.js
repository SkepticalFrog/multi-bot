const { prefix } = require('config');
const Prefix = require('../../schemas/Prefix');

module.exports = {
  name: 'prefix',
  aliases: [],
  description: 'Affiche ou modifie le prefixe du bot',
  usage: '[new prefix]',
  cooldown: 10,
  guildOnly: true,
  permissions: 'ADMINISTRATOR',
  execute: async (message, args) => {
    const guildID = message.guild.id;

    let currPrefix = await Prefix.findById(guildID);
    if (!currPrefix) {
      currPrefix = prefix;
    } else {
      currPrefix = currPrefix.symbol;
    }
    if (!args.length) {
      return message.channel.send(`Le préfixe actuel est  **${currPrefix}**`);
    }

    if (args[0] === currPrefix) {
      return message.channel.send(`Ce préfixe est déjà utilisé.`);
    }

    let newPrefix = await Prefix.findById(guildID);
    if (!newPrefix) {
      newPrefix = new Prefix({
        _id: guildID,
        symbol: args[0],
      });
    } else {
      await newPrefix.updateOne({
        $set: {
          symbol: args[0],
        },
      });
    }

    await newPrefix.save();
    message.channel.send(
      `Le préfixe est maintenant **${args[0]}** pour ce serveur.`
    );
  },
};
