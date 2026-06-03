import {
  obtTodo,
  obtCategoria,
  inserta,
  actualiza,
  elimina
} from '../modelos/categoriaModelo.js';

import { check, validationResult } from 'express-validator';

// Ejercicio 2: GET /categorias
export const obtCategorias = async (req, res) => {
  const categorias = await obtTodo();
  res.status(200).json(categorias);
};

// Ejercicio 3: GET /categorias/:id
export const obtCategoriaPorID = async (req, res) => {
  const id = req.params.id;
  const categoria = await obtCategoria(id);
  if (!categoria) {
    return res.status(404).json({ mensaje: 'Categoría no encontrada' });
  }
  res.status(200).json(categoria);
};

// Ejercicio 1: POST /categorias
export const insertaCategoria = async (req, res) => {
  await check('nombre')
    .notEmpty().withMessage('El nombre no puede ir vacío')
    .run(req);
  await check('descripcion')
    .notEmpty().withMessage('La descripción no puede ir vacía')
    .run(req);

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ mensaje: errores.array() });
  }

  const nuevaCategoria = await inserta(req.body);
  res.status(201).json(nuevaCategoria);
};

// Ejercicio 4: PATCH /categorias/:id
export const actualizaCategoria = async (req, res) => {
  await check('nombre')
    .notEmpty().withMessage('El nombre no puede ir vacío')
    .run(req);
  await check('descripcion')
    .notEmpty().withMessage('La descripción no puede ir vacía')
    .run(req);

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ mensaje: errores.array() });
  }

  const categoriaActualizada = await actualiza(req.params.id, req.body);
  res.status(200).json(categoriaActualizada);
};

// Ejercicio 5: DELETE /categorias/:id
export const eliminaCategoria = async (req, res) => {
  const resultado = await elimina(req.params.id);
  res.status(200).json(resultado);
};
