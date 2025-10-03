import { pool } from '../config/db.js';

const UsuarioModel = {
   /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns {Promise<Array<Object>>} Arreglo con usuarios
   * @throws {Error} Error de base de datos.
   */
   getAllUsuarios: async () => {
      try {
         const [rows] = await pool.query('SELECT * FROM usuarios');
         return rows;
      } catch (error) {
         throw error;
      }
   },

   /**
   * Obtiene un usuario por email, con datos de rol y empleado (pueden ser null).
   * @param {string} email - Email del usuario.
   * @returns {Promise<Object|null>} Objeto con id, usuario, email, password, rol_id, rol, y datos de empleado, o null si no existe.
   * @throws {Error} Error de base de datos.
   */
   getUsuarioByEmail: async (email) => {
      try {
         const [rows] = await pool.query(
            `SELECT 
               u.id,
               u.nombre AS usuario,
               u.email,
               u.password,
               u.rol_id,
               r.nombre AS rol,
               e.cedula,
               e.primer_nombre,
               e.segundo_nombre,
               e.primer_apellido,
               e.segundo_apellido
               FROM usuarios u
               LEFT JOIN roles r ON u.rol_id = r.id
               LEFT JOIN usuario_empleado ue ON u.id = ue.usuario_id
               LEFT JOIN empleados e ON ue.empleado_id = e.id
               WHERE u.email = ?`,
            [email]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         throw error;
      }
   },

   /**
   * Crea un usuario en la base de datos.
   * @param {Object} params - Datos del usuario.
   * @param {string} params.nombre - Nombre completo.
   * @param {string} params.email - Email único.
   * @param {string} params.password - Contraseña hasheada.
   * @returns {Promise<Object>} Objeto con el ID del usuario creado.
   * @throws {Error} Error de base de datos (ej. email duplicado).
   * @note Validaciones en controlador; rol_id usa DEFAULT 2.
   */
   createUsuario: async ({ nombre, email, password }) => {
      try {
         const [result] = await pool.query(
            `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
            [nombre, email, password]
         );
         return { userId: result.insertId };
      } catch (error) {
         throw error;
      }
   },

   /**
   * Actualiza el empleado_id en la tabla usuario_empleado para un usuario específico.
   * @param {Object} params - Datos para la actualización.
   * @param {number} params.usuario_id - ID del usuario.
   * @param {number} params.empleado_id - Nuevo ID del empleado.
   * @returns {Promise<Object>} Promesa que resuelve a un objeto con el número de filas afectadas.
   * @throws {Error} Lanza un error de base de datos (ej. registro no encontrado o clave foránea inválida).
   */
   updateEmpleadoId: async ({ usuario_id, empleado_id }) => {
      try {
         const [result] = await pool.query(
            `UPDATE usuario_empleado SET empleado_id = ? WHERE usuario_id = ?`,
            [empleado_id, usuario_id]
         );
         return { affectedRows: result.affectedRows };
      } catch (error) {
         throw error;
      }
   },
};

export default UsuarioModel;