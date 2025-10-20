$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // 🔹 Inicialización de DataTable (Resultados)
   let tableResultados = $("#example").DataTable({
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
      order: [[0, "desc"]], // Ordenar por la primera columna (índice 0, id) de mayor a menor
      pageLength: 100,      // Mostrar 100 registros por página
      lengthMenu: [10, 25, 50, 100], // Opciones de número de registros por página
      ajax: {
         url: `/resultados/data/${window.location.pathname.split('/').pop()}`,
         dataSrc: function (response) {
            console.log(response);

            userRole = response.user?.rol;
            return response.data || []; // siempre devuelve un array, aunque esté vacío
         },
         error: function (xhr) {
            // Muestra mensaje del backend si existe
            const msg = xhr.responseJSON?.message || 'No hay resultados para este tamizaje.';
            console.warn(msg);

            // Vacía la tabla para que no pinte nada
            tableResultados.clear().draw();
         }
      },
      columns: [
         { data: 'id', createdCell: (td) => $(td).addClass('bg-success text-white') },
         // { data: 'tamizaje_id' },
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
            title: 'primer_nombre',
            data: 'primer_nombre',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            title: 'segundo_nombre',
            data: 'segundo_nombre',
            createdCell: function (td, cellData, rowData, row, col) {
               let value = (cellData || '').trim(); // Maneja null y undefined
               let data = value ? value.toUpperCase() : 'N/A';
               $(td).text(data);
            }
         },
         {
            title: 'primer_apellido',
            data: 'primer_apellido',
            createdCell: function (td, cellData, rowData, row, col) {
               let capitalized = cellData.toUpperCase();
               $(td).text(capitalized);
            }
         },
         {
            title: 'segundo_apellido',
            data: 'segundo_apellido',
            createdCell: function (td, cellData, rowData, row, col) {
               let value = (cellData || '').trim(); // Maneja null y undefined
               let data = value ? value.toUpperCase() : 'N/A';
               $(td).text(data);
            }
         },
         {
            data: 'IMC',
            title: 'IMC',
            createdCell: function (td, cellData) {
               const valor = parseFloat(cellData);
               let color = '', rango = '';

               if (valor < 18.5) { color = '#3A9AD9'; rango = 'Bajo'; }      // Azul
               else if (valor < 25) { color = '#3AD98C'; rango = 'Normal'; } // Verde
               else if (valor < 30) { color = '#F7E03C'; rango = 'Sobrepeso'; } // Amarillo
               else if (valor < 35) { color = '#F7A03C'; rango = 'Obeso I'; } // Naranja
               else { color = '#F74D4D'; rango = 'Obeso II+'; }             // Rojo

               $(td).css({ 'background-color': color, 'color': '#000', 'font-weight': 'bold', 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'sistole',
            title: 'Sistólica',
            createdCell: function (td, cellData) {
               const valor = parseInt(cellData);
               let color = '', rango = '';

               if (valor < 90) { color = '#3A9AD9'; rango = 'Bajo'; }        // Azul
               else if (valor <= 120) { color = '#3AD98C'; rango = 'Normal'; } // Verde
               else if (valor <= 140) { color = '#F7E03C'; rango = 'Ligeramente Alto'; } // Amarillo
               else if (valor <= 160) { color = '#F7A03C'; rango = 'Alto'; } // Naranja
               else { color = '#F74D4D'; rango = 'Muy Alto'; }               // Rojo

               $(td).css({ 'background-color': color, 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'diastole',
            title: 'Diastólica',
            createdCell: function (td, cellData) {
               const valor = parseInt(cellData);
               let color = '', rango = '';

               if (valor < 60) { color = '#3A9AD9'; rango = 'Bajo'; }        // Azul
               else if (valor <= 80) { color = '#3AD98C'; rango = 'Normal'; } // Verde
               else if (valor <= 90) { color = '#F7E03C'; rango = 'Ligeramente Alto'; } // Amarillo
               else if (valor <= 100) { color = '#F7A03C'; rango = 'Alto'; } // Naranja
               else { color = '#F74D4D'; rango = 'Muy Alto'; }               // Rojo

               $(td).css({ 'background-color': color, 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'pulso',
            title: 'Pulso',
            createdCell: function (td, cellData) {
               const valor = parseInt(cellData);
               let color = '', rango = '';

               if (valor < 60) { color = '#3A9AD9'; rango = 'Bajo'; }        // Azul
               else if (valor <= 100) { color = '#3AD98C'; rango = 'Normal'; } // Verde
               else if (valor <= 120) { color = '#F7E03C'; rango = 'Elevado'; } // Amarillo
               else if (valor <= 140) { color = '#F7A03C'; rango = 'Alto'; } // Naranja
               else { color = '#F74D4D'; rango = 'Muy Alto'; }               // Rojo

               $(td).css({ 'background-color': color, 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'oxigenacion',
            title: 'Oxigenación',
            createdCell: function (td, cellData) {
               const valor = parseFloat(cellData);
               let color = '', rango = '';

               if (valor >= 95) { color = '#3AD98C'; rango = 'Normal'; }   // Verde
               else if (valor >= 90) { color = '#F7E03C'; rango = 'Ligeramente Bajo'; } // Amarillo
               else if (valor >= 85) { color = '#F7A03C'; rango = 'Bajo'; } // Naranja
               else { color = '#F74D4D'; rango = 'Muy Bajo'; }            // Rojo

               $(td).css({ 'background-color': color, 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'glucosa',
            title: 'Glucosa',
            createdCell: function (td, cellData) {
               const valor = parseFloat(cellData);
               let color = '', rango = '';

               if (valor < 70) { color = '#3A9AD9'; rango = 'Bajo'; }       // Azul
               else if (valor <= 140) { color = '#3AD98C'; rango = 'Normal'; } // Verde
               else if (valor <= 180) { color = '#F7E03C'; rango = 'Ligeramente Alto'; } // Amarillo
               else if (valor <= 220) { color = '#F7A03C'; rango = 'Alto'; } // Naranja
               else { color = '#F74D4D'; rango = 'Muy Alto'; }               // Rojo

               $(td).css({ 'background-color': color, 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'temperatura',
            title: 'Temperatura',
            createdCell: function (td, cellData) {
               const valor = parseFloat(cellData);
               let color = '', rango = '';

               if (valor < 36) { color = '#3A9AD9'; rango = 'Bajo'; }      // Azul
               else if (valor <= 37.5) { color = '#3AD98C'; rango = 'Normal'; } // Verde
               else if (valor <= 38.5) { color = '#F7E03C'; rango = 'Fiebre Ligera'; } // Amarillo
               else if (valor <= 39.5) { color = '#F7A03C'; rango = 'Fiebre Alta'; } // Naranja
               else { color = '#F74D4D'; rango = 'Fiebre Muy Alta'; }      // Rojo

               $(td).css({ 'background-color': color, 'text-align': 'center' })
                  .html(`${valor} <br><small>${rango}</small>`);
            }
         },
         {
            data: 'observacion',
            title: 'Observación',
            className: 'observacion-column',
            createdCell: function (td, cellData) {
               $(td).on('click', function () {
                  alert(cellData); // Muestra el texto completo en un alert
               });
            }
         },
         {
            title: 'Actualizar',
            data: 'id',
            render: function (data, type, row, meta) {
               if (type === 'display') {
                  return `
                     <button type="button" class="btn btn-primary btn-update w-100" data-id="${data}">
                        <i data-lucide="file-pen" width="20" height="20" stroke-width="2"></i>
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
                        <i data-lucide="file-x-2" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;   // ordenación y búsqueda
            }
         },
         // { data: 'estado', render: (data) => data ? 'Activo' : 'Inactivo' },
         { title: 'Creado', data: 'created_at' },
         { title: 'Actualizado', data: 'updated_at' }
      ],
      drawCallback: function () {
         const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
         tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
      },
      initComplete: function () {
         if (userRole !== 1 && userRole !== 3) {
            tableResultados.column(16).visible(false);
         }
      }
   });

   // 🔹 Redibujar íconos al cambiar de página en la tabla
   tableResultados.on('draw', function () {
      lucide.createIcons(); // vuelve a renderizar los íconos Lucide
   });

});
