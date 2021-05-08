const { prefix } = require('config');
const Server = require('../../schemas/Server');

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

    let server = await Server.findById(guildID);
    const currPrefix = server.prefix || prefix;

    if (!args.length) {
      return message.channel.send(`Le préfixe actuel est  **${currPrefix}**`);
    }

    if (args[0] === currPrefix) {
      return message.channel.send(`Ce préfixe est déjà utilisé.`);
    }

    await server.updateOne({
      prefix: args[0],
    });
    message.channel.send(
      `Le préfixe est maintenant **${args[0]}** pour ce serveur.`
    );
  },
};
