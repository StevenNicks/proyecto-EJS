import { pool } from '../config/db.js';

const RolModel = {
   /**
   * Obtiene todos los roles de la base de datos.
   * 
   * @returns {Promise<Array>} Arreglo con roles.
   * @throws {Error} Error de base de datos.
   */
   getAllRoles: async () => {
      try {
         const [rows] = await pool.query('SELECT * FROM roles');
         return rows;   // Devuelve los registros obtenidos
      } catch (error) {
         throw error;
      }
   },
};

export default RolModel;
