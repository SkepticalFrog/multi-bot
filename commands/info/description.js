const User = require('../../schemas/User');

module.exports = {
  name: 'description',
  aliases: ['desc'],
  description: "Permet de modifier la description d'un utilisateur.",
  usage: ' <description>',
  args: true,
  guildOnly: true,
  execute: async (message, args) => {
    const guildId = message.guild.id;

    let id = message.author.id;
    const user = await User.findById(id);
    if (!user || !user.guilds.includes(guildId)) {
      return message.reply("L'utilisateur n'est pas enregistré.");
    }

    await user.updateOne(
      {
        $set: {
          description: args.join(' '),
        },
      },
      { new: true }
    );

    message.channel.send(
      "La description de l'utilisateur @" +
        message.guild.members.cache.get(id).nickname +
        ' a été mis à jour'
    );
  },
};
