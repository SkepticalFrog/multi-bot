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
      return message.reply(
        'Liste des commandes désactivées :\n' +
          server.unused.map((c) => '`' + c + '`')
      );
    }

    if (args.length !== 2) {
      return message.reply(
        'Arguments invalides, se réferer à la commande `help`.'
      );
    }

    if (
      (!message.client.commands.find((c) => c.name === args[1]) ||
        args[1] === 'toggle') &&
      args[1] !== 'all'
    ) {
      return message.reply("La commande n'existe pas.");
    }

    if (args[0] === 'on') {
      const data =
        args[1] === 'all' ? [] : server.unused.filter((o) => o !== args[1]);

      await server.updateOne({
        $set: {
          unused: data,
        },
      });
      return message.reply('Action effectuée.');
    } else if (args[0] === 'off') {
      const data =
        args[1] === 'all'
          ? message.client.commands
              .filter((c) => c.name !== 'toggle')
              .map((c) => c.name)
          : [...new Set([...server.unused, args[1]])];

      await server.updateOne({
        $set: {
          unused: data,
        },
      });
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
