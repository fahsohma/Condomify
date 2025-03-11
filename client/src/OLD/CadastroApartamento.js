import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importe o Link
import Menu from './Menu';
import './styles.css';

function CadastroApartamento() {
  const [condominios, setCondominios] = useState([]);
  const [nomeCondominio, setNomeCondominio] = useState('');
  const [bloco, setBloco] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [moradores, setMoradores] = useState([]);
  const [moradoresCadastrados, setMoradoresCadastrados] = useState([]);
  const [apartamentoExistente, setApartamentoExistente] = useState(false);
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

  useEffect(() => {
    const fetchMoradoresCadastrados = async () => {
      if (nomeCondominio && bloco && apartamento) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/apartamentos/moradores?nomeCondominio=${nomeCondominio}&bloco=${bloco}&apartamento=${apartamento}`
          );
          const data = await response.json();
          setMoradoresCadastrados(data.moradores || []);
          setApartamentoExistente(data.apartamentoExistente || false);

          if (!data.apartamentoExistente) {
            setMoradores([{ nome: '', telefone: '' }]);
          } else {
            setMoradores([]);
          }
        } catch (error) {
          console.error('Erro ao buscar moradores cadastrados:', error);
        }
      }
    };

    fetchMoradoresCadastrados();
  }, [nomeCondominio, bloco, apartamento]);

  const adicionarMorador = () => {
    setMoradores([...moradores, { nome: '', telefone: '' }]);
  };

  const removerMorador = (index) => {
    const novosMoradores = moradores.filter((_, i) => i !== index);
    setMoradores(novosMoradores);
  };

  const formatarNome = (nome) => {
    const palavrasIgnoradas = ['de', 'da', 'do', 'dos', 'das', 'di'];
    return nome
      .toLowerCase()
      .split(' ')
      .map((palavra) => {
        if (palavrasIgnoradas.includes(palavra)) {
          return palavra;
        }
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      })
      .join(' ');
  };

  const aplicarMascaraTelefone = (input) => {
    if (input) {
      input.value = input.value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const validarTelefone = (telefone) => {
    const telefoneSemMascara = telefone.replace(/\D/g, '');
    return telefoneSemMascara.length === 11;
  };

  const removerMoradorDoBanco = async (nomeMorador) => {
    try {
      const response = await fetch('http://localhost:5000/api/apartamentos/remover-morador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCondominio,
          bloco,
          apartamento,
          nomeMorador,
        }),
      });

      const result = await response.json();
      alert(result.message);

      const novosMoradores = moradoresCadastrados.filter((morador) => morador.nome !== nomeMorador);
      setMoradoresCadastrados(novosMoradores);
    } catch (error) {
      console.error('Erro ao remover morador:', error);
      alert('Erro ao remover morador. Tente novamente.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeCondominio || !bloco || !apartamento) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (bloco.length > 50) {
      alert('O campo "Bloco" deve ter no máximo 50 caracteres.');
      return;
    }

    const todosMoradores = [...moradoresCadastrados, ...moradores];
    const moradoresFormatados = [];
    let telefoneValido = true;

    todosMoradores.forEach((morador) => {
      const nome = formatarNome(morador.nome.trim());
      const telefone = morador.telefone.trim();

      if (!nome || !telefone) {
        alert('Preencha todos os campos dos moradores.');
        telefoneValido = false;
        return;
      }

      if (!validarTelefone(telefone)) {
        alert('Telefone inválido. O telefone deve ter 11 dígitos.');
        telefoneValido = false;
        return;
      }

      moradoresFormatados.push({ nome, telefone });
    });

    if (!telefoneValido) return;

    try {
      const response = await fetch('http://localhost:5000/api/apartamentos/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeCondominio, bloco, apartamento, moradores: moradoresFormatados }),
      });

      const result = await response.json();
      alert(result.message);

      setNomeCondominio('');
      setBloco('');
      setApartamento('');
      setMoradores([{ nome: '', telefone: '' }]);
      setMoradoresCadastrados([]);
      setApartamentoExistente(false);
    } catch (error) {
      console.error('Erro ao cadastrar apartamento:', error);
      alert('Erro ao cadastrar apartamento. Tente novamente.');
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="header">
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        <Link to="/"> {/* Adicione o Link aqui */}
          <img
            src="/CondomifyLogo.png"
            alt="Condomify Logo"
            className="logo"
          />
        </Link>
      </div>

      {/* Menu sanduíche */}
      <Menu aberto={menuAberto} onClose={toggleMenu} />

      {/* Conteúdo da tela de cadastro */}
      <div className="conteudo">
        <h1 className="titulo-cadastro">CADASTRO DE APARTAMENTO X MORADOR</h1> {/* Adicione a classe aqui */}
        <form onSubmit={handleSubmit}>
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

          {apartamentoExistente && (
            <div>
              <label>Moradores Cadastrados:</label>
              {moradoresCadastrados.map((morador, index) => (
                <div key={index} className="morador-campos">
                  <input
                    type="text"
                    value={morador.nome}
                    onChange={(e) => {
                      const novosMoradores = [...moradoresCadastrados];
                      novosMoradores[index].nome = formatarNome(e.target.value);
                      setMoradoresCadastrados(novosMoradores);
                    }}
                    placeholder="Nome do Morador"
                    required
                  />
                  <input
                    type="text"
                    value={morador.telefone}
                    onChange={(e) => {
                      const novosMoradores = [...moradoresCadastrados];
                      novosMoradores[index].telefone = e.target.value;
                      setMoradoresCadastrados(novosMoradores);
                    }}
                    onInput={(e) => aplicarMascaraTelefone(e.target)}
                    placeholder="Telefone"
                    required
                  />
                  <div className="morador-botoes">
                    <button
                      type="button"
                      className="botao-remover"
                      onClick={() => removerMoradorDoBanco(morador.nome)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <label>Novos Moradores:</label>
            {moradores.map((morador, index) => (
              <div key={index} className="morador-campos">
                <input
                  type="text"
                  value={morador.nome}
                  onChange={(e) => {
                    const novosMoradores = [...moradores];
                    novosMoradores[index].nome = formatarNome(e.target.value);
                    setMoradores(novosMoradores);
                  }}
                  placeholder="Nome do Morador"
                  required
                />
                <input
                  type="text"
                  value={morador.telefone}
                  onChange={(e) => {
                    const novosMoradores = [...moradores];
                    novosMoradores[index].telefone = e.target.value;
                    setMoradores(novosMoradores);
                  }}
                  onInput={(e) => aplicarMascaraTelefone(e.target)}
                  placeholder="Telefone"
                  required
                />
                <div className="morador-botoes">
                  <button
                    type="button"
                    className="botao-remover"
                    onClick={() => removerMorador(index)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <div className="morador-botoes">
              <button
                type="button"
                className="botao-adicionar"
                onClick={adicionarMorador}
              >
                Adicionar Morador
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={apartamentoExistente ? 'botao-atualizar' : 'botao-cadastrar'}
          >
            {apartamentoExistente ? 'Atualizar Moradores' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroApartamento;