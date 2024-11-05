import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CrearRegistrosForm, ConsultarRegistrosForm, } from './components';
import './App.css';

function App() {
  return (
    <Router>
      <div id="root">
        <nav>
          <Link to="/">Crear Resultados</Link>
          <Link to="/consultar">Consultar Resultados</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CrearRegistrosForm />} />
          <Route path="/consultar" element={<ConsultarRegistrosForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
