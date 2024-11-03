import React, { useState, useEffect } from 'react';
import './CrearRegistrosForm.css';

export const CrearRegistrosForm = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedPrueba, setSelectedPrueba] = useState('');
  const [selectedPregunta, setSelectedPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/estudiantes')
      .then(response => response.json())
      .then(data => setEstudiantes(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error al cargar estudiantes:', error));

    fetch('http://localhost:3000/pruebas')
      .then(response => response.json())
      .then(data => setPruebas(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error al cargar pruebas:', error));
  }, []);

  useEffect(() => {
    if (selectedPrueba) {
      fetch(`http://localhost:3000/preguntas/${selectedPrueba}`)
        .then(response => response.json())
        .then(data => setPreguntas(Array.isArray(data) ? data : []))
        .catch(error => console.error('Error al cargar preguntas:', error));
    } else {
      setPreguntas([]);
    }
  }, [selectedPrueba]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          IDEstudiante: selectedEstudiante,
          IDprueba: selectedPrueba,
          IDPregunta: selectedPregunta,
          Respuesta: respuesta,
        }),
      });
      const data = await response.json();
      setMessage(data.message || 'Registro creado con éxito');
    } catch (error) {
      console.error('Error al guardar el registro:', error);
      setMessage('Hubo un error al crear el registro');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Crear Resultado</h2>

      <label className="form-label">Estudiante:</label>
      <select
        className="form-select"
        value={selectedEstudiante}
        onChange={(e) => setSelectedEstudiante(e.target.value)}
        required
      >
        <option value="">Seleccionar Estudiante</option>
        {estudiantes.map((estudiante) => (
          <option key={estudiante.ID} value={estudiante.ID}>
            {estudiante.Nombres}
          </option>
        ))}
      </select>

      <label className="form-label">Prueba:</label>
      <select
        className="form-select"
        value={selectedPrueba}
        onChange={(e) => setSelectedPrueba(e.target.value)}
        required
      >
        <option value="">Seleccionar Prueba</option>
        {pruebas.map((prueba) => (
          <option key={prueba.ID} value={prueba.ID}>
            {prueba.Nombre}
          </option>
        ))}
      </select>

      <label className="form-label">Pregunta (Orden):</label>
      <select
        className="form-select"
        value={selectedPregunta}
        onChange={(e) => setSelectedPregunta(e.target.value)}
        required
      >
        <option value="">Seleccionar Pregunta</option>
        {preguntas.map((pregunta) => (
          <option key={pregunta.id} value={pregunta.id}>
            {pregunta.orden || 'Sin orden'}
          </option>
        ))}
      </select>

      <label className="form-label">Respuesta:</label>
      <input
        type="text"
        className="form-input"
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        placeholder="Escribe tu respuesta"
        required
      />

      <button className="form-button" type="submit">Guardar</button>
      <p className="form-message">{message}</p>
    </form>
  );
};
