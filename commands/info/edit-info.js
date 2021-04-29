const JSONdb = require('simple-json-db');

module.exports = {
  name: 'edit-info',
  aliases: ['info-edit'],
  description: "Permet de modifier les informations d'un utilisateur.",
  usage: '<@user> [parameter=new_value]',
  args: true,
  guildOnly: true,
  execute(message, args) {
    const db = new JSONdb('./db/info.json');

    const guildId = message.guild.id;

    if (!args.length) {
      return message.reply(
        'La syntaxe pour la commande `edit` est :\n`$info edit @username parametre=nouvelle_valeur`'
      );
    }
    let id;
    if (message.mentions.users.size) {
      id = message.mentions.users.first().id;
      args.shift()
    } else {
      id = message.author.id
    }
    const users = db.get(guildId);
    const user = users.find(user => user.id === id);
    if (!user) {
      return message.reply("L'utilisateur n'est pas enregistré.");
    }
    const keys = Object.keys(user);
    args.map((curr) => {
      const param1 = curr.split('=')[0];
      const param2 = curr.split('=')[1];
      if (keys.includes(param1)) {
        user[param1] = param2;
      }
    });

    db.set(guildId, users.reduce((arr, curr) => {
      if (curr.id === user.id) arr.push(user);
      else arr.push(curr);
      return arr;
    }, []));
    message.channel.send("L'utilisateur @" + message.guild.members.cache.get(id).nickname + ' a été mis à jour')
  }
};

