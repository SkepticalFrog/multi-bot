const { start } = require('repl');
const JSONdb = require('simple-json-db');
const moment = require('moment')

const birthTimer = (message) => {
  message.channel.send('Okay let\'s start.');
  setInterval(() => {
    const db = new JSONdb('./db/info.json');

    const users = db.JSON();
    const now = moment();
    const happybirthday = Object.keys(users).reduce((arr, key) => {
      const user = db.get(key);
      const birth = moment(user.birthday)
      console.log(`now.date(), now.month`, now.date(), now.month())
      console.log(`birth.date(), birth.month`, birth.date(), birth.month())
      if (birth.date() === now.date() && birth.month() === now.month()) {
        arr.push(key)
      }
      return arr;
    }, [])

    if (happybirthday.length > 0) {
      let reply = happybirthday.reduce((str, curr) => {
        str += ', <' + curr + '>';
        return str;
      }, 'Hey hey hey')
      if (happybirthday.length === 1)
        reply += '\nJoyeux anniversaire à toi !!';
      else reply += '\nJoyeux anniversaire à vous !!';
      message.guild.systemChannel.send(reply).then(m => {
        console.log(`m.content`, m.content)
      });
    } else {
      message.guild.systemChannel.send('Pas d\'anniversaire aujourd\'hui.');
    }
  }, moment.duration(1, 'day').asMilliseconds())
};

module.exports = birthTimer;