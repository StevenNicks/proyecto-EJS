$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // 🔹 Carga datos de las cards
   cargarCards(); // function -> main.js

   // 🔹 Mostrar modal para crear rol
   $("#agregar-rol").on("click", function () {
      $("#createRolModal").modal('show');
   });

   // 🔹 Inicialización de DataTable (roles)
   const tableRoles = $("#example").DataTable({
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
         method: 'GET',
         url: '/roles/data',
         dataSrc: function (response) {
            // console.log(response.data);     // imprime datos de la tabla y sesion en la consola
            // Guardamos el rol del usuario en una variable a parte
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
            data: 'nombre',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            data: 'descripcion',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            title: 'Actualizar',
            data: 'id',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-primary btn-update w-100" data-id="${data}">
                        <i data-lucide="settings" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;   // ordenación y búsqueda
            }
         },
         {
            title: 'Eliminar',
            data: 'id',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-danger btn-delete w-100" data-id="${data}">
                        <i data-lucide="trash-2" width="20" height="20" stroke-width="2"></i>
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
      initComplete: function () {
         if (userRole !== 1 && userRole !== 3) {
            // Oculta las columnas 3 y 6 (índices empiezan en 0)
            tableRoles.column(3).visible(false);
            tableRoles.column(4).visible(false);
            tableRoles.column(5).visible(false);
            tableRoles.column(6).visible(false);
         }
      }
   });

   // 🔹 Redibujar íconos al cambiar de página en la tabla
   tableRoles.on('draw', function () {
      lucide.createIcons(); // vuelve a renderizar los íconos Lucide
   });

   // 🔹 Mantener visibilidad de columnas según rol tras recarga
   tableRoles.on('xhr.dt', function (e, settings, json) {
      userRole = json.user?.rol;
      if (userRole !== 1 && userRole !== 3) {
         tableRoles.column(3).visible(false);
         tableRoles.column(4).visible(false);
         tableRoles.column(5).visible(false);
         tableRoles.column(6).visible(false);
      } else {
         tableRoles.column(3).visible(true);
         tableRoles.column(4).visible(true);
         tableRoles.column(5).visible(true);
         tableRoles.column(6).visible(true);
      }
   });

   // 🔹 Registro validación de Rol
   $(document).on("submit", "#rolForm", function (e) {
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
               $("#createRolModal").modal('hide');  // Cierra el modal
               $("#rolForm")[0].reset();            // Limpia el formulario

               $("#rolForm")
                  .removeClass("was-validated") // Quita la clase general de Bootstrap
                  .find(".is-valid, .is-invalid") // Busca campos con estilos de validación
                  .removeClass("is-valid is-invalid"); // Los limpia
               // 🔄 Recargar la tabla
               tableRoles.ajax.reload(null, false); // false = mantiene la página actual

               cargarCards(); // function -> main.js

               // Muestra el mensaje
               Toast.fire({
                  icon: "success",
                  title: response.message
               });
            } else {
               // Si el backend devuelve success = false (por ejemplo validaciones)
               Toast.fire({
                  icon: "error",
                  title: response.message || "Ocurrió un error al crear el rol."
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
            $submitBtn.prop('disabled', false).text('Crear rol');
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

   // 🔹 Actualizar rol
   $(document).on('click', '.btn-update', function () {
      const id = $(this).data('id');      // Obtiene la cédula del botón
      console.log(id);
      
      const $button = $(this);                    // Referencia al botón clickeado
      const originalText = $button.html();        // Guarda el texto original del botón

      // 🔸 Deshabilita el botón y muestra spinner
      $button.prop('disabled', true).html(`
         <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Cargando...</span>
         </div>
      `);

      // 🔹 Limpia el formulario antes de llenarlo
      const $form = $("#updateRolForm");
      $form[0].reset();
      $form.removeClass("was-validated").find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");

      // 🔹 Realiza la petición AJAX
      $.ajax({
         method: "GET",
         url: `/roles/${id}`,
         dataType: "json"
      }).done(function (response) {
         // ✅ Si la respuesta es correcta
         if (response.success && response.data) {
            const rol = response.data;
            console.log(rol);

            // Llena los campos del formulario
            $form.find("#update_id").val(rol.id);
            $form.find("#update_nombre").val(rol.nombre);
            $form.find("#update_descripcion").val(rol.descripcion);

            // 🔹 Abre el modal una vez cargados los datos
            $("#updateRolModal").modal('show');
         } else {
            // ⚠️ Si no se encontró el rol
            Toast.fire({
               icon: "error",
               title: response.message || "No se encontraron datos del rol."
            });
         }
      }).fail(function (xhr, status, error) {
         // ❌ Si ocurre un error en la petición
         console.error("Error al obtener el rol:", error);
         Toast.fire({
            icon: "error",
            title: "Ocurrió un error al obtener los datos del rol."
         });
      }).always(function () {
         // 🔹 Restaura el botón (se ejecuta tanto en éxito como en error)
         $button.prop('disabled', false).html(originalText);
      });
   });

   // 🔹 Evento para actualizar rol desde el formulario de la modal
   $(document).on("submit", "#updateRolForm", function (e) {
      e.preventDefault();

      const $form = $(this);
      const id = $form.find("#update_id").val(); // Se obtiene la id del campo del formulario
      const $submitBtn = $form.find('button[type="submit"]'); // Botón de envío
      const originalText = $submitBtn.text(); // Guarda el texto original del botón

      if (validarFormulario(this.id)) {
         $.ajax({
            method: "PUT",
            url: `/roles/${id}`,
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
                  title: response.message || "Rol actualizado correctamente."
               });

               // 🔹 Cierra la modal
               $("#updateRolModal").modal("hide");

               // 🔹 Limpia el formulario
               $form[0].reset();
               $form
                  .removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");

               // 🔹 Recarga la tabla sin reiniciar la página
               tableRoles.ajax.reload(null, false);
            } else {
               // ⚠️ Error del servidor (por ejemplo, no se encontró el rol)
               Toast.fire({
                  icon: "error",
                  title: response.message || "No se pudo actualizar el rol."
               });

               $("#updateRolModal").modal("hide");
               $form[0].reset();
               $form.removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");
            }
         }).fail(function (xhr, status, error) {
            console.error("❌ Error al actualizar rol:", error);

            Toast.fire({
               icon: "error",
               title: "Ocurrió un error al actualizar el rol."
            });

            // 🔹 Cierra la modal y limpia el formulario
            $("#updateRolModal").modal("hide");
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

   // 🔹 Eliminar
   $(document).on('click', '.btn-delete', function () {
      const id = $(this).data('id');
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
            url: `/roles/${id}`,
         }).done(function (response) {
            Toast.fire({
               icon: "success",
               title: response.message || "Registro eliminado exitosamente"
            });

            tableRoles.ajax.reload(null, false); // recarga sin perder la página actual
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