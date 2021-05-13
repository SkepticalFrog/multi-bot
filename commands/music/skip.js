const ytdl = require('ytdl-core');

module.exports = {
  name: 'skip',
  aliases: [],
  cooldown: 1,
  guildOnly: true,
  usage: '<utilisateur à ban du vocal><temps du ban>',
  description:
    "Ban un utilisateur d'un vocal pendant un certain temps suite à un vote.",
  execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        'Tu dois être dans un channel vocal pour cette commande.'
      );
    }

    if (message.client.voice.connections.has(message.guild.id)) {
      const connection = message.client.voice.connections.get(message.guild.id);

      connection.play(
        ytdl('https://www.youtube.com/watch?v=2BIkMr_gdgM', {
          filter: 'audioonly',
        })
      );
    }
  },
};
