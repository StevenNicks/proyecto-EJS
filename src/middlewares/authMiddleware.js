// authMiddleware.js
/**
 * Middleware de autenticación.
 * 
 * Este middleware verifica la sesión del usuario incluye una propiedad `loggedin`.
 * Si el usuario está autenticado (`loggedin` es verdadero), permite el acceso al siguiente middleware o ruta.
 * Si no, devuelve un error 401 (Unauthorized).
 *
 * NOTA: Este middleware NO utiliza JWT ni otros tokens; depende
 * exclusivamente de la sesión del servidor.
 * 
 * @param {object} req - Objeto de solicitud (request) de Express.
 * @param {object} res - Objeto de respuesta (response) de Express.
 * @param {function} next - Función para pasar al siguiente middleware o ruta.
 */
export function authMiddleware(req, res, next) {
   if (req.session.loggedin) {
      // Usuario autenticado, continuar con la siguiente función/middleware o ruta
      next();
   } else {
      // Usuario no autenticado, redireccionar al login
      res.redirect("auth/login");
   }
}
