import EmpleadoModel from '../models/empleadoModel.js'
import ResultadosModel from '../models/resultadosModel.js';

/**
 * Renderiza la vista principal de empleados.
 * @route GET /empleados
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
 */
export const getEmpleadoByCedula = async (req, res, next) => {
   const { cedula } = req.params;

   try {
      const empleado = await EmpleadoModel.getEmpleadoByCedula(cedula);
      res.status(200).json({ success: true, data: empleado });
   } catch (error) {
      next(error);
   }
}

/**
 * Crea un nuevo empleado en la base de datos.
 * @route POST /empleados
 */
export const createEmpleado = async (req, res, next) => {
   let { cedula, primer_nombre, primer_apellido, segundo_nombre, segundo_apellido } = req.body;

   if (!cedula || !primer_nombre || !primer_apellido) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
   }

   segundo_nombre = segundo_nombre?.trim() || null;
   segundo_apellido = segundo_apellido?.trim() || null;

   try {
      const empleado = await EmpleadoModel.getEmpleadoByCedula(cedula);

      if (empleado) {
         return res.status(409).json({ success: false, message: "La cedula ya está en registrada" });
      }

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
 */
export const updateEmpleadoByCedula = async (req, res, next) => {
   const { cedula } = req.params;
   let { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = req.body;

   try {
      if (!cedula || !primer_nombre || !primer_apellido) {
         return res.status(400).json({
            success: false,
            message: "La cédula, primer nombre y primer apellido son obligatorios."
         });
      }

      segundo_nombre = segundo_nombre?.trim() || null;
      segundo_apellido = segundo_apellido?.trim() || null;

      const result = await EmpleadoModel.updateEmpleadoByCedula({
         cedula: cedula.trim(),
         primer_nombre: primer_nombre.trim().toUpperCase(),
         segundo_nombre: segundo_nombre ? segundo_nombre.trim().toUpperCase() : null,
         primer_apellido: primer_apellido.trim().toUpperCase(),
         segundo_apellido: segundo_apellido ? segundo_apellido.trim().toUpperCase() : null
      });

      if (result.affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "No se encontró ningún empleado con esa cédula."
         });
      }

      return res.status(200).json({
         success: true,
         message: "Empleado actualizado correctamente."
      });

   } catch (error) {
      next(error);
   }
}

/**
 * Elimina un empleado existente según su cédula.
 * @route DELETE /empleados/:cedula
 */
export const deleteEmpleadoByCedula = async (req, res, next) => {
   const { cedula } = req.params;

   try {
      const result = await EmpleadoModel.deleteEmpleadoByCedula(cedula);

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

/**
 * Obtiene los resultados del empleado logueado
 * @route GET /empleados/mis-resultados
 */
export const getMisResultados = async (req, res, next) => {
   try {
      const user = req.session.user;
      
      console.log('🔍 DEBUG - Datos COMPLETOS del usuario:', JSON.stringify(user, null, 2));
      
      if (user.rol !== 2) {
         console.log('❌ ERROR - Rol incorrecto, debe ser 2 (empleado)');
         return res.status(403).json({ 
            success: false, 
            message: "No tienes permisos para acceder a estos resultados." 
         });
      }

      // ✅ SOLUCIÓN DEFINITIVA: Buscar empleado por NOMBRE
      const empleado = await EmpleadoModel.getEmpleadoByNombre(user.nombre);
      
      if (!empleado || !empleado.cedula) {
         console.log('❌ ERROR - No se encontró empleado con nombre:', user.nombre);
         return res.status(403).json({ 
            success: false, 
            message: "No se encontró información del empleado." 
         });
      }

      console.log('✅ DEBUG - Empleado encontrado:', empleado);
      console.log('✅ DEBUG - Buscando resultados para cédula:', empleado.cedula);
      
      const resultados = await ResultadosModel.getTodosResultadosPorEmpleado(empleado.cedula);

      console.log('✅ DEBUG - Resultados encontrados:', resultados.length, 'registros');

      if (!Array.isArray(resultados) || resultados.length === 0) {
         return res.status(404).json({ 
            success: true, 
            data: [], 
            message: 'No se encontraron resultados para mostrar.' 
         });
      }

      res.status(200).json({ success: true, data: resultados });
   } catch (error) {
      console.log('❌ ERROR en getMisResultados:', error);
      next(error);
   }
}