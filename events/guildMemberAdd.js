const Welcome = require('../schemas/Welcome');

module.exports = {
  name: 'guildMemberAdd',
  execute: async (member, client) => {
    const guild = await member.guild.fetch();
    const channel = await client.channels.fetch(guild.systemChannelID);

    const welcome = await Welcome.findById(guild.id);
    if (!welcome) {
      channel.send(`<@${member.id}> Bienvenue !`);
      console.log(`[+] Greeting new user`);
    } else {
      channel.send(`<@${member.id}>\n${welcome.text}`);
    }
  },
};
