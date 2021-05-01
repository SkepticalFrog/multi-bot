const JSONdb = require('simple-json-db');
const Discord = require('discord.js');

const { prefix } = require('../config.json');

module.exports = {
  name: 'message',
  execute(message) {
    const { client } = message;

    const db = new JSONdb('./db/info.json');
    const guildID = message.guild.id;
    const currPrefix = db.get(guildID).prefix || prefix;

    if (!message.content.startsWith(currPrefix) || message.author.bot) return -1;

    const args = message.content.slice(currPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(`[+] Command =>`, commandName + ' [' + args + ']');

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      console.log(`\t[-] Unknown command.`);
      return message.channel.send(
        `Commande inexistante. Utilise \`${currPrefix}help\` pour avoir une liste de mes commandes.`
      );
    }

    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply("Cette commande n'est pas exécutable en DM !");
    }

    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return message.reply(
          "Cette commande n'est pas faite pour les enfants."
        );
      }
    }

    if (command.args && !args.length) {
      let reply = `Aucun argument fourni. Utilise la commande \`help\`.`;

      if (command.usage) {
        reply += `\nLa syntaxe correcte est : \`${currPrefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `Attends ${timeLeft.toFixed(
            1
          )} seconde de plus avant d'utiliser la commande \`${command.name}\`.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (err) {
      console.log(`[-] Error in command ==>`, err);
      message.reply(`Erreur lors de l'exécution de la commande.`);
    }
  },
};
