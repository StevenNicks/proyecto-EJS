import { title } from "process";

// Renderizar vista error
export const renderError = (req, res) => {
   res.render('error', { title: 'Página de Error' });
};