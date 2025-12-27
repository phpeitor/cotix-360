document.addEventListener("DOMContentLoaded", () => {
  
  const formCargar = document.querySelector(".form-cargar-item");
  const inputFile = document.querySelector("#fileItems");

  const container = document.getElementById("cards-container");
  const paginationContainer = document.getElementById("pagination-container");

  let page = 1;
  const perPage = 4;

  formCargar.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!inputFile.files.length) {
      alertify.error("Seleccione un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("fileItems", inputFile.files[0]);

    try {
      const res = await fetch("controller/cargar_items.php", {
        method: "POST",
        body: formData
      });

      const json = await res.json();

      if (json.ok) {
        alertify.success(json.message);
        formCargar.reset();
        cargarDatos();
      } else {
        alertify.error("Error: " + json.message);
      }

    } catch (err) {
      console.error(err);
      alertify.error("Error en la carga masiva");
    }
  });

  async function cargarDatos() {
      const res = await fetch("controller/table_carga.php");
      const data = await res.json();

      renderCards(data);
      renderPagination(data.length);
  }

  function renderCards(data) {
      container.innerHTML = "";

      const start = (page - 1) * perPage;
      const end = start + perPage;
      const items = data.slice(start, end);

      items.forEach(carga => {
          const card = `
            <div class="col-sm-6 col-lg-3">
                <div class="card d-block">
                    <div class="card-body">
                    
                        <div class="d-flex mb-3 justify-content-between align-items-center">
                            <h5 class="header-title">${carga.nombre_file}</h5>
                            <div>
                                <a href="javascript:void(0);"
                                    class="btn btn-sm rounded-circle btn-icon btn-estado
                                            ${carga.estado == 1 ? 'btn-danger' : 'btn-success'}"
                                    data-id="${carga.id}"
                                    data-estado="${carga.estado}">
                                    <i class="ti ${carga.estado == 1 ? 'ti-x' : 'ti-check'}"></i>
                                </a>
                            </div>
                        </div>

                        <p class="mb-0 text-muted">
                            <small class="ti ti-circle-filled ${carga.estado == 1 ? 'text-success' : 'text-danger'}"></small>
                            ${carga.estado == 1 ? 'Active' : 'Cancel'}
                        </p>

                        <p class="card-text">
                            <span class="text-success me-2">
                                Cargados: <i class="ti ti-caret-up-filled"></i> ${carga.cargados}
                            </span>
                            <br/>
                            <span class="text-danger me-2">
                                Errores: <i class="ti ti-caret-down-filled"></i> ${carga.errores}
                            </span>
                            <br/>
                            <small class="text-muted">${carga.fecha_registro}</small>
                        </p>

                        <a href="items.php?id=${md5(String(carga.id))}" class="btn btn-primary">Ver</a>
                    </div>
                </div>
            </div>
          `;
          container.innerHTML += card;
      });
  }

  function renderPagination(totalItems) {
      const totalPages = Math.ceil(totalItems / perPage);

      let html = `
      <div class="card-footer border-0">
          <div class="align-items-center justify-content-between row text-center text-sm-start">
              <div class="col-sm">
                  <div class="text-muted">
                      Showing <span class="fw-semibold">${perPage}</span>
                      of <span class="fw-semibold">${totalItems}</span> Results
                  </div>
              </div>

              <div class="col-sm-auto mt-3 mt-sm-0">
              <ul class="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
      `;

      html += `
          <li class="page-item ${page === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" data-page="${page - 1}">
                  <i class="ti ti-chevron-left"></i>
              </a>
          </li>
      `;

      for (let i = 1; i <= totalPages; i++) {
          html += `
              <li class="page-item ${page === i ? "active" : ""}">
                  <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
          `;
      }

      html += `
          <li class="page-item ${page === totalPages ? "disabled" : ""}">
              <a class="page-link" href="#" data-page="${page + 1}">
                  <i class="ti ti-chevron-right"></i>
              </a>
          </li>
      `;

      html += `
              </ul>
              </div>
          </div>
      </div>
      `;

      paginationContainer.innerHTML = html;

      paginationContainer.querySelectorAll(".page-link").forEach(btn => {
          btn.addEventListener("click", (e) => {
              e.preventDefault();
              const goto = parseInt(e.target.closest("a").dataset.page);

              if (!isNaN(goto)) {
                  page = goto;
                  cargarDatos();
              }
          });
      });
  }

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-estado");
    if (!btn) return;

    const id = btn.dataset.id;
    const estado = parseInt(btn.dataset.estado);

    const accion = estado === 1 ? "anular" : "activar";

    alertify.confirm(
        "Confirmar",
        `¿Seguro que deseas ${accion} esta carga?`,
        async () => {
            try {
                const formData = new FormData();
                formData.append("id", id);
                formData.append("accion", accion);

                const res = await fetch("controller/upd_carga.php", {
                    method: "POST",
                    body: formData
                });

                const json = await res.json();

                if (json.success) {
                    alertify.success("Estado actualizado correctamente");
                    cargarDatos(); // refresca cards
                } else {
                    alertify.error(json.message || "Error al actualizar");
                }

            } catch (err) {
                console.error(err);
                alertify.error("Error en la solicitud");
            }
        },
        () => {}
    );
  });

  cargarDatos();
});
