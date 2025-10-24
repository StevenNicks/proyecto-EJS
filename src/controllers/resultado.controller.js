import ResultadoModel from '../models/resultadosModel.js'
import TamizajeModel from '../models/tamizajeModel.js'

/**
 * Renderiza la vista principal de resultados según el tamizaje.
 */
export const renderResultados = async (req, res, next) => {
   const { id } = req.params

   try {
      const tamizaje = await TamizajeModel.getTamizajeById(id)

      if (!tamizaje) {
         return res.status(404).send("El tamizaje no existe")
      }

      res.render("resultados/index", {
         title: "Resultados",
         user: req.session.user,
      })
   } catch (error) {
      next(error)
   }
}

/**
 * Obtiene todos los registros de resultados desde la base de datos.
 */
export const getAllResultadosByTamizajeId = async (req, res, next) => {
   const { id } = req.params;

   try {
      const resultados = await ResultadoModel.getAllResultadosByTamizajeId(id);

      if (!Array.isArray(resultados) || resultados.length === 0) {
         return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      res.status(200).json({ success: true, data: resultados, user: req.session.user });
   } catch (error) {
      next(error);
   }
}

/**
 * Crea un nuevo resultado en la base de datos.
 */
export const createResultado = async (req, res, next) => {
   const {
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
      observacion
   } = req.body;

   if (!tamizaje_id || !empleado_cedula || !altura || !peso) {
      return res.status(400).json({ 
         success: false, 
         message: "Los campos tamizaje_id, cédula del empleado, altura y peso son obligatorios." 
      });
   }

   try {
      const { resultadoId } = await ResultadoModel.createResultado({
         tamizaje_id,
         empleado_cedula,
         altura: parseFloat(altura),
         peso: parseFloat(peso),
         IMC: parseFloat(IMC),
         sistole: parseInt(sistole),
         diastole: parseInt(diastole),
         pulso: parseInt(pulso),
         oxigenacion: parseFloat(oxigenacion),
         glucosa: parseFloat(glucosa),
         temperatura: parseFloat(temperatura),
         observacion: observacion || null
      });

      return res.status(201).json({
         success: true,
         message: "Resultado creado exitosamente.",
         id: resultadoId
      });
   } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
         return res.status(400).json({
            success: false,
            message: "La cédula del empleado no está registrada en el sistema."
         });
      }
      
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
         return res.status(400).json({
            success: false,
            message: "Ya existe un resultado para este empleado en el tamizaje seleccionado."
         });
      }
      
      next(error);
   }
}

/**
 * Obtiene un resultado por ID.
 */
export const getResultadoById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const resultado = await ResultadoModel.getResultadoById(id);

      if (!resultado) {
         return res.status(404).json({ 
            success: false, 
            message: "Resultado no encontrado." 
         });
      }

      res.status(200).json({ success: true, data: resultado });
   } catch (error) {
      next(error);
   }
}

/**
 * Actualiza un resultado por ID.
 */
export const updateResultadoById = async (req, res, next) => {
   const { id } = req.params;
   const {
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
      observacion
   } = req.body;

   if (!tamizaje_id || !empleado_cedula || !altura || !peso) {
      return res.status(400).json({ 
         success: false, 
         message: "Los campos tamizaje_id, cédula del empleado, altura y peso son obligatorios." 
      });
   }

   try {
      const result = await ResultadoModel.updateResultadoById({
         id: parseInt(id),
         tamizaje_id,
         empleado_cedula,
         altura: parseFloat(altura),
         peso: parseFloat(peso),
         IMC: parseFloat(IMC),
         sistole: parseInt(sistole),
         diastole: parseInt(diastole),
         pulso: parseInt(pulso),
         oxigenacion: parseFloat(oxigenacion),
         glucosa: parseFloat(glucosa),
         temperatura: parseFloat(temperatura),
         observacion: observacion || null
      });

      if (result.affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "No se encontró el resultado con ese ID."
         });
      }

      return res.status(200).json({
         success: true,
         message: "Resultado actualizado correctamente."
      });
   } catch (error) {
      next(error);
   }
}

/**
 * Elimina un resultado por ID.
 */
export const deleteResultadoById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const result = await ResultadoModel.deleteResultadoById(id);

      if (!result.success) {
         return res.status(404).json({
            success: false,
            message: result.message
         });
      }

      return res.status(200).json({
         success: true,
         message: result.message
      });
   } catch (error) {
      next(error);
   }
}