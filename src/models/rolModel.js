import { pool } from '../config/db.js';

const RolModel = {
   /**
   * Cuenta cuántos usuarios hay por cada rol.
   * 
   * @returns {Promise<Array>} Arreglo con numero de usuarios por rol.
   * @throws {Error} Error de base de datos.
   */
   getCountByRol: async () => {
      try {
         // const [rows] = await pool.query(`
         //    SELECT r.nombre, u.rol_id, COUNT(*) AS total
         //    FROM usuarios u
         //    LEFT JOIN roles r ON u.rol_id = r.id
         //    GROUP BY rol_id
         //    ORDER BY rol_id ASC
         // `);
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
         return rows; // Ejemplo: [{ rol: 1, total: 5 }, { rol: 2, total: 10 }]
      } catch (error) {
         console.error("❌ Error al contar usuarios por rol:", error);
         throw error;
      }
   },
};

export default RolModel;
