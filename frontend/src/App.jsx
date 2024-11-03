import { useState } from 'react';
import { CrearRegistrosForm, ConsultarRegistrosForm } from './components';
import './App.css';

function App() {
  return (
    <div id="root">
      <div className="form-wrapper">
        <div className="">
          <CrearRegistrosForm />
        </div>
        <div className="">
          <ConsultarRegistrosForm />
        </div>
      </div>
    </div>
  );
}

export default App;
