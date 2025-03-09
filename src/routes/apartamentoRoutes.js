const express = require('express');
const Apartamento = require('../models/apartamentoModel');
const Condominio = require('../models/condominioModel');
const router = express.Router();

// Rota para listar condomínios
router.get('/condominios', async (req, res) => {
  try {
    const condominios = await Condominio.find({});
    res.status(200).json(condominios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar condomínios', error });
  }
});

// Rota para buscar moradores cadastrados
router.get('/moradores', async (req, res) => {
  const { nomeCondominio, bloco, apartamento } = req.query;
  try {
    const apartamentoExistente = await Apartamento.findOne({ nomeCondominio, bloco, apartamento });
    if (apartamentoExistente) {
      res.status(200).json({ moradores: apartamentoExistente.moradores, apartamentoExistente: true });
    } else {
      res.status(200).json({ moradores: [], apartamentoExistente: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar moradores', error });
  }
});

// Rota para cadastrar ou atualizar um apartamento
router.post('/cadastrar', async (req, res) => {
  try {
    const { nomeCondominio, bloco, apartamento, moradores } = req.body;

    // Verificar se o condomínio existe
    const condominioExiste = await Condominio.findOne({ nome: nomeCondominio });
    if (!condominioExiste) {
      return res.status(400).json({ message: 'Condomínio não encontrado.' });
    }

    // Verificar se o apartamento já existe
    const apartamentoExistente = await Apartamento.findOne({ nomeCondominio, bloco, apartamento });

    // Formatar o nome dos moradores
    const moradoresFormatados = moradores.map((morador) => ({
      ...morador,
      nome: formatarNome(morador.nome),
    }));

    if (apartamentoExistente) {
      // Se o apartamento já existe, verificar se os moradores já existem
      moradoresFormatados.forEach((novoMorador) => {
        const moradorExistente = apartamentoExistente.moradores.find(
          (morador) => morador.nome === novoMorador.nome
        );

        if (moradorExistente) {
          // Se o morador já existe, atualiza o telefone
          moradorExistente.telefone = novoMorador.telefone;
        } else {
          // Se o morador não existe, adiciona à lista
          apartamentoExistente.moradores.push(novoMorador);
        }
      });

      await apartamentoExistente.save();
      res.status(200).json({ message: 'Moradores atualizados com sucesso!' });
    } else {
      // Se o apartamento não existe, cria um novo apartamento
      const novoApartamento = new Apartamento({
        nomeCondominio,
        bloco,
        apartamento,
        moradores: moradoresFormatados,
      });
      await novoApartamento.save();
      res.status(201).json({ message: 'Apartamento cadastrado com sucesso!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar/atualizar apartamento', error });
  }
});

// Rota para remover um morador
router.post('/remover-morador', async (req, res) => {
  try {
    const { nomeCondominio, bloco, apartamento, nomeMorador } = req.body;

    const apartamentoExistente = await Apartamento.findOne({ nomeCondominio, bloco, apartamento });
    if (!apartamentoExistente) {
      return res.status(404).json({ message: 'Apartamento não encontrado.' });
    }

    // Remover o morador da lista
    apartamentoExistente.moradores = apartamentoExistente.moradores.filter(
      (morador) => morador.nome !== nomeMorador
    );

    await apartamentoExistente.save();
    res.status(200).json({ message: 'Morador removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover morador', error });
  }
});

// Função para formatar o nome, exceto palavras específicas
function formatarNome(nome) {
  const palavrasIgnoradas = ['de', 'da', 'do', 'dos', 'das', 'di'];
  return nome
    .toLowerCase()
    .split(' ')
    .map((palavra) => {
      if (palavrasIgnoradas.includes(palavra)) {
        return palavra; // Mantém em minúsculas
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1); // Capitaliza a primeira letra
    })
    .join(' ');
}

module.exports = router;