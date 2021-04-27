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
        const id = args[1].replace(/[<@!>]/gi, '');
        console.log(`id`, id);
        const user = db.get(id);
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

  if (args.length === 7) {
    const id = message.author.id;
    if (db.get(id)) {
      console.log(`Exists already.`);
      message.reply(
        'Cet utilisateur est déjà enregistré. Utilise la commande `edit` pour le modifier.'
      );
    } else {
      const user = {
        lastname: args[2],
        firstname: args[3],
        email: args[4],
        number: args[5],
        birthday: args[6],
      };
      db.set(id, user);

      message.channel.send("L'utilisateur <@" + id + '> a bien été ajouté !');
    }
  } else {
    message.reply(
      'La syntaxe pour la commande `add` est :\n`$info add lastname firstname email phone_number birthdate(format YYYY-MM-DD)`'
    );
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
      ' (<' +
      curr +
      '>)';
    return str;
  }, 'Voici la liste des utilisateurs enregistrés :');

  message.reply(reply).then((m) => {
    m.edit(m.content.replace(/\(</gi, '(<@'));
  });
};

const editInfo = (message) => {
  const args = message.content.split(' ');
  if (args.length < 4) {
    message.reply(
      'La syntaxe pour la commande `edit` est :\n`$info edit @username parametre=nouvelle_valeur`'
    );
  } else {
    const id = args[2].replace(/[@<>!]/gi, '');
    const user = db.get(id);
    if (!user) {
      message.reply("L'utilisateur n'est pas enregistré.");
      return;
    }
    const keys = Object.keys(user);
    args.slice(3).map((curr) => {
      const param1 = curr.split('=')[0];
      const param2 = curr.split('=')[1];
      if (keys.includes(param1)) {
        user[param1] = param2;
      }
    });

    db.set(id, user);
    message.reply("L'utilisateur <" + id + '> a été mis à jour.').then((m) => {
      m.edit(m.content.replace(/r </g, 'r <@'));
    });
  }
};

const deleteInfo = (message) => {
  const args = message.content.split(' ');
  if (args.length === 3) {
    const id = args[2].replace(/[!@<>]/gi, '');
    const user = db.get(id);
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
          if (collected.first().content.match(/oui/gi)) {
            db.delete(id);
            message.reply(`Utilisateur <${id}> supprimé...`).then((m) => {
              m.edit(m.content.replace(/</g, '<@'));
            });
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
      'La syntaxe pour la commande `delete` est :\n`$info delete @username`'
    );
  }
};

module.exports = info;
