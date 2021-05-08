const Server = require('../schemas/Server');

module.exports = {
  name: 'guildCreate',
  execute: async (guild) => {
    console.log(`[+] Checking new joined guild ${guild.id}...`);

    let server = await Server.findById(guild.id);
    if (!server) {
      console.log('[+] Creating DB object...');
      server = new Server({
        _id: guild.id,
        defaultChannel: guild.systemChannelID,
      });
      await server.save();
      console.log(`\t+ done.`);
    }
  },
};
