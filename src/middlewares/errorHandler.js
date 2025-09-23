// Middleware para manejo centralizado de errores
export function errorHandler(err, req, res, next) {
   // Si no se ha definido el código de estado, usar 500 (Internal Server Error)
   const statusCode = err.status || err.statusCode || 500;
   const isDev = process.env.NODE_ENV === 'production';

   console.error(`[ERROR]: ${err.message}`); // Mostrar el error en consola para debug
   if (isDev) console.error(err.stack);      // Depuración, localizar el error en el código
   
   res.status(statusCode).json({
      success: false,
      error: {
         message: isDev ? err.message : 'Ocurrió un error en el servidor',
      },
   });
}
