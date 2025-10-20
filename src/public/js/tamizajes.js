$(document).ready(function () {
   let userRole = null;

   // 🔹 Cargar cards
   cargarCards();

   // 🔹 Mostrar modal para crear tamizaje
   $("#agregar-tamizaje").on("click", function () {
      $("#createTamizajeModal").modal("show");
   });

   // 🔹 Inicialización de DataTable (Tamizajes)
   const tableTamizajes = $("#example").DataTable({
      language: {
         decimal: ",",
         thousands: ".",
         lengthMenu: "Mostrar _MENU_ registros",
         zeroRecords: "No se encontraron registros",
         info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
         infoEmpty: "Mostrando 0 a 0 de 0 registros",
         infoFiltered: "(filtrado de _MAX_ registros totales)",
         search: "Buscar:",
         paginate: { first: "<<", last: ">>", next: ">", previous: "<" },
         processing: "Procesando...",
         loadingRecords: "Cargando...",
         emptyTable: "No hay datos disponibles en la tabla",
      },
      ajax: {
         url: "/tamizajes/data",
         dataSrc: function (response) {
            // console.log(response);
            userRole = response.user?.rol;
            return response.data || [];
         },
      },
      columns: [
         {
            data: "id",
            createdCell: function (td) {
               $(td).addClass("bg-success text-white text-center fw-semibold");
            },
         },
         {
            data: "nombre",
            createdCell: function (td, cellData) {
               const value = (cellData || "").trim();
               $(td)
                  .addClass("text-uppercase text-center fw-normal")
                  .text(value || "N/A");
            },
         },
         {
            data: "estado",
            render: function (data) {
               if (data === 1) {
                  return `<span class="badge bg-warning text-black p-2">En proceso</span>`;
               } else if (data === 2) {
                  return `<span class="badge bg-success p-2">Completado</span>`;
               } else if (data === 3) {
                  return `<span class="badge bg-danger p-2">Cancelado</span>`;
               } else {
                  return `<span class="badge bg-secondary p-2">Desconocido</span>`;
               }
            },
         },
         {
            title: "Actualizar",
            data: "id",
            render: function (data, type) {
               if (type === "display") {
                  return `
                     <button type="button" class="btn btn-primary btn-update w-100" data-id="${data}">
                        <i data-lucide="pencil" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;
            },
         },
         {
            title: "Eliminar",
            data: "id",
            render: function (data, type) {
               if (type === "display") {
                  return `
                     <button type="button" class="btn btn-danger btn-delete w-100" data-id="${data}">
                        <i data-lucide="trash-2" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;
            },
         },
         {
            title: "visualizar",
            data: "id",
            render: function (data, type) {
               if (type === "display") {
                  return `
                     <button type="button" class="btn btn-outline-success w-100" 
                        onclick="window.location.href='resultados/tamizaje/${data}'">
                        <i data-lucide="eye" width="20" height="20" stroke-width="2"></i>
                     </button>
                  `;
               }
               return data;
            },
         },
         { data: "created_at", title: "Creado" },
         { data: "updated_at", title: "Actualizado" },
      ],
      drawCallback: function () {
         lucide.createIcons();
      },
      initComplete: function () {
         if (userRole !== 1 && userRole !== 3) {
            tableTamizajes.column(3).visible(false);
            tableTamizajes.column(4).visible(false);
            tableTamizajes.column(5).visible(false);
            tableTamizajes.column(6).visible(false);
         }
      },
   });

   // 🔹 Redibujar íconos al cambiar de página
   tableTamizajes.on("draw", function () {
      lucide.createIcons();
   });

   // 🔹 Mantener visibilidad de columnas según rol tras recarga
   tableTamizajes.on('xhr.dt', function (e, settings, json) {
      userRole = json.user?.rol;
      if (userRole !== 1 && userRole !== 3) {
         tableTamizajes.column(3).visible(false);
         tableTamizajes.column(4).visible(false);
         tableTamizajes.column(5).visible(false);
         tableTamizajes.column(6).visible(false);
      } else {
         tableTamizajes.column(3).visible(true);
         tableTamizajes.column(4).visible(true);
         tableTamizajes.column(5).visible(true);
         tableTamizajes.column(6).visible(true);
      }
   });

   // 🔹 Registrar tamizaje
   $(document).on("submit", "#tamizajeForm", function (e) {
      e.preventDefault();
      const $form = $(this);
      const $submitBtn = $form.find('button[type="submit"]');

      if (validarFormulario(this.id)) {
         $.ajax({
            url: $form.attr("action"),
            method: $form.attr("method"),
            data: $form.serialize(),
            beforeSend: function () {
               $submitBtn.prop("disabled", true).text("Procesando...");
            },
         })
            .done(function (response) {
               if (response.success) {
                  $("#createTamizajeModal").modal("hide");
                  $form[0].reset();
                  $form
                     .removeClass("was-validated")
                     .find(".is-valid, .is-invalid")
                     .removeClass("is-valid is-invalid");
                  tableTamizajes.ajax.reload(null, false);
                  cargarCards();
                  Toast.fire({ icon: "success", title: response.message });
               } else {
                  Toast.fire({
                     icon: "error",
                     title:
                        response.message || "Ocurrió un error al crear el tamizaje.",
                  });
               }
            })
            .fail(function (xhr) {
               console.warn("⚠️ Error HTTP:", xhr.status);
               let msg = "Error inesperado.";
               if (xhr.status === 400)
                  msg = "Campos obligatorios o datos inválidos.";
               else if (xhr.status === 401)
                  msg = "No autorizado. Inicia sesión nuevamente.";
               else if (xhr.status === 500)
                  msg = "Error interno del servidor.";
               Toast.fire({ icon: "error", title: msg });
            })
            .always(function () {
               $submitBtn.prop("disabled", false).text("Guardar tamizaje");
            });
      } else {
         Toast.fire({
            icon: "error",
            title: "Formulario inválido",
            text: "Por favor, completa todos los campos requeridos.",
         });
      }
   });

   // 🔹 Obtener datos del tamizaje para actualizar
   $(document).on("click", ".btn-update", function () {
      const id = $(this).data("id");
      const $button = $(this);
      const original = $button.html();

      $button.prop("disabled", true).html(`
         <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Cargando...</span>
         </div>
      `);

      const $form = $("#updateTamizajeForm");
      $form[0].reset();

      $.ajax({
         method: "GET",
         url: `/tamizajes/${id}`,
         dataType: "json",
      })
         .done(function (response) {
            // console.log(response);

            if (response.success && response.data) {
               const t = response.data;
               $form.find("#update_id").val(t.id);
               $form.find("#update_nombre").val(t.nombre);
               $form.find("#update_estado").val(t.estado);
               $("#updateTamizajeModal").modal("show");
            } else {
               Toast.fire({
                  icon: "error",
                  title: response.message || "No se encontraron datos del tamizaje.",
               });
            }
         })
         .fail(function () {
            Toast.fire({
               icon: "error",
               title: "Ocurrió un error al obtener los datos del tamizaje.",
            });
         })
         .always(function () {
            $button.prop("disabled", false).html(original);
         });
   });

   // 🔹 Actualizar tamizaje
   $(document).on("submit", "#updateTamizajeForm", function (e) {
      e.preventDefault();

      const $form = $(this);
      const id = $form.find("#update_id").val();
      const $submitBtn = $form.find('button[type="submit"]');
      const originalText = $submitBtn.text();

      if (validarFormulario(this.id)) {
         $.ajax({
            method: "PUT",
            url: `/tamizajes/${id}`,
            data: $form.serialize(),
            dataType: "json",
            beforeSend: function () {
               $submitBtn.prop("disabled", true).text("Actualizando...");
            },
         }).done(function (response) {
            // console.log(response);

            if (response.success) {
               Toast.fire({
                  icon: "success",
                  title: response.message || "Tamizaje actualizado correctamente.",
               });
               $("#updateTamizajeModal").modal("hide");
               $form[0].reset();
               $form
                  .removeClass("was-validated")
                  .find(".is-valid, .is-invalid")
                  .removeClass("is-valid is-invalid");
               tableTamizajes.ajax.reload(null, false);
            } else {
               Toast.fire({
                  icon: "error",
                  title:
                     response.message || "No se pudo actualizar el tamizaje.",
               });
            }
         }).fail(function () {
            Toast.fire({
               icon: "error",
               title: "Error al actualizar el tamizaje.",
            });
         }).always(function () {
            $submitBtn.prop("disabled", false).text(originalText);
         });
      } else {
         Toast.fire({
            icon: "error",
            title: "Formulario inválido",
            text: "Por favor, completa todos los campos requeridos.",
         });
      }
   });

   // 🔹 Eliminar tamizaje
   $(document).on("click", ".btn-delete", function () {
      const id = $(this).data("id");
      const $btn = $(this);

      Swal.fire({
         title: "¿Estás seguro?",
         text: "Esta acción eliminará el registro permanentemente.",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: "Sí, eliminar",
         cancelButtonText: "Cancelar",
      }).then((result) => {
         if (!result.isConfirmed) return;

         $btn.prop("disabled", true).html(`
            <div class="spinner-border spinner-border-sm" role="status">
               <span class="visually-hidden">Cargando...</span>
            </div>
         `);

         $.ajax({
            method: "DELETE",
            url: `/tamizajes/${id}`,
         })
            .done(function (response) {
               Toast.fire({
                  icon: "success",
                  title: response.message || "Registro eliminado exitosamente",
               });
               tableTamizajes.ajax.reload(null, false);
            })
            .fail(function () {
               Toast.fire({
                  icon: "error",
                  title: "Error al eliminar el registro",
               });
               $btn.prop("disabled", false).html(`
                  <i data-lucide="trash-2" width="20" height="20" stroke-width="2"></i>
               `);
               lucide.createIcons();
            });
      });
   });
});
