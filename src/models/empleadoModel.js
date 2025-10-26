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
   getEmpleadoByCedula: async (cedula) => {
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

   /**
   * Actualiza la información de un empleado existente en la base de datos
   * usando su número de cédula como identificador.
   * 
   * @param {Object} empleado - Objeto con los datos actualizados del empleado.
   * @param {string} empleado.cedula - Número de cédula del empleado.
   * @param {string} empleado.primer_nombre - Primer nombre actualizado.
   * @param {string} empleado.segundo_nombre - Segundo nombre actualizado.
   * @param {string} empleado.primer_apellido - Primer apellido actualizado.
   * @param {string} empleado.segundo_apellido - Segundo apellido actualizado.
   * @returns {Promise<Object>} Objeto con información sobre la actualización (por ejemplo, número de filas afectadas).
   * @throws {Error} Si ocurre un error durante la actualización o si no se encuentra el empleado.
   */
   updateEmpleadoByCedula: async ({ cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido }) => {
      try {
         const [result] = await pool.query(
            `UPDATE empleados 
               SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?
               WHERE cedula = ?`,
            [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula]
         );

         // Devuelve cuántas filas fueron modificadas
         return { affectedRows: result.affectedRows };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Elimina un empleado de la base de datos según su cédula.
    * 
    * @param {string} cedula - Número de cédula del empleado a eliminar.
    * @returns {Promise<Object>} Objeto con el estado y un mensaje del resultado.
    * @throws {Error} Si ocurre un error durante la eliminación.
    */
   deleteEmpleadoByCedula: async (cedula) => {
      try {
         const [result] = await pool.query(
            `DELETE FROM empleados WHERE cedula = ?`,
            [cedula]
         );

         // Retorna un mensaje claro dependiendo del resultado
         return {
            success: result.affectedRows > 0,
            message: result.affectedRows === 0
               ? 'No se encontró el empleado con esa cédula.'
               : 'Empleado eliminado correctamente.'
         };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Obtiene un empleado por nombre (búsqueda más flexible)
    */
   getEmpleadoByNombre: async (nombre) => {
      try {
         // Extraer partes del nombre completo
         const partesNombre = nombre.split(' ');
         const primerNombre = partesNombre[0] || '';
         const primerApellido = partesNombre[partesNombre.length - 2] || ''; // Penúltima parte
         
         const [rows] = await pool.query(
            'SELECT * FROM empleados WHERE primer_nombre = ? AND primer_apellido = ?', 
            [primerNombre, primerApellido]
         );
         return rows[0] || null;
      } catch (error) {
         throw error;
      }
   }
};

export default EmpleadoModel;