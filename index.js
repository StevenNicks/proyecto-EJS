import app from './src/app.js';
import { PORT } from './src/config/config.js'

// Iniciar servidor en el puerto 3000
app.listen(PORT, () => {
   console.log(`>>> Server running on port:${PORT} >>> http://localhost:${PORT}/api/`);
})
