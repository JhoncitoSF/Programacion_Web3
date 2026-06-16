import { validationResult } from 'express-validator';

export const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({
      ok:      false,
      mensaje: 'Error de validación',
      errores: errores.array().map(e => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};
