const JSONdb = require('simple-json-db');

const moment = require('moment')
moment.locale('fr')

module.exports = {
  name: 'stopbirthday',
  aliases: ['stopbd'],
  description: "Stoppe le timer pour afficher les anniversaires chaque jour.",
  guildOnly: true,
  execute(message, args) {
    if (!message.client.birthdayInterval) {
      return message.channel.send('Le timer est déjà stoppé.')
    }
    clearInterval(message.client.birthdayInterval);
    message.client.birthdayInterval = null;
    message.channel.send('Le timer est stoppé.')
  },
};

// guild.systemChannel
// guild.systemChannel 