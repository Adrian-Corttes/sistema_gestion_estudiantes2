import React, { useState, useEffect } from 'react';
import './CrearRegistrosForm.css';

export const CrearRegistrosForm = () => {
  //estudiantes, pruebas, y preguntas: Guardan listas de opciones para seleccionar en el formulario.
  const [estudiantes, setEstudiantes] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  //selectedEstudiante, selectedPrueba, y selectedPregunta: Guardan los valores seleccionados por el usuario en los respectivos campos.
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedPrueba, setSelectedPrueba] = useState('');
  const [selectedPregunta, setSelectedPregunta] = useState('');
  //respuesta: Almacena la respuesta ingresada por el usuario.
  const [respuesta, setRespuesta] = useState('');
  //message: Contiene mensajes para el usuario, como confirmación o errores.
  const [message, setMessage] = useState('');

  // Se carga los datos iniciales de estudiantes y pruebas al montar el componente.
  useEffect(() => {
    //Se realiza la solicitud para obtener estudiantes desde la API.
    fetch('http://localhost:3000/estudiantes')
      .then(response => response.json())
      //Se guarda los datos obtenidos en estudiantes, o un arreglo vacío si no se recibe un arreglo.
      .then(data => setEstudiantes(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error al cargar estudiantes:', error));

    //Se obtiene datos para pruebas y los guarda en pruebas.  
    fetch('http://localhost:3000/pruebas')
      .then(response => response.json())
      .then(data => setPruebas(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error al cargar pruebas:', error));
  }, []);

  //Este hook carga las preguntas basadas en la prueba seleccionada (selectedPrueba)
  useEffect(() => {
    // Solo realiza la solicitud si selectedPrueba tiene un valor.
    if (selectedPrueba) {
      //Se hace una solicitud a la API para obtener preguntas relacionadas con la prueba seleccionada.
      fetch(`http://localhost:3000/preguntas/${selectedPrueba}`)
        .then(response => response.json())
        //Se guarda las preguntas obtenidas o un arreglo vacío si no se recibe un arreglo.
        .then(data => setPreguntas(Array.isArray(data) ? data : []))
        .catch(error => console.error('Error al cargar preguntas:', error));
    } else {
      setPreguntas([]);
    }
  }, [selectedPrueba]);

  //Esta función se llama cuando se envía el formulario.
  const handleSubmit = async (e) => {
    //Se previene el comportamiento por defecto de recargar la página.
    e.preventDefault();
    try {
      //Se realiza una solicitud POST para enviar los datos del formulario.
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
      //Se muestra un mensaje de éxito o error al usuario, según el resultado de la operación.
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
