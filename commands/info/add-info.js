const connectDB = require('../../config/db');
const User = require('../../schemas/User');

module.exports = {
  name: 'add-info',
  aliases: ['info-add'],
  description:
    "Affiche les infos d'un utilisateur enregistré, ou de tous les utilisateur sans argument.",
  usage: '<lastname> <firstname> <email> <number> <birthday (YYYY-MM-DD)>',
  guildOnly: true,
  execute: async (message, args) => {
    const id = message.mentions.users.first()
      ? message.mentions.users.first().id || message.author.id
      : message.author.id;
    if (args.length > 5) args.shift();

    let user = await User.findById(id);

    if (user) {
      if (user.guilds.includes(message.guild.id)) {
        console.log(`[-] Exists already.`);
        return message.reply(
          'Cet utilisateur est déjà enregistré. Utilise la commande `edit` pour le modifier.'
        );
      } else {
        console.log(`[+] Adding guild id.`);

        user.guilds.push(message.guild.id);
        await user.save();

        return message.channel.send(
          "L'utilisateur @" +
            message.guild.members.cache.get(id).nickname +
            ' a bien été ajouté !'
        );
      }
    }

    if (args.length !== 5 && args.length !== 6) {
      return message.reply(
        `Syntaxe incorrecte. Consulte l'aide avec la commande \`help\` !`
      );
    }

    user = new User({
      _id: id,
      lastname: args[0],
      firstname: args[1],
      email: args[2],
      phone_number: args[3],
      birthday: args[4],
    });

    user.guilds.push(message.guild.id);

    await user.save();

    return message.channel.send(
      "L'utilisateur @" +
        message.guild.members.cache.get(id).nickname +
        ' a bien été ajouté !'
    );
  },
};
