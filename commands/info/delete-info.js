const JSONdb = require('simple-json-db');

module.exports = {
  name: 'delete-info',
  aliases: ['remove-info', 'rm-info'],
  description: "Supprime les données d'un utilisateur.",
  usage: '<@user>',
  args: true,
  guildOnly: true,
  execute(message, args) {
    const db = new JSONdb('./db/info.json');

    if (!message.mentions.users.size) {
      return message.reply(
        'La syntaxe pour la commande `delete` est :\n`$info delete @username`'
      );
    }
    const id = message.mentions.users.first().id;
    const user = db.get(message.guild.id).users.find((user) => user.id === id);
    if (!user) {
      return message.reply("Cet utilisateur n'existe pas.");
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
              const newUsers = db
                .get(message.guild.id)
                .users.filter((user) => user.id !== id);
              db.set(message.guild.id, {
                ...db.get(message.guild.id),
                users: newUsers,
              });
              return message.reply(
                `Utilisateur @${
                  message.guild.members.cache.get(id).nickname
                } supprimé...`
              );
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
