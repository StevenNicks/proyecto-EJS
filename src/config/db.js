import { createPool } from 'mysql2/promise'
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE } from './config.js'

export const pool = createPool({
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   port: DB_PORT,
   database: DB_DATABASE
});

try {
   const connection = await pool.getConnection();
   console.log('✅ Conectado a la base de datos');
   connection.release();
} catch (error) {
   console.error('❌ Error de conexión:', error);
}
