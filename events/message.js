const Discord = require('discord.js');

const { prefix } = require('config');
const Server = require('../schemas/Server');

module.exports = {
  name: 'message',
  execute: async (message, updated = false) => {
    if (message.author.bot) return -1;
    if (updated && updated.user) updated = false;
    const { client, guild } = message;
    const { cooldowns } = client;

    let server;
    let currPrefix;
    if (message.channel.type === 'dm') {
      currPrefix = prefix;
    } else {
      server = await Server.findById(message.guild.id);
      currPrefix = server.prefix || prefix;
    }

    if (!message.content.startsWith(currPrefix)) {
      if (updated) return -1;
      const hiddenCommand = client.hiddenCommands.find((cmd) =>
        cmd.trigger.reduce((bool, trig) => {
          bool = bool || message.content.match(trig);
          return bool;
        }, false)
      );

      if (hiddenCommand) {
        console.log(
          `[+] Hidden command ==> ${hiddenCommand.name} by ${message.author.username}`
        );

        if (!cooldowns.has(hiddenCommand.name)) {
          cooldowns.set(hiddenCommand.name, 0);
        }

        const now = Date.now();
        const timestamp = cooldowns.get(hiddenCommand.name);
        const cooldownAmount = (hiddenCommand.cooldown || 3) * 1000;

        const expirationTime = timestamp + cooldownAmount;

        if (now < expirationTime) {
          const mLeft = Math.floor((expirationTime - now) / 1000 / 60);
          const sLeft = ((expirationTime - now) / 1000) % 60;

          return console.log(
            `\t[-] ${mLeft} minutes ${sLeft.toFixed(
              1
            )} seconds left before reuse of hidden command ${
              hiddenCommand.name
            }`
          );
        }

        cooldowns.set(hiddenCommand.name, now);

        try {
          hiddenCommand.execute(message);
        } catch (err) {
          console.log(`[-] Error in hidden command ==>`, err);
        }
        return 0;
      }

      if (
        message.mentions.users.size &&
        message.mentions.users.has(client.user.id)
      ) {
        console.log(`[+] Bot replies to ==>`, message.author.username);
        try {
          return client.hiddenCommands.get('call').execute(message);
        } catch (err) {
          console.log(`[-] Error in bot reply ==>`, err);
        }
      }
      return -1;
    }

    const args = message.content.slice(currPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(
      `[+] Command =>`,
      commandName + ' [' + args + '] by',
      message.author.username
    );

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

    if (server && server.unused.includes(command.name)) {
      return message.reply('Cette commande est désactivée sur le serveur.');
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
