//Se Importa el módulo express, que facilita la creación de aplicaciones web y APIs en Node.js.
import express from 'express';
//Se Importa cors, que permite solicitudes desde otros dominios, resolviendo problemas de "Same-Origin Policy".
import cors from 'cors';
//Se Importa body-parser, que ayuda a procesar el cuerpo de las solicitudes HTTP, convirtiéndolas en JSON o datos URL-encoded.
import bodyParser from 'body-parser';
//Se Importa mysql2/promise, una biblioteca para interactuar con bases de datos MySQL usando promesas en lugar de callbacks.
import mysql from 'mysql2/promise';

//Se Crea una instancia de Express, llamada app, que será el servidor de la aplicación.
const app = express();
//Se Habilita cors para que el servidor pueda aceptar solicitudes desde otros orígenes.
app.use(cors());
//Se Configura body-parser para interpretar el cuerpo de las solicitudes como JSON, útil para procesar datos enviados por clientes.
app.use(bodyParser.json());

const dbConfig = {
  //Se Define un objeto de configuración para conectar a la base de datos MySQL, especificando
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_gestion'
};

// Se Declara una función asíncrona que establece y devuelve una conexión con la base de datos usando mysql.createConnection().
async function connectToDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

// Se Define un endpoint GET en /estudiantes que responde con la lista de estudiantes en formato JSON.
app.get('/estudiantes', async (req, res) => {
  try {
    //Se Crea una conexión a la base de datos usando la función connectToDatabase.
    const connection = await connectToDatabase();
    //Se Ejecuta una consulta SQL para obtener todos los registros de la tabla Estudiante.
    const [rows] = await connection.execute('SELECT * FROM Estudiante');
    // Se Cierra la conexión con la base de datos.
    await connection.end();
    //Se Envía el resultado de la consulta como respuesta en formato JSON.
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Se define un endpoint GET en /pruebas que devuelve todas las pruebas de la base de datos.
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

// Se define un endpoint GET en /preguntas/:pruebaId, que responde con preguntas específicas para una prueba dada (según pruebaId).
app.get('/preguntas/:pruebaId', async (req, res) => {
  //Se extrae el parámetro pruebaId de la URL.
  const { pruebaId } = req.params;
  try {
    const connection = await connectToDatabase();
    //Se ejecuta una consulta para obtener id y orden de las preguntas asociadas a la prueba específica.
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

// Se define un endpoint POST en /resultados que guarda un nuevo resultado en la tabla Resultado.
app.post('/resultados', async (req, res) => {
  //Se extrae los datos necesarios del cuerpo de la solicitud (req.body).
  const { IDEstudiante, IDprueba, IDPregunta, Respuesta } = req.body;
  try {
    const connection = await connectToDatabase();
    //Se inserta un nuevo registro en la tabla Resultado usando los datos de IDEstudiante, IDprueba, IDPregunta y Respuesta.
    const [result] = await connection.execute(
      'INSERT INTO Resultado (IDEstudiante, IDprueba, IDPregunta, Respuesta) VALUES (?, ?, ?, ?)',
      [IDEstudiante, IDprueba, IDPregunta, Respuesta]
    );
    await connection.end();
    //Se envía una respuesta JSON con los datos insertados, incluyendo el insertId del resultado.
    res.status(201).json({ id: result.insertId, IDEstudiante, IDprueba, IDPregunta, Respuesta });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Se define un endpoint GET en /reporte/:IDEstudiante/:IDPrueba que genera un reporte de aciertos de un estudiante en una prueba.
app.get('/reporte/:IDEstudiante/:IDPrueba', async (req, res) => {
  //Se extrae IDEstudiante e IDPrueba de los parámetros de la URL.
  const { IDEstudiante, IDPrueba } = req.params;

  try {
    const connection = await connectToDatabase();

    // Se ejecuta una consulta que compara las respuestas del estudiante con las correctas, agregando un campo acierto que indica si respondió correctamente.
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


// Se inicia el servidor en el puerto 3000.
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
