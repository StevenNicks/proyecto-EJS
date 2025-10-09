$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // Mostrar modal para crear empleado
   $("#agregar-empleado").on("click", function () {
      $("#createEmpleadoModal").modal('show');
   });

   // Cerrar modal y limpiar formulario
   $("#createEmpleadoModalBtnClose").on("click", function () {
      this.blur(); // Quita el foco del botón
      $("#createEmpleadoModal").modal("hide"); // Cierra el modal
      $("#empleadoForm")[0].reset(); // Limpia los valores del formulario

      // 🔹 Elimina clases de validación de Bootstrap
      $("#empleadoForm")
         .removeClass("was-validated") // Quita la clase general de Bootstrap
         .find(".is-valid, .is-invalid") // Busca campos con estilos de validación
         .removeClass("is-valid is-invalid"); // Los limpia
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
            defaultContent: 'N/A',
            createdCell: function (td, cellData, rowData, row, col) {
               $(td).addClass('bg-success text-white');
            }
         },
         {
            data: 'cedula',
            defaultContent: 'N/A', // Si el valor de 'cedula' es null o undefined, muestra 'N/A'.
            createdCell: function (td, cellData, rowData, row, col) {
               const cedula = cellData ? cellData.toString() : "";

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
                     .addClass('text-center align-middle bg-warning-flash')
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
         { data: 'primer_nombre', defaultContent: 'N/A' },
         { data: 'segundo_nombre', defaultContent: 'N/A' },
         { data: 'primer_apellido', defaultContent: 'N/A' },
         { data: 'segundo_apellido', defaultContent: 'N/A' },
         { data: 'created_at', defaultContent: 'N/A' },
         { data: 'updated_at', defaultContent: 'N/A' },
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
         }
      }
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
      } else {
         tableEmpleados.column(6).visible(true);
         tableEmpleados.column(7).visible(true);
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
            console.log(response);
            if (response.success) {
               $("#createEmpleadoModal").modal('hide');  // Cierra el modal
               $("#empleadoForm")[0].reset();            // Limpia el formulario

               // 🔄 Recargar la tabla
               tableEmpleados.ajax.reload(null, false); // false = mantiene la página actual

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

   // Cargar tarjetas dinámicas (Roles)
   $(document).ready(function () {
      $.ajax({
         method: "GET",
         url: "/empleados/countUserByRol",
         dataType: "json",
      }).done(function (response) {
         // console.log(response);
         if (response.success && Array.isArray(response.data)) {
            const container = $("#cards");
            container.empty(); // 🔄 Limpia antes de insertar nuevas tarjetas

            response.data.forEach(item => {
               // Capitalizar el nombre
               const nombre = item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1);

               // 🧩 Asigna ícono según el rol
               let icono = "user-round";
               if (item.nombre.toLowerCase() === "admin") icono = "shield-user";
               else if (item.nombre.toLowerCase() === "empleado") icono = "users-round";
               else if (item.nombre.toLowerCase() === "supervisor") icono = "user-round-pen";

               // Crear la tarjeta dinámica HTML
               const card = `
                  <div class="col-12 col-sm-12 col-md-4 mb-3">
                     <div class="custom-card bg-light p-3 text-center border border-2 shadow-sm bg-body-tertiary rounded">
                        <h3 class="fw-semibold mb-2 d-flex align-items-center justify-content-center gap-2">
                           <i data-lucide="${icono}" width="25" height="25" stroke-width="2.5"></i>
                           <span>${nombre}s</span>
                        </h3>
                        <p class="mt-2 mb-0">${item.total} ${nombre}s</p>
                     </div>
                  </div>
               `;

               // Insertar en el contenedor
               container.append(card);
            });
            if (window.lucide) lucide.createIcons();
         } else {
            console.warn("⚠️ No se encontraron datos válidos en la respuesta.");
         }
      }).fail(function (xhr, status, error) {
         console.warn("⚠️ Error HTTP:", xhr.status, error);
      })
   });
});