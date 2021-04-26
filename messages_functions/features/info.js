const JSONdb = require('simple-json-db');
const db = new JSONdb('./db/info.json');
const moment = require('moment');
moment.locale('fr');

const info = (message) => {
  const args = message.content.split(' ');
  switch (args[1]) {
    case 'add':
      addInfo(message);
      break;
    case 'all':
      allInfo(message);
      break;
    case 'edit':
      editInfo(message);
      break;
    case 'delete':
      deleteInfo(message);
      break;
    default:
      if (!args[1]) {
        message.reply(
          'Les commandes pour `$info` sont : ' +
            '\n\t- `$info all`' +
            '\n\t- `$info add [args]`' +
            '\n\t- `$info edit [args]`' +
            '\n\t- `$info delete username`' +
            '\n\t- `$info username`'
        );
      } else {
        const user = db.get(args[1].toString().toLowerCase());
        if (user) {
          message.reply(
            'Moui... on parle de ' +
              user.firstname +
              ' ' +
              user.lastname +
              ' : ' +
              user.email +
              ', ' +
              user.number +
              ' né le ' +
              moment(user.birthday).format('dddd D MMMM YYYY')
          );
        } else {
          message.reply('Inconnu au bataillon.');
        }
      }
  }
};

const addInfo = (message) => {
  const args = message.content.split(' ');
  if (args[2] && db.get(args[2])) {
    console.log(`Exists already.`);
    message.reply(
      'Cet utilisateur est déjà enregistré. Utilise la commande `edit` pour le modifier.'
    );
  } else {
    if (args.length === 8) {
      const user = {
        lastname: args[3],
        firstname: args[4],
        email: args[5],
        number: args[6],
        birthday: args[7],
      };
      db.set(args[2].toString().toLowerCase(), user);

      message.reply("L'utilisateur " + args[2] + ' a bien été ajouté !');
    } else {
      message.reply(
        'La syntaxe pour la commande `add` est :\n`$info add username lastname name email phone_number birthdate(format YYYY-MM-DD)`'
      );
    }
  }
};

const allInfo = (message) => {
  const users = db.JSON();
  const reply = Object.keys(users).reduce((str, curr) => {
    const user = users[curr];
    str +=
      '\n' +
      user.firstname +
      ' ' +
      user.lastname +
      ' : ' +
      user.email +
      ', ' +
      user.number +
      ' né le ' +
      moment(user.birthday).format('dddd D MMMM YYYY') +
      ' (' +
      curr +
      ')';
    return str;
  }, 'Voici la liste des utilisateurs enregistrés :');

  message.reply(reply);
};

const editInfo = (message) => {
  const args = message.content.split(' ');
  if (args.length < 4) {
    message.reply(
      'La syntaxe pour la commande `edit` est :\n`$info edit username parametre=nouvelle_valeur`'
    );
  } else {
    const user = db.get(args[2]);
    const keys = Object.keys(user);
    args.slice(3).map((curr) => {
      const param1 = curr.split('=')[0];
      const param2 = curr.split('=')[1];
      if (keys.includes(param1)) {
        user[param1] = param2;
      }
    });

    db.set(args[2].toString().toLowerCase(), user);
    message.reply("L'utilisateur " + args[2] + ' a été mis à jour.');
  }
};

const deleteInfo = (message) => {
  const args = message.content.split(' ');
  if (args.length === 3) {
    const user = db.get(args[2]);
    if (user) {
      message.reply(
        'Es-tu sûr de vouloir supprimer cet utilisateur ? (oui/non)'
      );

      message.channel
        .awaitMessages((m) => m.author.id == message.author.id, {
          max: 1,
          time: 30000,
        })
        .then((collected) => {
          if (collected.first().content.toLowerCase() == 'oui') {
            db.delete(args[2]);
            message.reply(`Utilisateur ${args[2]} supprimé...`);
          } else message.reply('Operation annulée.');
        })
        .catch(() => {
          message.reply('Pas de réponse après 30 secondes, operation annulée.');
        });
    } else {
      message.reply("Cet utilisateur n'existe pas.");
    }
  } else {
    message.reply(
      'La syntaxe pour la commande `delete` est :\n`$info delete username`'
    );
  }
};

module.exports = info;
