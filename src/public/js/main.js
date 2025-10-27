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

// Configuración de un "toast" con SweetAlert2
const Toast = Swal.mixin({
   toast: true,               // Tipo notificación flotante
   position: "top-end",       // Se muestra arriba a la derecha
   showConfirmButton: false,  // Sin botón de confirmación
   timer: 3000,               // Dura 3 segundos
   timerProgressBar: true,    // Con barra de progreso
   didOpen: (toast) => {
      // Pausa y reanuda el temporizador al pasar/quitar el mouse
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
   }
});

function cargarCards() {
   $.ajax({
      method: "GET",
      url: "/usuarios/count-by-rol", // ✅ Nueva ruta correcta
      dataType: "json",
   }).done(function (response) {
      // console.log(response);
      
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
         // 👇 Extraemos el primer objeto del array
         const { total_empleados, total_admins, total_supervisores } = response.data[0];

         const container = $("#cards");
         container.empty(); // 🔄 Limpia antes de insertar nuevas tarjetas

         const roles = [
            { nombre: "Empleado", total: total_empleados, icono: "users-round" },
            { nombre: "Supervisor", total: total_supervisores, icono: "user-round-pen" },
            { nombre: "Admin", total: total_admins, icono: "shield-user" }
         ];

         roles.forEach(({ nombre, total, icono }) => {
            const card = `
               <div class="col-12 col-sm-12 col-md-4 mb-3">
                  <div class="custom-card bg-light p-3 text-center border border-2 shadow-sm bg-body-tertiary rounded">
                     <h3 class="fw-semibold mb-2 d-flex align-items-center justify-content-center gap-2">
                        <i data-lucide="${icono}" width="25" height="25" stroke-width="2.5"></i>
                        <span>${nombre}s</span>
                     </h3>
                     <p class="mt-2 mb-0">${total} ${nombre}s</p>
                  </div>
               </div>
            `;
            container.append(card);
         });

         if (window.lucide) lucide.createIcons(); // ✅ Regenera íconos
      } else {
         console.warn("⚠️ No se encontraron datos válidos en la respuesta.");
      }
   }).fail(function (xhr, status, error) {
      console.warn("⚠️ Error HTTP:", xhr.status, error);
   });
}

function getAllEmpleados() {
   return $.ajax({
      method: "GET",
      url: "/empleados/data", // ✅ Nueva ruta correcta
      dataType: "json",
   }).fail(function (xhr, status, error) {
      console.warn("⚠️ Error al obtener empleados:", xhr.status, error);
      throw error;
   });
}

function getAllRoles() {
   return $.ajax({
      method: "GET",
      url: "/roles/data", // ✅ Nueva ruta correcta
      dataType: "json",
   }).fail(function (xhr, status, error) {
      console.warn("⚠️ Error al obtener roles:", xhr.status, error);
      throw error;
   });
};

// 🔹 Cerrar cualquier modal activa con el botón "X" y limpiar su formulario
$(document).on("click", ".btn-close", function () {
   this.blur(); // Quita el foco del botón

   // Obtiene el modal donde está el botón de cierre
   const $modal = $(this).closest(".modal");

   // Cierra el modal manualmente (por seguridad)
   $modal.modal("hide");

   // Busca y limpia el formulario dentro del modal (si existe)
   const $form = $modal.find("form");
   if ($form.length) {
      $form[0].reset(); // Limpia los valores del formulario
      $form
         .removeClass("was-validated") // Quita la clase general de validación
         .find(".is-valid, .is-invalid") // Limpia los estados de validación
         .removeClass("is-valid is-invalid");
   }
});

// 🔹 Copiar cédula al portapapeles
$(document).on('click', '.cedula-clickable', function () {
   const cedula = $(this).data('cedula');
   const span = $(this);

   navigator.clipboard.writeText(cedula).then(() => {
      span.attr('data-bs-original-title', '¡Copiado!').tooltip('show');

      setTimeout(() => {
         span.attr('data-bs-original-title', 'Copiar cédula');
      }, 1000);
   });
});

// ✅ NUEVA FUNCIONALIDAD: PERSISTENCIA DE SESIÓN
// ================================================

// 🔐 PERSISTENCIA DE SESIÓN - MANTENER SESIÓN ABIERTA
$(document).ready(function() {
    // Verificar si hay sesión activa al cargar la página
    verificarSesionPersistente();
});

function verificarSesionPersistente() {
    const sessionActive = localStorage.getItem('sessionActive');
    
    if (sessionActive === 'true') {
        console.log('✅ Sesión persistente activa');
        // La sesión se mantiene, no es necesario hacer nada
    }
}

// Guardar sesión en localStorage después del login exitoso
function guardarSesionPersistente() {
    localStorage.setItem('sessionActive', 'true');
    console.log('✅ Sesión guardada en localStorage');
}

// Limpiar sesión de localStorage (al hacer logout)
function limpiarSesionPersistente() {
    localStorage.removeItem('sessionActive');
    console.log('✅ Sesión eliminada de localStorage');
}

// ✅ ESTA FUNCIÓN SE DEBE LLAMAR DESPUÉS DE UN LOGIN EXITOSO
// Ejemplo: En tu archivo de login, después del login exitoso, llama:
// guardarSesionPersistente();