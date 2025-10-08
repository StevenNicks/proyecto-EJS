$(document).ready(function () {
   // rol de la sesion
   let userRole = null;

   // tabla empleados
   const table = $("#example").DataTable({
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
            console.log(response);
            // Guardamos el rol del usuario
            userRole = response.user?.rol;
            // Devolvemos los datos para que DataTables los pinte inicialmente
            return response.data || [];
         },
      },
      columns: [
         { data: 'id', defaultContent: 'N/A' },
         { data: 'cedula', defaultContent: 'N/A' },
         { data: 'primer_nombre', defaultContent: 'N/A' },
         { data: 'segundo_nombre', defaultContent: 'N/A' },
         { data: 'primer_apellido', defaultContent: 'N/A' },
         { data: 'segundo_apellido', defaultContent: 'N/A' },
         { data: 'created_at', defaultContent: 'N/A' },
         { data: 'updated_at', defaultContent: 'N/A' },
      ],
      initComplete: function () {
         if (userRole !== 1 && userRole !== 3) {
            // Oculta las columnas 6 y 7 (índices empiezan en 0)
            table.column(6).visible(false);
            table.column(7).visible(false);
         }
      }
   });


   // validacion y envio de formulario
   $(document).on("submit", "#empleadoForm", function (e) {
      e.preventDefault();

      const $submitBtn = $(this).find('button[type="submit"]');

      if (validarFormulario(this.id)) {
         console.log("✅ Formulario válido");
         
         $.ajax({
            url: $(this).attr("action"),
            method: $(this).attr("method"),
            data: $(this).serialize(),
         }).done(function (response) {
            console.log(response);
         })
      } else {
         console.log("❌ Formulario inválido");
      }
   });
});