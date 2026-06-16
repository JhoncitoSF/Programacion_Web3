import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;  
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
};

export const soloAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ ok: false, mensaje: 'Acceso denegado — Solo administradores' });
  }
  next();
};
