import { pool } from '../config/db.js';

const UsuarioModel = {
   /**
    * Obtiene todos los usuarios de la base de datos.
    * @returns {Promise<Array>} - Devuelve una promesa con la lista de usuarios.
    */
   getAllUsuarios: async () => {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      return rows;
   },

   /**
    * Obtiene un usuario por su email.
    * @param {string} email - Email del usuario.
    * @returns {Promise<Object>|null} - Devuelve una promesa con el usuario encontrado o null.
    */
   getUsuarioByEmail: async (email) => {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows.length > 0 ? rows[0] : null;
   },
};

export default UsuarioModel;
