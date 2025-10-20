import ResultadoModel from '../models/resultadosModel.js'
import TamizajeModel from '../models/tamizajeModel.js'

/**
 * Renderiza la vista principal de resultados según el tamizaje.
 * @route GET /resultados/:id
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Renderiza la vista 'resultados/index' con el título y datos de resultados,
 *                 o muestra un mensaje si el tamizaje no existe.
 */
export const renderResultados = async (req, res, next) => {
   const { id } = req.params

   try {
      // Verificar si el tamizaje existe
      const tamizaje = await TamizajeModel.getTamizajeById(id)

      if (!tamizaje) {
         // Si no existe, mostrar mensaje
         return res.status(404).send("El tamizaje no existe")
      }

      // Renderizar la vista con los datos
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
 * @route GET /resultados/data/id
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con la lista de resultados o un mensaje de error.
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