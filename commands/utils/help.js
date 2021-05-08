const { prefix } = require('config');
const Server = require('../../schemas/Server');

module.exports = {
  name: 'help',
  usage: '[command name]',
  description:
    "Liste toutes les commandes, ou les informations spécifiques à l'une d'entre elles.",
  execute: async (message, args) => {
    const data = [];
    const { commands } = message.client;

    let currPrefix;
    if (message.channel.type === 'dm') {
      currPrefix = prefix;
    } else {
      const server = await Server.findById(message.guild.id);
      currPrefix = server.prefix || prefix;
    }

    if (!args.length) {
      data.push('Voici la liste de toutes mes commandes :');
      data.push(commands.map((command) => `\`${command.name}\``).join(', '));
      data.push(
        `\nTu peux envoyer \`${currPrefix}help [command name]\` pour avoir les info d'une commande en particulier !`
      );

      return message.channel.send(data, { split: true });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("Cette commande n'existe pas !");
    }

    data.push(`**Nom :** ${command.name}`);

    if (command.aliases) data.push(`**Alias :** ${command.aliases.join(', ')}`);
    if (command.description)
      data.push(`**Description :** ${command.description}`);
    if (command.usage)
      data.push(
        `**Utilisation :** ${currPrefix}${command.name} ${command.usage}`
      );
    if (command.cooldown)
      data.push(`**Cooldown :** ${command.cooldown} secondes.`);

    message.channel.send(data, { split: true });
  },
};
