$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // 🔹 Carga datos de las cards
   cargarCards(); // function -> main.js

   // 🔹 Mostrar modal para crear empleado
   $("#agregar-rol").on("click", function () {
      $("#createRolModal").modal('show');
   });

   // 🔹 Inicialización de DataTable (Empleados)
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