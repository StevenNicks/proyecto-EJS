// Cargar tarjetas dinámicas (Roles)
function cargarCards() {
   $.ajax({
      method: "GET",
      url: "/usuarios/count-by-rol", // ✅ Nueva ruta correcta
      dataType: "json",
   }).done(function (response) {
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


$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // Carga datos de las cards
   cargarCards();

   // Mostrar modal para crear empleado
   $("#agregar-empleado").on("click", function () {
      $("#createEmpleadoModal").modal('show');
   });

   // Cerrar cualquier modal activa con el botón "X" y limpiar su formulario
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

   // Inicialización de DataTable (Empleados)
   const tableEmpleados = $("#example").DataTable({
      language: {
         decimal: ",",
         thousands: ".",
         lengthMenu: "Mostrar _MENU_ registros",
         zeroRecords: "No se encontraron registros",
         info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
         infoEmpty: "Mostrando 0 a 0 de 0 registros",
         infoFiltered: "(filtrado de _MAX_ registros totales)",
         search: "Buscar:",
         paginate: {
            first: "<<",
            last: ">>",
            next: ">",
            previous: "<"
         },
         processing: "Procesando...",
         loadingRecords: "Cargando...",
         emptyTable: "No hay datos disponibles en la tabla",
         aria: {
            sortAscending: ": activar para ordenar la columna de manera ascendente",
            sortDescending: ": activar para ordenar la columna de manera descendente"
         }
      },
      ajax: {
         url: '/empleados/data',
         dataSrc: function (response) {
            // console.log(response);     // imprime datos de la tabla y sesion en la consola
            // Guardamos el rol del usuario
            userRole = response.user?.rol;
            // Devolvemos los datos para que DataTables los pinte inicialmente
            return response.data || [];
         },
      },
      columns: [
         {
            data: 'id',
            createdCell: function (td, cellData, rowData, row, col) {
               $(td).addClass('bg-success text-white');
            }
         },
         {
            data: 'cedula',
            createdCell: function (td, cellData, rowData, row, col) {
               const cedula = cellData ? cellData.toString() : "VACIO";

               // valida que la cedula no posea menos de 7 caracteres
               const isValida = cedula.length >= 7;

               if (isValida) {
                  const content = `
                        <span class="cedula-clickable" 
                           data-cedula="${cedula}" 
                           data-bs-toggle="tooltip" 
                           data-bs-placement="right" 
                           title="Click para copiar"
                           style="cursor: pointer;">
                           ${cedula}
                        </span>
                  `;

                  $(td).addClass('text-center user-select-all align-middle fw-semibold').html(content);
                  $(td).find('span').tooltip();
               } else {
                  // Mostrar tooltip de cédula errónea sin permitir copiar
                  $(td)
                     .addClass('text-center align-middle bg-warning')
                     .attr({
                        'data-bs-toggle': 'tooltip',
                        'data-bs-placement': 'right',
                        'title': '¡Cédula errónea!'
                     })
                     .text(cedula)
                     .tooltip();
               }
            }
         },
         {
            data: 'primer_nombre',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            data: 'segundo_nombre',
            createdCell: function (td, cellData, rowData, row, col) {
               let value = (cellData || '').trim(); // Maneja null y undefined
               let data = value ? value.toUpperCase() : 'N/A';
               $(td).text(data);
            }
         },
         {
            data: 'primer_apellido',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            data: 'segundo_apellido',
            createdCell: function (td, cellData, rowData, row, col) {
               let value = (cellData || '').trim(); // Maneja null y undefined
               let data = value ? value.toUpperCase() : 'N/A';
               $(td).text(data);
            }
         },
         {
            title: 'Actualizar',
            data: 'cedula',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-primary btn-update w-100" data-cedula="${data}">
                        <i data-lucide="user-round-pen" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;   // ordenación y búsqueda
            }
         },
         {
            title: 'Eliminar',
            data: 'cedula',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-danger btn-delete w-100" data-cedula="${data}">
                        <i data-lucide="user-round-x" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;   // ordenación y búsqueda
            }
         },
         {
            title: 'Creado',
            data: 'created_at',
         },
         {
            title: 'Actualizado',
            data: 'updated_at',
         },

      ],
      drawCallback: function (settings) {
         const tooltipTriggerList = [].slice.call(document.querySelectorAll(
            '[data-bs-toggle="tooltip"]'))
         tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
         })
      },
      initComplete: function () {
         if (userRole !== 1 && userRole !== 3) {
            // Oculta las columnas 6 y 7 (índices empiezan en 0)
            tableEmpleados.column(6).visible(false);
            tableEmpleados.column(7).visible(false);
            tableEmpleados.column(8).visible(false);
            tableEmpleados.column(9).visible(false);
         }
      }
   });

   // Redibujar íconos al cambiar de página en la tabla
   tableEmpleados.on('draw', function () {
      lucide.createIcons(); // vuelve a renderizar los íconos Lucide
   });

   // Copiar cédula al portapapeles
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

   // 🔄 Mantener visibilidad de columnas según rol tras recarga
   tableEmpleados.on('xhr.dt', function (e, settings, json) {
      userRole = json.user?.rol;
      if (userRole !== 1 && userRole !== 3) {
         tableEmpleados.column(6).visible(false);
         tableEmpleados.column(7).visible(false);
         tableEmpleados.column(8).visible(false);
         tableEmpleados.column(9).visible(false);
      } else {
         tableEmpleados.column(6).visible(true);
         tableEmpleados.column(7).visible(true);
         tableEmpleados.column(8).visible(true);
         tableEmpleados.column(9).visible(true);
      }
   });

   // Envío y validación de formulario Empleado
   $(document).on("submit", "#empleadoForm", function (e) {
      e.preventDefault();

      const $submitBtn = $(this).find('button[type="submit"]');

      if (validarFormulario(this.id)) {
         // console.log("✅ Formulario válido");

         $.ajax({
            url: $(this).attr("action"),
            method: $(this).attr("method"),
            data: $(this).serialize(),
            beforeSend: function () {
               // Desactivar el botón antes de enviar
               $submitBtn.prop('disabled', true).text('Procesando...');
            }
         }).done(function (response) {
            // console.log(response);
            if (response.success) {
               $("#createEmpleadoModal").modal('hide');  // Cierra el modal
               $("#empleadoForm")[0].reset();            // Limpia el formulario

               $("#empleadoForm")
                  .removeClass("was-validated") // Quita la clase general de Bootstrap
                  .find(".is-valid, .is-invalid") // Busca campos con estilos de validación
                  .removeClass("is-valid is-invalid"); // Los limpia
               // 🔄 Recargar la tabla
               tableEmpleados.ajax.reload(null, false); // false = mantiene la página actual

               cargarCards();

               // Muestra el mensaje
               Toast.fire({
                  icon: "success",
                  title: response.message
               });
            } else {
               // Si el backend devuelve success = false (por ejemplo validaciones)
               Toast.fire({
                  icon: "error",
                  title: response.message || "Ocurrió un error al crear el empleado."
               });
            }
         }).fail(function (xhr, status, error) {
            console.warn("⚠️ Error HTTP:", xhr.status, error);
            let msg = "Ocurrió un error inesperado.";

            if (xhr.status === 400) msg = "Campos obligatorios o datos inválidos.";
            else if (xhr.status === 409) msg = "La cédula ya está registrada.";
            else if (xhr.status === 401) msg = "No autorizado. Inicia sesión nuevamente.";
            else if (xhr.status === 500) msg = "Error interno del servidor.";

            Toast.fire({
               icon: "error",
               title: msg
            });
         }).always(function () {
            // Volver a activar el botón después de terminar
            $submitBtn.prop('disabled', false).text('Iniciar sesión');
         });
      } else {
         console.log("❌ Formulario inválido");
         Toast.fire({
            icon: "error",
            title: "Formulario inválido",
            text: "Por favor, completa todos los campos requeridos."
         });
      }
   });

   // 🔹 Actualizar empleado
   $(document).on('click', '.btn-update', function () {
      const cedula = $(this).data('cedula');      // Obtiene la cédula del botón
      const $button = $(this);                    // Referencia al botón clickeado
      const originalText = $button.html();        // Guarda el texto original del botón

      // 🔸 Deshabilita el botón y muestra spinner
      $button.prop('disabled', true).html(`
         <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Cargando...</span>
         </div>
      `);

      // 🔹 Limpia el formulario antes de llenarlo
      const $form = $("#updateEmpleadoForm");
      $form[0].reset();
      $form.removeClass("was-validated").find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");

      // 🔹 Realiza la petición AJAX
      $.ajax({
         method: "GET",
         url: `/empleados/${cedula}`,
         dataType: "json"
      }).done(function (response) {
         // ✅ Si la respuesta es correcta
         if (response.success && response.data) {
            const empleado = response.data;

            // Llena los campos del formulario
            $form.find("#update_cedula").val(empleado.cedula);
            $form.find("#update_primer_nombre").val(empleado.primer_nombre);
            $form.find("#update_segundo_nombre").val(empleado.segundo_nombre);
            $form.find("#update_primer_apellido").val(empleado.primer_apellido);
            $form.find("#update_segundo_apellido").val(empleado.segundo_apellido);

            // 🔹 Abre el modal una vez cargados los datos
            $("#updateEmpleadoModal").modal('show');
         } else {
            // ⚠️ Si no se encontró el empleado
            Toast.fire({
               icon: "error",
               title: response.message || "No se encontraron datos del empleado."
            });
         }
      }).fail(function (xhr, status, error) {
         // ❌ Si ocurre un error en la petición
         console.error("Error al obtener el empleado:", error);
         Toast.fire({
            icon: "error",
            title: "Ocurrió un error al obtener los datos del empleado."
         });
      }).always(function () {
         // 🔹 Restaura el botón (se ejecuta tanto en éxito como en error)
         $button.prop('disabled', false).html(originalText);
      });
   });

   // 🔹 Evento para actualizar empleado desde el formulario de la modal
   $(document).on("submit", "#updateEmpleadoForm", function (e) {
      e.preventDefault();

      const $form = $(this);
      const cedula = $form.find("#update_cedula").val(); // Se obtiene la cédula del campo del formulario
      const $submitBtn = $form.find('button[type="submit"]'); // Botón de envío
      const originalText = $submitBtn.text(); // Guarda el texto original del botón

      if (validarFormulario(this.id)) {
         $.ajax({
            method: "PUT",
            url: `/empleados/${cedula}`,
            data: $form.serialize(),
            dataType: "json",
            beforeSend: function () {
               // 🔸 Desactiva el botón y muestra texto de carga
               $submitBtn.prop("disabled", true).text("Actualizando...");
            }
         }).done(function (response) {
            if (response.success) {
               // ✅ Actualización exitosa
               Toast.fire({
                  icon: "success",
                  title: response.message || "Empleado actualizado correctamente."
               });

               // 🔹 Cierra la modal
               $("#updateEmpleadoModal").modal("hide");

               // 🔹 Limpia el formulario
               $form[0].reset();
               $form
                  .removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");

               // 🔹 Recarga la tabla sin reiniciar la página
               tableEmpleados.ajax.reload(null, false);
            } else {
               // ⚠️ Error del servidor (por ejemplo, no se encontró el empleado)
               Toast.fire({
                  icon: "error",
                  title: response.message || "No se pudo actualizar el empleado."
               });

               $("#updateEmpleadoModal").modal("hide");
               $form[0].reset();
               $form.removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");
            }
         }).fail(function (xhr, status, error) {
            console.error("❌ Error al actualizar empleado:", error);

            Toast.fire({
               icon: "error",
               title: "Ocurrió un error al actualizar el empleado."
            });

            // 🔹 Cierra la modal y limpia el formulario
            $("#updateEmpleadoModal").modal("hide");
            $form[0].reset();
            $form.removeClass("was-validated")
               .find(".is-valid, .is-invalid")
               .removeClass("is-valid is-invalid");
         }).always(function () {
            // 🔹 Restaura el botón
            $submitBtn.prop("disabled", false).text(originalText);
         });
      } else {
         // ❌ Si el formulario no pasa validación
         Toast.fire({
            icon: "error",
            title: "Formulario inválido",
            text: "Por favor, completa todos los campos requeridos."
         });
      }
   });

   // Eliminar
   $(document).on('click', '.btn-delete', function () {
      const cedula = $(this).data('cedula');
      const $submitBtn = $(this);

      // Confirmación opcional (antes de eliminar)
      Swal.fire({
         title: "¿Estás seguro?",
         text: "Esta acción eliminará el registro permanentemente.",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: "Sí, eliminar",
         cancelButtonText: "Cancelar"
      }).then((result) => {
         if (!result.isConfirmed) return; // cancelado

         // 🔄 Spinner antes de enviar
         $submitBtn.prop('disabled', true).html(`
            <div class="spinner-border spinner-border-sm" role="status">
               <span class="visually-hidden">Cargando...</span>
            </div>
         `);

         $.ajax({
            method: "DELETE",
            url: `/empleados/${cedula}`,
         }).done(function (response) {
            Toast.fire({
               icon: "success",
               title: response.message || "Registro eliminado exitosamente"
            });

            tableEmpleados.ajax.reload(null, false); // recarga sin perder la página actual
         }).fail(function (xhr, status, error) {
            console.error('Error al eliminar:', error);
            Toast.fire({
               icon: "error",
               title: "Ocurrió un error al eliminar el registro"
            });

            // restaurar botón solo si NO se eliminó
            $submitBtn.prop('disabled', false).html(`
               <i data-lucide="user-round-x" width="20" height="20" stroke-width="2"></i>
            `);
            lucide.createIcons();
         });
      });
   });
});