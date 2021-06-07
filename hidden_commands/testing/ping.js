module.exports = {
  name: 'ping',
  trigger: [/ping/i],
  cooldown: 300,
  execute(message) {
    message.channel.send(`Pong, mothafucka`);
  },
};
