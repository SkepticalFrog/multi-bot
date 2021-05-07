const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('config');
const connectDB = require('./config/db');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.hiddenCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

const commandFolders = fs.readdirSync('./commands');
console.log('[+] Bot requires following commands =>');

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    console.log(`\t+\t./commands/${folder}/${file}`);
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

const hiddenCommandFolders = fs.readdirSync('./hidden_commands');
console.log('[+] Bot requires following hidden commands =>');

for (const folder of hiddenCommandFolders) {
  const commandFiles = fs
    .readdirSync(`./hidden_commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    console.log(`\t+\t./hidden_commands/${folder}/${file}`);
    const command = require(`./hidden_commands/${folder}/${file}`);
    client.hiddenCommands.set(command.name, command);
  }
}

console.log(`[+] Bot requires following events =>`);
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    console.log(`\t+ once\t./events/${file}`);
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    console.log(`\t+ on\t./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(token);
connectDB();

