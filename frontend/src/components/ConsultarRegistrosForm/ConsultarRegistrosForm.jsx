import { useState, useEffect } from 'react';
import {Modal} from '../Modal'


export const ConsultarRegistrosForm = () => {
  //guardan los IDs seleccionados de estudiante y prueba. 
  const [estudianteId, setEstudianteId] = useState('');
  const [pruebaId, setPruebaId] = useState('');
  //resultados almacena los datos de la consulta.
  const [resultados, setResultados] = useState([]);
  //estudiantes y pruebas almacenan las listas de estudiantes y pruebas disponibles.
  const [estudiantes, setEstudiantes] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  //mensaje guarda mensajes de error o información.
  const [mensaje, setMensaje] = useState('');
  //modalOpen controla la visibilidad del modal.
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal

  // Se cargan los estudiantes y pruebas al montar el componente
  useEffect(() => {
    // Se hace una petición fetch para obtener la lista de estudiantes desde una URL y se guarda en el estado estudiantes.
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('http://localhost:3000/estudiantes');
        const data = await response.json();
        setEstudiantes(data);
      } catch (error) {
        console.error("Error al cargar los estudiantes:", error);
      }
    };
    //Se obtiene la lista de pruebas y la guarda en el estado pruebas.
    const fetchPruebas = async () => {
      try {
        const response = await fetch('http://localhost:3000/pruebas');
        const data = await response.json();
        setPruebas(data);
      } catch (error) {
        console.error("Error al cargar las pruebas:", error);
      }
    };

    fetchEstudiantes();
    fetchPruebas();
  }, []);

  //función asíncrona que maneja la consulta de los resultados. Limpia mensaje y resultados para evitar datos de consultas anteriores.
  const handleConsultar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setResultados([]); 

    //Se realiza una petición fetch con estudianteId y pruebaId. Si no se encuentran datos, establece un mensaje informativo; si hay datos, los guarda en resultados y abre el modal.
    try {
      const response = await fetch(`http://localhost:3000/reporte/${estudianteId}/${pruebaId}`);
      const data = await response.json();
      
      if (data.length === 0) {
        setMensaje("No se tiene información correspondiente al estudiante");
      } else {
        setResultados(data);
        setModalOpen(true); // Abrir el modal al recibir resultados
      }
      
    } catch (error) {
      console.error("Error al consultar los resultados:", error);
      setMensaje("Error al consultar los resultados");
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Función para cerrar el modal
  };

  return (
    <div className="form-container">
      <form onSubmit={handleConsultar} className="form">
        <h2>Consultar Reporte de Aciertos</h2>
        <select
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
          required
          className="form-select"
        >
          <option value="">Selecciona un Estudiante</option>
          {estudiantes.map((estudiante) => (
            <option key={estudiante.ID} value={estudiante.ID}>
              {estudiante.Nombres}
            </option>
          ))}
        </select>
        
        <select
          value={pruebaId}
          onChange={(e) => setPruebaId(e.target.value)}
          required
          className="form-select"
        >
          <option value="">Selecciona una Prueba</option>
          {pruebas.map((prueba) => (
            <option key={prueba.ID} value={prueba.ID}>
              {prueba.Nombre}
            </option>
          ))}
        </select>

        <button type="submit" className="form-button">Consultar</button>
      </form>

      {mensaje && <p className="form-message">{mensaje}</p>}

      {/* Modal para mostrar los resultados */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {resultados.length > 0 && (
          <table className="result-table">
            <thead>
              <tr>
                <th>Pregunta N°</th>
                <th>Respuesta Correcta</th>
                <th>Respuesta del Estudiante</th>
                <th>Acierto</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.preguntaNumero}</td>
                  <td>{resultado.respuestaCorrecta}</td>
                  <td>{resultado.respuestaEstudiante}</td>
                  <td>{resultado.acierto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};
