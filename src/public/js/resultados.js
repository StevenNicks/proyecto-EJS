$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // ==================== CÓDIGO DEL BOTÓN AGREGAR RESULTADO ====================
   
   // ✅ BOTÓN "AGREGAR RESULTADO"
   $('#agregar-resultado').on('click', function() {
      // Obtener el ID del tamizaje desde la URL
      const tamizajeId = window.location.pathname.split('/').pop();
      
      // Llenar automáticamente el campo tamizaje_id en el modal
      $('#tamizaje_id').val(tamizajeId);
      
      // Mostrar el modal de crear resultado
      const modal = new bootstrap.Modal(document.getElementById('createResultadoModal'));
      modal.show();
   });

   // Cerrar modal al hacer clic en la X
   $('#createResultadoModalBtnClose').on('click', function() {
      const modal = bootstrap.Modal.getInstance(document.getElementById('createResultadoModal'));
      modal.hide();
   });

   // 🔹 ENVÍO DEL FORMULARIO DE CREAR RESULTADO
   $('#resultadoForm').on('submit', function(e) {
      e.preventDefault();
      
      const formData = {
         tamizaje_id: $('#tamizaje_id').val(),
         empleado_cedula: $('#empleado_cedula').val(),
         altura: $('#altura').val(),
         peso: $('#peso').val(),
         IMC: $('#IMC').val(),
         sistole: $('#sistole').val(),
         diastole: $('#diastole').val(),
         pulso: $('#pulso').val(),
         oxigenacion: $('#oxigenacion').val(),
         glucosa: $('#glucosa').val(),
         temperatura: $('#temperatura').val(),
         observacion: $('#observacion').val()
      };

      // Validar campos requeridos
      if (!formData.empleado_cedula || !formData.altura || !formData.peso) {
         Swal.fire({
            icon: 'warning',
            title: 'Campos requeridos',
            text: 'Por favor complete todos los campos obligatorios',
            confirmButtonColor: '#ffc107'
         });
         return;
      }

      // Enviar datos al servidor
      $.ajax({
         url: '/resultados',
         method: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(formData),
         success: function(response) {
            if (response.success) {
               // Cerrar modal
               const modal = bootstrap.Modal.getInstance(document.getElementById('createResultadoModal'));
               modal.hide();
               
               // Recargar DataTable
               tableResultados.ajax.reload();
               
               // Limpiar formulario
               $('#resultadoForm')[0].reset();
               
               // ✅ ALERT BONITO DE ÉXITO
               Swal.fire({
                  icon: 'success',
                  title: '¡Éxito!',
                  text: 'Resultado agregado exitosamente',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar'
               });
            } else {
               // ✅ ALERT BONITO DE ERROR
               Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: response.message,
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Aceptar'
               });
            }
         },
         error: function(xhr) {
            const errorMsg = xhr.responseJSON?.message || 'Error al agregar resultado';
            
            // ✅ DETECTAR SI ES ERROR DE CÉDULA NO ENCONTRADA
            if (errorMsg.includes('cedula') || errorMsg.includes('cédula') || errorMsg.includes('empleado')) {
               Swal.fire({
                  icon: 'warning',
                  title: 'Cédula no encontrada',
                  text: 'La cédula ingresada no está registrada en el sistema. Verifique el número e intente nuevamente.',
                  confirmButtonColor: '#ffc107',
                  confirmButtonText: 'Aceptar'
               });
            } else {
               // ✅ ALERT BONITO PARA OTROS ERRORES
               Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: errorMsg,
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Aceptar'
               });
            }
         }
      });
   });

   // ==================== FIN CÓDIGO BOTÓN AGREGAR ====================

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
      order: [[0, "desc"]],
      pageLength: 100,
      lengthMenu: [10, 25, 50, 100],
      ajax: {
         url: `/resultados/data/tamizaje/${window.location.pathname.split('/').pop()}`,
         dataSrc: function (response) {
            console.log(response);
            userRole = response.user?.rol;
            return response.data || [];
         },
         error: function (xhr) {
            const msg = xhr.responseJSON?.message || 'No hay resultados para este tamizaje.';
            console.warn(msg);
            tableResultados.clear().draw();
         }
      },
      columns: [
         { data: 'id', createdCell: (td) => $(td).addClass('bg-success text-white') },
         {
            data: 'empleado_cedula',
            createdCell: function (td, cellData, rowData, row, col) {
               const cedula = cellData ? cellData.toString() : "VACIO";
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
               let value = (cellData || '').trim();
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
               let value = (cellData || '').trim();
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

               if (valor < 18.5) { color = '#3A9AD9'; rango = 'Bajo'; }
               else if (valor < 25) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor < 30) { color = '#F7E03C'; rango = 'Sobrepeso'; }
               else if (valor < 35) { color = '#F7A03C'; rango = 'Obeso I'; }
               else { color = '#F74D4D'; rango = 'Obeso II+'; }

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

               if (valor < 90) { color = '#3A9AD9'; rango = 'Bajo'; }
               else if (valor <= 120) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor <= 140) { color = '#F7E03C'; rango = 'Ligeramente Alto'; }
               else if (valor <= 160) { color = '#F7A03C'; rango = 'Alto'; }
               else { color = '#F74D4D'; rango = 'Muy Alto'; }

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

               if (valor < 60) { color = '#3A9AD9'; rango = 'Bajo'; }
               else if (valor <= 80) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor <= 90) { color = '#F7E03C'; rango = 'Ligeramente Alto'; }
               else if (valor <= 100) { color = '#F7A03C'; rango = 'Alto'; }
               else { color = '#F74D4D'; rango = 'Muy Alto'; }

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

               if (valor < 60) { color = '#3A9AD9'; rango = 'Bajo'; }
               else if (valor <= 100) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor <= 120) { color = '#F7E03C'; rango = 'Elevado'; }
               else if (valor <= 140) { color = '#F7A03C'; rango = 'Alto'; }
               else { color = '#F74D4D'; rango = 'Muy Alto'; }

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

               if (valor >= 95) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor >= 90) { color = '#F7E03C'; rango = 'Ligeramente Bajo'; }
               else if (valor >= 85) { color = '#F7A03C'; rango = 'Bajo'; }
               else { color = '#F74D4D'; rango = 'Muy Bajo'; }

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

               if (valor < 70) { color = '#3A9AD9'; rango = 'Bajo'; }
               else if (valor <= 140) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor <= 180) { color = '#F7E03C'; rango = 'Ligeramente Alto'; }
               else if (valor <= 220) { color = '#F7A03C'; rango = 'Alto'; }
               else { color = '#F74D4D'; rango = 'Muy Alto'; }

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

               if (valor < 36) { color = '#3A9AD9'; rango = 'Bajo'; }
               else if (valor <= 37.5) { color = '#3AD98C'; rango = 'Normal'; }
               else if (valor <= 38.5) { color = '#F7E03C'; rango = 'Fiebre Ligera'; }
               else if (valor <= 39.5) { color = '#F7A03C'; rango = 'Fiebre Alta'; }
               else { color = '#F74D4D'; rango = 'Fiebre Muy Alta'; }

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
                  alert(cellData);
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
               return data;
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
               return data;
            }
         },
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
      lucide.createIcons();
   });

   // ==================== CÓDIGO BOTONES ACTUALIZAR Y ELIMINAR ====================

   // ✅ FUNCIONALIDAD PARA BOTÓN ACTUALIZAR
   $(document).on('click', '.btn-update', function() {
      const resultadoId = $(this).data('id');
      console.log('Actualizando resultado ID:', resultadoId);
      
      $.ajax({
         url: `/resultados/${resultadoId}`,
         method: 'GET',
         success: function(response) {
            if (response.success) {
               const resultado = response.data;
               console.log('Datos del resultado:', resultado);
               
               // Llenar el formulario de actualizar
               $('#update_id').val(resultado.id);
               $('#update_tamizaje_id').val(resultado.tamizaje_id);
               $('#update_empleado_cedula').val(resultado.empleado_cedula);
               $('#update_altura').val(resultado.altura);
               $('#update_peso').val(resultado.peso);
               $('#update_IMC').val(resultado.IMC);
               $('#update_sistole').val(resultado.sistole);
               $('#update_diastole').val(resultado.diastole);
               $('#update_pulso').val(resultado.pulso);
               $('#update_oxigenacion').val(resultado.oxigenacion);
               $('#update_glucosa').val(resultado.glucosa);
               $('#update_temperatura').val(resultado.temperatura);
               $('#update_observacion').val(resultado.observacion);
               
               // Mostrar el modal de actualizar
               const modal = new bootstrap.Modal(document.getElementById('updateResultadoModal'));
               modal.show();
            } else {
               Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: response.message || 'No se pudieron cargar los datos',
                  confirmButtonColor: '#d33'
               });
            }
         },
         error: function(xhr) {
            console.error('Error al cargar datos:', xhr);
            Swal.fire({
               icon: 'error',
               title: 'Error',
               text: 'No se pudieron cargar los datos del resultado',
               confirmButtonColor: '#d33'
            });
         }
      });
   });

   // ✅ FUNCIONALIDAD PARA BOTÓN ELIMINAR
   $(document).on('click', '.btn-delete', function() {
      const resultadoId = $(this).data('id');
      console.log('Eliminando resultado ID:', resultadoId);
      
      Swal.fire({
         title: '¿Estás seguro?',
         text: "¡No podrás revertir esto!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Sí, eliminar',
         cancelButtonText: 'Cancelar'
      }).then((result) => {
         if (result.isConfirmed) {
            $.ajax({
               url: `/resultados/${resultadoId}`,
               method: 'DELETE',
               success: function(response) {
                  if (response.success) {
                     Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: response.message,
                        confirmButtonColor: '#3085d6'
                     });
                     tableResultados.ajax.reload();
                  } else {
                     Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                        confirmButtonColor: '#d33'
                     });
                  }
               },
               error: function(xhr) {
                  console.error('Error al eliminar:', xhr);
                  Swal.fire({
                     icon: 'error',
                     title: 'Error',
                     text: 'Error al eliminar el resultado',
                     confirmButtonColor: '#d33'
                  });
               }
            });
         }
      });
   });

   // ✅ ENVÍO DEL FORMULARIO DE ACTUALIZAR
   $('#updateResultadoForm').on('submit', function(e) {
      e.preventDefault();
      
      const resultadoId = $('#update_id').val();
      console.log('Actualizando resultado ID:', resultadoId);
      
      const formData = {
         tamizaje_id: $('#update_tamizaje_id').val(),
         empleado_cedula: $('#update_empleado_cedula').val(),
         altura: $('#update_altura').val(),
         peso: $('#update_peso').val(),
         IMC: $('#update_IMC').val(),
         sistole: $('#update_sistole').val(),
         diastole: $('#update_diastole').val(),
         pulso: $('#update_pulso').val(),
         oxigenacion: $('#update_oxigenacion').val(),
         glucosa: $('#update_glucosa').val(),
         temperatura: $('#update_temperatura').val(),
         observacion: $('#update_observacion').val()
      };

      // Validar campos requeridos
      if (!formData.empleado_cedula || !formData.altura || !formData.peso) {
         Swal.fire({
            icon: 'warning',
            title: 'Campos requeridos',
            text: 'Por favor complete todos los campos obligatorios',
            confirmButtonColor: '#ffc107'
         });
         return;
      }

      $.ajax({
         url: `/resultados/${resultadoId}`,
         method: 'PUT',
         contentType: 'application/json',
         data: JSON.stringify(formData),
         success: function(response) {
            if (response.success) {
               const modal = bootstrap.Modal.getInstance(document.getElementById('updateResultadoModal'));
               modal.hide();
               tableResultados.ajax.reload();
               Swal.fire({
                  icon: 'success',
                  title: '¡Actualizado!',
                  text: response.message,
                  confirmButtonColor: '#3085d6'
               });
            } else {
               Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: response.message,
                  confirmButtonColor: '#d33'
               });
            }
         },
         error: function(xhr) {
            console.error('Error al actualizar:', xhr);
            const errorMsg = xhr.responseJSON?.message || 'Error al actualizar el resultado';
            Swal.fire({
               icon: 'error',
               title: 'Error',
               text: errorMsg,
               confirmButtonColor: '#d33'
            });
         }
      });
   });

   // ==================== FIN CÓDIGO BOTONES ACTUALIZAR Y ELIMINAR ====================
});