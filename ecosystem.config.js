module.exports = {
  apps: [
    {
      name: 'multi-bot',
      script: 'updateAndRun.sh',
      watch: ['events', 'commands', 'hidden_commands', 'index.js'],
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'db', 'utils'],
    },
  ],
};
