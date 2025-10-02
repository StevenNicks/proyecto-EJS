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
      // const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      const [rows] = await pool.query(
         `SELECT 
            u.id,
            u.nombre AS usuario,
            u.email,
            u.password,
            e.cedula,
            e.primer_nombre,
            e.segundo_nombre,
            e.primer_apellido,
            e.segundo_apellido,
            r.id AS rol_id,
            r.nombre AS rol
         FROM usuario_empleado_rol uer
            LEFT JOIN usuarios u ON u.id = uer.usuario_id
            LEFT JOIN empleados e ON e.id = uer.empleado_id
            LEFT JOIN roles r ON r.id = uer.rol_id
         WHERE u.email = ?`, [email]
      );

      return rows.length > 0 ? rows[0] : null;
   },
};

export default UsuarioModel;
