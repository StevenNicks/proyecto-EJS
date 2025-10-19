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

   /**
    * Obtiene un rol por su id desde la base de datos.
    * 
    * @param {string} id  - id del rol.
    * @returns {Promise<Objet|null>} Objeto con con los datos del rol, o null si no existe.
    * @throws {Error} Error de base de datos.
    */
   getRolById: async (id) => {
      try {
         const [rows] = await pool.query(`SELECT * FROM roles WHERE id = ?`, [id]);
         return rows.length > 0 ? rows[0] : null;   // Devuelve los registros obtenidos
      } catch (error) {
         throw error;
      }
   },

   /**
    * Inserta un nuevo rol en la base de datos.
    * 
    * @param {Object} rol - Objeto con los datos del rol.
    * @param {Object} rol.nombre - Nombre corto del rol.
    * @param {Object} rol.descripcion - Descripcion del rol.
    * @returns {Promise<Object>} Objeto con el ID insertado.
    * @throws {Error} Si ocurre un error durante la inserción.
    * @returns 
    */
   createRol: async ({ nombre, descripcion }) => {
      try {
         const [result] = await pool.query(
            `INSERT INTO roles (nombre, descripcion) 
               VALUES (?, ?)`,
            [nombre, descripcion]
         );

         // Devuelve el ID del nuevo registro insertado
         return { userId: result.insertId };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Actualiza la información de un rol existente en la base de datos
    * usando su número de id como identificador.
    * 
    * @param {Object} rol - Objeto con los datos actualizados del rol.
    * @param {string} rol.id - id del rol.
    * @param {string} rol.nombre - Nombre del rol actualizado.
    * @param {string} rol.descripcion - Descripcion del rol actualizado.
    * @returns 
    */
   updateRolById: async ({ id, nombre, descripcion }) => {
      try {
         const [result] = await pool.query(
            `UPDATE roles 
               SET nombre = ?, descripcion = ?
               WHERE id = ?`,
            [nombre, descripcion, id]
         );

         // Devuelve cuántas filas fueron modificadas
         return { affectedRows: result.affectedRows };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Elimina un rol de la base de datos según su id.
    * 
    * @param {string} id - Número de id del rol a eliminar.
    * @returns {Promise<Object>} Objeto con el estado y un mensaje del resultado.
    * @throws {Error} Si ocurre un error durante la eliminación.
    */
   deleteRolById: async (id) => {
      try {
         const [result] = await pool.query(
            `DELETE FROM roles WHERE id = ?`,
            [id]
         );

         // Retorna un mensaje claro dependiendo del resultado
         return {
            success: result.affectedRows > 0,
            message: result.affectedRows === 0
               ? 'No se encontró el rol con ese id.'
               : 'rol eliminado correctamente.'
         };
      } catch (error) {
         throw error;
      }
   }
};

export default RolModel;
