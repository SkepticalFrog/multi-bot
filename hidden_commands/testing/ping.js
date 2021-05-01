module.exports = {
  name: 'ping',
  trigger: [/ping/i],
  execute(message) {
    message.channel.send(`Pong, mothafucka`);
  },
};
