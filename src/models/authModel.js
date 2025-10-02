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
    * Obtiene un usuario junto con su información de empleado y rol a partir de su email.
    *
    * @param {string} email - Email del usuario a buscar.
    * @returns {Promise<Object|null>} - Promesa que resuelve en un objeto con los campos:
    *   - id: ID del usuario
    *   - usuario: nombre del usuario
    *   - email: email del usuario
    *   - password: contraseña hasheada
    *   - cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido: datos del empleado
    *   - rol_id: ID del rol
    *   - rol: nombre del rol
    *   Devuelve `null` si no se encuentra ningún usuario.
    */
   getUsuarioByEmail: async (email) => {
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

   createUsuario: async ({ nombre, email, password }) => {
      const connection = await pool.getConnection(); // usamos transacción
      try {
         await connection.beginTransaction();

         // 1️. Insertar en usuarios
         const [result] = await connection.query(
            `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
            [nombre, email, password]
         );
         const userId = result.insertId;

         // 2️. Insertar en usuario_empleado_rol
         await connection.query(
            `INSERT INTO usuario_empleado_rol (usuario_id, empleado_id, rol_id) VALUES (?, ?, ?)`,
            [userId, null, 2]
         );

         await connection.commit();
         return { userId }; // retornamos el ID del usuario

      } catch (error) {
         await connection.rollback();  // ⚠️ si falla algo aquí, se deshace todo
         throw error;
      } finally {
         connection.release();
      }
   }
};

export default UsuarioModel;
// return result;