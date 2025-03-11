import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Menu({ aberto, onClose }) {
  return (
    <div className={`menu ${aberto ? 'aberto' : ''}`}>
      <div className="menu-conteudo">
        <button className="fechar-menu" onClick={onClose}>
          &times;
        </button>
        <ul>
          <li>
            <Link to="/notificar-encomenda" onClick={onClose}>
              Notificar Encomenda
            </Link>
          </li>
          <li>
            <Link to="/cadastro-apartamento" onClick={onClose}>
              Cadastro Apto/Morador
            </Link>
          </li>
          {/* Adicionar mais opções de menu aqui no futuro */}
        </ul>
      </div>
    </div>
  );
}

export default Menu;