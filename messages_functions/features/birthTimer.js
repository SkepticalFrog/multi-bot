const { start } = require('repl');
const JSONdb = require('simple-json-db');
const db = new JSONdb('../../db/info.json');
const moment = require('moment')

const birthTimer = (message) => {
  message.channel.send('Okay let\'s start.');
  setInterval(() => {
    message.channel.send('It\'s been one day.')
  }, moment.duration(1, 'days').asMilliseconds())
};

module.exports = birthTimer;