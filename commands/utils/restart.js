module.exports = {
  name: 'restart',
  description: 'Stops the bot\'s process and therefore restarts.',
  execute(message, args) {
    message.channel.send('Restarting bot now...')
    process.exit(0);
  }
}