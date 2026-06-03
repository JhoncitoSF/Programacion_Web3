import express from 'express';
import categoriaRutas from './rutas/categoriaRutas.js';

const app = express();

app.use(express.json());

app.use('/categorias', categoriaRutas);

const PUERTO = 3001;
app.listen(PUERTO, () => {
  console.log(`Servidor en http://localhost:${PUERTO}`);
});
