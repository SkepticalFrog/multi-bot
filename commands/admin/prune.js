module.exports = {
  name: 'prune',
  aliases: [],
  description: 'Deletes a certain amount of messages in current channel',
  usage: '<number of messages to delete>',
  args: true,
  cooldown: 0,
  permissions: 'ADMINISTRATOR',
  execute(message, args) {
    let amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return message.reply(`Comment tu veux que je compte jusqu'à "${args[0]}" ? C'est même pas un nombre !`);
    } else if (amount < 1) {
      return message.reply(`Je ne peux pas supprimer moins de 1 message...`);
    } else if (amount > 98) {
      amount = 98;
    }

    const expectReaction = '👍';
    const filter = (reaction) => {
      return (
        [expectReaction].includes(reaction.emoji.name) &&
        reaction.users.cache.last().id === message.author.id
      );
    };

    message
      .reply(`Es-tu sûr de supprimer ${amount} messages ?`)
      .then((m) => {
        m.react(expectReaction)
          .then(() => {
            console.log(`m`, m);
          })
          .then(() => {
            m.awaitReactions(filter, {
              max: 1,
              time: 10000,
              errors: ['time'],
            })
              .then(() => {
                message.channel.bulkDelete(amount + 2, true).catch((err) => {
                  console.log('[-] Error in prune ==>', err);
                  message.channel.send(`Erreur pendant la prune;`);
                });
              })
              .catch((err) => {
                console.log(`[-] Error in time prune ==>`, err);
                message.channel.send(
                  `Temps écoulé, les messages ne seront pas supprimés.`
                );
              });
          });
      });
    if (false) {
    }
  },
};
