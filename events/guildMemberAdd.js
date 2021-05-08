const Server = require('../schemas/Server');

module.exports = {
  name: 'guildMemberAdd',
  execute: async (member, client) => {
    const guild = await member.guild.fetch();
    const channel = await client.channels.fetch(guild.systemChannelID);

    const server = await Server.findById(guild.id);
    if (!server.welcome) {
      channel.send(`<@${member.id}> Bienvenue !`);
      console.log(`[+] Greeting new user`);
    } else {
      channel.send(`<@${member.id}>\n${server.welcome}`);
    }
  },
};
