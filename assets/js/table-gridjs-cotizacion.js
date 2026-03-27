document.addEventListener("DOMContentLoaded", () => {

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
            { id: "total_peru", name: "", hidden: true },
            { id: "cuota", name: "", hidden: true },

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

    function renderItems(items, row) {
        if (!items) return "";

        const arr = items.split("|").map(i => i.trim());
        const total = Number(row?.cells?.[4]?.data ?? arr.length);
        const totalPeru = Number(row?.cells?.[5]?.data ?? 0);
        const cuotaRaw = row?.cells?.[6]?.data;
        const tieneCuota = cuotaRaw !== null && cuotaRaw !== "" && !Number.isNaN(Number(cuotaRaw));
        const cuota = tieneCuota ? Number(cuotaRaw) : 0;
        const totalFinal = totalPeru + cuota;

        const totalPeruFmt = totalPeru.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const cuotaFmt = cuota.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const totalFinalFmt = totalFinal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

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
                <br>
                <small class="text-muted fw-semibold">
                    Total 🇵🇪: $ ${totalPeruFmt}
                </small>
            </div>
        `);
    }

    function renderAcciones(_, row) {
        const id = row.cells[0].data;
        const estado = row.cells[2].data;
        const totalPeru = Number(row?.cells?.[5]?.data ?? 0);
        const hashId = md5(String(id));

        let botones = `
            <a href="form_cotizacion.php?id=${hashId}" 
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

                <a href="pdf_cotizacion.php?id=${hashId}"
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir cotización en PDF"
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

        if (totalPeru > 15000) {
            botones += `
                <button class="btn btn-soft-warning btn-icon btn-sm rounded-circle btn-tooltip isadmin"
                        data-bs-toggle="modal"
                        data-bs-target="#info-header-modal"
                        data-bs-title="Financiar"
                        data-cotizacion-id="${id}"
                        data-total-peru="${totalPeru}"
                        title="Financiar">
                    <i class="ti ti-currency-dollar"></i>
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

        alertify.confirm("Confirmar",texto,
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

    // Financiamiento modal
    const modalEl = document.getElementById("info-header-modal");
    if (modalEl) {
        const inputAnual = document.getElementById("input-tasa-anual");
        const dispMensual = document.getElementById("display-tasa-mensual");
        const dispCuota = document.getElementById("display-cuota");
        const tablaBody = document.getElementById("financiamiento-body");
        const btnMinus = document.getElementById("btn-anual-minus");
        const btnPlus = document.getElementById("btn-anual-plus");
        const btnGuardar = document.getElementById("btn-guardar-financiamiento");

        modalEl.addEventListener("show.bs.modal", async (e) => {
            const btn = e.relatedTarget;
            const cotizacionId = btn ? parseInt(btn.dataset.cotizacionId || 0, 10) : 0;
            const total = btn ? parseFloat(btn.dataset.totalPeru || 0) : 0;

            document.getElementById("modal-total-peru").textContent =
                total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            modalEl._totalPeru = total;
            modalEl._cotizacionId = cotizacionId;

            setEditable(true);
            inputAnual.value = "25";
            calcular();

            if (cotizacionId > 0) {
                await cargarFinanciamientoExistente(cotizacionId);
            }
        });

        btnMinus.addEventListener("click", () => {
            const v = parseInt(inputAnual.value, 10);
            if (v > parseInt(inputAnual.min, 10)) {
                inputAnual.value = String(v - 1);
                calcular();
            }
        });

        btnPlus.addEventListener("click", () => {
            const v = parseInt(inputAnual.value, 10);
            if (v < parseInt(inputAnual.max, 10)) {
                inputAnual.value = String(v + 1);
                calcular();
            }
        });

        btnGuardar.addEventListener("click", async () => {
            const id = modalEl._cotizacionId || 0;
            if (id <= 0) {
                alertify.error("Cotizacion invalida");
                return;
            }

            if (btnGuardar.disabled) {
                return;
            }

            const { cuota } = calcular();
            const tasaAnual = parseFloat(inputAnual.value);

            btnGuardar.disabled = true;

            try {
                const res = await fetch("controller/financiamiento_cotizacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        id: String(id),
                        tasa: String(tasaAnual),
                        cuota: String(cuota)
                    })
                });

                const json = await res.json();

                if (!res.ok || !json.success) {
                    alertify.error(json.message || "No se pudo guardar");

                    if (res.status === 409) {
                        setEditable(false);
                    } else {
                        btnGuardar.disabled = false;
                    }
                    return;
                }

                alertify.success("Financiamiento guardado");
                setEditable(false);
            } catch (_err) {
                btnGuardar.disabled = false;
                alertify.error("Error de conexion");
            }
        });

        function calcular() {
            const iAnual = parseInt(inputAnual.value, 10) / 100;
            const iMensual = Math.pow(1 + iAnual, 1 / 12) - 1;
            const total = modalEl._totalPeru || 0;
            const n = 5;
            const cuota = (iMensual * total) / (1 - Math.pow(1 + iMensual, -n));

            dispMensual.textContent = (iMensual * 100).toFixed(3) + "%";
            dispCuota.textContent = "$ " + cuota.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            renderTabla(total, iMensual, cuota, n);
            return { iMensual, cuota };
        }

        async function cargarFinanciamientoExistente(id) {
            try {
                const res = await fetch("controller/financiamiento_cotizacion.php?" + new URLSearchParams({ id: String(id) }));
                const json = await res.json();

                if (!res.ok || !json.success) {
                    return;
                }

                if (json.ya_guardado) {
                    if (json.tasa !== null && !Number.isNaN(Number(json.tasa))) {
                        inputAnual.value = String(Math.round(Number(json.tasa)));
                    }

                    calcular();
                    setEditable(false);
                }
            } catch (_err) {
                // Si falla la consulta, se deja editable para no bloquear el flujo.
            }
        }

        function setEditable(canEdit) {
            inputAnual.disabled = !canEdit;
            btnMinus.disabled = !canEdit;
            btnPlus.disabled = !canEdit;
            btnGuardar.disabled = !canEdit;
        }

        function renderTabla(total, iMensual, cuota, n) {
            tablaBody.innerHTML = "";

            const formatMoney = (v) => "$ " + v.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            tablaBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td class="text-center">0</td>
                    <td class="text-end">${formatMoney(total)}</td>
                    <td class="text-end">-</td>
                    <td class="text-end">-</td>
                    <td class="text-end">-</td>
                </tr>
            `);

            let saldo = total;

            for (let t = 1; t <= n; t++) {
                const interes = saldo * iMensual;
                const amortizacion = cuota - interes;
                saldo = saldo - amortizacion;

                const saldoMostrar = t === n ? 0 : saldo;

                tablaBody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td class="text-center">${t}</td>
                        <td class="text-end">${formatMoney(saldoMostrar)}</td>
                        <td class="text-end">${formatMoney(amortizacion)}</td>
                        <td class="text-end">${formatMoney(interes)}</td>
                        <td class="text-end">${formatMoney(cuota)}</td>
                    </tr>
                `);
            }
        }
    }

});
