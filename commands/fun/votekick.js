const kick = (member, message) => {
  member.voice.kick();
  message.reply(`L'utilisateur <@${member.id}> a été kick du vocal.`);
};

module.exports = {
  name: 'votekick',
  args: true,
  cooldown: 60,
  guildOnly: true,
  usage: '<utilisateur à kick du vocal>',
  description: "Kick un utilisateur d'un vocal suite à un vote.",
  execute(message, args) {
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
        .send(`Pouce en l'air pour kick <@${member.id}>`)
        .then((m) => {
          m.react(expectReaction).then(() => {
            m.awaitReactions(filter, {
              max: votesNeeded + falseReactions,
              time: 60000,
              errors: ['time'],
            })
              .then((collected) => {
                if (collected.first().count - 1 - falseReactions >= votesNeeded)
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
