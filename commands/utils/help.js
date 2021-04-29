const JSONdb = require('simple-json-db');
const { prefix } = require('../../config.json');

module.exports = {
  name: 'help',
  usage: '[command name]',
  description:
    "Liste toutes les commandes, ou les informations spécifiques à l'une d'entre elles.",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    const db = new JSONdb('./db/info.json');
    const guildID = message.guild.id;
    const currPrefix = db.get(guildID).prefix || prefix;

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
