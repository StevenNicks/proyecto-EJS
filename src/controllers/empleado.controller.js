import EmpleadoModel from '../models/empleadoModel.js'

/**
 * Renderiza la vista principal de empleados.
 * @route GET /empleados
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Renderiza la vista 'empleados/index' con el título y datos del usuario.
 */
export const renderEmpleados = async (req, res, next) => {
   try {
      res.render("empleados/index", {
         title: "Empleados",
         user: req.session.user
      });
   } catch (error) {
      next(error);
   }
}

/**
 * Obtiene todos los registros de empleados desde la base de datos.
 * @route GET /empleados/data
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con la lista de empleados o un mensaje de error.
 */
export const getAllEmpleados = async (req, res, next) => {
   try {
      const empleados = await EmpleadoModel.getAllEmpleados();

      if (!Array.isArray(empleados) || empleados.length === 0) {
         return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      res.status(200).json({ success: true, data: empleados, user: req.session.user });
   } catch (error) {
      next(error);
   }
}

/**
 * Obtiene un empleado según su número de cédula.
 * @route GET /empleados/:cedula
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con los datos del empleado.
 */
export const getEmpleadoByCedula = async (req, res, next) => {
   const { cedula } = req.params; // Extrae la cédula desde los parámetros de la ruta

   try {
      // Consulta los datos del empleado en el modelo
      const empleado = await EmpleadoModel.getEmpleadoByCedula(cedula);

      // Devuelve la respuesta exitosa con los datos del empleado
      res.status(200).json({ success: true, data: empleado });
   } catch (error) {
      next(error);
   }
}

/**
 * Crea un nuevo empleado en la base de datos.
 * @route POST /empleados
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el id del nuevo empleado o un mensaje de error.
 */
export const createEmpleado = async (req, res, next) => {
   let { cedula, primer_nombre, primer_apellido, segundo_nombre, segundo_apellido } = req.body;

   // Valida campos obligatorios
   if (!cedula || !primer_nombre || !primer_apellido) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
   }

   // Si el dato existe quita los espacios sino dato = NULL
   segundo_nombre = segundo_nombre?.trim() || null;
   segundo_apellido = segundo_apellido?.trim() || null;

   try {
      // Verifica si la cédula ya existe en la base de datos
      const empleado = await EmpleadoModel.getEmpleadoByCedula(cedula);

      if (empleado) {
         return res.status(409).json({ success: false, message: "La cedula ya está en registrada" });
      }

      // Inserta el nuevo empleado
      const { userId } = await EmpleadoModel.createEmpleado({
         cedula: cedula.trim(),
         primer_nombre: primer_nombre.trim().toUpperCase(),
         segundo_nombre: segundo_nombre ? segundo_nombre.trim().toUpperCase() : null,
         primer_apellido: primer_apellido.trim().toUpperCase(),
         segundo_apellido: segundo_apellido ? segundo_apellido.trim().toUpperCase() : null
      });

      return res.status(201).json({ success: true, message: 'Empleado registrado exitosamente', userId });
   } catch (error) {
      next(error);
   }
}

/**
 * Actualiza los datos de un empleado existente según su cédula.
 * @route PUT /empleados/:cedula
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el resultado de la actualización.
 */
export const updateEmpleadoByCedula = async (req, res, next) => {
   const { cedula } = req.params; // Cédula enviada por la URL
   let { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = req.body; // Datos enviados en el cuerpo

   try {
      // 🔹 Validaciones mínimas
      if (!cedula || !primer_nombre || !primer_apellido) {
         return res.status(400).json({
            success: false,
            message: "La cédula, primer nombre y primer apellido son obligatorios."
         });
      }

      // Si el dato existe quita los espacios sino dato = NULL
      segundo_nombre = segundo_nombre?.trim() || null;
      segundo_apellido = segundo_apellido?.trim() || null;

      // 🔹 Llamada al modelo para actualizar el empleado
      const result = await EmpleadoModel.updateEmpleadoByCedula({
         cedula: cedula.trim(),
         primer_nombre: primer_nombre.trim().toUpperCase(),
         segundo_nombre: segundo_nombre ? segundo_nombre.trim().toUpperCase() : null,
         primer_apellido: primer_apellido.trim().toUpperCase(),
         segundo_apellido: segundo_apellido ? segundo_apellido.trim().toUpperCase() : null
      });

      // 🔹 Verifica si se actualizó algún registro
      if (result.affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "No se encontró ningún empleado con esa cédula."
         });
      }

      // 🔹 Respuesta exitosa
      return res.status(200).json({
         success: true,
         message: "Empleado actualizado correctamente."
      });

   } catch (error) {
      // Envía el error al manejador global
      next(error);
   }
}

/**
 * Elimina un empleado existente según su cédula.
 * @route DELETE /empleados/:cedula
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el resultado de la eliminación.
 */
export const deleteEmpleadoByCedula = async (req, res, next) => {
   const { cedula } = req.params;

   try {
      const result = await EmpleadoModel.deleteEmpleadoByCedula(cedula);

      // 🔹 Si no se encontró el empleado
      if (!result.success) {
         return res.status(404).json({
            success: false,
            message: result.message
         });
      }

      // 🔹 Eliminación exitosa
      return res.status(200).json({
         success: true,
         message: result.message
      });

   } catch (error) {
      next(error);
   }
};