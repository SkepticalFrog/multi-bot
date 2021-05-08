module.exports = {
  name: 'voteban',
  args: true,
  cooldown: 120,
  guildOnly: true,
  usage: '<utilisateur à ban du vocal><temps du ban>',
  description:
    "Ban un utilisateur d'un vocal pendant un certain temps suite à un vote.",
  execute(message, args) {
    if (args.length !== 2 || isNaN(args[1])) {
      return message.reply(
        'Arguments invalides, se référer à la commande `help`.'
      );
    }
    if (args[1] > 60) args[1] = 60;
    if (!message.mentions.users.size)
      return message.channel.send('Utilisateur invalide.');
    const id = message.mentions.users.first().id;
    message.guild.members.fetch(id).then((member) => {
      const expectReaction = '👍';
      if (!member.voice.channel) {
        message.reply(`<@${id}> n'est pas dans un channel vocal.`);
        return;
      }
      const nbMembers = member.voice.channel.members.size;
      const membersInVoice = member.voice.channel.members;
      const inVoiceChannel =
        membersInVoice.filter((m) => m.id === message.author.id).size >= 1;
      if (!inVoiceChannel) {
        message.reply("Tu ne peux pas kick si tu n'es pas dans le vocal.");
        return;
      }
      const votesNeeded = Math.ceil(nbMembers / 2);
      let falseReactions = 0;

      const filter = (reaction) => {
        if (membersInVoice.has(reaction.users.cache.last().id)) {
          return [expectReaction].includes(reaction.emoji.name);
        } else {
          falseReactions += 1;
          return false;
        }
      };

      message.channel
        .send(`Pouce en l'air pour ban <@${id}> pendant ${args[1]} secondes !`)
        .then((m) => {
          m.react(expectReaction).then(() => {
            m.awaitReactions(filter, {
              max: votesNeeded + falseReactions,
              time: 60000,
              errors: ['time'],
            })
              .then((collected) => {
                if (
                  collected.first().count - 1 - falseReactions >=
                  votesNeeded
                ) {
                  message.channel.send(
                    `<@${id}> a été ban du channel <#${member.voice.channel.id}> pour ${args[1]} secondes.`
                  );
                  const channelId = member.voice.channel.id;
                  const inter = setInterval(() => {
                    member.voice.kick();
                  }, 1000);
                  setTimeout(() => {
                    clearInterval(inter);
                    message.channel.send(
                      `<@${id}> a été deban du channel <#${channelId}>.`
                    );
                  }, args[1] * 1000);
                } else message.channel.send("Essaie pas de tricher p'tit con.");
              })
              .catch((err) => {
                console.log(err);
                message.reply('Pas assez de votes.');
              });
          });
        });
    });
  },
};
