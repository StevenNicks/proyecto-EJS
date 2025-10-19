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
