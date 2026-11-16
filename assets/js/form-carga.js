document.addEventListener("DOMContentLoaded", () => {
  const formCargar = document.querySelector(".form-cargar-item");
  const inputFile = document.querySelector("#fileItems");
  const dropzone = document.getElementById("cargarItemsDropzone");
  const btnSeleccionarArchivo = document.getElementById("btnSeleccionarArchivo");
  const fileInfo = document.getElementById("cargarItemsFileInfo");
  const fileNameEl = document.getElementById("cargarItemsFileName");
  const fileSizeEl = document.getElementById("cargarItemsFileSize");
  const btnQuitarArchivo = document.getElementById("btnQuitarArchivo");
  const btnSubirItems = document.getElementById("btnSubirItems");
  const progressWrap = document.getElementById("cargarItemsProgress");
  const progressText = document.getElementById("cargarItemsProgressText");
  const progressPercent = document.getElementById("cargarItemsProgressPercent");
  const progressBar = document.getElementById("cargarItemsProgressBar");
  const container = document.getElementById("cards-container");
  const paginationContainer = document.getElementById("pagination-container");
  const modalErroresCargaEl = document.getElementById("modalErroresCarga");
  const modalErroresCargaTitle = document.getElementById("modalErroresCargaTitle");
  const modalErroresCargaSubtitle = document.getElementById("modalErroresCargaSubtitle");
  const erroresCargaBody = document.getElementById("erroresCargaBody");
  let page = 1;
  const perPage = 4;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatoBytes(bytes) {
    if (!Number(bytes)) return "0 bytes";
    const unidades = ["bytes", "KB", "MB", "GB"];
    const nivel = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), unidades.length - 1);
    const valor = bytes / Math.pow(1024, nivel);
    return `${valor.toFixed(nivel === 0 ? 0 : 1)} ${unidades[nivel]}`;
  }

  function actualizarArchivo(file) {
    if (!file) {
      if (fileInfo) fileInfo.classList.add("d-none");
      if (btnSubirItems) btnSubirItems.disabled = true;
      return;
    }

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      inputFile.value = "";
      if (fileInfo) fileInfo.classList.add("d-none");
      if (btnSubirItems) btnSubirItems.disabled = true;
      alertify.error("Selecciona un archivo Excel .xls o .xlsx");
      return;
    }

    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatoBytes(file.size);
    fileInfo.classList.remove("d-none");
    btnSubirItems.disabled = false;
  }

  btnSeleccionarArchivo?.addEventListener("click", () => inputFile?.click());
  dropzone?.addEventListener("click", event => {
    if (!event.target.closest("#btnSeleccionarArchivo")) inputFile?.click();
  });
  dropzone?.addEventListener("keydown", event => {
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      inputFile?.click();
    }
  });
  inputFile?.addEventListener("change", () => actualizarArchivo(inputFile.files?.[0]));
  btnQuitarArchivo?.addEventListener("click", () => {
    inputFile.value = "";
    actualizarArchivo(null);
  });

  ["dragenter", "dragover"].forEach(type => dropzone?.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.add("is-dragover");
  }));
  ["dragleave", "drop"].forEach(type => dropzone?.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");
  }));
  dropzone?.addEventListener("drop", event => {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputFile.files = transfer.files;
    actualizarArchivo(file);
  });

  formCargar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = inputFile.files?.[0];
    if (!file) {
      alertify.error("Seleccione un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("fileItems", file);
    btnSubirItems.disabled = true;
    btnSubirItems.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Subiendo…';
    progressWrap.classList.remove("d-none");
    progressBar.style.width = "0%";
    progressBar.parentElement.setAttribute("aria-valuenow", "0");
    progressPercent.textContent = "0%";
    progressText.textContent = "Preparando archivo…";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "controller/cargar_items.php");
    xhr.upload.addEventListener("progress", event => {
      if (!event.lengthComputable) return;
      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      progressBar.style.width = `${percent}%`;
      progressBar.parentElement.setAttribute("aria-valuenow", String(percent));
      progressPercent.textContent = `${percent}%`;
      progressText.textContent = percent >= 100 ? "Procesando filas del Excel…" : "Subiendo archivo…";
    });
    xhr.addEventListener("load", () => {
      let json = {};
      try { json = JSON.parse(xhr.responseText || "{}"); } catch (_) {}
      if (xhr.status >= 200 && xhr.status < 300 && json.ok) {
        progressBar.style.width = "100%";
        progressBar.parentElement.setAttribute("aria-valuenow", "100");
        progressPercent.textContent = "100%";
        progressText.textContent = "Carga completada";
        alertify.success(json.message || "Archivo cargado correctamente");
        formCargar.reset();
        actualizarArchivo(null);
        page = 1;
        cargarDatos();
        window.setTimeout(() => progressWrap.classList.add("d-none"), 900);
      } else {
        progressWrap.classList.add("d-none");
        alertify.error(json.message || "No se pudo procesar el archivo");
      }
      btnSubirItems.disabled = !inputFile.files?.length;
      btnSubirItems.innerHTML = '<i class="ti ti-upload me-1"></i><span>Iniciar carga</span>';
    });
    xhr.addEventListener("error", () => {
      progressWrap.classList.add("d-none");
      alertify.error("Error de conexión durante la carga");
      btnSubirItems.disabled = false;
      btnSubirItems.innerHTML = '<i class="ti ti-upload me-1"></i><span>Iniciar carga</span>';
    });
    xhr.send(formData);
  });

  async function cargarDatos() {
      try {
        const res = await fetch("controller/table_carga.php");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) throw new Error(data?.message || "No se pudo cargar el historial");
        const totalPages = Math.max(1, Math.ceil(data.length / perPage));
        page = Math.min(page, totalPages);
        renderCards(data);
        renderPagination(data.length);
      } catch (error) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-danger">${escapeHtml(error.message || "Error al cargar el historial")}</div></div>`;
        paginationContainer.innerHTML = "";
      }
  }

 function initTooltips() {
    container?.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        bootstrap.Tooltip.getOrCreateInstance(el);
    });
 }

  function renderCards(data) {
      container.innerHTML = "";
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const items = data.slice(start, end);

      if (!data.length) {
          container.innerHTML = `
              <div class="col-12">
                  <div class="cargar-items-empty-state">
                      <span class="cargar-items-empty-icon"><i class="ti ti-file-spreadsheet"></i></span>
                      <h5>Aún no hay cargas</h5>
                      <p class="text-muted mb-0">Cuando importes un Excel, aquí verás el estado y el resumen de cada carga.</p>
                  </div>
              </div>`;
          return;
      }

      items.forEach(carga => {
          const active = Number(carga.estado) === 1;
          const errores = Number(carga.errores || 0);
          const card = `
            <div class="col-sm-6 col-xl-3">
                <article class="card cargar-items-history-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                            <span class="cargar-items-history-icon ${active ? 'is-active' : 'is-inactive'}"><i class="ti ti-file-spreadsheet"></i></span>
                            <span class="badge rounded-pill ${active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">${active ? 'Activa' : 'Anulada'}</span>
                            <button type="button" class="btn btn-sm btn-light btn-icon btn-estado ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${active ? 'Anular esta carga' : 'Reactivar esta carga'}" aria-label="${active ? 'Anular esta carga' : 'Reactivar esta carga'}" data-id="${escapeHtml(carga.id)}" data-estado="${escapeHtml(carga.estado)}">
                                <i class="ti ${active ? 'ti-x' : 'ti-restore'}"></i>
                            </button>
                        </div>
                        <h5 class="cargar-items-file-title" title="${escapeHtml(carga.nombre_file)}">${escapeHtml(carga.nombre_file)}</h5>
                        <p class="text-muted fs-12 mb-3"><i class="ti ti-calendar-event me-1"></i>${escapeHtml(carga.fecha_registro || 'Fecha no disponible')}</p>
                        <div class="cargar-items-stats">
                            <div><span class="stat-value text-success">${escapeHtml(carga.cargados ?? 0)}</span><span class="stat-label">Cargados</span></div>
                            <div><span class="stat-value ${errores > 0 ? 'text-danger' : 'text-muted'}">${escapeHtml(errores)}</span><span class="stat-label">Errores</span></div>
                        </div>
                        ${errores > 0 ? `<button type="button" class="btn btn-sm btn-outline-danger w-100 mt-3 btn-ver-errores" data-id="${escapeHtml(carga.id)}" data-count="${errores}" data-file="${escapeHtml(carga.nombre_file)}"><i class="ti ti-alert-circle me-1"></i>Ver detalle de errores</button>` : ""}
                        <a href="items.php?id=${encodeURIComponent(md5(String(carga.id)))}" class="btn btn-outline-primary w-100 mt-3"><i class="ti ti-list-search me-1"></i>Ver items</a>
                    </div>
                </article>
            </div>
          `;
          container.insertAdjacentHTML("beforeend", card);
      });
      initTooltips();
  }

  function renderPagination(totalItems) {
      if (totalItems === 0) {
          paginationContainer.innerHTML = "";
          return;
      }
      const totalPages = Math.ceil(totalItems / perPage);
      const start = totalItems === 0 ? 0 : ((page - 1) * perPage) + 1;
      const end = Math.min(page * perPage, totalItems);

      let html = `
      <div class="card-footer border-0">
          <div class="align-items-center justify-content-between row text-center text-sm-start">
              <div class="col-sm">
                  <div class="text-muted">
                      Mostrando <span class="fw-semibold">${start}-${end}</span>
                      de <span class="fw-semibold">${totalItems}</span> cargas
                  </div>
              </div>

              <div class="col-sm-auto mt-3 mt-sm-0">
              <ul class="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
      `;

      html += `
          <li class="page-item ${page === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" data-page="${page - 1}">
                  <i class="ti ti-chevron-left"></i><span class="visually-hidden">Anterior</span>
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
                  <i class="ti ti-chevron-right"></i><span class="visually-hidden">Siguiente</span>
              </a>
          </li>
      `;

      html += `
              </ul>
              </div>
          </div>
      </div>
      `;

      paginationContainer.innerHTML = totalPages <= 1 ? `
        <div class="cargar-items-pagination-summary">Mostrando ${start}-${end} de ${totalItems} cargas</div>
      ` : html;

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
    const errorBtn = e.target.closest(".btn-ver-errores");
    if (errorBtn) {
      const id = Number(errorBtn.dataset.id || 0);
      modalErroresCargaTitle.textContent = `Errores de carga #${id}`;
      modalErroresCargaSubtitle.textContent = `${errorBtn.dataset.file || "Archivo"} · ${errorBtn.dataset.count || 0} fila(s) con error`;
      erroresCargaBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4"><span class="spinner-border spinner-border-sm me-2" role="status"></span>Cargando errores…</td></tr>';
      bootstrap.Modal.getOrCreateInstance(modalErroresCargaEl).show();

      try {
        const res = await fetch(`controller/table_carga_errores.php?id=${encodeURIComponent(id)}`);
        const json = await res.json();
        if (!res.ok || !json.ok || !Array.isArray(json.errores)) throw new Error(json.message || "No se pudieron cargar los errores");
        if (!json.errores.length) {
          erroresCargaBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">Esta carga se registró antes de guardar el detalle de errores.</td></tr>';
          return;
        }
        erroresCargaBody.innerHTML = json.errores.map(error => `
          <tr>
            <td class="text-nowrap"><span class="badge bg-light text-dark">Fila ${escapeHtml(error.fila_excel)}</span></td>
            <td class="fw-semibold text-break">${escapeHtml(error.modelo || "-")}</td>
            <td class="text-wrap">${escapeHtml(error.mensaje || "Error sin descripción")}</td>
          </tr>
        `).join("");
      } catch (error) {
        erroresCargaBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger py-4">${escapeHtml(error.message || "Error al consultar el detalle")}</td></tr>`;
      }
      return;
    }

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
