module.exports = {
  name: 'elon',
  trigger: [/ +elon +/i, /^elon/i, / +elon$/i],
  cooldown: 900,
  execute(message) {
    message.reply(
      `Mais saviez-vous qu'Elon Musk avait vécu avec un dollar par jour ? UN DOLLAR SEULEMENT !!`
    );
  },
};
