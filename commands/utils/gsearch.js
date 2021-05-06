const { default: axios } = require('axios');
const { GuildEmojiRoleManager } = require('discord.js');

module.exports = {
  name: 'gsearch',
  aliases: ['gs', 'google'],
  description: 'Effectue une recherche sur Google.',
  cooldown: 10,
  usage: '<search terms>',
  args: true,
  execute: async (message, args) => {
    const query = args.join('+');
    const url = 'https://lmgtfy.com/?q=' + query + '&iie=1';

    message.reply('Laisse moi chercher ça pour toi: ' + url);
  },
};
