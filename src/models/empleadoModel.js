import { pool } from '../config/db.js';

const EmpleadoModel = {
   /**
   * Obtiene todos los empleados de la base de datos.
   * @returns {Promise<Array>} Arreglo con empleados.
   * @throws {Error} Error de base de datos.
   */
   getAllEmpleados: async () => {
      try {
         const [rows] = await pool.query('SELECT * FROM empleados');
         return rows;
      } catch (error) {
         throw error;
      }
   },
};

export default EmpleadoModel;
