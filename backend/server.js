const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const serviceAccount = require('./path/to/serviceAccountKey.json'); // Actualiza esta ruta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pinkward-10fe9-default-rtdb.firebaseio.com'
});

const app = express();
app.use(bodyParser.json());

const db = admin.database();

app.get('/movimientos', async (req, res) => {
  const userId = req.query.userId;

  // Verifica si el usuario está logueado (puedes añadir tu lógica de autenticación aquí)
  if (!userId) {
    return res.status(401).send('No autorizado');
  }

  try {
    const ref = db.ref(`/usuarios/${userId}/movimientos`);
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
