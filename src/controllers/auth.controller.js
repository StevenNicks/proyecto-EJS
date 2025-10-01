import bcrypt from "bcrypt";
import UsuarioModel from '../models/authModel.js'

// Renderizar vista login
export const renderLogin = (req, res) => {
   res.render("auth/login", { title: "Login", error: null });
};

export const renderRegister = (req, res) => {
   res.render("auth/register", { title: "Registro", error: null });
};

// Procesar login
export const login = async (req, res, next) => {
   const { email, password } = req.body;

   try {
      // Buscar usuario por email
      const user = await UsuarioModel.getUsuarioByEmail(email);

      if (!user) {
         return res.status(200).json({ success: false, message: "Usuario no encontrado" });
      }

      // Comparar contraseña ingresada con la almacenada
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
         return res.status(200).json({ success: false, message: "Contraseña incorrecta" });
      }

      // Guardar usuario en la sesión (solo info mínima)
      req.session.loggedin = true;
      req.session.user = {
         id: user.id,
         email: user.email,
         nombre: user.nombre,
      };

      // Respuesta JSON con datos del usuario
      res.status(200).json({
         success: true,
         message: "Inicio de sesión exitoso",
         user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
         }
      });

   } catch (err) {
      next(err); // Pasar el error al middleware de manejo de errores
   }
}
