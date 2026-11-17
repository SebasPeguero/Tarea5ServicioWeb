const express = require('express');
const cors = require('cors');
const path = require('path');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servicio web.' });
});

app.listen(PORT, () => {
  console.log(`Servicio web escuchando en http://localhost:${PORT}`);
});

module.exports = app;
