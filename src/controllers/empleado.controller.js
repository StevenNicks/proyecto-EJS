import EmpleadoModel from '../models/empleadoModel.js'

/**
 * Renderiza la vista principal de empleados.
 * @route GET /
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Renderiza la vista 'empleados/index' con el título y datos del usuario.
 */
export const renderEmpleados = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.redirect('/auth/login');
      }
      res.render("empleados/index", { title: "Empleados", user: req.session.user });
   } catch (err) {
      next(err); // lo manda al errorHandler
   }
};

export const getAllEmpleados = async (req, res, next) => {
   try {
      if (!req.session.user) {
         return res.redirect('/auth/login');
      }

      const empleados = await EmpleadoModel.getAllEmpleados();

      if (!Array.isArray(empleados) || empleados.length === 0) {
         return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      res.status(200).json({ success: true, data: empleados, user: req.session.user });

   } catch (err) {
      next(err); // lo manda al errorHandler
   }
}

export const createEmpleado = async (req, res, next) => {
   try {
      return res.status(200).json({
         success: true,
         data: req.body
      });
   } catch (error) {
      next(error);
   }
}