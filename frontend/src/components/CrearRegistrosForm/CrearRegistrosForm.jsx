import { useState, useEffect } from 'react';
import './CrearRegistrosForm.css';

export const CrearRegistrosForm = () => {
  // Estados para almacenar listas de estudiantes, pruebas y preguntas
  const [estudiantes, setEstudiantes] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  // Estados para almacenar los valores seleccionados en el formulario
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedPrueba, setSelectedPrueba] = useState('');
  const [selectedPregunta, setSelectedPregunta] = useState('');
  // Estado para almacenar la respuesta ingresada por el usuario
  const [respuesta, setRespuesta] = useState('');
  // Estado para mostrar mensajes al usuario
  const [message, setMessage] = useState('');

  // Carga inicial de datos de estudiantes y pruebas al montar el componente
  useEffect(() => {
    // Función asincrónica para obtener estudiantes desde la API
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('http://localhost:3000/estudiantes');
        const data = await response.json();
        setEstudiantes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
      }
    };

    // Función asincrónica para obtener pruebas desde la API
    const fetchPruebas = async () => {
      try {
        const response = await fetch('http://localhost:3000/pruebas');
        const data = await response.json();
        setPruebas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar pruebas:', error);
      }
    };

    // Llamadas a las funciones para cargar los datos
    fetchEstudiantes();
    fetchPruebas();
  }, []);

  // Carga de preguntas basada en la prueba seleccionada
  useEffect(() => {
    // Función asincrónica para obtener preguntas según la prueba seleccionada
    const fetchPreguntas = async () => {
      if (selectedPrueba) { // Verifica si hay una prueba seleccionada
        try {
          const response = await fetch(`http://localhost:3000/preguntas/${selectedPrueba}`);
          const data = await response.json();
          setPreguntas(Array.isArray(data) ? data : []);
          
        } catch (error) {
          console.error('Error al cargar preguntas:', error);
        }
      } else {
        setPreguntas([]); // Resetea preguntas si no hay prueba seleccionada
      }
    };

    fetchPreguntas();
  }, [selectedPrueba]);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario
    try {
      // Realiza una solicitud POST a la API para guardar el registro
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
      // Muestra un mensaje de éxito o error en función del resultado
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
