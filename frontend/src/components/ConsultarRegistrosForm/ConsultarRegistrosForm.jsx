import React, { useState, useEffect } from 'react';
import {Modal} from '../Modal'


export const ConsultarRegistrosForm = () => {
  const [estudianteId, setEstudianteId] = useState('');
  const [pruebaId, setPruebaId] = useState('');
  const [resultados, setResultados] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal

  // Cargar estudiantes y pruebas al montar el componente
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('http://localhost:3000/estudiantes');
        const data = await response.json();
        setEstudiantes(data);
      } catch (error) {
        console.error("Error al cargar los estudiantes:", error);
      }
    };

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

  const handleConsultar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setResultados([]); // Limpiar resultados al hacer una nueva consulta
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
