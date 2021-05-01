const JSONdb = require('simple-json-db');
const Discord = require('discord.js');

const { prefix } = require('../config.json');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (
      newMessage.author.id !== client.id &&
      newMessage.content !== oldMessage.content
    ) {
      newMessage
        .react('834319455450300419')
        .then(() => newMessage.react('👀'))
        .then(() => newMessage.react('👎'))
        .catch((err) => console.log('[-] Error ==>', err));
    }
  },
};
