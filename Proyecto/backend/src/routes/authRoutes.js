import { Router }       from 'express';
import { body }         from 'express-validator';
import { validar }      from '../middlewares/validateMiddleware.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import {
  generarCaptcha,
  registro,
  login,
  logout,
  perfil,
} from '../controllers/authController.js';

const router = Router();

// GET  /api/auth/captcha-gen   — genera pregunta CAPTCHA
router.get('/captcha-gen', generarCaptcha);

// POST /api/auth/registro
router.post('/registro',
  [
    body('nombre')
      .trim().notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 100 }).withMessage('Nombre: 2–100 caracteres'),
    body('email')
      .trim().notEmpty().withMessage('El email es obligatorio')
      .isEmail().withMessage('Email no válido')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
      .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
      .matches(/[0-9]/).withMessage('Debe contener al menos un número')
      .matches(/[!@#$%^&*]/).withMessage('Debe contener al menos un símbolo (!@#$%^&*)'),
    body('captchaToken').notEmpty().withMessage('CAPTCHA token requerido'),
    body('captchaRespuesta').notEmpty().withMessage('Respuesta CAPTCHA requerida'),
  ],
  validar,
  registro
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').trim().notEmpty().isEmail().withMessage('Email no válido').normalizeEmail(),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    body('captchaToken').notEmpty().withMessage('CAPTCHA token requerido'),
    body('captchaRespuesta').notEmpty().withMessage('Respuesta CAPTCHA requerida'),
  ],
  validar,
  login
);

// POST /api/auth/logout  (requiere JWT)
router.post('/logout', verificarToken, logout);

// GET  /api/auth/perfil  (requiere JWT)
router.get('/perfil', verificarToken, perfil);

export default router;
