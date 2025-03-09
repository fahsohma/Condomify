const mongoose = require('mongoose');

const MoradorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
});

const ApartamentoSchema = new mongoose.Schema({
  nomeCondominio: { type: String, required: true },
  bloco: { type: String, required: true },
  apartamento: { type: String, required: true },
  moradores: [MoradorSchema],
});

// Adicionar índice único para nomeCondominio, bloco e apartamento
ApartamentoSchema.index({ nomeCondominio: 1, bloco: 1, apartamento: 1 }, { unique: true });

module.exports = mongoose.model('Apartamento', ApartamentoSchema);