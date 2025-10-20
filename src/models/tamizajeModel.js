import { pool } from '../config/db.js';

const TamizajeModel = {
   /**
   * Obtiene todos los tamizajes de la base de datos.
   * 
   * @returns {Promise<Array>} Arreglo con tamizajes.
   * @throws {Error} Error de base de datos.
   */
   getAllTamizajes: async () => {
      try {
         const [rows] = await pool.query('SELECT * FROM tamizajes');
         return rows;
      } catch (error) {
         throw error;
      }
   },

   /**
   * Obtiene un tamizaje por su ID.
   * 
   * @param {number} id - ID del tamizaje.
   * @returns {Promise<Object|null>} Objeto con los datos del tamizaje o null si no existe.
   * @throws {Error} Error de base de datos.
   */
   getTamizajeById: async (id) => {
      try {
         const [rows] = await pool.query('SELECT * FROM tamizajes WHERE id = ?', [id]);
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         throw error;
      }
   },

   /**
   * Inserta un nuevo tamizaje en la base de datos.
   * 
   * @param {Object} tamizaje - Objeto con los datos del tamizaje.
   * @param {string} tamizaje.nombre - Nombre del tamizaje.
   * @param {number} tamizaje.estado - Estado del tamizaje (por defecto 1).
   * @returns {Promise<Object>} Objeto con el ID insertado.
   * @throws {Error} Si ocurre un error durante la inserción.
   */
   createTamizaje: async ({ nombre, estado = 1 }) => {
      try {
         const [result] = await pool.query(
            'INSERT INTO tamizajes (nombre, estado) VALUES (?, ?)',
            [nombre, estado]
         );

         return { id: result.insertId };
      } catch (error) {
         throw error;
      }
   },

   /**
   * Actualiza un tamizaje existente por su ID.
   * 
   * @param {Object} tamizaje - Objeto con los datos actualizados.
   * @param {number} tamizaje.id - ID del tamizaje.
   * @param {string} tamizaje.nombre - Nombre actualizado.
   * @param {number} tamizaje.estado - Estado actualizado.
   * @returns {Promise<Object>} Resultado con las filas afectadas.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
   updateTamizajeById: async ({ id, nombre, estado }) => {
      try {
         const [result] = await pool.query(
            'UPDATE tamizajes SET nombre = ?, estado = ? WHERE id = ?',
            [nombre, estado, id]
         );

         return { affectedRows: result.affectedRows };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Elimina un tamizaje de la base de datos según su ID.
    * 
    * @param {number} id - ID del tamizaje a eliminar.
    * @returns {Promise<Object>} Objeto con el estado y un mensaje del resultado.
    * @throws {Error} Si ocurre un error durante la eliminación.
    */
   deleteTamizajeById: async (id) => {
      try {
         const [result] = await pool.query('DELETE FROM tamizajes WHERE id = ?', [id]);

         return {
            success: result.affectedRows > 0,
            message: result.affectedRows === 0
               ? 'No se encontró el tamizaje con ese ID.'
               : 'Tamizaje eliminado correctamente.'
         };
      } catch (error) {
         throw error;
      }
   }
};

export default TamizajeModel;
