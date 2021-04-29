const kick = (member, message) => {
  member.voice.kick();
  message.reply(`L'utilisateur <@${member.id}> a été kick du vocal.`);
};

module.exports = {
  name: 'votekick',
  args: true,
  cooldown: 60,
  usage: '<utilisateur à kick du vocal>',
  description: "Kick un utilisateur d'un vocal suite à un vote.",
  execute(message, args) {
    const reaction = '👍';
    const id = args[0].replace(/[!@<>]/gi, '');
    message.guild.members.fetch(id).then((member) => {
      if (!member.voice.channel) {
        message.reply(`<@${id}> n'est pas dans un channel vocal.`);
        return;
      }
      const nbMembers = member.voice.channel.members.size;
      const inVoiceChannel =
        member.voice.channel.members.filter((m) => m.id === message.author.id)
          .size >= 1;
      if (!inVoiceChannel) {
        message.reply("Tu ne peux pas kick si tu n'es pas dans le vocal.");
        return;
      }
      const votesNeeded = Math.ceil(nbMembers / 2);

      const filter = (reaction) => {
        return ['👍'].includes(reaction.emoji.name);
      };

      message.channel
        .send(`Pouce en l'air pour kick <@${member.id}>`)
        .then((m) => {
          m.react(reaction).then(() => {
            m.awaitReactions(filter, {
              max: votesNeeded,
              time: 60000,
              errors: ['time'],
            })
              .then((collected) => {
                if (collected.first().count - 1 >= votesNeeded)
                  kick(member, message);
                else message.channel.send("Essaie pas de tricher p'tit con.");
              })
              .catch(() => {
                message.reply('Pas assez de votes.');
              });
          });
        });
    });
  },
};
