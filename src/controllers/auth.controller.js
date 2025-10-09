import bcrypt from "bcrypt";
import UsuarioModel from '../models/usuarioModel.js'
import EmpleadoModel from '../models/empleadoModel.js'
import qrcode from "qrcode-terminal";

/**
* Renderiza la vista del formulario de inicio de sesión.
*
* @function renderLogin
* @param {object} req - Objeto de solicitud HTTP (Express).
* @param {object} res - Objeto de respuesta HTTP (Express) utilizado para renderizar la vista.
*
* @description
* Carga la plantilla `auth/login` y establece el título de la página.
*/
export const renderLogin = (req, res) => {
   res.render("auth/login", { title: "Login" });
};

/**
* Controlador para el inicio de sesión de usuarios.
*
* @async
* @function login
* @param {object} req - Objeto de solicitud HTTP (Express), debe contener `email` y `password` en `req.body`.
* @param {object} res - Objeto de respuesta HTTP (Express), utilizado para enviar la respuesta JSON.
* @param {function} next - Middleware personalizado para manejar errores.
*
* @description
* Este controlador:
*  1. Busca el usuario en la base de datos a partir del email.
*  2. Verifica la contraseña ingresada comparándola con el hash almacenado usando `bcrypt`.
*  3. Si las credenciales son correctas, guarda datos mínimos en la sesión (`req.session`) y responde con JSON.
*  4. Si ocurre un error, lo delega al middleware centralizado de errores mediante `next(err)`.
*/
export const login = async (req, res, next) => {
   const { email, password } = req.body;

   // Valida que todos los campos obligatorios estén presentes
   if (!email || !password) {
      return res.status(400).json({
         success: false,
         message: "Email y contraseña son obligatorios"
      });
   }

   try {
      // 1. Buscar usuario por email
      const user = await UsuarioModel.getUsuarioByEmail(email);

      if (!user) {
         // Si el usuario no existe, responder sin éxito
         return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      // 2. Comparar contraseña ingresada con la almacenada (hash bcrypt)
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
         // Si la contraseña no coincide, responder sin éxito
         return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }

      // 3. Guardar usuario en la sesión (solo información mínima)
      req.session.loggedin = true;
      req.session.user = {
         id: user.id,
         nombre: user.usuario,
         email: user.email,
         rol: user.rol_id,
      };

      // // Imprime el QR en consola (Node)
      qrcode.generate("https://es.pinterest.com/pin/1013521091132324688/", { small: true });

      // 4. Respuesta JSON con los datos del usuario autenticado
      res.status(200).json({
         success: true,
         message: "Inicio de sesión exitoso",
         // user: user
      });

   } catch (err) {
      // 5. Pasar cualquier error inesperado al middleware de errores
      next(err);
   }
}

/**
* Renderiza la vista del formulario de registro de usuarios.
*
* @function renderRegister
* @param {object} req - Objeto de solicitud HTTP (Express).
* @param {object} res - Objeto de respuesta HTTP (Express) utilizado para renderizar la vista.
*
* @description
* Carga la plantilla `auth/register` y establece el título de la página en "Registro".
*/
export const renderRegister = (req, res) => {
   res.render("auth/register", { title: "Registro" });
};

/**
* Registra un nuevo usuario en el sistema.
*
* @function register
* @async
* @param {object} req - Objeto de solicitud HTTP (Express) con los datos del usuario (cedula, email, password, confirmPassword).
* @param {object} res - Objeto de respuesta HTTP (Express) para enviar el resultado de la operación.
* @param {function} next - Middleware de Express para manejar errores.
* @returns {Promise<void>} Responde con un JSON indicando el éxito o fallo del registro.
*/
export const register = async (req, res, next) => {
   const { cedula, email, password, confirmPassword } = req.body;

   // Valida que todos los campos obligatorios estén presentes
   if (!cedula || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
   }

   // Verifica que las contraseñas coincidan
   if (password !== confirmPassword) {
      return res.status(422).json({ success: false, message: "Las contraseñas no coinciden" });
   }

   try {
      // Comprueba si la cedula ya está registrado en la base de datos
      const empleado = await EmpleadoModel.getEmpleadosByCedula(cedula);

      if (!empleado) {
         return res.status(404).json({ success: false, message: "Empleado no registrado" });
      }

      // Comprueba si el email ya está registrado en la base de datos
      const user = await UsuarioModel.getUsuarioByEmail(email);

      if (user) {
         return res.status(409).json({ success: false, message: "El email ya está en uso" });
      }

      // Hashea la contraseña para almacenarla de forma segura
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { cedula, email, password: hashedPassword };

      // Registra el usuario en la base de datos
      const { userId } = await UsuarioModel.createUsuario(newUser);
      return res.status(201).json({
         success: true,
         message: 'Usuario registrado exitosamente',
         userId
      });
   } catch (error) {
      next(error);
   }
}