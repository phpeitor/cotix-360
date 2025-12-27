document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       📅 FECHAS POR DEFECTO (HOY y -7 DÍAS)
    --------------------------------------------------- */
    const dateInput = document.getElementById("filterDate");

    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);

    // Helpers
    const formatISO = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD
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
                formatter: (cell) => renderItems(cell)
            },

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

        return "controller/table_cotizacion.php?" + new URLSearchParams({
            fec_ini,
            fec_fin
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

    function renderItems(items) {
        if (!items) return "";

        const arr = items.split("|").map(i => i.trim());
        const total = arr.length;

        if (total === 1) {
            return gridjs.html(`<span>${arr[0]}</span>`);
        }

        const list = arr.map(i => `<li>${i}</li>`).join("");

        return gridjs.html(`
            <div>
                <ul class="mb-1 ps-3">${list}</ul>
                <small class="text-muted fw-semibold">
                    Total items: ${total}
                </small>
            </div>
        `);
    }

    function renderAcciones(_, row) {
        const id = row.cells[0].data;
        const estado = row.cells[2].data;
        const hashId = md5(String(id));

        let botones = `
            <a 
                href="form_cotizacion.php?id=${hashId}" 
                class="btn btn-soft-primary btn-icon btn-sm rounded-circle"
                title="Ver cotización"
            >
                <i class="ti ti-eye"></i>
            </a>
        `;

        if (estado === "Aprobada") {

            botones += `
                <button class="btn btn-soft-danger btn-icon btn-sm rounded-circle btn-estado"
                        data-id="${id}"
                        data-accion="anular"
                        title="Anular">
                    <i class="ti ti-x"></i>
                </button>

                <a href="pdf_cotizacion.php?id=${hashId}"
                class="btn btn-soft-warning btn-icon btn-sm rounded-circle"
                title="PDF">
                    <i class="ti ti-file"></i>
                </a>
            `;

        } else if (estado === "Anulada") {

            botones += `
                <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-estado"
                        data-id="${id}"
                        data-accion="aprobar"
                        title="Aprobar">
                    <i class="ti ti-check"></i>
                </button>
            `;

        } else {

            botones += `
                <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-estado"
                        data-id="${id}"
                        data-accion="aprobar"
                        title="Aprobar">
                    <i class="ti ti-check"></i>
                </button>

                <button class="btn btn-soft-danger btn-icon btn-sm rounded-circle btn-estado"
                        data-id="${id}"
                        data-accion="anular"
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
            ? "¿Deseas aprobar esta cotización?"
            : "¿Deseas anular esta cotización?";

        alertify.confirm(texto,
            () => actualizarEstado(id, accion),
            () => {}
        );
    });

    function actualizarEstado(id, accion) {

        fetch("controller/upd_estado.php", {
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

            alertify.success(`Cotización ${resp.estado}`);
            grid.forceRender();
        })
        .catch(() => alertify.error("Error de conexión"));
    }

});
