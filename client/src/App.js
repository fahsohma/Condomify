import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CadastroApartamento from './CadastroApartamento';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro-apartamento" element={<CadastroApartamento />} />
      </Routes>
    </Router>
  );
}

export default App;