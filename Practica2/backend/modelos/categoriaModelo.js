import { pool } from '../config/bd.js';

export const obtTodo = async () => {
  const [resultado] = await pool.query('SELECT * FROM categorias');
  return resultado;
};

export const obtCategoria = async (id) => {
  const [categoria] = await pool.query(
    'SELECT * FROM categorias WHERE id = ?', [id]
  );
  if (!categoria[0]) return null;

  const [productos] = await pool.query(
    'SELECT * FROM productos WHERE categoriaId = ?', [id]
  );

  return { ...categoria[0], productos };
};

export const inserta = async (categoria) => {
  const { nombre, descripcion } = categoria;
  await pool.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion]
  );
  return { mensaje: 'Categoría registrada correctamente' };
};


export const actualiza = async (id, categoria) => {
  const { nombre, descripcion } = categoria;
  await pool.query(
    'UPDATE categorias SET nombre = ?, descripcion = ?, updatedAt = NOW() WHERE id = ?',
    [nombre, descripcion, id]
  );
  return { mensaje: 'Categoría actualizada correctamente' };
};


export const elimina = async (id) => {
  await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
  return { mensaje: 'Categoría y sus productos eliminados correctamente' };
};
