module.exports = {
  name: 'restart',
  description: 'Redémarre le bot pour le mettre à jour suivant le git.',
  execute(message, args) {
    message.channel.send('Redémarrage du bot...')
    process.exit(0);
  }
}