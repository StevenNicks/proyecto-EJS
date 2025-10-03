import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js'

/**
 * Middleware de autenticación basado en JWT.
 * 
 * - Extrae el token JWT de las cookies de la petición.
 * - Verifica y decodifica el token utilizando la clave secreta configurada.
 * - Si el token es válido, añade la información del usuario a `req.user`.
 * - Si el token es inválido o no existe, responde con un error 401 (No autorizado).
 * 
 * @param {Object} req - Objeto de solicitud (Express Request).
 * @param {Object} res - Objeto de respuesta (Express Response).
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const authenticateJWT = (req, res, next) => {
   // Extraer el token de las cookies enviadas por el cliente
   const token = req.cookies.jwt;

   // Si no existe token en la cookie, denegar acceso
   if (!token) {
      return res.status(401).json({
         success: false,
         message: "No autorizado: Token no proporcionado"
      });
   }

   try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Guardar los datos del usuario en el objeto req para uso posterior
      req.user = decoded;

      // Continuar con el siguiente middleware o controlador
      next();
   } catch (err) {
      // Si el token es inválido o ha expirado, devolver error 401
      return res.status(401).json({
         success: false,
         message: "No autorizado: Token inválido"
      });
   }
};
