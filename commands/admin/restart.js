module.exports = {
  name: 'restart',
  aliases: ['rs'],
  description: 'Redémarre le bot pour le mettre à jour suivant le git.',
  cooldown: 10,
  permissions: 'ADMINISTRATOR',
  execute(message, args) {
    message.channel.send('Redémarrage du bot...').then(() => {
      process.exit(0);
    });
  },
};
