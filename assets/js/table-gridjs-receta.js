document.addEventListener("DOMContentLoaded", () => {
    let recetaListEventSource = null;
    let streamSignature = "";

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
                width: "140px",
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
            "Aprobada": "badge-outline-success",
            "Anulada": "badge-outline-danger"
        };

        const cls = map[estado] || "badge-outline-secondary";

        return gridjs.html(
            `<span class="badge ${cls}">${estado}</span>`
        );
    }

    function renderItems(items, row) {
        if (!items) return "";

        const arr = items.split("|").map(i => i.trim());
        const total = Number(row?.cells?.[4]?.data ?? arr.length);

        if (total === 1) {
            return gridjs.html(`<span>${arr[0]}</span>`);
        }

        const list = arr.map(i => `<li>${i}</li>`).join("");

        let itemsHtml = `
            <div>
                <ul class="mb-1 ps-3">${list}</ul>
                <small class="text-muted fw-semibold">
                    Total items: ${total}
                </small>`;
        
        itemsHtml += `</div>`;

        return gridjs.html(itemsHtml);
    }

    function renderAcciones(_, row) {
        const id = row.cells[0].data;
        const estado = row.cells[2].data;
        const hashId = md5(String(id));

        let botones = `
            <a href="receta_form.php?id=${hashId}" 
                class="btn btn-soft-primary btn-icon btn-sm rounded-circle"
                data-bs-toggle="tooltip"
                data-bs-title="Ver"
            >
                <i class="ti ti-eye"></i>
            </a>
        `;

        if (estado === "Aprobada") {
            botones += `
                <button class="btn btn-soft-danger btn-icon btn-sm rounded-circle btn-estado isadmin"
                        data-id="${id}"
                        data-accion="anular"
                        data-bs-toggle="tooltip"
                        data-bs-title="Anular"
                        title="Anular">
                    <i class="ti ti-x"></i>
                </button>

                <a href="pdf_receta.php?id=${hashId}"
                target="_blank"
                rel="noopener noreferrer"
                title="PDF"
                class="btn btn-soft-warning btn-icon btn-sm rounded-circle">
                    <i class="ti ti-file"></i>
                </a>
            `;

        } else if (estado === "Anulada") {
            botones += `
                <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-estado isadmin"
                        data-id="${id}"
                        data-accion="aprobar"
                        data-bs-toggle="tooltip"
                        data-bs-title="Aprobar"
                        title="Aprobar">
                    <i class="ti ti-check"></i>
                </button>
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
