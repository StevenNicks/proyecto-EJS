$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // 🔹 Carga datos de las cards
   cargarCards();


   // 🔹 Inicialización de DataTable (Empleados)
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
            data: 'id',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-primary btn-update w-100" data-id="${data}">
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
         tableEmpleados.column(5).visible(false);
         tableEmpleados.column(6).visible(false);
         tableEmpleados.column(7).visible(false);
         tableEmpleados.column(8).visible(false);
      } else {
         tableEmpleados.column(5).visible(true);
         tableEmpleados.column(6).visible(true);
         tableEmpleados.column(7).visible(true);
         tableEmpleados.column(8).visible(true);
      }
   });
});