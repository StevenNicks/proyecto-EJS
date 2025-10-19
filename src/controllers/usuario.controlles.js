import bcrypt from "bcrypt";
import UsuarioModel from '../models/usuarioModel.js'

export const renderUsuarios = async (req, res, next) => {
   try {
      res.render("usuarios/index", {
         title: "Usuarios",
         user: req.session.user
      });
   } catch (error) {
      next(error);
   }
}

export const getAllUsuarios = async (req, res, next) => {
   try {
      const usuarios = await UsuarioModel.getAllUsuarios();

      if (!Array.isArray(usuarios) || usuarios.length === 0) {
         return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      res.status(200).json({ success: true, data: usuarios, user: req.session.user });
   } catch (error) {
      next(error);
   }
}

export const getUsuarioByEmail = async (req, res, next) => {
   const { email } = req.params; // Extrae el email desde los parámetros de la ruta

   try {
      // Consulta los datos del usuario en el modelo
      const usuario = await UsuarioModel.getUsuarioByEmail(email);

      // Devuelve la respuesta exitosa con los datos del usuario
      res.status(200).json({ success: true, data: usuario });
   } catch (error) {
      next(error);
   }
}

export const createUsuario = async (req, res, next) => {
   let { cedula, email, password } = req.body;

   // Valida campos obligatorios
   if (!cedula || !email || !password) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
   }

   try {
      // Verifica si la cédula ya existe en la base de datos
      const usuario = await UsuarioModel.getUsuarioByEmail(email);

      if (usuario) {
         return res.status(409).json({ success: false, message: "La cedula ya está en registrada" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserta el nuevo usuario
      const { userId } = await UsuarioModel.createUsuario({
         cedula: cedula.trim(),
         email: email.trim().toLowerCase(),
         password: hashedPassword,
      });

      return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', userId });
   } catch (error) {
      next(error);
   }
}

export const deleteUsuarioById = async (req, res, next) => {
   const { id } = req.params;

   try {
      const result = await UsuarioModel.deleteUsuarioById(id);

      // 🔹 Si no se encontró el usuario
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

export const updateUsuarioById = async (req, res, next) => {
   const { id } = req.params; // Cédula enviada por la URL
   let { update_cedula, update_email, update_password, rol } = req.body; // Datos enviados en el cuerpo

   try {
      // 🔹 Validaciones mínimas
      if (!id || !update_cedula || !update_email || !update_password || !rol) {
         return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios."
         });
      }

      const hashedPassword = await bcrypt.hash(update_password, 10);

      // 🔹 Llamada al modelo para actualizar el usuario
      const result = await UsuarioModel.updateUsuarioById({
         usuario_id: id.trim(),
         empleado_cedula: update_cedula.trim(),
         email: update_email.trim().toLowerCase(),
         password: hashedPassword,
         rol_id: rol.trim(),
      });

      // 🔹 Verifica si se actualizó algún registro
      if (result.affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "No se encontró ningún usuario con esa cédula."
         });
      }

      // 🔹 Respuesta exitosa
      return res.status(200).json({
         success: true,
         message: "Usuario actualizado correctamente."
      });

   } catch (error) {
      // Envía el error al manejador global
      next(error);
   }
}

/**
 * Obtiene el conteo de usuarios agrupados por rol.
 * @route GET /usuarios/count-by-rol
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Devuelve una respuesta JSON con el total de usuarios por rol o un mensaje de error.
 */
export const countUsuariosByRol = async (req, res, next) => {
   try {
      const data = await UsuarioModel.getCountByRol();

      return res.status(201).json({
         success: true,
         data
      });
   } catch (error) {
      next(error);
   }
}
