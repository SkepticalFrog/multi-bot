const info = require('./features/info');
const birthTimer = require('./features/birthTimer');
const votekick = require('./features/votekick');

const handleMessage = (message) => {
  const command = message.content.split(' ')[0];

  if (message.content.match(/j'aime les mo+ches/gi)) {
    message.reply("Parce qu'on se les fait pas piquer !!");
  }

  if (message.content.match(/ping/gi)) {
    message.channel.send('pong, mothafucka!');
  }

  if (message.content.match(/elon/gi)) {
    message.channel.send(
      'Et Elon Musk a vécu un an avec uniquement 1$ par jour pour vivre. UN SEUL DOLLAR !! Quel boss.'
    );
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
      case '$votekick':
        votekick(message);
        break;
      default:
        message.reply('Why are you talking to me?');
    }
  }
};

module.exports = handleMessage;
