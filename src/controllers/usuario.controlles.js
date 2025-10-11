import UsuarioModel from '../models/usuarioModel.js'

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
