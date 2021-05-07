const JSONdb = require('simple-json-db');
const connectDB = require('../../config/db');
const User = require('../../schemas/User');

module.exports = {
  name: 'delete-info',
  aliases: ['remove-info', 'rm-info'],
  description: "Supprime les données d'un utilisateur.",
  usage: '<@user>',
  args: true,
  guildOnly: true,
  execute: async (message, args, mongoose) => {
    const id = message.mentions.users.first()
      ? message.mentions.users.first().id || message.author.id
      : message.author.id;

    let user = await User.findById(id);

    if (!user) {
      return message.channel.send("L'utilisateur n'est pas enregistré.");
    }

    const expectReaction = '👍';
    const filter = (reaction) => {
      return (
        [expectReaction].includes(reaction.emoji.name) &&
        reaction.users.cache.last().id === message.author.id
      );
    };

    message
      .reply('Es-tu sûr de vouloir supprimer cet utilisateur ?')
      .then((m) => {
        m.react(expectReaction).then(() => {
          m.awaitReactions(filter, {
            max: 1,
            time: 10000,
            errors: ['time'],
          })
            .then(() => {
              user.delete().then(() => {
                message.reply(
                  `Utilisateur @${
                    message.guild.members.cache.get(id).nickname
                  } supprimé...`
                );
              });
            })
            .catch((err) => {
              console.log(`[-] Error in time delete-info ==>`, err);
              return message.channel.send(
                `Temps écoulé, l'utilisateur ne sera pas supprimé.`
              );
            });
        });
      });
  },
};
