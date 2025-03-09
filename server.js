// Importar as dependências
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Criar uma instância do Express
const app = express();

// Definir a porta do servidor
const PORT = process.env.PORT || 5000;

// Middleware para permitir requisições JSON e CORS
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://fahsohma:Teka.2014@cluster0.oyhsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Registrar as rotas do apartamento
const apartamentoRoutes = require('./src/routes/apartamentoRoutes');
app.use('/api/apartamentos', apartamentoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});