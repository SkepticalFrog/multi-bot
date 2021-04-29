const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');
console.log('[+] Bot requires =>');

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    console.log(`\t+ ./commands/${folder}/${file}`);
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.cooldowns = new Discord.Collection();

client.once('ready', () => {
  console.log('[+] Bot is ready!');
});

client.login(token);

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  console.log(`[+] Command =>`, commandName + ' [' + args + ']');

  if (!client.commands.has(commandName))
    return console.log(`\t[-] Unknown command.`);

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `Aucun argument fourni. Utilise la commande \`help\`.`;

    if (command.usage) {
      reply += `\nLa syntaxe correcte est : \`${prefix}${command.name} ${command.usage}\``;
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
    console.log(`err ==>`, err);
    message.reply(`Erreur lors de l'exécution de la commande.`);
  }
});
