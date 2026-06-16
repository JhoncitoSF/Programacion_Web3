import { Router } from 'express';
import { body }   from 'express-validator';
import { validar } from '../middlewares/validateMiddleware.js';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import { crearPedido, misPedidos, todosLosPedidos } from '../controllers/orderController.js';

const router = Router();

router.post('/',
  verificarToken,
  [ body('items').isArray({ min: 1 }).withMessage('Se requiere al menos un producto') ],
  validar,
  crearPedido
);
router.get('/mis-pedidos', verificarToken, misPedidos);
router.get('/admin/todos', verificarToken, soloAdmin, todosLosPedidos);

export default router;
