const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true,
};

const ServerSchema = mongoose.Schema({
  _id: reqString,
  defaultChannel: reqString,
  welcome: String,
  prefix: String,
  unused: {
    type: [String],
    default: [],
  },
  botreplies: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Server', ServerSchema);
