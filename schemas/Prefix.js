const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true,
};

const PrefixSchema = mongoose.Schema({
  _id: reqString,
  symbol: reqString,
});

module.exports = mongoose.model('Prefix', PrefixSchema);
