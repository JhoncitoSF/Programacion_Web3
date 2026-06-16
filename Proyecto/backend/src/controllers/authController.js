import bcrypt         from 'bcrypt';
import jwt            from 'jsonwebtoken';
import pool           from '../config/db.js';
import { registrarLog } from '../utils/logAccess.js';

// ---------- helpers ----------
const obtenerIP = (req) =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

// POST /api/auth/captcha-gen
export const generarCaptcha = (_req, res) => {
  const a       = Math.floor(Math.random() * 9) + 1;
  const b       = Math.floor(Math.random() * 9) + 1;
  const suma    = a + b;
  const token   = jwt.sign({ suma }, process.env.JWT_SECRET, { expiresIn: '5m' });

  res.json({
    ok:        true,
    pregunta:  `¿Cuánto es ${a} + ${b}?`,
    token,          
  });
};


// POST /api/auth/registro
export const registro = async (req, res) => {
  const { nombre, email, password, captchaToken, captchaRespuesta } = req.body;

  //Verificar CAPTCHA
  try {
    const { suma } = jwt.verify(captchaToken, process.env.JWT_SECRET);
    if (parseInt(captchaRespuesta) !== suma) {
      return res.status(400).json({ ok: false, mensaje: 'CAPTCHA incorrecto' });
    }
  } catch {
    return res.status(400).json({ ok: false, mensaje: 'CAPTCHA expirado o inválido' });
  }

  //Verificar duplicado de email
  const [filas] = await pool.execute(
    'SELECT id FROM usuarios WHERE email = ?',
    [email]
  );
  if (filas.length > 0) {
    return res.status(409).json({ ok: false, mensaje: 'El correo ya está registrado' });
  }

  //Encriptar contraseña con bcrypt
  const rounds      = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  const hashPassword = await bcrypt.hash(password, rounds);

  const sqlInsert = `
    INSERT INTO usuarios (nombre, email, password, rol)
    VALUES (?, ?, ?, 'CLIENTE')
  `;
  const [resultado] = await pool.execute(sqlInsert, [nombre, email, hashPassword]);

  const token = generarToken({ id: resultado.insertId, nombre, email, rol: 'CLIENTE' });

  return res.status(201).json({
    ok:      true,
    mensaje: 'Usuario registrado correctamente',
    token,
    usuario: { id: resultado.insertId, nombre, email, rol: 'CLIENTE' },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password, captchaToken, captchaRespuesta } = req.body;
  const ip      = obtenerIP(req);
  const browser = req.headers['user-agent'] || '';

  // --- Verificar CAPTCHA ---
  try {
    const { suma } = jwt.verify(captchaToken, process.env.JWT_SECRET);
    if (parseInt(captchaRespuesta) !== suma) {
      return res.status(400).json({ ok: false, mensaje: 'CAPTCHA incorrecto' });
    }
  } catch {
    return res.status(400).json({ ok: false, mensaje: 'CAPTCHA expirado o inválido' });
  }

  // --- Buscar usuario activo ---
  const [filas] = await pool.execute(
    'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ? AND activo = 1',
    [email]
  );

  if (filas.length === 0) {
    return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
  }

  const { password: hashGuardado, ...usuarioDatos } = filas[0];

  // --- Comparar contraseña ---
  const coincide = await bcrypt.compare(password, hashGuardado);
  if (!coincide) {
    return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
  }

  // --- Log de INGRESO automático ---
  await registrarLog(usuarioDatos.id, ip, 'INGRESO', browser);
  const token = generarToken(usuarioDatos);
  return res.json({
    ok:      true,
    mensaje: 'Inicio de sesión exitoso',
    token,
    usuario: usuarioDatos,
  });
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  const ip      = obtenerIP(req);
  const browser = req.headers['user-agent'] || '';
  await registrarLog(req.usuario.id, ip, 'SALIDA', browser);
  return res.json({ ok: true, mensaje: 'Sesión cerrada correctamente' });
};


export const perfil = async (req, res) => {
  const [filas] = await pool.execute(
    'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?',
    [req.usuario.id]
  );
  if (filas.length === 0) {
    return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
  }
  return res.json({ ok: true, usuario: filas[0] });
};
