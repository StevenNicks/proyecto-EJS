import { pool } from '../config/db.js';

const UsuarioModel = {
   /**
   * Obtiene todos los usuarios de la base de datos.
   * 
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
   * 
   * @param {string} email - Email del usuario.
   * @returns {Promise<Object|null>} Objeto con con con los datos del empleado, o null si no existe.
   * @throws {Error} Error de base de datos.
   */
   getUsuarioByEmail: async (email) => {
      try {
         const [rows] = await pool.query(
            `SELECT u.*, 
               CONCAT(
                  COALESCE(e.primer_nombre, ''), ' ',
                  COALESCE(e.segundo_nombre, ''), ' ',
                  COALESCE(e.primer_apellido, ''), ' ',
                  COALESCE(e.segundo_apellido, '')
               ) AS usuario
               FROM usuarios u
               LEFT JOIN empleados e ON u.empleado_cedula = e.cedula
               WHERE email = ?`,
            [email]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         throw error;
      }
   },

   /**
   * Crea un usuario en la base de datos.
   * 
   * @param {Object} usuario - Datos del usuario.
   * @param {string} usuario.nombre - Nombre completo.
   * @param {string} usuario.email - Email único.
   * @param {string} usuario.password - Contraseña hasheada.
   * @returns {Promise<Object>} Objeto con el ID del usuario creado.
   * @throws {Error} Error de base de datos (ej. email duplicado).
   * @note Validaciones en controlador; rol_id usa DEFAULT 2.
   */
   createUsuario: async ({ cedula, email, password }) => {
      try {
         const [result] = await pool.query(
            `INSERT INTO usuarios (empleado_cedula, email, password) VALUES (?, ?, ?)`,
            [cedula, email, password]
         );

         // Devuelve el ID del nuevo registro insertado
         return { userId: result.insertId };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Actualiza los datos de un usuario existente en la base de datos.
    * 
    * @param {Object} usuario - Objeto con los datos actualizados del usuario.
    * @param {number} usuario.usuario_id - ID del usuario a actualizar.
    * @param {string} usuario.empleado_cedula - Nueva cédula del empleado asociado.
    * @param {string} usuario.email - Nuevo correo electrónico.
    * @param {string} usuario.password - Nueva contraseña (ya encriptada, si aplica).
    * @param {number} usuario.rol_id - ID del nuevo rol asignado.
    * @returns {Promise<Object>} Objeto con el estado de la operación y un mensaje descriptivo.
    * @throws {Error} Si ocurre un error durante la actualización.
    */
   updateUsuarioById: async ({ usuario_id, empleado_cedula, email, password, rol_id }) => {
      try {
         // ...
      } catch (error) {
         throw error;
      }
   },

   /**
    * Elimina un usuario de la base de datos según su ID.
    * 
    * @param {number} usuario_id - ID del usuario que se desea eliminar.
    * @returns {Promise<Object>} Objeto con el estado de la operación y un mensaje descriptivo.
    * @throws {Error} Si ocurre un error durante la eliminación.
    */
   deleteUsuarioById: async (usuario_id) => {
      try {
         // ...
      } catch (error) {
         throw error;
      }
   },

   /**
    * Obtiene un conteo general de usuarios agrupados por rol.
    * 
    * Realiza una consulta SQL que:
    * - Cuenta el total de empleados registrados.
    * - Cuenta cuántos usuarios tienen rol de administrador.
    * - Cuenta cuántos usuarios tienen rol de supervisor.
    * 
    * Si un empleado tiene múltiples roles, se le asigna prioridad:
    *  1️⃣ Admin > 3️⃣ Supervisor > 2️⃣ Empleado.
    * 
    * @returns {Promise<Array>} Un arreglo con un único objeto que contiene:
    *    {
    *       total_empleados: number,
    *       total_admins: number,
    *       total_supervisores: number
    *    }
    * @throws {Error} Si ocurre un error en la base de datos.
    */
   getCountByRol: async () => {
      try {
         const [rows] = await pool.query(`
            SELECT
               (SELECT COUNT(*) FROM empleados) AS total_empleados,
               SUM(CASE WHEN t.assigned_role = 1 THEN 1 ELSE 0 END)   AS total_admins,
               SUM(CASE WHEN t.assigned_role = 3 THEN 1 ELSE 0 END)   AS total_supervisores
            FROM (
               SELECT empleado_cedula,
                  CASE
                     WHEN SUM(CASE WHEN rol_id = 1 THEN 1 ELSE 0 END) > 0 THEN 1  -- si tiene admin
                     WHEN SUM(CASE WHEN rol_id = 3 THEN 1 ELSE 0 END) > 0 THEN 3  -- si NO tiene admin pero tiene supervisor
                     WHEN SUM(CASE WHEN rol_id = 2 THEN 1 ELSE 0 END) > 0 THEN 2  -- si solo tiene empleado
                     ELSE NULL
                  END AS assigned_role
               FROM usuarios
            GROUP BY empleado_cedula
            ) AS t;
         `);
         return rows;
      } catch (error) {
         console.error("❌ Error al contar usuarios por rol:", error);
         throw error;
      }
   },
};

export default UsuarioModel;