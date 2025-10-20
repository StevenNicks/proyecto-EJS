import { pool } from '../config/db.js';

const ResultadoModel = {
   /**
    * Obtiene todos los resultados asociados a un tamizaje_id.
    * 
    * @param {number} id - ID del tamizaje.
    * @returns {Promise<Array>} Array con los resultados o vacío si no hay ninguno.
    * @throws {Error} Error de base de datos.
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
         return rows; // <-- devolver todo el array, no solo rows[0]
      } catch (error) {
         throw error;
      }
   },

   /**
    * Inserta un nuevo resultado en la base de datos.
    * 
    * @param {Object} resultado - Objeto con los datos del resultado.
    * @param {number} resultado.tamizaje_id
    * @param {string} resultado.empleado_cedula
    * @param {number} resultado.altura
    * @param {number} resultado.peso
    * @param {number} resultado.IMC
    * @param {number} resultado.sistole
    * @param {number} resultado.diastole
    * @param {number} resultado.pulso
    * @param {number} resultado.oxigenacion
    * @param {number} resultado.glucosa
    * @param {number} resultado.temperatura
    * @param {string|null} resultado.observacion
    * @param {number} resultado.estado
    * @returns {Promise<Object>} Objeto con el ID insertado.
    * @throws {Error} Si ocurre un error durante la inserción.
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
    * 
    * @param {Object} resultado - Objeto con los datos actualizados.
    * @param {number} resultado.id
    * @param {number} resultado.tamizaje_id
    * @param {string} resultado.empleado_cedula
    * @param {number} resultado.altura
    * @param {number} resultado.peso
    * @param {number} resultado.IMC
    * @param {number} resultado.sistole
    * @param {number} resultado.diastole
    * @param {number} resultado.pulso
    * @param {number} resultado.oxigenacion
    * @param {number} resultado.glucosa
    * @param {number} resultado.temperatura
    * @param {string|null} resultado.observacion
    * @param {number} resultado.estado
    * @returns {Promise<Object>} Objeto con información sobre filas afectadas.
    * @throws {Error} Si ocurre un error durante la actualización.
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
               SET tamizaje_id = ?, empleado_cedula = ?, altura = ?, peso = ?, IMC = ?, sistole = ?, diastole = ?, pulso = ?, oxigenacion = ?, glucosa = ?, temperatura = ?, observacion = ?, estado = ?
               WHERE id = ?`,
            [tamizaje_id, empleado_cedula, altura, peso, IMC, sistole, diastole, pulso, oxigenacion, glucosa, temperatura, observacion, estado, id]
         );

         return { affectedRows: result.affectedRows };
      } catch (error) {
         throw error;
      }
   },

   /**
    * Elimina un resultado por ID.
    * 
    * @param {number} id - ID del resultado a eliminar.
    * @returns {Promise<Object>} Objeto con estado y mensaje del resultado.
    * @throws {Error} Si ocurre un error durante la eliminación.
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
   }
};

export default ResultadoModel;
