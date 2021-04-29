module.exports = {
  name: 'args-info',
  description: 'Shows command and args',
  usage: '<args>',
  args: true,
  execute(message, args) {
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  },
};
