import EmpleadoModel from '../models/empleadoModel.js'
import RolModel from '../models/rolModel.js'

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
   let { cedula, primer_nombre, primer_apellido, segundo_nombre, segundo_apellido } = req.body;

   // Valida que  los campos obligatorios estén presentes
   if (!cedula || !primer_nombre || !primer_apellido) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
   }

   // Normalizar campos opcionales vacíos -> null
   segundo_nombre = segundo_nombre?.trim() || null;
   segundo_apellido = segundo_apellido?.trim() || null;

   try {
      // Comprueba si la cedula ya está registrado en la base de datos
      const empleado = await EmpleadoModel.getEmpleadosByCedula(cedula);

      if (empleado) {
         return res.status(409).json({ success: false, message: "La cedula ya está en registrada" });
      }

      // Registra el empleado en la base de datos
      const { userId } = await EmpleadoModel.createEmpleado({
         cedula: cedula.trim(),
         primer_nombre: primer_nombre.trim().toUpperCase(),
         primer_apellido: primer_apellido.trim().toUpperCase(),
         segundo_nombre: segundo_nombre ? segundo_nombre.trim().toUpperCase() : null,
         segundo_apellido: segundo_apellido ? segundo_apellido.trim().toUpperCase() : null
      });

      return res.status(201).json({
         success: true,
         message: 'Empleado registrado exitosamente',
         userId
      });
   } catch (error) {
      next(error);
   }
}

export const countUsuariosByRol = async (req, res, next) => {
   try {
      const data = await RolModel.getCountByRol();

      return res.status(201).json({
         success: true,
         data
      });
   } catch (error) {
      next(error)
   }
}