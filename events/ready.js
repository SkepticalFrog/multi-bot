const Server = require('../schemas/Server');

module.exports = {
  name: 'ready',
  once: true,
  execute: async (client) => {
    console.log(`[+] Bot is ready! Logged in as ${client.user.tag}`);

    console.log('[+] Checking new guilds...');
    await Promise.all(
      client.guilds.cache.map(async (guild) => {
        let server = await Server.findById(guild.id);
        if (!server) {
          console.log(`\t+ adding guild ${guild.id} to DB...`);
          server = new Server({
            _id: guild.id,
            defaultChannel: guild.systemChannelID,
          });
          await server.save();
        }
      })
    );
    console.log('\t+ done');
  },
};
