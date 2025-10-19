import RolModel from '../models/rolModel.js'

export const renderRoles = async (req, res, next) => {
   try {
      res.render("roles/index", {
         title: "roles",
         user: req.session.user
      });
   } catch (error) {
      next(error);
   }
}

export const getAllRoles = async (req, res, next) => {
   try {
      const roles = await RolModel.getAllRoles();

      if (!Array.isArray(roles) || roles.length === 0) {
         return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      res.status(200).json({ success: true, data: roles, user: req.session.user });
   } catch (error) {
      next(error);
   }
}

export const getRolById = async (req, res, next) => {
   const { id } = req.params; // Extrae el id desde los parámetros de la ruta

   try {
      // Consulta los datos del rol en el modelo
      const rol = await RolModel.getRolById(id);

      // Devuelve la respuesta exitosa con los datos del rol
      res.status(200).json({ success: true, data: rol });
   } catch (error) {
      next(error);
   }
}

export const createRol = async (req, res, next) => {
   let { nombre, descripcion } = req.body;

   // Valida campos obligatorios
   if (!nombre || !descripcion) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
   }

   try {
      // Inserta el nuevo rol
      const { userId } = await RolModel.createRol({
         nombre: nombre.trim().toLowerCase(),
         descripcion: descripcion.trim().charAt(0).toUpperCase() + descripcion.trim().slice(1).toLowerCase(),
      });

      return res.status(201).json({ success: true, message: 'Rol registrado exitosamente', userId });
   } catch (error) {
      next(error);
   }
}

export const updateRolById = async (req, res, next) => {
   const { id } = req.params; // Cédula enviada por la URL
   let { nombre, descripcion } = req.body; // Datos enviados en el cuerpo

   try {
      // 🔹 Validaciones mínimas
      if (!nombre || !descripcion) {
         return res.status(400).json({
            success: false,
            message: "El nombre y descripcion son obligatorios."
         });
      }

      // 🔹 Llamada al modelo para actualizar el rol
      const result = await RolModel.updateRolById({
         id: id.trim(),
         nombre: nombre.trim().toLowerCase(),
         descripcion: descripcion.trim().charAt(0).toUpperCase() + descripcion.trim().slice(1).toLowerCase(),
      });

      // 🔹 Verifica si se actualizó algún registro
      if (result.affectedRows === 0) {
         return res.status(404).json({
            success: false,
            message: "No se encontró ningún rol con ese id."
         });
      }

      // 🔹 Respuesta exitosa
      return res.status(200).json({
         success: true,
         message: "Rol actualizado correctamente."
      });

   } catch (error) {
      // Envía el error al manejador global
      next(error);
   }
}


export const deleteRolById = async (req, res, next) => {
   try {
      const { id } = req.params;

      const result = await RolModel.deleteRolById(id);

      // 🔹 Si no se encontró el rol
      if (!result.success) {
         return res.status(404).json({
            success: false,
            message: result.message
         });
      }

      // 🔹 Eliminación exitosa
      return res.status(200).json({
         success: true,
         message: result.message
      });

   } catch (error) {
      next(error);
   }
};