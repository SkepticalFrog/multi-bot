const JSONdb = require('simple-json-db');
const db = new JSONdb('./db/info.json');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    const guilds = client.guilds.cache;
    for (guild of guilds) {
      if (!db.get(guild[1].id)) {
        db.set(guild[1].id, {
          users: [],
          prefix: '',
        });
        console.log(`[+] Adding ${guild[1].name}#${guild[1].id} to database`);
      }
    }

    console.log(`[+] Bot is ready! Logged in as ${client.user.tag}`);
  },
};
