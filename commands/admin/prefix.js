const JSONdb = require('simple-json-db');
const { prefix } = require('config');

module.exports = {
  name: 'prefix',
  aliases: [],
  description: 'Affiche ou modifie le prefixe du bot',
  usage: '[new prefix]',
  cooldown: 60,
  guildOnly: true,
  permissions: 'ADMINISTRATOR',
  execute(message, args) {
    const db = new JSONdb('./db/info.json');
    const guildID = message.guild.id;
    const currPrefix = db.get(guildID).prefix || prefix;

    if (!args.length) {
      return message.channel.send(`Le préfixe actuel est  **${currPrefix}**`);
    }

    if (args[0] === currPrefix) {
      return message.channel.send(`Ce préfixe est déjà utilisé.`);
    }

    db.set(guildID, {
      ...db.get(guildID),
      prefix: args[0],
    });

    message.channel.send(
      `Le préfixe est maintenant **${args[0]}** pour ce serveur.`
    );
  },
};
