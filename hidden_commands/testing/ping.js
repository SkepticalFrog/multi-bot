module.exports = {
  name: 'ping',
  trigger: [/ping/i],
  cooldown: 60,
  execute(message) {
    message.channel.send(`Pong, mothafucka`);
  },
};
