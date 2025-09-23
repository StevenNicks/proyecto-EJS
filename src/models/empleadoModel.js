import { pool } from '../config/db.js';

const EmpleadoModel = {
   /**
    * Obtiene todos los empleados de la base de datos.
    * @returns {Promise<Array>} - Devuelve una promesa con la lista de empleados.
    */
   getAllEmpleados: async () => {
      const [rows] = await pool.query('SELECT * FROM empleados');
      return rows;
   },
};

export default EmpleadoModel;
