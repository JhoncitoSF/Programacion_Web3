import pool from '../config/db.js';

// POST /api/orders
export const crearPedido = async (req, res) => {
  const { items }   = req.body;
  const usuarioId   = req.usuario.id;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'El pedido no tiene productos' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let totalPago  = 0;
    const detalles = [];

    for (const item of items) {
      const { productoId, cantidad } = item;

      if (!productoId || cantidad < 1) {
        await conn.rollback();
        return res.status(400).json({ ok: false, mensaje: 'Item inválido en el pedido' });
      }

      const [filas] = await conn.execute(
        'SELECT id, precio, stock FROM productos WHERE id = ? AND activo = 1',
        [productoId]
      );
      if (filas.length === 0) {
        await conn.rollback();
        return res.status(404).json({ ok: false, mensaje: `Producto ${productoId} no encontrado` });
      }

      const { precio, stock } = filas[0];
      if (stock < cantidad) {
        await conn.rollback();
        return res.status(400).json({ ok: false, mensaje: `Stock insuficiente para producto ${productoId}` });
      }

      totalPago += precio * cantidad;
      detalles.push({ productoId, cantidad, precioUnitario: precio });
    }

    // Insertar pedido
    const [pedidoRes] = await conn.execute(
      'INSERT INTO pedidos (usuario_id, total_pago, estado) VALUES (?, ?, ?)',
      [usuarioId, totalPago.toFixed(2), 'PAGADO']
    );
    const pedidoId = pedidoRes.insertId;

    // Insertar detalles y descontar stock
    for (const { productoId, cantidad, precioUnitario } of detalles) {
      await conn.execute(
        'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, productoId, cantidad, precioUnitario]
      );
      await conn.execute(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [cantidad, productoId]
      );
    }

    await conn.commit();
    return res.status(201).json({
      ok:      true,
      mensaje: 'Pedido creado correctamente',
      pedidoId,
      total:   totalPago.toFixed(2),
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// GET /api/orders/mis-pedidos
export const misPedidos = async (req, res) => {
  const usuarioId = req.usuario.id;
  const [pedidos] = await pool.execute(`
    SELECT id, fecha, total_pago, estado
    FROM pedidos
    WHERE usuario_id = ?
    ORDER BY fecha DESC
  `, [usuarioId]);

  if (pedidos.length === 0) {
    return res.json({ ok: true, pedidos: [] });
  }
  const pedidoIds   = pedidos.map(p => p.id);
  const placeholders = pedidoIds.map(() => '?').join(',');

  const [detalles] = await pool.execute(`
    SELECT dp.pedido_id, p.nombre AS producto, p.categoria,
           dp.cantidad, dp.precio_unitario AS precio
    FROM detalles_pedido dp
    JOIN productos p ON dp.producto_id = p.id
    WHERE dp.pedido_id IN (${placeholders})
    ORDER BY dp.pedido_id DESC
  `, pedidoIds);
  const pedidosConItems = pedidos.map(pedido => ({
    ...pedido,
    items: detalles.filter(d => d.pedido_id === pedido.id),
  }));

  return res.json({ ok: true, pedidos: pedidosConItems });
};

// GET /api/orders/admin/todos  (ADMIN)
export const todosLosPedidos = async (_req, res) => {
  const [pedidos] = await pool.execute(`
    SELECT pe.id, u.nombre AS cliente, u.email,
           pe.fecha, pe.total_pago, pe.estado
    FROM pedidos pe
    JOIN usuarios u ON pe.usuario_id = u.id
    ORDER BY pe.fecha DESC
    LIMIT 200
  `);
  return res.json({ ok: true, pedidos });
};
