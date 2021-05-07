const User = require('../../schemas/User');
const { unauthorized } = require('config');

module.exports = {
  name: 'edit-info',
  aliases: ['info-edit'],
  description: "Permet de modifier les informations d'un utilisateur.",
  usage: '<@user> [parameter=new_value]',
  args: true,
  guildOnly: true,
  execute: async (message, args) => {
    const guildId = message.guild.id;

    let id;
    if (message.mentions.users.size) {
      id = message.mentions.users.first().id;
      args.shift();
    } else {
      id = message.author.id;
    }
    const user = await User.findById(id);
    if (!user || !user.guilds.includes(guildId)) {
      return message.reply("L'utilisateur n'est pas enregistré.");
    }

    const keys = Object.keys(user.toObject());
    const temp = {};
    args.map((curr) => {
      const param1 = curr.split('=')[0];
      const param2 = curr.split('=')[1];
      if (keys.includes(param1) && !unauthorized.includes(param1)) {
        temp[param1] = param2;
      }
    });

    await user.updateOne(
      {
        $set: temp,
      },
      { new: true }
    );

    message.channel.send(
      "L'utilisateur @" +
        message.guild.members.cache.get(id).nickname +
        ' a été mis à jour'
    );
  },
};
