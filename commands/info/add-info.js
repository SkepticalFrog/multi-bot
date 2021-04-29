const JSONdb = require('simple-json-db');

module.exports = {
  name: 'add-info',
  aliases: ['info-add'],
  args: true,
  description: "Affiche les infos d'un utilisateur enregistré, ou de tous les utilisateur sans argument.",
  usage: '<lastname> <firstname> <email> <number> <birthday (YYYY-MM-DD)>',
  execute(message, args) {
    const db = new JSONdb('./db/info.json');

    if (args.length === 5 || args.length === 6) {
      const id = args.length === 5 ? message.author.id : message.mentions.users.first().id;
      if (args.length > 5) args.shift();
      if (db.get(message.guild.id).find(user => user.id === id)) {
        console.log(`Exists already.`);
        return message.reply(
          'Cet utilisateur est déjà enregistré. Utilise la commande `edit` pour le modifier.'
        );
      }

      const user = {
        id,
        lastname: args[0],
        firstname: args[1],
        email: args[2],
        number: args[3],
        birthday: args[4],
      };
      const newUsers = db.get(message.guild.id);
      newUsers.push(user);
      db.set(message.guild.id, newUsers);


      return message.channel.send("L'utilisateur @" + message.guild.members.cache.get(id).nickname + ' a bien été ajouté !');

    }
    message.reply(
      `Syntaxe incorrecte. Consulte l'aide avec la commande \`help\` !`
    );

  }
};

