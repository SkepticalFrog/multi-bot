module.exports = {
  name: 'info',
  cooldown: 1,
  aliases: [],
  description: "Affiche les infos d'un utilisateur enregistré.",
  execute(message, args) {
    message.channel.send('En cours de mise à jour.');
  },
};
