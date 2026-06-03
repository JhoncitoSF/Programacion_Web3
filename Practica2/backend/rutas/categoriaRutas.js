import {
  obtCategorias,
  obtCategoriaPorID,
  insertaCategoria,
  actualizaCategoria,
  eliminaCategoria
} from '../controladores/categoriaControlador.js';

import express from 'express';

const rutas = express.Router();

rutas.get('/', obtCategorias);           // Ejercicio 2
rutas.get('/:id', obtCategoriaPorID);    // Ejercicio 3
rutas.post('/', insertaCategoria);       // Ejercicio 1
rutas.patch('/:id', actualizaCategoria); // Ejercicio 4
rutas.delete('/:id', eliminaCategoria);  // Ejercicio 5

export default rutas;
