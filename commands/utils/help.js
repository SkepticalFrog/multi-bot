const { prefix } = require('../../config.json');

module.exports = {
  name: 'help',
  usage: '[command name]',
  description:
    "Liste toutes les commandes, ou les informations spécifiques à l'une d'entre elles.",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push('Voici la liste de toutes mes commandes :');
      data.push(commands.map((command) => `\`${command.name}\``).join(', '));
      data.push(
        `\nTu peux envoyer \`${prefix}help [command name]\` pour avoir les info d'une commande en particulier !`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply("Je t'ai envoyé un DM avec toutes mes commmandes !");
        })
        .catch((error) => {
          console.error(
            `[-] Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "Apparemment je ne peux pas te DM... Je ne suis pas assez E-Girl à ton goût ?"
          );
        });
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
      data.push(`**Utilisation :** ${prefix}${command.name} ${command.usage}`);
    if (command.cooldown)
      data.push(`**Cooldown :** ${command.cooldown} secondes.`);

    message.channel.send(data, { split: true });
  },
};
