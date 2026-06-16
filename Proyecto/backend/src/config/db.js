import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'jazzprostudio_db',
  charset:            'utf8mb4',

  // --- Configuración del Pool ---
  connectionLimit:    10,      
  queueLimit:         0,       
  waitForConnections: true,    

  // --- Seguridad y estabilidad ---
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,

  // --- Tipado automático ---
  typeCast: true,              
  dateStrings: false,         
  timezone: 'local',
});


export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('  MySQL conectado — base de datos:', process.env.DB_NAME || 'jazzprostudio_db');
    conn.release();
  } catch (err) {
    console.error('  Error al conectar con MySQL:', err.message);
    console.error('    Verifica que XAMPP esté activo y el .env sea correcto.');
    process.exit(1);
  }
};

export default pool;
