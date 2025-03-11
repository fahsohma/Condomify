import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import './styles.css';

function Home() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
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

      {/* Conteúdo da HOME */}
      <div className="conteudo">
        <p>Bem-vindo ao Condomify! Use o menu para navegar.</p>
      </div>
    </div>
  );
}

export default Home;