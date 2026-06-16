import express          from 'express';
import cors             from 'cors';
import helmet           from 'helmet';
import morgan           from 'morgan';
import dotenv           from 'dotenv';
import { testConnection } from './src/config/db.js';

import authRoutes       from './src/routes/authRoutes.js';
import productRoutes    from './src/routes/productRoutes.js';
import orderRoutes      from './src/routes/orderRoutes.js';
import adminRoutes      from './src/routes/adminRoutes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES GLOBALES
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ============================================================
// RUTAS
// ============================================================
app.get('/api/health', (_req, res) => res.json({
  status: 'OK', mensaje: 'JazzProStudio API activa', hora: new Date().toISOString(),
}));

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/admin',    adminRoutes);

// 404
app.use((_req, res) => res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' }));

// Error global
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err.message);
  res.status(err.status || 500).json({ ok: false, mensaje: err.message || 'Error interno' });
});

// ARRANQUE
const iniciarServidor = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n  JazzProStudio API — http://localhost:${PORT}`);
    console.log(`\n  Endpoints disponibles:`);
    console.log(`    GET  /api/health`);
    console.log(`    POST /api/auth/captcha-gen`);
    console.log(`    POST /api/auth/registro`);
    console.log(`    POST /api/auth/login`);
    console.log(`    POST /api/auth/logout`);
    console.log(`    GET  /api/products`);
    console.log(`    GET  /api/products/:id`);
    console.log(`    POST /api/products           [ADMIN]`);
    console.log(`    PUT  /api/products/:id       [ADMIN]`);
    console.log(`    DELETE /api/products/:id     [ADMIN - lógico]`);
    console.log(`    POST /api/orders`);
    console.log(`    GET  /api/orders/mis-pedidos`);
    console.log(`    GET  /api/admin/dashboard    [ADMIN]`);
    console.log(`    GET  /api/admin/ventas-categoria [ADMIN]`);
    console.log(`    GET  /api/admin/logs         [ADMIN]\n`);
  });
};

iniciarServidor();
