document.addEventListener("DOMContentLoaded", () => {
    let recetaListEventSource = null;
    let streamSignature = "";
    let pendingPdfHash = "";

    const successModalEl = document.getElementById("success-alert-modal");
    const inputNombreReceta = document.getElementById("input-nombre-receta");
    const btnGuardarNombreReceta = document.getElementById("btn-guardar-nombre-receta");
    const successModal = successModalEl ? new bootstrap.Modal(successModalEl) : null;
    const ofertaModalEl = document.getElementById("oferta-pdf-modal");
    const ofertaModal = ofertaModalEl ? new bootstrap.Modal(ofertaModalEl) : null;
    const ofertaItemsContainer = document.getElementById("oferta-items-container");
    const ofertaItemsSelectedCount = document.getElementById("oferta-items-selected-count");
    const btnOfertaSelectAll = document.getElementById("btn-oferta-select-all");
    const btnOfertaClearAll = document.getElementById("btn-oferta-clear-all");
    const btnGenerarOfertaPdf = document.getElementById("btn-generar-oferta-pdf");
    const btnGenerarOfertaExcel = document.getElementById("btn-generar-oferta-excel");
    let ofertaActualHash = "";

    function confirmarPdfDetalle() {
        return new Promise(resolve => {
            alertify.confirm(
                "Detalle de receta",
                "¿Desea generar el PDF del detalle de la receta?",
                () => resolve(true),
                () => resolve(false)
            ).set("labels", { ok: "Si", cancel: "No" });
        });
    }

    function abrirPdfReceta(hash) {
        window.open(`pdf_receta.php?id=${encodeURIComponent(hash)}&detalle=1`, "_blank", "noopener,noreferrer");
    }

    function initTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"], .btn-tooltip').forEach(el => {
            if (!bootstrap.Tooltip.getInstance(el)) {
                new bootstrap.Tooltip(el);
            }
        });
    }

    const observer = new MutationObserver(() => {
        aplicarPermisosAdmin();
        initTooltips();
    });

    observer.observe(document.getElementById("table-gridjs"), {
        childList: true,
        subtree: true
    });

    const dateInput = document.getElementById("filterDate");
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);
    const formatISO = (d) => d.toISOString().split("T")[0]; 
    const formatFlatpickr = (d) =>
        d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const defaultRangeText =
        `${formatFlatpickr(pastDate)} to ${formatFlatpickr(today)}`;

    // Inicializar Flatpickr
    flatpickr(dateInput, {
        mode: "range",
        dateFormat: "d M Y",
        defaultDate: [pastDate, today]
    });

    dateInput.value = defaultRangeText;

    /* ---------------------------------------------------
       📊 GRID
    --------------------------------------------------- */
    const grid = new gridjs.Grid({
        columns: [
            { id: "id", name: "ID", width: "70px" },
            { id: "usuario", name: "Usuario", width: "80px" },
            {
                id: "nombre",
                name: "Receta",
                width: "220px",
                formatter: (cell, row) => renderRecetaCliente(cell, row)
            },
            { id: "cliente_ruc", name: "RUC", hidden: true },
            { id: "cliente_razon_social_empresa", name: "Razón Social", hidden: true },
            {
                id: "estado",
                name: "Estado",
                width: "100px",
                formatter: (cell) => renderEstado(cell)
            },

            {
                id: "items",
                name: "Items",
                width: "280px",
                formatter: (cell, row) => renderItems(cell, row)
            },

            { id: "total_items", name: "", hidden: true },

            { id: "created_at", name: "Fecha", width: "150px" },

            {
                name: "Opciones",
                width: "210px",
                sort: false,
                formatter: renderAcciones
            }
        ],
        server: {
            url: buildUrl(),
            method: "GET",
            then: res => res.data
        },
        pagination: {
            enabled: true,
            limit: 10
        },
        sort: true,
        search: true
    }).render(document.getElementById("table-gridjs"));

    grid.on("ready", aplicarPermisosAdmin);

    conectarStreamRecetaList();

    /* ---------------------------------------------------
       🔎 BOTÓN BUSCAR
    --------------------------------------------------- */
    document.getElementById("btn_buscar").addEventListener("click", () => {
        grid.updateConfig({
            server: {
                url: buildUrl(),
                method: "GET",
                then: res => res.data
            }
        }).forceRender();

        conectarStreamRecetaList();
    });

    window.addEventListener("beforeunload", () => {
        if (recetaListEventSource) {
            recetaListEventSource.close();
            recetaListEventSource = null;
        }
    });

    function buildUrl() {
        const fp = dateInput._flatpickr;
        let fec_ini, fec_fin;

        if (fp && fp.selectedDates.length === 2) {
            fec_ini = formatISO(fp.selectedDates[0]);
            fec_fin = formatISO(fp.selectedDates[1]);
        } else {
            fec_ini = formatISO(pastDate);
            fec_fin = formatISO(today);
        }

        return "controller/table_receta.php?" + new URLSearchParams({
            fec_ini,
            fec_fin
        });
    }

    function getCurrentDateRangeIso() {
        const fp = dateInput._flatpickr;
        if (fp && fp.selectedDates.length === 2) {
            return {
                fec_ini: formatISO(fp.selectedDates[0]),
                fec_fin: formatISO(fp.selectedDates[1])
            };
        }

        return {
            fec_ini: formatISO(pastDate),
            fec_fin: formatISO(today)
        };
    }

    function conectarStreamRecetaList() {
        if (typeof window.EventSource === "undefined") {
            return;
        }

        const { fec_ini, fec_fin } = getCurrentDateRangeIso();
        const nextSignature = `${fec_ini}|${fec_fin}`;

        if (streamSignature === nextSignature && recetaListEventSource) {
            return;
        }

        streamSignature = nextSignature;

        if (recetaListEventSource) {
            recetaListEventSource.close();
            recetaListEventSource = null;
        }

        const streamUrl = "controller/stream_receta.php?" + new URLSearchParams({ fec_ini, fec_fin });
        recetaListEventSource = new EventSource(streamUrl);

        recetaListEventSource.addEventListener("new_receta", event => {
            try {
                const payload = JSON.parse(event.data || "{}");
                const nuevas = Number(payload.nuevas_recetas || 0);
                const usuarioReceta = String(payload.usuario_receta || "").trim();

                grid.forceRender();

                if (nuevas > 0) {
                    const etiqueta = nuevas === 1 ? "nueva receta" : `${nuevas} nuevas recetas`;
                    const sufijo = usuarioReceta ? ` de ${usuarioReceta}` : "";
                    alertify.success(`Se detecto ${etiqueta}${sufijo}.`);
                } else {
                    alertify.message("Se actualizo el listado de recetas.");
                }
            } catch (error) {
                console.error("Error procesando stream_receta:", error);
            }
        });

        recetaListEventSource.addEventListener("error", () => {
            // EventSource maneja reconexion automatica.
        });
    }

    function renderEstado(estado) {
        const map = {
            "Borrador": "badge-outline-primary",
            "Enviada": "badge-outline-info",
            "Ofertado": "badge-outline-warning",
            "Aprobada": "badge-outline-success",
            "Anulada": "badge-outline-danger"
        };

        const cls = map[estado] || "badge-outline-secondary";

        return gridjs.html(
            `<span class="badge ${cls}">${estado}</span>`
        );
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function renderRecetaCliente(nombre, row) {
        const recetaNombre = String(nombre ?? "").trim().replace(/\s*-\s*\d+$/, "").trim();
        const ruc = String(row?.cells?.[3]?.data ?? "").trim();
        const razonSocial = String(row?.cells?.[4]?.data ?? "").trim();
        const cliente = [ruc, razonSocial].filter(Boolean).join(" - ");

        if (!recetaNombre && !cliente) {
            return gridjs.html("<span></span>");
        }

        return gridjs.html(`
            <div class="lh-sm">
                <span>${escapeHtml(recetaNombre)}</span>
                ${cliente ? `<small class="d-block text-muted mt-1">${escapeHtml(cliente)}</small>` : ""}
            </div>
        `);
    }

    function renderItems(items, row) {
        if (!items) return "";

        const arr = items.split("|").map(i => i.trim());
        const total = Number(row?.cells?.[7]?.data ?? arr.length);
        const recipeId = String(row?.cells?.[0]?.data ?? "").trim();

        if (total === 1) {
            return gridjs.html(`<span>${arr[0]}</span>`);
        }

        const maxVisible = 4;
        const visibleItems = arr.slice(0, maxVisible);
        const hiddenItems = arr.slice(maxVisible);
        const list = visibleItems.map(i => `<li>${i}</li>`).join("");
        const hiddenList = hiddenItems.map(i => `<li>${i}</li>`).join("");
        const collapseId = `receta-items-${recipeId || Math.random().toString(36).slice(2, 10)}`;
        const hiddenCount = Math.max(0, total - maxVisible);

        let itemsHtml = `
            <div class="receta-items-preview">
                <ul class="mb-1 ps-3 receta-items-visible">${list}</ul>`;

        if (hiddenItems.length) {
            itemsHtml += `
                <div id="${collapseId}" class="receta-items-hidden collapse">
                    <ul class="mb-1 ps-3">${hiddenList}</ul>
                </div>
                <button type="button"
                        class="btn btn-link p-0 receta-items-toggle"
                        data-receta-items-toggle="${collapseId}"
                        data-hidden-count="${hiddenCount}"
                        aria-expanded="false">
                    Ver más (+${hiddenCount})
                </button>`;
        }

        itemsHtml += `
                <small class="text-muted fw-semibold d-block mt-1">
                    Total items: ${total}
                </small>`;
        
        itemsHtml += `</div>`;

        return gridjs.html(itemsHtml);
    }

    function agruparDetalleOferta(detalle) {
        const grupos = { PRODUCTO: new Map(), SERVICIO: new Map() };

        detalle.forEach(item => {
            const tipo = String(item.tipo || "").trim().toUpperCase() === "PRODUCTO" ? "PRODUCTO" : "SERVICIO";
            const subcat = String(item.sub_cat_1 || "Sin subcategoria").trim() || "Sin subcategoria";

            if (!grupos[tipo].has(subcat)) {
                grupos[tipo].set(subcat, []);
            }

            grupos[tipo].get(subcat).push(item);
        });

        return grupos;
    }

    function renderOfertaItemsModal(detalle) {
        if (!ofertaItemsContainer) return;

        const grupos = agruparDetalleOferta(detalle);
        let html = "";

        Object.entries({ PRODUCTO: "Productos", SERVICIO: "Servicios" }).forEach(([tipo, titulo]) => {
            const subcats = grupos[tipo];
            if (!subcats || subcats.size === 0) return;

            html += `
                <div class="mb-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h5 class="mb-0 text-uppercase fs-13 fw-bold text-primary">${escapeHtml(titulo)}</h5>
                    </div>`;

            subcats.forEach((items, subcat) => {
                const groupId = `oferta-grupo-${tipo}-${md5(subcat).slice(0, 8)}`;
                html += `
                        <div class="card border mb-2">
                        <div class="card-header bg-light py-2 d-flex flex-wrap gap-3 justify-content-between align-items-center">
                            <div class="form-check mb-0">
                                <input class="form-check-input oferta-grupo-check" type="checkbox" id="${groupId}" data-group="${groupId}" checked>
                                <label class="form-check-label fw-semibold" for="${groupId}">${escapeHtml(subcat)}</label>
                            </div>
                            <div class="d-flex flex-wrap gap-3 align-items-center">
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input oferta-grupo-col-check" type="checkbox" id="${groupId}-descripcion" data-subcat="${escapeHtml(subcat)}" value="descripcion">
                                    <label class="form-check-label" for="${groupId}-descripcion">Descripcion</label>
                                </div>
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input oferta-grupo-col-check" type="checkbox" id="${groupId}-marca" data-subcat="${escapeHtml(subcat)}" value="marca">
                                    <label class="form-check-label" for="${groupId}-marca">Marca</label>
                                </div>
                                <span class="badge bg-primary-subtle text-primary">${items.length} items</span>
                            </div>
                        </div>
                        <div class="list-group list-group-flush">`;

                items.forEach(item => {
                    const itemId = String(item.id || "").trim();
                    const inputId = `oferta-item-${itemId}`;
                    const descripcion = String(item.descripcion || "-").trim() || "-";
                    const marca = String(item.marca || "-").trim() || "-";

                    html += `
                        <label class="list-group-item d-flex gap-3 align-items-start">
                            <input class="form-check-input mt-1 oferta-item-check" type="checkbox" id="${inputId}" value="${escapeHtml(itemId)}" data-group="${groupId}" checked>
                            <span class="flex-grow-1">
                                <span class="fw-semibold d-block">${escapeHtml(item.nombre || "SIN NOMBRE")}</span>
                                <span class="text-muted small d-block">${escapeHtml(descripcion)}</span>
                                <span class="text-muted small">Marca: ${escapeHtml(marca)}</span>
                            </span>
                        </label>`;
                });

                html += `</div></div>`;
            });

            html += `</div>`;
        });

        ofertaItemsContainer.innerHTML = html || '<div class="alert alert-warning mb-0">No hay items para mostrar.</div>';
        actualizarContadorOferta();
    }

    function actualizarContadorOferta() {
        if (!ofertaItemsSelectedCount) return;

        const checks = Array.from(document.querySelectorAll(".oferta-item-check"));
        const selected = checks.filter(check => check.checked).length;
        ofertaItemsSelectedCount.textContent = `${selected} item${selected === 1 ? "" : "s"} seleccionado${selected === 1 ? "" : "s"}`;
    }

    function getOfertaGroupCols() {
        const groupCols = {};
        document.querySelectorAll(".oferta-grupo-col-check").forEach(check => {
            const subcat = String(check.dataset.subcat || "").trim();
            if (!subcat) return;
            if (!groupCols[subcat]) groupCols[subcat] = [];
            if (check.checked) groupCols[subcat].push(check.value);
        });
        return groupCols;
    }

    function getOfertaColsUnion() {
        const cols = new Set(["cantidad"]);
        Object.values(getOfertaGroupCols()).forEach(groupCols => {
            groupCols.forEach(col => cols.add(col));
        });
        return Array.from(cols);
    }

    async function abrirOfertaPdfSeleccionada() {
        const selectedItems = Array.from(document.querySelectorAll(".oferta-item-check:checked"))
            .map(check => check.value)
            .filter(Boolean);

        if (!selectedItems.length) {
            alertify.error("Seleccione al menos un item para imprimir");
            return;
        }

        const selectedCols = getOfertaColsUnion();

        try {
            if (btnGenerarOfertaPdf) {
                btnGenerarOfertaPdf.disabled = true;
            }

            const estadoRes = await fetch("controller/upd_receta_ofertado.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ id: ofertaActualHash })
            });
            const estadoJson = await estadoRes.json();

            if (!estadoRes.ok || !estadoJson.success) {
                alertify.error(estadoJson.message || "No se pudo actualizar el estado de la receta");
                return;
            }
        } catch (error) {
            alertify.error("Error de conexión al actualizar el estado");
            return;
        } finally {
            if (btnGenerarOfertaPdf) {
                btnGenerarOfertaPdf.disabled = false;
            }
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "pdf_receta.php";
        form.target = "_blank";
        form.style.display = "none";

        [
            ["id", ofertaActualHash],
            ["oferta", "1"],
            ["oferta_items", selectedItems.join(",")],
            ["oferta_cols", selectedCols.join(",")]
        ].forEach(([name, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        form.remove();
        ofertaModal?.hide();
        grid.forceRender();
    }

    function abrirOfertaExcelSeleccionada() {
        const selectedItems = Array.from(document.querySelectorAll(".oferta-item-check:checked"))
            .map(check => check.value)
            .filter(Boolean);

        if (!selectedItems.length) {
            alertify.error("Seleccione al menos un item para exportar");
            return;
        }

        const groupCols = getOfertaGroupCols();

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "controller/export_oferta_comercial_excel.php";
        form.target = "_blank";
        form.style.display = "none";

        [
            ["id", ofertaActualHash],
            ["oferta_items", selectedItems.join(",")],
            ["oferta_group_cols", JSON.stringify(groupCols)]
        ].forEach(([name, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        form.remove();
        ofertaModal?.hide();
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-receta-items-toggle]");
        if (!btn) return;

        const targetId = String(btn.dataset.recetaItemsToggle || "").trim();
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        const expanded = target.classList.toggle("show");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        const hiddenCount = Number(btn.dataset.hiddenCount || 0);
        btn.textContent = expanded ? "Ver menos" : `Ver más (+${hiddenCount})`;
    });

    function renderAcciones(_, row) {
        const id = row.cells[0].data;
        const estado = row.cells[5].data;
        const hashId = md5(String(id));

        let botones = `
            <a href="receta_form.php?id=${hashId}" 
                class="btn btn-soft-primary btn-icon btn-sm rounded-circle"
                data-bs-toggle="tooltip"
                data-bs-title="Ver"
            >
                <i class="ti ti-eye"></i>
            </a>

            <button type="button"
                    class="btn btn-soft-secondary btn-icon btn-sm rounded-circle btn-duplicar-receta"
                    data-id="${id}"
                    data-bs-toggle="tooltip"
                    data-bs-title="Duplicar"
                    title="Duplicar">
                <i class="ti ti-copy"></i>
            </button>

            <a href="pdf_receta.php?id=${hashId}&oferta=1"
                target="_blank"
                rel="noopener noreferrer"
                title="Oferta PComercialDF"
                data-bs-toggle="tooltip"
                data-bs-title="Oferta Comercial"
                class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-oferta-receta"
                data-hash="${hashId}">
                    <i class="ti ti-file-dollar"></i>
            </a>
        `;

        if (estado === "Aprobada") {
            const mostrarExcel = !(typeof CARGO !== 'undefined' && Number(CARGO) === 4);

            botones += `
                <a href="pdf_receta.php?id=${hashId}"
                target="_blank"
                rel="noopener noreferrer"
                title="PDF"
                data-bs-toggle="tooltip"
                data-bs-title="PDF"
                class="btn btn-soft-warning btn-icon btn-sm rounded-circle btn-pdf-receta"
                data-hash="${hashId}">
                    <i class="ti ti-file"></i>
                </a>`

            if (mostrarExcel) {
                botones += `
                <a href="controller/export_receta_excel.php?id=${hashId}"
                target="_blank"
                rel="noopener noreferrer"
                title="Excel"
                data-bs-toggle="tooltip"
                data-bs-title="Excel"
                class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-excel-receta"
                data-hash="${hashId}">
                    <i class="ti ti-file-spreadsheet"></i>
                </a>
            `;
                botones = botones.replace(/\s*<a href="controller\/export_receta_excel\.php\?id=\$\{hashId\}"[\s\S]*?<\/a>\s*/,
                    "");
            }

        } else if (estado === "Anulada") {
            botones += `
                <a href="pdf_receta.php?id=${hashId}"
                target="_blank"
                rel="noopener noreferrer"
                title="PDF"
                data-bs-toggle="tooltip"
                data-bs-title="PDF"
                class="btn btn-soft-warning btn-icon btn-sm rounded-circle btn-pdf-receta"
                data-hash="${hashId}">
                    <i class="ti ti-file"></i>
                </a>
            `;
        } else {
            botones += `
                <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-estado isadmin"
                        data-id="${id}"
                        data-accion="aprobar"
                        data-bs-toggle="tooltip"
                        data-bs-title="Aprobar"
                        title="Aprobar">
                    <i class="ti ti-check"></i>
                </button>

                <button class="btn btn-soft-danger btn-icon btn-sm rounded-circle btn-estado isadmin"
                        data-id="${id}"
                        data-accion="anular"
                        data-bs-toggle="tooltip"
                        data-bs-title="Anular"
                        title="Anular">
                    <i class="ti ti-x"></i>
                </button>
            `;
        }

        return gridjs.html(`
            <div class="d-flex gap-1 justify-content-center">
                ${botones}
            </div>
        `);
    }

    document.addEventListener("click", e => {
        const btn = e.target.closest(".btn-estado");
        if (!btn) return;

        const id     = btn.dataset.id;
        const accion = btn.dataset.accion;

        const texto = accion === "aprobar"
            ? "¿Deseas aprobar esta receta?"
            : "¿Deseas anular esta receta?";

        alertify.confirm("Confirmar",texto,
            () => actualizarEstado(id, accion),
            () => {}
        );
    });

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-duplicar-receta");
        if (!btn) return;

        const id = btn.dataset.id;
        if (!id) return;

        const confirmed = await new Promise(resolve => {
            alertify.confirm(
                "Duplicar receta",
                "¿Deseas duplicar esta receta?",
                () => resolve(true),
                () => resolve(false)
            );
        });

        if (!confirmed) return;

        try {
            btn.disabled = true;
            const res = await fetch("controller/duplicar_receta.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ id })
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                alertify.error(json.message || "No se pudo duplicar la receta");
                return;
            }

            alertify.success(json.message || "Receta duplicada correctamente");
            grid.forceRender();
        } catch (error) {
            alertify.error("Error de conexión al duplicar receta");
        } finally {
            btn.disabled = false;
        }
    });

    document.addEventListener("click", async (e) => {
        const btnPdf = e.target.closest(".btn-pdf-receta");
        if (!btnPdf) return;

        e.preventDefault();

        const hash = String(btnPdf.dataset.hash || "").trim();
        if (!hash) {
            alertify.error("No se pudo identificar la receta");
            return;
        }

        try {
            const res = await fetch(`controller/get_receta.php?id=${encodeURIComponent(hash)}`);
            const json = await res.json();

            if (!res.ok || json.error || !json.receta) {
                alertify.error(json.message || "No se pudo validar la receta");
                return;
            }

            const nombreReceta = String(json.receta.nombre ?? "").trim();

            if (nombreReceta !== "") {
                if (!await confirmarPdfDetalle()) return;
                abrirPdfReceta(hash);
                return;
            }

            // Si el usuario es técnico (cargo === 4) no mostrar modal, abrir PDF directamente
            if (typeof CARGO !== 'undefined' && Number(CARGO) === 4) {
                if (!await confirmarPdfDetalle()) return;
                abrirPdfReceta(hash);
                return;
            }

            pendingPdfHash = hash;
            if (inputNombreReceta) {
                inputNombreReceta.value = "";
                inputNombreReceta.focus();
            }

            successModal?.show();
        } catch (error) {
            alertify.error("Error de conexion al validar nombre de receta");
        }
    });

    document.addEventListener("click", async (e) => {
        const btnOfertaExcel = e.target.closest(".btn-oferta-excel");
        if (btnOfertaExcel) {
            e.preventDefault();

            const hash = String(btnOfertaExcel.dataset.hash || "").trim();
            if (!hash) {
                alertify.error("No se pudo identificar la receta");
                return;
            }

            try {
                btnOfertaExcel.classList.add("disabled");
                const res = await fetch(`controller/get_receta.php?id=${encodeURIComponent(hash)}`);
                const json = await res.json();

                if (!res.ok || json.error || !json.receta) {
                    alertify.error(json.message || "No se pudo validar la receta");
                    return;
                }

                const cliente = json.cliente || {};
                const campos = [
                    ["razon_social_empresa", "Razón social"],
                    ["direccion", "Dirección"],
                    ["ruc", "RUC"],
                    ["nombre_completo", "Contacto"],
                    ["correo", "Correo"],
                    ["celular", "Celular"],
                    ["motivo", "Motivo"],
                    ["tiempo_entrega", "Tiempo de entrega"],
                    ["condiciones_pago", "Condiciones de pago"],
                    ["vendedor", "Vendedor"],
                    ["vendedor_correo", "Email vendedor"],
                    ["vendedor_telefono", "Teléfono vendedor"],
                    ["condiciones_economicas_dias", "Días de suspensión"]
                ];

                const faltantes = campos
                    .filter(([key]) => String(cliente[key] ?? "").trim() === "")
                    .map(([, label]) => label);

                if (faltantes.length) {
                    alertify.alert(
                        "Datos incompletos",
                        `Para emitir la oferta Excel complete datos de cliente y comerciales:<br><br>${faltantes.map(campo => `- ${escapeHtml(campo)}`).join("<br>")}`
                    );
                    return;
                }

                ofertaActualHash = hash;
                renderOfertaItemsModal(Array.isArray(json.detalle) ? json.detalle : []);
                ofertaModal?.show();
            } catch (error) {
                alertify.error("Error de conexión al validar la oferta");
            } finally {
                btnOfertaExcel.classList.remove("disabled");
            }
            return;
        }

        const btnOferta = e.target.closest(".btn-oferta-receta");
        if (!btnOferta) return;

        e.preventDefault();

        const hash = String(btnOferta.dataset.hash || "").trim();
        if (!hash) {
            alertify.error("No se pudo identificar la receta");
            return;
        }

        try {
            btnOferta.classList.add("disabled");

            const res = await fetch(`controller/get_receta.php?id=${encodeURIComponent(hash)}`);
            const json = await res.json();

            if (!res.ok || json.error || !json.receta) {
                alertify.error(json.message || "No se pudo validar la receta");
                return;
            }

            const cliente = json.cliente || {};
            const campos = [
                ["razon_social_empresa", "Razón social"],
                ["direccion", "Dirección"],
                ["ruc", "RUC"],
                ["nombre_completo", "Contacto"],
                ["correo", "Correo"],
                ["celular", "Celular"],
                ["motivo", "Motivo"],
                ["tiempo_entrega", "Tiempo de entrega"],
                ["condiciones_pago", "Condiciones de pago"],
                ["vendedor", "Vendedor"],
                ["vendedor_correo", "Email vendedor"],
                ["vendedor_telefono", "Teléfono vendedor"],
                ["condiciones_economicas_dias", "Días de suspensión"]
            ];

            const faltantes = campos
                .filter(([key]) => String(cliente[key] ?? "").trim() === "")
                .map(([, label]) => label);

            if (faltantes.length) {
                alertify.alert(
                    "Datos incompletos",
                    `Para emitir la oferta PDF complete datos de cliente y comerciales:<br><br>${faltantes.map(campo => `- ${escapeHtml(campo)}`).join("<br>")}`
                );
                return;
            }

            ofertaActualHash = hash;
            renderOfertaItemsModal(Array.isArray(json.detalle) ? json.detalle : []);
            ofertaModal?.show();
        } catch (error) {
            alertify.error("Error de conexión al validar la oferta");
        } finally {
            btnOferta.classList.remove("disabled");
        }
    });

    ofertaItemsContainer?.addEventListener("change", (e) => {
        const itemCheck = e.target.closest(".oferta-item-check");
        const groupCheck = e.target.closest(".oferta-grupo-check");

        if (groupCheck) {
            const group = groupCheck.dataset.group;
            document.querySelectorAll(`.oferta-item-check[data-group="${group}"]`).forEach(check => {
                check.checked = groupCheck.checked;
            });
        }

        if (itemCheck) {
            const group = itemCheck.dataset.group;
            const items = Array.from(document.querySelectorAll(`.oferta-item-check[data-group="${group}"]`));
            const groupInput = document.querySelector(`.oferta-grupo-check[data-group="${group}"]`);
            if (groupInput) {
                groupInput.checked = items.every(check => check.checked);
                groupInput.indeterminate = items.some(check => check.checked) && !groupInput.checked;
            }
        }

        actualizarContadorOferta();
    });

    btnOfertaSelectAll?.addEventListener("click", () => {
        document.querySelectorAll(".oferta-item-check, .oferta-grupo-check, .oferta-grupo-col-check").forEach(check => {
            check.checked = true;
            check.indeterminate = false;
        });
        actualizarContadorOferta();
    });

    btnOfertaClearAll?.addEventListener("click", () => {
        document.querySelectorAll(".oferta-item-check, .oferta-grupo-check").forEach(check => {
            check.checked = false;
            check.indeterminate = false;
        });
        actualizarContadorOferta();
    });

    btnGenerarOfertaPdf?.addEventListener("click", abrirOfertaPdfSeleccionada);
    btnGenerarOfertaExcel?.addEventListener("click", abrirOfertaExcelSeleccionada);

    btnGuardarNombreReceta?.addEventListener("click", async () => {
        const nombre = String(inputNombreReceta?.value ?? "").trim();

        if (!pendingPdfHash) {
            alertify.error("No hay receta seleccionada");
            return;
        }

        if (!nombre) {
            alertify.error("Ingrese el nombre de la receta");
            inputNombreReceta?.focus();
            return;
        }

        const hash = pendingPdfHash;

        try {
            btnGuardarNombreReceta.disabled = true;

            const body = new URLSearchParams({
                hash,
                nombre
            });

            const res = await fetch("controller/upd_nombre_receta.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                alertify.error(json.message || "No se pudo guardar el nombre");
                return;
            }

            successModal?.hide();
            alertify.success("Nombre de receta guardado");
            if (!await confirmarPdfDetalle()) {
                grid.forceRender();
                return;
            }
            abrirPdfReceta(hash);
            grid.forceRender();
        } catch (error) {
            alertify.error("Error de conexion al guardar nombre");
        } finally {
            btnGuardarNombreReceta.disabled = false;
        }
    });

    successModalEl?.addEventListener("hidden.bs.modal", () => {
        pendingPdfHash = "";
        if (inputNombreReceta) {
            inputNombreReceta.value = "";
        }
    });

    function actualizarEstado(id, accion) {
        fetch("controller/upd_estado_receta.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ id, accion })
        })
        .then(res => res.json())
        .then(resp => {
            if (!resp.success) {
                alertify.error(resp.message || "Error");
                return;
            }
            alertify.success(`Receta ${resp.estado}`);
            grid.forceRender();
        })
        .catch(() => alertify.error("Error de conexión"));
    }

});
