module.exports = {
  name: 'avatar',
  cooldown: 10,
  description: "Shows users' avatar",
  execute(message, args) {
    if (!message.mentions.users.size) {
      return message.channel.send(
        `Your avatar: <${message.author.displayAvatarURL({
          format: 'png',
          dynamic: 'true',
        })}>`
      );
    }

    const avatarList = message.mentions.users.map((user) => {
      return `${user.username}'s avatar: <${user.displayAvatarURL({
        format: 'png',
        dynamic: 'true',
      })}>`;
    });

    message.channel.send(avatarList);
  },
};
