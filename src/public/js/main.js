/**
 * Valida un formulario utilizando la API de validación nativa de HTML5
 * y los estilos de Bootstrap.
 *
 * @param {string} formId - El ID del formulario a validar.
 * @returns {boolean} - Devuelve `true` si el formulario es válido, `false` en caso contrario.
 *
 * Esta función:
 *  - Selecciona el formulario a partir de su ID.
 *  - Evalúa la validez de los campos con `checkValidity()`.
 *  - Aplica la clase `was-validated` de Bootstrap para mostrar visualmente los mensajes de validación.
 *  - No envía los datos del formulario, solo indica su validez.
 */
function validarFormulario(formId) {
   const selector = `#${formId}`;
   const form = document.querySelector(selector);

   // Verifica si el formulario cumple con las reglas de validación HTML5
   if (!form.checkValidity()) {
      // Aplica la clase de Bootstrap para mostrar errores
      form.classList.add('was-validated');
      return false; // Formulario inválido
   }

   // Aplica la clase de Bootstrap en caso válido también,
   // de modo que los estilos se apliquen correctamente
   form.classList.add('was-validated');
   return true; // Formulario válido
}
