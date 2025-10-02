import EmpleadoModel from '../models/empleadoModel.js'

export const renderEmpleados = async (req, res) => {
   try {
      const empleados = await EmpleadoModel.getAllEmpleados();
      // res.json(empleados[0]);
      res.render("empleados/index", { title: "Empleados", user: req.session.user, empleados: empleados[0] });
   } catch (error) {
      next(err); // lo manda al errorHandler
   }
};