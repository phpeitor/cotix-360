document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("filterDate");
    const tableContainer = document.getElementById("table-gridjs");
    const userCargo = Number(tableContainer?.dataset?.userCargo || 0);
    const esTecnico = userCargo === 4;
    const totalItemsCellIndex = esTecnico ? 10 : 11;
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
            { id: "ingenieria_id", name: "Ingeniería", width: "95px" },
            { id: "id_receta_duplicada", name: "Origen", hidden: true },
            { id: "usuario", name: "Usuario", width: "120px" },
            { id: "usuario_aprobador", name: "Aprobado", width: "120px" },
            {
                id: "nombre",
                name: "Receta",
                width: "260px",
                formatter: (cell, row) => renderRecetaCliente(cell, row)
            },
            { id: "cliente_ruc", name: "RUC", hidden: true },
            { id: "cliente_razon_social_empresa", name: "Razón Social", hidden: true },
            {
                id: "estado",
                name: "Estado",
                width: "110px",
                formatter: (cell) => renderEstado(cell)
            },
            ...(esTecnico ? [] : [{
                id: "semaforo",
                name: "Semáforo",
                width: "150px",
                sort: false,
                formatter: (cell, row) => renderSemaforo(cell, row)
            }]),
            {
                id: "items",
                name: "Items",
                width: "390px",
                formatter: (cell, row) => renderItems(cell, row)
            },
            { id: "total_items", name: "", hidden: true },
            { id: "created_at", name: "Fecha", width: "170px" },
            {
                id: "acciones",
                name: "Opciones",
                width: "95px",
                sort: false,
                formatter: (_, row) => {
                    const id = row?.cells?.[0]?.data;
                    const hashId = typeof md5 === "function" ? md5(String(id)) : String(id);

                    return gridjs.html(`
                        <a href="compras_detalle.php?id=${hashId}"
                           class="btn btn-soft-primary btn-icon btn-sm rounded-circle"
                           data-bs-toggle="tooltip"
                           data-bs-title="Ver">
                            <i class="ti ti-eye"></i>
                        </a>
                    `);
                }
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

    document.getElementById("btn_buscar").addEventListener("click", () => {
        grid.updateConfig({
            server: {
                url: buildUrl(),
                method: "GET",
                then: res => res.data
            }
        }).forceRender();
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-compras-items-toggle]");
        if (!btn) return;

        const target = document.getElementById(String(btn.dataset.comprasItemsToggle || ""));
        if (!target) return;

        const expanded = target.classList.toggle("show");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.textContent = expanded ? "Ver menos" : `Ver más (+${btn.dataset.hiddenCount || 0})`;
    });

    function buildUrl() {
        const fp = dateInput._flatpickr;
        let fec_ini = formatISO(pastDate);
        let fec_fin = formatISO(today);

        if (fp && fp.selectedDates.length === 2) {
            fec_ini = formatISO(fp.selectedDates[0]);
            fec_fin = formatISO(fp.selectedDates[1]);
        }

        return "controller/compras/table_compras.php?" + new URLSearchParams({ fec_ini, fec_fin });
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function renderEstado(value) {
        const estado = String(value || "Pendiente").trim();
        const badgeClass = estado === "Aprobada"
            ? "badge-outline-success"
            : estado === "Anulada"
                ? "badge-outline-danger"
                : "badge-outline-warning";

        return gridjs.html(`<span class="badge ${badgeClass}">${escapeHtml(estado)}</span>`);
    }

    function renderSemaforo(value, row) {
        const semaforo = (typeof value === "object" && value !== null) ? value : {};
        const nivel = String(semaforo.nivel || "gris").trim();
        if (nivel === "gris") {
            return gridjs.html(`<span class="text-muted">-</span>`);
        }

        const map = {
            verde: "bg-success",
            naranja: "bg-warning",
            rojo: "bg-danger"
        };

        const totalCompra = Number(semaforo.total_compra_dolares ?? 0);
        const totalOrigen = Number(semaforo.total_origen_dolares ?? 0);
        const diff = totalOrigen > 0
            ? ((totalCompra / totalOrigen - 1) * 100).toFixed(1)
            : null;

        return gridjs.html(`
            <span class="badge ${map[nivel] || "bg-secondary"}">
                <i class="ti ti-circle-filled fs-10 me-1"></i>
                ${escapeHtml(String(semaforo.mensaje || nivel))}
                ${diff !== null ? ` <small class="opacity-75">(${diff}%)</small>` : ""}
            </span>
        `);
    }

    function renderRecetaCliente(nombre, row) {
        const recetaNombre = String(nombre ?? "").trim().replace(/\s*-\s*\d+$/, "").trim();
        const ruc = String(row?.cells?.[6]?.data ?? "").trim();
        const razonSocial = String(row?.cells?.[7]?.data ?? "").trim();
        const cliente = [ruc, razonSocial].filter(Boolean).join(" - ");

        return gridjs.html(`
            <div class="lh-sm">
                <span>${escapeHtml(recetaNombre || "-")}</span>
                ${cliente ? `<small class="d-block text-muted mt-1">${escapeHtml(cliente)}</small>` : ""}
            </div>
        `);
    }

    function renderItems(items, row) {
        if (!items) return "";

        const arr = String(items).split("|").map(i => i.trim()).filter(Boolean);
        const total = Number(row?.cells?.[totalItemsCellIndex]?.data ?? arr.length);
        const id = String(row?.cells?.[0]?.data ?? "").trim();

        if (arr.length <= 4) {
            return gridjs.html(`
                <div class="receta-items-preview">
                    <ul class="mb-1 ps-3">${arr.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
                    <small class="text-muted fw-semibold d-block mt-1">Total items: ${total}</small>
                </div>
            `);
        }

        const visibleItems = arr.slice(0, 4);
        const hiddenItems = arr.slice(4);
        const collapseId = `compras-items-${id || Math.random().toString(36).slice(2, 10)}`;

        return gridjs.html(`
            <div class="receta-items-preview">
                <ul class="mb-1 ps-3 receta-items-visible">${visibleItems.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
                <div id="${collapseId}" class="receta-items-hidden collapse">
                    <ul class="mb-1 ps-3">${hiddenItems.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
                </div>
                <button type="button"
                        class="btn btn-link p-0 receta-items-toggle"
                        data-compras-items-toggle="${collapseId}"
                        data-hidden-count="${hiddenItems.length}"
                        aria-expanded="false">
                    Ver más (+${hiddenItems.length})
                </button>
                <small class="text-muted fw-semibold d-block mt-1">Total items: ${total}</small>
            </div>
        `);
    }
});
