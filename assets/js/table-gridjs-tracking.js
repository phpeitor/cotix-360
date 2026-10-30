document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("filterDate");
    const estadoSelect = document.getElementById("filterEstado");
    const codigoInput = document.getElementById("filterCodTracking");
    const rucInput = document.getElementById("filterRuc");
    const tableContainer = document.getElementById("table-gridjs");
    if (!dateInput || !tableContainer) return;
    const puedeVerReceta = Number(tableContainer.dataset.userCargo || 0) === 1;

    const formatISO = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const formatFlatpickr = (d) => d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 30);

    function initTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"], .btn-tooltip').forEach(el => {
            if (!bootstrap.Tooltip.getInstance(el)) {
                new bootstrap.Tooltip(el);
            }
        });
    }

    const observer = new MutationObserver(() => initTooltips());
    observer.observe(tableContainer, {
        childList: true,
        subtree: true
    });

    flatpickr(dateInput, {
        mode: "range",
        dateFormat: "d M Y",
        defaultDate: [pastDate, today]
    });
    dateInput.value = `${formatFlatpickr(pastDate)} to ${formatFlatpickr(today)}`;

    const grid = new gridjs.Grid({
        columns: [
            { id: "id", name: "ID", width: "70px" },
            {
                id: "nombre",
                name: "Nombre",
                width: "260px",
                formatter: (cell, row) => renderNombre(cell, row)
            },
            { id: "id_receta", name: "", hidden: true },
            { id: "razon_social_empresa", name: "Razón Social", width: "240px" },
            { id: "ruc", name: "RUC", width: "120px" },
            {
                id: "cod_tracking",
                name: "Código Tracking",
                width: "170px",
                formatter: (cell, row) => renderCodTracking(cell, row)
            },
            { id: "created_at", name: "Fecha creación", width: "170px" },
            { id: "updated_at", name: "Última actualización", width: "185px" },
            {
                id: "origen_receta",
                name: "Origen",
                width: "110px",
                formatter: (cell, row) => renderOrigen(cell, row)
            },
            {
                id: "estado",
                name: "Estado",
                width: "110px",
                formatter: (cell) => renderEstado(cell)
            },
            {
                id: "acciones",
                name: "Acciones",
                width: "130px",
                sort: false,
                formatter: (cell, row) => renderAcciones(row)
            },
            { id: "cod_publico", name: "", hidden: true },
            { id: "total_actividades", name: "", hidden: true },
            { id: "final_proyecto_completado", name: "", hidden: true }
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
    }).render(tableContainer);

    function recargarGrid() {
        grid.updateConfig({
            server: {
                url: buildUrl(),
                method: "GET",
                then: res => res.data
            }
        }).forceRender();
    }

    document.getElementById("btn_buscar")?.addEventListener("click", recargarGrid);
    estadoSelect?.addEventListener("change", recargarGrid);
    [codigoInput, rucInput].forEach(input => input?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            recargarGrid();
        }
    }));

    function buildUrl() {
        const fp = dateInput._flatpickr;
        const estado = estadoSelect?.value || "todos";
        const cod_tracking = String(codigoInput?.value || "").trim();
        const ruc = String(rucInput?.value || "").trim();
        const params = new URLSearchParams({ estado, cod_tracking, ruc });

        if (fp && fp.selectedDates.length === 2) {
            params.set("fec_ini", formatISO(fp.selectedDates[0]));
            params.set("fec_fin", formatISO(fp.selectedDates[1]));
        }

        return "controller/tracking/table_tracking.php?" + params;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function renderCodTracking(cell, row) {
        const codInterno = String(cell || "");
        const codPublico = String(row?.cells?.[11]?.data ?? "").trim();

        if (codPublico) {
            const partes = codInterno.split("-");
            if (partes.length >= 4) {
                partes[partes.length - 1] = codPublico;
                return gridjs.html(`<span class="badge badge-outline-primary font-monospace">${escapeHtml(partes.join("-"))}</span>`);
            }
        }

        return gridjs.html(`<span class="badge badge-outline-primary font-monospace">${escapeHtml(codInterno || "-")}</span>`);
    }

    function renderNombre(nombre, row) {
        const idReceta = String(row?.cells?.[2]?.data ?? "").trim();
        const origenReceta = Number(row?.cells?.[8]?.data || 0) === 1;

        if (puedeVerReceta && origenReceta && idReceta && typeof md5 === "function") {
            const hash = md5(idReceta);
            return gridjs.html(`
                <a href="receta_form.php?id=${encodeURIComponent(hash)}"
                   class="fw-semibold link-primary"
                   data-bs-toggle="tooltip"
                   data-bs-title="Ver receta">
                    ${escapeHtml(String(nombre || "-"))}
                </a>
            `);
        }

        return gridjs.html(`<span>${escapeHtml(String(nombre || "-"))}</span>`);
    }

    function renderOrigen(cell, row) {
        const esReceta = Number(cell || 0) === 1;
        const idReceta = String(row?.cells?.[2]?.data ?? "").trim();
        const label = esReceta ? "Receta" : "Manual";
        const cls = esReceta ? "badge-outline-info" : "badge-outline-secondary";
        const badge = `<span class="badge ${cls}">${label}</span>`;

        if (puedeVerReceta && esReceta && idReceta && typeof md5 === "function") {
            const hash = md5(idReceta);
            return gridjs.html(`
                <a href="receta_form.php?id=${encodeURIComponent(hash)}"
                   data-bs-toggle="tooltip"
                   data-bs-title="Ver receta"
                   class="text-decoration-none">
                    ${badge}
                </a>
            `);
        }

        return gridjs.html(badge);
    }

    function renderEstado(cell) {
        const estado = String(cell || "abierto").trim();
        const cls = estado === "cerrado" ? "badge-outline-danger" : "badge-outline-primary";
        const label = estado === "cerrado" ? "Cerrado" : "Abierto";
        return gridjs.html(`<span class="badge ${cls}">${label}</span>`);
    }

    function renderAcciones(row) {
        const idTracking = String(row?.cells?.[0]?.data ?? "").trim();
        const codTracking = String(row?.cells?.[5]?.data ?? "").trim();
        const estado = String(row?.cells?.[9]?.data ?? "").trim();
        const codPublico = String(row?.cells?.[11]?.data ?? "").trim();
        const totalActividades = Number(row?.cells?.[12]?.data ?? 0);
        const finalProyectoCompletado = Number(row?.cells?.[13]?.data ?? 0) === 1;

        const codPublicoCompleto = codPublico
            ? codTracking.substring(0, codTracking.lastIndexOf('-') + 1) + codPublico
            : codTracking;
        const trackingUrl = String(tableContainer.dataset.trackingUrl || "").trim();

        let botones = `
            <a href="javascript:void(0);"
               class="btn btn-sm btn-soft-info btn-icon me-1"
               data-tracking-actividades="1"
               data-tracking-id="${escapeHtml(idTracking)}"
                data-tracking-cod="${escapeHtml(codPublicoCompleto)}"
               data-tracking-estado="${escapeHtml(estado)}"
               data-bs-toggle="tooltip"
               data-bs-title="Actividades">
                <i class="ti ti-checklist fs-18"></i>
            </a>`;

        const urlPublica = buildPublicTrackingUrl(trackingUrl, codPublicoCompleto);
        if (urlPublica) {
            botones += `
            <a href="${escapeHtml(urlPublica)}"
               class="btn btn-sm btn-soft-success btn-icon me-1"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Abrir tracking público ${escapeHtml(codPublicoCompleto)}"
               data-bs-toggle="tooltip"
               data-bs-title="Abrir tracking público">
                <i class="ti ti-external-link fs-18"></i>
            </a>`;
        }

        if (totalActividades >= 1) {
            botones += `
            <a href="javascript:void(0);"
               class="btn btn-sm btn-soft-primary btn-icon me-1"
               data-tracking-timeline="1"
               data-tracking-id="${escapeHtml(idTracking)}"
               data-tracking-cod="${escapeHtml(codTracking)}"
               data-tracking-cod-publico="${escapeHtml(codPublicoCompleto)}"
               data-bs-toggle="tooltip"
               data-bs-title="Timeline">
                <i class="ti ti-pin fs-18"></i>
            </a>`;
        }

        if (estado === 'abierto' && finalProyectoCompletado && totalActividades >= 2) {
            botones += `
            <a href="javascript:void(0);"
               class="btn btn-sm btn-soft-danger btn-icon"
               data-cerrar-tracking="1"
               data-tracking-id="${escapeHtml(idTracking)}"
               data-tracking-cod="${escapeHtml(codTracking)}"
               data-bs-toggle="tooltip"
               data-bs-title="Cerrar">
                <i class="ti ti-lock fs-18"></i>
            </a>`;
        }

        return gridjs.html(botones);
    }

    function buildPublicTrackingUrl(baseUrl, codTracking) {
        if (!baseUrl || !codTracking) return "";
        try {
            if (baseUrl.includes("cod_tracking=")) {
                return baseUrl + encodeURIComponent(codTracking);
            }
            const url = new URL(baseUrl, window.location.href);
            url.searchParams.set("cod_tracking", codTracking);
            return url.href;
        } catch (error) {
            console.error("TRACKING_URL no es una URL válida", error);
            return "";
        }
    }
});
