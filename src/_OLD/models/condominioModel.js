const mongoose = require('mongoose');

const CondominioSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Condominio', CondominioSchema);