const Server = require('../../schemas/Server');

module.exports = {
  name: 'toggle',
  aliases: [],
  description:
    'Permet de désactiver/activer certaines commandes du bot sur le serveur.',
  usage: '[<on | off> <command name>]',
  guildOnly: true,
  permissions: 'ADMINISTRATOR',
  execute: async (message, args) => {
    const server = await Server.findById(message.guild.id);

    if (!args.length) {
      if (!server.unused.length) {
        return message.reply('Toutes les commandes sont actives.');
      }
      const data = server.unused.reduce((str, curr) => {
        str += '`' + curr + '` | ';
      }, '|');
      return message.reply('Liste des commandes désactivées :\n' + data);
    }

    if (args.length !== 2) {
      return message.reply(
        'Arguments invalides, se réferer à la commande `help`.'
      );
    }

    if (!message.client.commands.find((c) => c.name === args[1])) {
      return message.reply("La commande n'existe pas.");
    }
    if (args[0] === 'on') {
      await server.updateOne({
        $set: {
          unused: server.unused.filter((o) => o !== args[1]),
        },
      });
      return message.reply('Action effectuée.');
    } else if (args[0] === 'off') {
      if (!server.unused.includes(args[1])) {
        await server.unused.push(args[1]);
        await server.save();
      }
      return message.reply(
        `La commande \`${args[1]}\` est désactivée sur ce serveur.`
      );
    } else {
      return message.reply(
        'Arguments invalides, se réferer à la commande `help`.'
      );
    }
  },
};
