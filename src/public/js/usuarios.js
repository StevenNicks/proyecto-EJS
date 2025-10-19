$(document).ready(function () {
   // rol de la sesion
   let userRole = null;
   let empleadosResponse = null;

   // 🔹 Carga datos de las cards
   cargarCards();

   // 🔹 Mostrar modal para crear usuario
   $("#agregar-usuario").on("click", async function () {
      try {
         empleadosResponse = await getAllEmpleados();
         const rolesResponse = await getAllRoles();

         const empleados = empleadosResponse.data;
         const roles = rolesResponse.data;

         const empleadoOptions = empleados.map(e =>
            `<option value="${e.cedula}">${e.cedula}</option>`
         ).join('');

         $("#cedula").html(`<option selected disabled value="">Selecciona un empleado</option>${empleadoOptions}`);

         const rolOptions = roles.map(r =>
            `<option value="${r.id}">${r.nombre}</option>`
         ).join('');

         $("#rol").html(`<option selected disabled value="">Selecciona un rol</option>${rolOptions}`);

         $("#createUsuarioModal").modal('show');

      } catch (error) {
         console.error("❌ Error cargando empleados o roles:", error);
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al cargar empleados o roles. Intenta nuevamente.'
         });
      }
   });

   // Escucha cuando cambie la cédula seleccionada
   $(document).on("change", "#cedula", function () {
      const cedulaSeleccionada = $(this).val();

      // Busca al empleado correspondiente en el array que ya cargaste
      const empleado = empleadosResponse.data.find(e => e.cedula == cedulaSeleccionada);

      if (empleado) {
         // Concatena nombre completo
         const nombreCompleto = [
            empleado.primer_nombre,
            empleado.segundo_nombre,
            empleado.primer_apellido,
            empleado.segundo_apellido
         ].filter(Boolean).join(" "); // ✅ Evita espacios dobles si falta algún nombre

         // Pinta el nombre en el input
         $("#empleado").val(nombreCompleto);
      } else {
         $("#empleado").val(""); // limpia si no encuentra coincidencia
      }
   });

   // 🔹 Inicialización de DataTable (Usuarios)
   const tableUsuarios = $("#example").DataTable({
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
         url: '/usuarios/data',
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
            data: 'empleado_cedula',
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
            data: 'nombre_completo',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            data: 'email',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toLowerCase();
               $(td).text(capitalized);
            }
         },
         {
            data: 'nombre_rol',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            title: 'Actualizar',
            data: 'email',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-primary btn-update w-100" data-email="${data}">
                        <i data-lucide="user-cog" width="20" height="20" stroke-width="2"></i>
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
                        <i data-lucide="user-x" width="20" height="20" stroke-width="2"></i>
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
            // Oculta las columnas 5 y 8 (índices empiezan en 0)
            tableUsuarios.column(5).visible(false);
            tableUsuarios.column(6).visible(false);
            tableUsuarios.column(7).visible(false);
            tableUsuarios.column(8).visible(false);
         }
      }
   });

   // 🔹 Redibujar íconos al cambiar de página en la tabla
   tableUsuarios.on('draw', function () {
      lucide.createIcons(); // vuelve a renderizar los íconos Lucide
   });

   // 🔹 Mantener visibilidad de columnas según rol tras recarga
   tableUsuarios.on('xhr.dt', function (e, settings, json) {
      userRole = json.user?.rol;
      if (userRole !== 1 && userRole !== 3) {
         tableUsuarios.column(5).visible(false);
         tableUsuarios.column(6).visible(false);
         tableUsuarios.column(7).visible(false);
         tableUsuarios.column(8).visible(false);
      } else {
         tableUsuarios.column(5).visible(true);
         tableUsuarios.column(6).visible(true);
         tableUsuarios.column(7).visible(true);
         tableUsuarios.column(8).visible(true);
      }
   });

   // 🔹 Registro validación de Usuario
   $(document).on("submit", "#usuarioForm", function (e) {
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
            if (response.success) {
               $("#createUsuarioModal").modal('hide');  // Cierra el modal
               $("#usuarioForm")[0].reset();            // Limpia el formulario

               $("#usuarioForm")
                  .removeClass("was-validated") // Quita la clase general de Bootstrap
                  .find(".is-valid, .is-invalid") // Busca campos con estilos de validación
                  .removeClass("is-valid is-invalid"); // Los limpia
               // 🔄 Recargar la tabla
               tableUsuarios.ajax.reload(null, false); // false = mantiene la página actual

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
                  title: response.message || "Ocurrió un error al crear el usuario."
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
            $submitBtn.prop('disabled', false).text('Crear usuario');
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

   // 🔹 Actualizar usuario
   $(document).on('click', '.btn-update', async function () {
      const email = $(this).data('email');
      const $button = $(this);
      const originalText = $button.html();

      // 🔸 Deshabilita el botón y muestra spinner
      $button.prop('disabled', true).html(`
      <div class="spinner-border spinner-border-sm" role="status">
         <span class="visually-hidden">Cargando...</span>
      </div>
   `);

      // 🔹 Limpia el formulario antes de llenarlo
      const $form = $("#updateUsuarioForm");
      $form[0].reset();
      $form.removeClass("was-validated").find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");

      try {
         // 1️⃣ Obtener empleados y roles
         const empleadosResponse = await getAllEmpleados();
         const rolesResponse = await getAllRoles();

         const empleados = empleadosResponse.data;
         const roles = rolesResponse.data;

         // 2️⃣ Cargar empleados en el select
         const empleadoOptions = empleados.map(e =>
            `<option value="${e.cedula}">${e.cedula}</option>`
         ).join('');
         $("#update_cedula").html(`<option disabled value="">Selecciona un empleado</option>${empleadoOptions}`);

         // 3️⃣ Cargar roles en el select
         const rolOptions = roles.map(r =>
            `<option value="${r.id}">${r.nombre}</option>`
         ).join('');
         $("#rol").html(`<option disabled value="">Selecciona un rol</option>${rolOptions}`);

         // 4️⃣ Obtener usuario por email
         $.ajax({
            method: "GET",
            url: `/usuarios/${email}`,
            dataType: "json"
         }).done(function (response) {
            // console.log(response);

            if (response.success && response.data) {
               const usuario = response.data;

               // Llena los campos del formulario
               $form.find("#usuario_id").val(usuario.id);
               $form.find("#update_cedula").val(usuario.empleado_cedula);
               $form.find("#rol").val(usuario.rol_id);
               $form.find("#update_email").val(usuario.email);
               $form.find("#update_password").val("");

               // 🔹 Buscar nombre completo en la lista de empleados
               const empleadoSeleccionado = empleados.find(e => e.cedula === usuario.empleado_cedula);
               const nombreCompleto = empleadoSeleccionado
                  ? [empleadoSeleccionado.primer_nombre, empleadoSeleccionado.segundo_nombre, empleadoSeleccionado.primer_apellido, empleadoSeleccionado.segundo_apellido]
                     .filter(Boolean).join(" ")
                  : "";

               $form.find("#update_empleado").val(nombreCompleto);

               // 🔹 Mostrar modal
               $("#updateUsuarioModal").modal('show');

               // 🟡 Escucha cambio de cédula dentro de este modal
               $(document).off("change", "#update_cedula").on("change", "#update_cedula", function () {
                  const cedulaSeleccionada = $(this).val();
                  const empleado = empleados.find(e => e.cedula == cedulaSeleccionada);

                  if (empleado) {
                     const nombreCompleto = [
                        empleado.primer_nombre,
                        empleado.segundo_nombre,
                        empleado.primer_apellido,
                        empleado.segundo_apellido
                     ].filter(Boolean).join(" ");

                     $("#update_empleado").val(nombreCompleto);
                  } else {
                     $("#update_empleado").val("");
                  }
               });

            } else {
               Toast.fire({
                  icon: "error",
                  title: response.message || "No se encontraron datos del usuario."
               });
            }
         }).fail(function (xhr, status, error) {
            console.error("Error al obtener el usuario:", error);
            Toast.fire({
               icon: "error",
               title: "Ocurrió un error al obtener los datos del usuario."
            });
         }).always(function () {
            $button.prop('disabled', false).html(originalText);
         });

      } catch (error) {
         console.error("❌ Error cargando empleados o roles:", error);
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar empleados o roles.'
         });
         $button.prop('disabled', false).html(originalText);
      }
   });

   // 🔹 Evento para actualizar usuario desde el formulario de la modal
   $(document).on("submit", "#updateUsuarioForm", function (e) {
      e.preventDefault();

      const $form = $(this);
      const id = $form.find("#usuario_id").val(); // Se obtiene la cédula del campo del formulario
      const $submitBtn = $form.find('button[type="submit"]'); // Botón de envío
      const originalText = $submitBtn.text(); // Guarda el texto original del botón

      if (validarFormulario(this.id)) {
         $.ajax({
            method: "PUT",
            url: `/usuarios/${id}`,
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
                  title: response.message || "Usuario actualizado correctamente."
               });

               // 🔹 Cierra la modal
               $("#updateUsuarioModal").modal("hide");

               // 🔹 Limpia el formulario
               $form[0].reset();
               $form
                  .removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");

               // 🔹 Recarga la tabla sin reiniciar la página
               tableUsuarios.ajax.reload(null, false);
            } else {
               // ⚠️ Error del servidor (por ejemplo, no se encontró el usuario)
               Toast.fire({
                  icon: "error",
                  title: response.message || "No se pudo actualizar el usuario."
               });

               $("#updateUsuarioModal").modal("hide");
               $form[0].reset();
               $form.removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");
            }
         }).fail(function (xhr, status, error) {
            console.error("❌ Error al actualizar usuario:", error);

            Toast.fire({
               icon: "error",
               title: "Ocurrió un error al actualizar el usuario."
            });

            // 🔹 Cierra la modal y limpia el formulario
            $("#updateUsuarioModal").modal("hide");
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
            url: `/usuarios/${id}`,
         }).done(function (response) {
            Toast.fire({
               icon: "success",
               title: response.message || "Registro eliminado exitosamente"
            });

            tableUsuarios.ajax.reload(null, false); // recarga sin perder la página actual
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