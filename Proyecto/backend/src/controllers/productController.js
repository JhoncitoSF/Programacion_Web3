import pool from '../config/db.js';

// GET /api/products
export const listarProductos = async (req, res) => {
  const { categoria, subtipo, buscar, pagina = 1, limite = 12 } = req.query;

  let condiciones = ['p.activo = 1'];
  const params    = [];

  if (categoria) {
    condiciones.push('p.categoria = ?');
    params.push(categoria);
  }
  if (subtipo) {
    condiciones.push('p.subtipo = ?');
    params.push(subtipo);
  }
  if (buscar) {
    condiciones.push('(p.nombre LIKE ? OR p.descripcion LIKE ?)');
    params.push(`%${buscar}%`, `%${buscar}%`);
  }

  const where      = condiciones.join(' AND ');
  const offset     = (parseInt(pagina) - 1) * parseInt(limite);
  const sqlTotal   = `SELECT COUNT(*) AS total FROM productos p WHERE ${where}`;
  const sqlData    = `
    SELECT id, nombre, categoria, subtipo, descripcion,
           precio, stock, imagen_url
    FROM productos p
    WHERE ${where}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  const [[{ total }]] = await pool.execute(sqlTotal, params);
  const [productos]   = await pool.execute(sqlData, [...params, parseInt(limite), offset]);

  return res.json({
    ok: true,
    total,
    pagina:    parseInt(pagina),
    limite:    parseInt(limite),
    productos,
  });
};

// GET /api/products/:id
export const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  const [filas] = await pool.execute(
    'SELECT * FROM productos WHERE id = ? AND activo = 1',
    [id]
  );
  if (filas.length === 0) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
  }
  return res.json({ ok: true, producto: filas[0] });
};

// POST /api/products
export const crearProducto = async (req, res) => {
  const { nombre, categoria, subtipo, descripcion, precio, stock, imagen_url } = req.body;

  const sql = `
    INSERT INTO productos (nombre, categoria, subtipo, descripcion, precio, stock, imagen_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [nombre, categoria, subtipo, descripcion, parseFloat(precio), parseInt(stock), imagen_url || ''];
  const [resultado] = await pool.execute(sql, params);

  return res.status(201).json({
    ok:      true,
    mensaje: 'Producto creado correctamente',
    id:      resultado.insertId,
  });
};

// PUT /api/products/:id
// ADMIN — actualizar producto existente
export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, subtipo, descripcion, precio, stock, imagen_url } = req.body;
  const [existe] = await pool.execute(
    'SELECT id FROM productos WHERE id = ? AND activo = 1',
    [id]
  );
  if (existe.length === 0) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
  }

  const sql = `
    UPDATE productos
    SET nombre = ?, categoria = ?, subtipo = ?, descripcion = ?,
        precio = ?, stock = ?, imagen_url = ?
    WHERE id = ?
  `;
  const params = [nombre, categoria, subtipo, descripcion,
                  parseFloat(precio), parseInt(stock), imagen_url || '', id];
  await pool.execute(sql, params);

  return res.json({ ok: true, mensaje: 'Producto actualizado correctamente' });
};


// DELETE /api/products/:id
// ADMIN — eliminación LÓGICA: activo = 0
export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  const [existe] = await pool.execute(
    'SELECT id FROM productos WHERE id = ? AND activo = 1',
    [id]
  );
  if (existe.length === 0) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado o ya inactivo' });
  }

  await pool.execute('UPDATE productos SET activo = 0 WHERE id = ?', [id]);

  return res.json({ ok: true, mensaje: 'Producto desactivado (eliminación lógica)' });
};

// GET /api/products/admin/todos
// ADMIN — lista TODOS los productos (activos e inactivos)
export const listarTodosAdmin = async (_req, res) => {
  const [productos] = await pool.execute(`
    SELECT id, nombre, categoria, subtipo, precio, stock, activo, creado_en
    FROM productos
    ORDER BY activo DESC, id DESC
  `);
  return res.json({ ok: true, productos });
};

// PATCH /api/products/:id/reactivar
// ADMIN — reactiva un producto previamente desactivado
export const reactivarProducto = async (req, res) => {
  const { id } = req.params;
  const [existe] = await pool.execute(
    'SELECT id FROM productos WHERE id = ? AND activo = 0',
    [id]
  );
  if (existe.length === 0) {
    return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado o ya activo' });
  }
  await pool.execute('UPDATE productos SET activo = 1 WHERE id = ?', [id]);
  return res.json({ ok: true, mensaje: 'Producto reactivado correctamente' });
};
