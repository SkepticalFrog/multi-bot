module.exports = {
  name: 'args-info',
  args: true,
  description: 'Shows command and args',
  execute(message, args) {
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  },
};
