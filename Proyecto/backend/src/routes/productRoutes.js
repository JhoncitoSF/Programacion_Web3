import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validar }            from '../middlewares/validateMiddleware.js';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  listarTodosAdmin,
  reactivarProducto,
} from '../controllers/productController.js';

const router = Router();

const validarProducto = [
  body('nombre').trim().notEmpty().withMessage('Nombre obligatorio')
    .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
  body('categoria').trim().notEmpty().withMessage('Categoría obligatoria'),
  body('subtipo').trim().notEmpty().withMessage('Subtipo obligatorio'),
  body('descripcion').trim().notEmpty().withMessage('Descripción obligatoria'),
  body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser un entero positivo o cero'),
];

//Rutas PÚBLICAS
router.get('/',    listarProductos);         
router.get('/:id', [                          // GET /api/products/:id
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
], validar, obtenerProducto);

//Rutas ADMIN
router.get('/admin/todos',
  verificarToken, soloAdmin,
  listarTodosAdmin                            // GET  /api/products/admin/todos
);
router.post('/',
  verificarToken, soloAdmin,
  validarProducto, validar,
  crearProducto                               // POST /api/products
);
router.put('/:id',
  verificarToken, soloAdmin,
  [param('id').isInt({ min: 1 })],
  validarProducto, validar,
  actualizarProducto                          // PUT  /api/products/:id
);
router.delete('/:id',
  verificarToken, soloAdmin,
  [param('id').isInt({ min: 1 }), validar],
  eliminarProducto                            // DELETE /api/products/:id (lógico)
);
router.patch('/:id/reactivar',
  verificarToken, soloAdmin,
  [param('id').isInt({ min: 1 }), validar],
  reactivarProducto                           // PATCH  /api/products/:id/reactivar
);

export default router;
