import { pool } from '../config/db.js';

const EmpleadoModel = {
   /**
   * Obtiene todos los empleados de la base de datos.
   * 
   * @returns {Promise<Array>} Arreglo con empleados.
   * @throws {Error} Error de base de datos.
   */
   getAllEmpleados: async () => {
      try {
         const [rows] = await pool.query('SELECT * FROM empleados');
         return rows;   // Devuelve los registros obtenidos
      } catch (error) {
         throw error;
      }
   },

   /**
   * Obtiene un empleado por cedula (pueden ser null).
   * 
   * @param {string} cedula - Cedula del empleado.
   * @returns {Promise<Object|null>} Objeto con con los datos del empleado, o null si no existe.
   * @throws {Error} Error de base de datos.
   */
   getEmpleadosByCedula: async (cedula) => {
      try {
         const [rows] = await pool.query(`SELECT * FROM empleados WHERE cedula = ?`, [cedula]);
         return rows.length > 0 ? rows[0] : null;   // Devuelve los registros obtenidos
      } catch (error) {
         throw error;
      }
   },

   /**
   * Inserta un nuevo empleado en la base de datos.
   * 
   * @param {Object} empleado - Objeto con los datos del empleado.
   * @param {string} empleado.cedula - Número de cédula del empleado.
   * @param {string} empleado.primer_nombre - Primer nombre.
   * @param {string} empleado.segundo_nombre - Segundo nombre.
   * @param {string} empleado.primer_apellido - Primer apellido.
   * @param {string} empleado.segundo_apellido - Segundo apellido.
   * @returns {Promise<Object>} Objeto con el ID insertado.
   * @throws {Error} Si ocurre un error durante la inserción.
   */
   createEmpleado: async ({ cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido }) => {
      try {
         const [result] = await pool.query(
            `INSERT INTO empleados (cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido) 
               VALUES (?, ?, ?, ?, ?)`,
            [cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido]
         );

         // Devuelve el ID del nuevo registro insertado
         return { userId: result.insertId };
      } catch (error) {
         throw error;
      }
   },

   deleteEmpleadoById: async (id) => {
      try {
         const [result] = await pool.query(
            `DELETE FROM empleados WHERE id = ?`,
            [id]
         );

         // result.affectedRows indica cuántas filas se eliminaron
         return {
            success: result.affectedRows > 0,
            message: result.affectedRows > 0
               ? 'Empleado eliminado correctamente'
               : 'No se encontró el empleado con ese ID'
         };
      } catch (error) {
         throw error;
      }
   }
};

export default EmpleadoModel;