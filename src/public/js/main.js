/**
 * Valida formularios con Bootstrap usando jQuery
 * @param {string} selector - selector del formulario (ejemplo: un id "#miFormulario" o una clase ".formulario")
 * @param {function} onSuccess - función a ejecutar si la validación es exitosa
 * @param {function} [onError] - función opcional a ejecutar si la validación falla
 */
function validarFormulario(selector, onSuccess, onError) {
   $(selector).on("submit", function (e) {
      e.preventDefault(); // siempre prevenir envío normal

      const form = this;

      if (form.checkValidity() === false) {
         e.stopPropagation();

         $(form).addClass("was-validated");
         if (typeof onError === "function") {
            onError(form);
         }
         return false;
      }

      $(form).addClass("was-validated");
      if (typeof onSuccess === "function") {
         onSuccess(form);
      }
   });
}
