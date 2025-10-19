export const renderTamizajes = async (req, res, next) => {
   try {
      res.render("tamizajes/index", {
         title: "Tamizajes",
         user: req.session.user
      });
   } catch (error) {
      next(error);
   }
}