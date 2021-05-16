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
      console.log(`users`, users);
      if (!users.length) return message.reply('Aucun utilisateur enregistré.');
      const embed = {
        color: 0x00cc22,
        title: 'Liste des utilisateurs enregistrés',
        footer: { text: 'Powered by SkepticalFrog™' },
        fields: [
          users.map((user) => {
            return {
              name:
                '@' +
                message.guild.members.cache.get(user.id).user.username +
                '#' +
                message.guild.members.cache.get(user.id).user.discriminator,
              value:
                user.lastname +
                ' ' +
                user.firstname +
                ' : ' +
                user.email +
                ', ' +
                user.phone_number +
                ' né le ' +
                moment(user.birthday).format('D MMMM YYYY'),
            };
          }),
        ],
      };

      return message.channel.send({ embed }).then((m) => {
        m.edit(m.content.replace(/\(@/gi, '(<@'));
      });
    }

    const id = message.mentions.users.first().id;
    const user = await User.findById(id);
    if (user) {
      const embed = {
        color: 0xff6600,
        title: user.lastname + ' ' + user.firstname,
        footer: { text: user.email },
        author: {
          name:
            '@' +
            message.guild.members.cache.get(user.id).user.username +
            '#' +
            message.guild.members.cache.get(user.id).user.discriminator,
        },
        thumbnail: {
          url: message.guild.members.cache.get(user.id).user.displayAvatarURL(),
        },
        fields: [
          {
            name: 'Numéro',
            value: user.phone_number,
            inline: true,
          },
          {
            name: 'Anniversaire',
            value: moment(user.birthday).format('D MMMM YYYY'),
            inline: true,
          },
        ],
        description: user.description,
      };
      message.channel.send("Voici la carte de visite de l'utilisateur :", {
        embed,
      });
    } else {
      message.reply('Inconnu au bataillon.');
    }
  },
};
