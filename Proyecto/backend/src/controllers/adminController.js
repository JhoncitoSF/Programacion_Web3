import pool from '../config/db.js';

// GET /api/admin/dashboard — KPIs del mes actual
export const dashboard = async (_req, res) => {
  const [[ingresos]]   = await pool.execute(`
    SELECT COALESCE(SUM(total_pago),0) AS ingresos_mes,
           COUNT(*) AS pedidos_mes
    FROM pedidos
    WHERE estado = 'PAGADO'
      AND MONTH(fecha) = MONTH(CURRENT_DATE())
      AND YEAR(fecha)  = YEAR(CURRENT_DATE())
  `);
  const [[usuarios]]   = await pool.execute(
    'SELECT COUNT(*) AS total FROM usuarios WHERE activo = 1'
  );
  const [[productos]]  = await pool.execute(
    'SELECT COUNT(*) AS total FROM productos WHERE activo = 1'
  );

  return res.json({
    ok: true,
    kpis: {
      ingresos_mes:  parseFloat(ingresos.ingresos_mes),
      pedidos_mes:   ingresos.pedidos_mes,
      total_usuarios: usuarios.total,
      total_productos: productos.total,
    },
  });
};

// GET /api/admin/ventas-categoria — para gráfico Recharts/Chart.js
export const ventasPorCategoria = async (_req, res) => {
  const [filas] = await pool.execute(`
    SELECT p.categoria,
           SUM(dp.cantidad)                      AS unidades,
           SUM(dp.cantidad * dp.precio_unitario) AS ingresos
    FROM detalles_pedido dp
    JOIN productos p ON dp.producto_id = p.id
    JOIN pedidos   pe ON dp.pedido_id  = pe.id
    WHERE pe.estado = 'PAGADO'
    GROUP BY p.categoria
    ORDER BY ingresos DESC
  `);
  return res.json({ ok: true, datos: filas });
};

// GET /api/admin/logs — últimos 100 eventos de acceso
export const logsAcceso = async (_req, res) => {
  const [logs] = await pool.execute(`
    SELECT la.id, u.nombre, u.email, la.ip,
           la.evento, la.browser, la.fecha_hora
    FROM logs_acceso la
    JOIN usuarios u ON la.usuario_id = u.id
    ORDER BY la.fecha_hora DESC
    LIMIT 100
  `);
  return res.json({ ok: true, logs });
};
