import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import './styles.css';

function NotificarEncomenda() {
  const [condominios, setCondominios] = useState([]);
  const [nomeCondominio, setNomeCondominio] = useState('');
  const [bloco, setBloco] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [moradores, setMoradores] = useState([]);
  const [apartamentoExistente, setApartamentoExistente] = useState(false);
  const [moradorSelecionado, setMoradorSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/apartamentos/condominios');
        const data = await response.json();
        setCondominios(data);
      } catch (error) {
        console.error('Erro ao buscar condomínios:', error);
      }
    };

    fetchCondominios();
  }, []);

  const consultarMoradores = async () => {
    if (!nomeCondominio || !bloco || !apartamento) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/apartamentos/moradores?nomeCondominio=${nomeCondominio}&bloco=${bloco}&apartamento=${apartamento}`
      );
      const data = await response.json();
      setMoradores(data.moradores || []);
      setApartamentoExistente(data.apartamentoExistente || false);

      if (!data.apartamentoExistente) {
        alert('Não existem moradores cadastrados.');
      }
    } catch (error) {
      console.error('Erro ao buscar moradores:', error);
      alert('Erro ao buscar moradores. Tente novamente.');
    }
  };

  const notificarMorador = () => {
    if (!moradorSelecionado) {
      alert('Selecione um morador para notificar.');
      return;
    }

    alert(`Morador ${moradorSelecionado.nome} notificado`);
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="header">
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        <Link to="/">
          <img
            src="/CondomifyLogo.png"
            alt="Condomify Logo"
            className="logo"
          />
        </Link>
      </div>

      {/* Menu sanduíche */}
      <Menu aberto={menuAberto} onClose={toggleMenu} />

      {/* Conteúdo da tela de Notificar Encomenda */}
      <div className="conteudo">
        <h1 className="titulo-cadastro">NOTIFICAR ENCOMENDA</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Nome do Condomínio:</label>
          <select
            value={nomeCondominio}
            onChange={(e) => setNomeCondominio(e.target.value)}
            required
          >
            <option value="">Selecione um condomínio</option>
            {condominios.map((condominio) => (
              <option key={condominio._id} value={condominio.nome}>
                {condominio.nome}
              </option>
            ))}
          </select>

          <label>Bloco:</label>
          <input
            type="text"
            value={bloco}
            onChange={(e) => setBloco(e.target.value)}
            maxLength="50"
            required
          />

          <label>Apartamento:</label>
          <input
            type="text"
            value={apartamento}
            onChange={(e) => setApartamento(e.target.value)}
            required
          />

          <button
            type="button"
            className="botao-cadastrar"
            onClick={consultarMoradores}
          >
            Consultar
          </button>

          {apartamentoExistente && (
            <div>
              <label>Moradores Cadastrados:</label>
              <div className="lista-moradores">
                {moradores.map((morador, index) => (
                  <div
                    key={index}
                    className={`morador-card ${moradorSelecionado === morador ? 'selecionado' : ''}`}
                    onClick={() => setMoradorSelecionado(morador)}
                  >
                    <span className="morador-nome">{morador.nome}</span>
                    <span className="morador-telefone">{morador.telefone}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="botao-cadastrar botao-notificar"
                onClick={notificarMorador}
              >
                Notificar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default NotificarEncomenda;