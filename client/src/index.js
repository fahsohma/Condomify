import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Certifique-se de que o caminho do CSS está correto
import App from './App';
import reportWebVitals from './reportWebVitals';

// Cria a raiz do React e renderiza o aplicativo
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Se você quiser medir o desempenho no seu app, passe uma função
// para registrar os resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um endpoint de analytics. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();