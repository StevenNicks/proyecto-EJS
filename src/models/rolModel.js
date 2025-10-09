import { pool } from '../config/db.js';

const RolModel = {
   /**
   * Cuenta cuántos usuarios hay por cada rol.
   * 
   * @returns {Promise<Array>} Arreglo con numero de usuarios por rol.
   * @throws {Error} Error de base de datos.
   */
   getCountByRol: async () => {
      try {
         const [rows] = await pool.query(`
            SELECT r.nombre, u.rol_id, COUNT(*) AS total
            FROM usuarios u
            LEFT JOIN roles r ON u.rol_id = r.id
            GROUP BY rol_id
            ORDER BY rol_id ASC
         `);
         return rows; // Ejemplo: [{ rol: 1, total: 5 }, { rol: 2, total: 10 }]
      } catch (error) {
         console.error("❌ Error al contar usuarios por rol:", error);
         throw error;
      }
   },
};

export default RolModel;
