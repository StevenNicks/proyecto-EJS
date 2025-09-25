import EmpleadoModel from '../models/empleadoModel.js'

export const getAllEmpleados = async (req, res, next) => {
   try {
      const empleados = await EmpleadoModel.getAllEmpleados();
      // res.json(empleados[0]);
      res.render("dashboard/index", { title: "Empleados", empleados: empleados[0] });
   } catch (err) {
      next(err); // lo manda al errorHandler
   }
}