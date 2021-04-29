const JSONdb = require('simple-json-db');
const db = new JSONdb('./db/info.json');

module.exports = {
  name: 'delete-info',
  aliases: ["remove-info", 'rm-info'],
  description: "Supprime les données d'un utilisateur.",
  args: true,
  usage: '<@user>',
  execute(message, args) {
    if (!message.mentions.users.size) {
      return message.reply(
        'La syntaxe pour la commande `delete` est :\n`$info delete @username`'
      );
    }
    const id = message.mentions.users.first().id;
    const user = db.get(message.guild.id).find(user => user.id === id);
    if (!user) {
      return message.reply("Cet utilisateur n'existe pas.");
    }

    message.reply(
      'Es-tu sûr de vouloir supprimer cet utilisateur ? (oui/non)'
    );

    message.channel
      .awaitMessages((m) => m.author.id == message.author.id, {
        max: 1,
        time: 30000,
        errors: ['time']
      })
      .then((collected) => {
        if (collected.first().content.match(/oui/gi)) {
          const newUsers = db.get(message.guild.id).filter(user => user.id !== id);
          db.set(message.guild.id, newUsers)
          message.reply(`Utilisateur @${message.guild.members.cache.get(id).nickname} supprimé...`)
        } else message.reply('Operation annulée.');
      })
      .catch((err) => {
        console.log(`[-] Error: `, err)
        message.reply('Pas de réponse après 30 secondes, operation annulée.');
      });
  }
};

