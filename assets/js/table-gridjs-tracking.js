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
                formatter: (cell) => {
                    const cod = String(cell || "-");
                    return gridjs.html(`<span class="badge badge-outline-primary font-monospace">${escapeHtml(cod)}</span>`);
                }
            },
            { id: "created_at", name: "Fecha", width: "170px" },
            {
                id: "origen_receta",
                name: "Origen",
                width: "110px",
                formatter: (cell, row) => renderOrigen(cell, row)
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
});