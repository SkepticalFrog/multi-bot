module.exports = {
  name: 'prune',
  args: true,
  cooldown: 20,
  usage: '<number of messages to delete>',
  description: 'Deletes a certain amount of messages in current channel',
  execute(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply(`That isn't a f*ckin' valid number.`);
    } else if (amount <= 1 || amount > 100) {
      return message.reply(`It needs to be between 1 and 99.`);
    }

    message.channel.bulkDelete(amount, true).catch((err) => {
      console.log('[-] Error :', err);
      message.channel.send(
        `There was an error trying to prune messages in this channel`
      );
    });
  },
};
