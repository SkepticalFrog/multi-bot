const ytdl = require('ytdl-core');

const play = async (message) => {
  const { client } = message;
  const connection = client.voice.connections.get(message.guild.id);

  console.log(`client.queues`, client.queues);

  const queue = client.queues.get(message.guild.id);

  if (connection)
    connection.play(
      ytdl(queue.shift(), { filter: 'audioonly', quality: 'highestaudio' })
    );
  else return;

  client.musicInterval = setInterval(() => {
    if (!connection.dispatcher) {
      clearInterval(client.musicInterval);
      if (queue[0]) {
        play(message);
      } else {
        connection.disconnect();
      }
    }
  }, 3000);
};

module.exports = {
  name: 'play',
  aliases: ['p'],
  args: true,
  cooldown: 1,
  guildOnly: true,
  usage: '<utilisateur à ban du vocal><temps du ban>',
  description:
    "Ban un utilisateur d'un vocal pendant un certain temps suite à un vote.",
  execute(message, args) {
    const link = args[0];

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        'Tu dois être dans un channel vocal pour cette commande.'
      );
    }

    if (!message.client.queues.has(message.guild.id)) {
      message.client.queues.set(message.guild.id, [link]);
    } else {
      message.client.queues.get(message.guild.id).push(link);
    }

    if (!message.client.voice.connections.has(message.guild.id)) {
      console.log('joining channel');
      voiceChannel
        .join()
        .then(() => {
          play(message);
        })
        .catch((err) => {
          console.log(
            `\t[-] Error trying to connect to the voice channel ==>`,
            err
          );
        });
    }
  },
};
