const moment = require('moment');
const User = require('../../schemas/User');
moment.locale('fr');

module.exports = {
  name: 'info',
  aliases: ['whois'],
  description:
    "Affiche les infos d'un utilisateur enregistré, ou de tous les utilisateur sans argument.",
  usage: '[@user]',
  guildOnly: true,
  execute: async (message, args) => {
    if (!args.length || !message.mentions.users.size) {
      const users = await User.find({ guilds: message.guild.id });

      if (!users.length) return message.reply('Aucun utilisateur enregistré.');
      const reply = users.reduce((str, user) => {
        str +=
          '\n' +
          user.firstname +
          ' ' +
          user.lastname +
          ' : ' +
          user.email +
          ', ' +
          user.phone_number +
          ' né le ' +
          moment(user.birthday).format('dddd D MMMM YYYY') +
          ' (@' +
          user.id +
          '>)';
        return str;
      }, 'Voici la liste des utilisateurs enregistrés :');

      return message.reply(reply).then((m) => {
        m.edit(m.content.replace(/\(@/gi, '(<@'));
      });
    }

    const id = message.mentions.users.first().id;
    const user = await User.findById(id);
    if (user) {
      message.reply(
        'Moui... on parle de ' +
          user.firstname +
          ' ' +
          user.lastname +
          ' : ' +
          user.email +
          ', ' +
          user.phone_number +
          ' né le ' +
          moment(user.birthday).format('dddd D MMMM YYYY')
      );
    } else {
      message.reply('Inconnu au bataillon.');
    }
  },
};
