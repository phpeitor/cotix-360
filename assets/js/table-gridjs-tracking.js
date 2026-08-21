document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("filterDate");
    const tableContainer = document.getElementById("table-gridjs");
    if (!dateInput || !tableContainer) return;

    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);

    const formatISO = (d) => d.toISOString().split("T")[0];
    const formatFlatpickr = (d) =>
        d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

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
            { id: "created_at", name: "Fecha", width: "170px" },
            {
                id: "origen_receta",
                name: "Origen",
                width: "110px",
                formatter: (cell, row) => renderOrigen(cell, row)
            },
            {
                id: "acciones",
                name: "Acciones",
                width: "130px",
                sort: false,
                formatter: (cell, row) => renderAcciones(row)
            },
            { id: "cod_publico", name: "", hidden: true },
            { id: "estado", name: "", hidden: true },
            { id: "total_actividades", name: "", hidden: true }
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

    document.getElementById("btn_buscar")?.addEventListener("click", () => {
        grid.updateConfig({
            server: {
                url: buildUrl(),
                method: "GET",
                then: res => res.data
            }
        }).forceRender();
    });

    function buildUrl() {
        const fp = dateInput._flatpickr;
        let fec_ini = formatISO(pastDate);
        let fec_fin = formatISO(today);

        if (fp && fp.selectedDates.length === 2) {
            fec_ini = formatISO(fp.selectedDates[0]);
            fec_fin = formatISO(fp.selectedDates[1]);
        }

        return "controller/tracking/table_tracking.php?" + new URLSearchParams({ fec_ini, fec_fin });
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
        const codPublico = String(row?.cells?.[9]?.data ?? "").trim();

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
        const origenReceta = Number(row?.cells?.[7]?.data || 0) === 1;

        if (origenReceta && idReceta && typeof md5 === "function") {
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

        if (esReceta && idReceta && typeof md5 === "function") {
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

    function renderAcciones(row) {
        const idTracking = String(row?.cells?.[0]?.data ?? "").trim();
        const codTracking = String(row?.cells?.[5]?.data ?? "").trim();
        const estado = String(row?.cells?.[10]?.data ?? "").trim();
        const totalActividades = Number(row?.cells?.[11]?.data ?? 0);

        let botones = `
            <a href="javascript:void(0);"
               class="btn btn-sm btn-soft-info btn-icon me-1"
               data-tracking-actividades="1"
               data-tracking-id="${escapeHtml(idTracking)}"
               data-tracking-cod="${escapeHtml(codTracking)}"
               data-bs-toggle="tooltip"
               data-bs-title="Actividades">
                <i class="ti ti-checklist fs-18"></i>
            </a>`;

        if (estado === 'abierto' && totalActividades >= 2) {
            botones += `
            <a href="javascript:void(0);"
               class="btn btn-sm btn-soft-danger btn-icon"
               data-cerrar-tracking="1"
               data-tracking-id="${escapeHtml(idTracking)}"
               data-tracking-cod="${escapeHtml(codTracking)}"
               data-bs-toggle="tooltip"
               data-bs-title="Cerrar tracking">
                <i class="ti ti-lock fs-18"></i>
            </a>`;
        }

        return gridjs.html(botones);
    }
});