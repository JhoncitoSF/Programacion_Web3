import { Router } from 'express';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';
import { dashboard, ventasPorCategoria, logsAcceso } from '../controllers/adminController.js';

const router = Router();
router.use(verificarToken, soloAdmin);  

router.get('/dashboard',          dashboard);
router.get('/ventas-categoria',   ventasPorCategoria);
router.get('/logs',               logsAcceso);

export default router;
