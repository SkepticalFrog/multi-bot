const User = require('../../schemas/User');

module.exports = {
  name: 'delete-info-server',
  aliases: ['remove-info-server', 'rm-info-serv'],
  description: "Supprime les données d'un utilisateur.",
  usage: '[@user]',
  guildOnly: true,
  execute: async (message, args) => {
    const id = message.mentions.users.first()
      ? message.mentions.users.first().id || message.author.id
      : message.author.id;

    let user = await User.findById(id);

    if (!user) {
      return message.channel.send("L'utilisateur n'est pas enregistré.");
    }

    const reply = await message.reply(
      'Es-tu sûr de vouloir supprimer les infos de cet utilisateur du serveur ?'
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
      await reply.awaitReactions(filter, {
        max: 1,
        time: 10000,
        errors: ['time'],
      });
    } catch (err) {
      console.log(`[-] Error in time delete-info ==>`, err);
      return message.channel.send(
        `Temps écoulé, l'utilisateur ne sera pas supprimé.`
      );
    }

    await user.updateOne({
      $set: {
        guilds: user.guilds.filter((g) => g !== message.guild.id),
      },
    });

    message.reply(
      `Utilisateur @${
        message.guild.members.cache.get(id).nickname
      } supprimé du serveur...`
    );
  },
};
