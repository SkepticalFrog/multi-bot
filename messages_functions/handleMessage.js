const info = require('./features/info');
const birthTimer = require('./features/birthTimer');

const handleMessage = (message) => {
  const command = message.content.split(' ')[0];

  if (message.content.match(/j'aime les mo+ches/gi)) {
    message.reply("Parce qu'on se les fait pas piquer !!");
  }

  if (message.content.toLowerCase() === 'ping') {
    message.channel.send('pong, mothafucka!');
  }

  if (command[0] === '$') {
    console.log(`command`, command, message.content.split(' ')[1]);
    switch (command) {
      case '$dudule':
        message.reply("C'est la grosse bite à Duduuuuleuuuuh...");
        break;
      case '$info':
        info(message);
        break;
      case '$starttimer':
        birthTimer(message);
        break;
      default:
        message.reply('Why are you talking to me?');
    }
  }
};

module.exports = handleMessage;
