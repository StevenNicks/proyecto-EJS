import bcrypt from "bcrypt";
import UsuarioModel from '../models/authModel.js'

// Renderizar vista login
export const renderLogin = (req, res) => {
   res.render("login", { title: "Login", error: null });
};

// Procesar login
export const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      // Buscar usuario por email
      const user = await UsuarioModel.getUsuarioByEmail(email);

      if (!user) {
         return res.render("login", {
            title: "Login",
            error: "Usuario no encontrado",
         });
      }

      // Comparar contraseña ingresada con la almacenada
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
         return res.render("login", {
            title: "Login",
            error: "Contraseña incorrecta",
         });
      }

      // Guardar usuario en la sesión (solo info mínima)
      req.session.loggedin = true;
      req.session.user = {
         id: user.id,
         email: user.email,
         nombre: user.nombre,
      };

      // Redirigir a empleados
      return res.redirect("/api/empleados");
   } catch (err) {
      console.error("Error en login:", err);
      return res.status(500).render("login", {
         title: "Login",
         error: "Error en el servidor",
      });
   }
}