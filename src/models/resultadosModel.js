import { pool } from '../config/db.js';

const ResultadoModel = {
   /**
    * Obtiene todos los resultados asociados a un tamizaje_id.
    */
   getAllResultadosByTamizajeId: async (id) => {
      try {
         const [rows] = await pool.query(
            `SELECT r.*, 
                  e.primer_nombre,
                  e.segundo_nombre,
                  e.primer_apellido,
                  e.segundo_apellido
            FROM resultados r 
            LEFT JOIN empleados e ON r.empleado_cedula = e.cedula 
            WHERE tamizaje_id = ?`,
            [id]
         );
         return rows;
      } catch (error) {
         throw error;
      }
   },

   /**
    * Obtiene un resultado por ID.
    */
   getResultadoById: async (id) => {
      try {
         const [rows] = await pool.query(
            `SELECT r.*, 
                    e.primer_nombre,
                    e.segundo_nombre,
                    e.primer_apellido,
                    e.segundo_apellido
             FROM resultados r 
             LEFT JOIN empleados e ON r.empleado_cedula = e.cedula 
             WHERE r.id = ?`,
            [id]
         );
         return rows[0] || null;
      } catch (error) {
         throw error;
      }
   },

   /**
    * Obtiene los resultados de un empleado específico en un tamizaje.
    */
   getResultadosByEmpleadoAndTamizaje: async (empleadoCedula, tamizajeId) => {
      try {
         const [rows] = await pool.query(
            `SELECT r.*, 
                    e.primer_nombre,
                    e.segundo_nombre,
                    e.primer_apellido,
                    e.segundo_apellido
             FROM resultados r 
             LEFT JOIN empleados e ON r.empleado_cedula = e.cedula 
             WHERE r.tamizaje_id = ? AND r.empleado_cedula = ?`,
            [tamizajeId, empleadoCedula]
         );
         return rows;
      } catch (error) {
         throw error;
      }
   },

   /**
    * Inserta un nuevo resultado en la base de datos.
    */
   createResultado: async ({
      tamizaje_id,
      empleado_cedula,
      altura,
      peso,
      IMC,
      sistole,
      diastole,
      pulso,
      oxigenacion,
      glucosa,
      temperatura,
      observacion = null,
      estado = 1
   }) => {
      try {
         const [result] = await pool.query(
            `INSERT INTO resultados 
               (tamizaje_id, empleado_cedula, altura, peso, IMC, sistole, diastole, pulso, oxigenacion, glucosa, temperatura, observacion, estado) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [tamizaje_id, empleado_cedula, altura, peso, IMC, sistole, diastole, pulso, oxigenacion, glucosa, temperatura, observacion, estado]
         );

         return { resultadoId: result.insertId };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Actualiza un resultado existente por ID.
    */
   updateResultadoById: async ({
      id,
      tamizaje_id,
      empleado_cedula,
      altura,
      peso,
      IMC,
      sistole,
      diastole,
      pulso,
      oxigenacion,
      glucosa,
      temperatura,
      observacion = null,
      estado = 1
   }) => {
      try {
         const [result] = await pool.query(
            `UPDATE resultados
             SET tamizaje_id = ?, empleado_cedula = ?, altura = ?, peso = ?, IMC = ?, 
                 sistole = ?, diastole = ?, pulso = ?, oxigenacion = ?, glucosa = ?, 
                 temperatura = ?, observacion = ?, estado = ?
             WHERE id = ?`,
            [tamizaje_id, empleado_cedula, altura, peso, IMC, sistole, diastole,
               pulso, oxigenacion, glucosa, temperatura, observacion, estado, id]
         );

         return { affectedRows: result.affectedRows };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Elimina un resultado por ID.
    */
   deleteResultadoById: async (id) => {
      try {
         const [result] = await pool.query('DELETE FROM resultados WHERE id = ?', [id]);
         return {
            success: result.affectedRows > 0,
            message: result.affectedRows === 0
               ? 'No se encontró el resultado con ese ID.'
               : 'Resultado eliminado correctamente.'
         };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Obtiene todos los resultados de un empleado por cédula CON información del tamizaje
    */
   getTodosResultadosPorEmpleado: async (empleadoCedula) => {
      try {
         const [rows] = await pool.query(
            `SELECT r.*, 
       t.nombre AS tamizaje_nombre,
       t.id AS tamizaje_id,
       e.primer_nombre,
       e.segundo_nombre, 
       e.primer_apellido,
       e.segundo_apellido
    FROM resultados r 
    INNER JOIN tamizajes t ON r.tamizaje_id = t.id 
    INNER JOIN empleados e ON r.empleado_cedula = e.cedula
    WHERE r.empleado_cedula = ?`,
            [empleadoCedula]
         );
         return rows;
      } catch (error) {
         throw error;
      }
   }
};

export default ResultadoModel;