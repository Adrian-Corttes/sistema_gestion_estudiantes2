import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_gestion'
};

async function connectToDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

// Endpoint para obtener estudiantes
app.get('/estudiantes', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM Estudiante');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener pruebas
app.get('/pruebas', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM Prueba');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener preguntas según la prueba
app.get('/preguntas/:pruebaId', async (req, res) => {
  const { pruebaId } = req.params;
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT id, orden FROM Pregunta WHERE IDprueba = ?',
      [pruebaId]
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para guardar resultado en la tabla Resultado
app.post('/resultados', async (req, res) => {
  const { IDEstudiante, IDprueba, IDPregunta, Respuesta } = req.body;
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'INSERT INTO Resultado (IDEstudiante, IDprueba, IDPregunta, Respuesta) VALUES (?, ?, ?, ?)',
      [IDEstudiante, IDprueba, IDPregunta, Respuesta]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, IDEstudiante, IDprueba, IDPregunta, Respuesta });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint para obtener el reporte detallado de aciertos de un estudiante en una prueba
app.get('/reporte/:IDEstudiante/:IDPrueba', async (req, res) => {
  const { IDEstudiante, IDPrueba } = req.params;

  try {
    const connection = await connectToDatabase();

    // Consulta para obtener las respuestas del estudiante y las respuestas correctas de la prueba
    const [rows] = await connection.execute(
      `SELECT 
        r.IDPregunta AS preguntaNumero,
        p.Respuesta AS respuestaCorrecta,
        r.Respuesta AS respuestaEstudiante,
        CASE 
          WHEN p.Respuesta = r.Respuesta THEN 'Sí' 
          ELSE 'No' 
        END AS acierto
      FROM Resultado r
      JOIN Pregunta p ON r.IDPregunta = p.ID
      WHERE r.IDEstudiante = ? AND r.IDPrueba = ?`,
      [IDEstudiante, IDPrueba]
    );

    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
