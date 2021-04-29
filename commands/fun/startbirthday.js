const JSONdb = require('simple-json-db');

const moment = require('moment')
moment.locale('fr')

const timeFunction = (message) => {
  const db = new JSONdb('./db/info.json');

  const users = db.get(message.guild.id);
  const now = moment();
  const happybirthday = users.reduce((arr, user) => {
    const birth = moment(user.birthday)
    if (birth.date() === now.date() && birth.month() === now.month()) {
      arr.push(user.id)
    }
    return arr;
  }, [])

  if (happybirthday.length > 0) {
    let reply = happybirthday.reduce((str, curr) => {
      str += ', <@!' + curr + '>';
      return str;
    }, 'Hey hey hey')
    if (happybirthday.length === 1)
      reply += '\nJoyeux anniversaire à toi !!';
    else reply += '\nJoyeux anniversaire à vous !!';
    message.guild.systemChannel.send(reply);
  } else {
    message.guild.systemChannel.send('Pas d\'anniversaire aujourd\'hui.');
  }
}

module.exports = {
  name: 'startbirthday',
  aliases: ['startbd'],
  description: "Lance le timer pour afficher les anniversaires chaque jour.",
  execute(message, args) {
    if (message.client.birthdayInterval) {
      return message.channel.send('Le timer est déjà lancé.')
    }

    message.channel.send('Okay let\'s start.');
    timeFunction(message);
    message.client.birthdayInterval = setInterval(() => timeFunction(message), moment.duration(1, 'days').asMilliseconds())
  },
};

// guild.systemChannel
// guild.systemChannel 