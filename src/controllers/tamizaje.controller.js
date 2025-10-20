import TamizajeModel from '../models/tamizajeModel.js';

/**
 * Renderiza la vista principal de tamizajes.
 * @route GET /tamizajes
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Renderiza la vista 'tamizajes/index' con el título y datos del usuario.
 */
export const renderTamizajes = async (req, res, next) => {
   try {
      res.render("tamizajes/index", {
         title: "Tamizajes",
         user: req.session.user
      });
   } catch (error) {
      next(error);
   }
};

/**
 * Obtiene todos los registros de tamizajes desde la base de datos.
 * @route GET /tamizajes/data
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con la lista de tamizajes o un mensaje de error.
 */
export const getAllTamizajes = async (req, res, next) => {
   try {
      const tamizajes = await TamizajeModel.getAllTamizajes();

      if (!Array.isArray(tamizajes) || tamizajes.length === 0) {
         return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      res.status(200).json({ success: true, data: tamizajes, user: req.session.user });
   } catch (error) {
      next(error);
   }
};

/**
 * Obtiene un tamizaje según su ID.
 * @route GET /tamizajes/:id
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con los datos del tamizaje.
 */
export const getTamizajeById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const tamizaje = await TamizajeModel.getTamizajeById(id);

      if (!tamizaje) {
         return res.status(404).json({ success: false, message: "Tamizaje no encontrado." });
      }

      res.status(200).json({ success: true, data: tamizaje });
   } catch (error) {
      next(error);
   }
};

/**
 * Crea un nuevo tamizaje en la base de datos.
 * @route POST /tamizajes
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el id del nuevo tamizaje o un mensaje de error.
 */
export const createTamizaje = async (req, res, next) => {
   let { nombre, estado } = req.body;

   if (!nombre) {
      return res.status(400).json({ success: false, message: "El campo 'nombre' es obligatorio." });
   }

   try {
      const { id } = await TamizajeModel.createTamizaje({
         nombre: nombre.trim().toUpperCase(),
         estado: estado ?? 1
      });

      return res.status(201).json({
         success: true,
         message: "Tamizaje creado exitosamente.",
         id
      });
   } catch (error) {
      next(error);
   }
};

/**
 * Actualiza los datos de un tamizaje existente según su ID.
 * @route PUT /tamizajes/:id
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el resultado de la actualización.
 */
export const updateTamizajeById = async (req, res, next) => {
   const { id } = req.params;
   let { update_nombre, update_estado } = req.body;

   if (!update_nombre) {
      return res.status(400).json({
         success: false,
         message: "El campo 'nombre del tamiazje' es obligatorio."
      });
   }

   try {
      const result = await TamizajeModel.updateTamizajeById({
         id: parseInt(id),
         nombre: update_nombre.trim().toUpperCase(),
         estado: update_estado ?? 1
      });

      if (result.affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "No se encontró ningún tamizaje con ese ID."
         });
      }

      return res.status(200).json({
         success: true,
         message: "Tamizaje actualizado correctamente."
      });
   } catch (error) {
      next(error);
   }
};

/**
 * Elimina un tamizaje existente según su ID.
 * @route DELETE /tamizajes/:id
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el resultado de la eliminación.
 */
export const deleteTamizajeById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const result = await TamizajeModel.deleteTamizajeById(id);

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
};
