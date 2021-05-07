const JSONdb = require('simple-json-db');
const db = new JSONdb('./db/info.json');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[+] Bot is ready! Logged in as ${client.user.tag}`);
  },
};
