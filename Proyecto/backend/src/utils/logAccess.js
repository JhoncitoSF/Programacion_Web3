import pool from '../config/db.js';

/**
 * @param {number} usuarioId
 * @param {string} ip
 * @param {'INGRESO'|'SALIDA'} evento
 * @param {string} browser  — valor del header User-Agent
 */
export const registrarLog = async (usuarioId, ip, evento, browser = '') => {
  const sql = `
    INSERT INTO logs_acceso (usuario_id, ip, evento, browser)
    VALUES (?, ?, ?, ?)
  `;
  const params = [usuarioId, ip, evento, browser.slice(0, 255)];
  try {
    await pool.execute(sql, params);
  } catch (err) {
    console.error('Advertencia — Error al registrar log:', err.message);
  }
};
