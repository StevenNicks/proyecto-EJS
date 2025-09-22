import app from './src/app.js';

// Ruta raíz: redirige automáticamente a /login
app.get('/', (req, res) => {
   res.send("Redirigiendo a login...");
})

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
   console.log(`Servidor corriendo en http://localhost:3000`)
})
