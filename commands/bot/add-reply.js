const Server = require('../../schemas/Server');

module.exports = {
  name: 'add-reply',
  aliases: ['arep'],
  description: 'Ajoute une réponse au bot.',
  usage: '<new reply>',
  guildOnly: true,
  args: true,
  execute: async (message, args) => {
    const server = await Server.findById(message.guild.id);

    const reply = await message.reply(
      'Veux tu ajouter cette réponse au bot ?\n*' + args.join(' ') + '*'
    );

    const expectReaction = '👍';
    const filter = (reaction) => {
      return (
        [expectReaction].includes(reaction.emoji.name) &&
        reaction.users.cache.last().id === message.author.id
      );
    };

    await reply.react(expectReaction);

    try {
      const reactions = await reply.awaitReactions(filter, {
        max: 1,
        time: 10000,
        errors: ['time'],
      });
    } catch (err) {
      console.log(`[-] Error in add-reply ==> ${err}`);
      return message.reply('Temps écoulé, TL;DR.');
    }

    await server.updateOne({
      $set: {
        botreplies: [...new Set([...server.botreplies, args.join(' ')])],
      },
    });

    return message.reply('Réponse ajoutée au bot !');
  },
};
