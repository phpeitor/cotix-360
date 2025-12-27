document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTOS DOM
    =================================================== */
    const tbody          = document.querySelector("table.table tbody");
    const totalItemsEl   = document.getElementById("total_item");
    const totalPesoEl    = document.getElementById("total_peso");
    const totalFobEl     = document.getElementById("total_fob");
    const totalFleteEl   = document.getElementById("total_flete");
    const totalGastoEl   = document.getElementById("total_gasto");
    const totalPeruEl    = document.getElementById("total_peru");
    const totalFactorEl  = document.getElementById("total_factor");
    const usuarioEl = document.getElementById("usuario");
    const fechaEl   = document.getElementById("fecha");
    const estadoEl  = document.getElementById("estado");
    const cotizacionIdEl = document.getElementById("cotizacion_id");


    let fleteTable = [];
    let gastoTable = [];

    /* ===================================================
       INIT
    =================================================== */
    init();

    function init() {
        Promise.all([
            fetch("controller/get_flete.php").then(r => r.json()),
            fetch("controller/get_gastos.php").then(r => r.json())
        ])
        .then(([flete, gasto]) => {
            fleteTable = flete;
            gastoTable = gasto;

            const hash = getQueryParam("id");
            if (!hash) return;

            return fetch(`controller/get_cotizacion.php?id=${hash}`);
        })
        .then(res => res ? res.json() : null)
        .then(data => {
            if (!data || !data.cotizacion) return;
            setHeader(data.cotizacion);
            data.detalle.forEach(renderItemRow);
            recalculateTotals();
            alertify.success("Cotización cargada");
        })
        .catch(err => {
            console.error(err);
            alertify.error("Error cargando cotización");
        });
    }

    /* ===================================================
       UTILIDADES
    =================================================== */
    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    function formatNumber(value, decimals = 2) {
        return Number(value || 0).toFixed(decimals);
    }

    function getRandomLogo() {
        const n = Math.floor(Math.random() * 9) + 1;
        return `assets/images/products/logo/logo-${n}.svg`;
    }

    function getMargenByGrupo(grupo) {
        if (!grupo) return 0.32;
        const g = grupo.toString().toLowerCase();
        if (g.includes("1")) return 0.25;
        if (g.includes("2")) return 0.15;
        return 0.32;
    }

    /* ===================================================
       FLETE / GASTOS
    =================================================== */
    function calcularFlete(totalPeso) {
        if (!fleteTable.length) return 0;

        for (const row of fleteTable) {
            if (parseFloat(row.peso) >= totalPeso) {
                return parseFloat(row.flete);
            }
        }
        return parseFloat(fleteTable.at(-1).flete);
    }

    function calcularGasto(totalFob) {
        if (!gastoTable.length) return 0;

        for (const row of gastoTable) {
            const min = parseFloat(row.valor_inicial);
            const max = parseFloat(row.valor_final);
            if (totalFob >= min && totalFob <= max) {
                return parseFloat(row.costo);
            }
        }
        return parseFloat(gastoTable.at(-1).costo);
    }

    /* ===================================================
       RENDER ITEM (SOLO LECTURA)
    =================================================== */
    function renderItemRow(item) {

        const tr = document.createElement("tr");

        tr.dataset.itemId = item.item_id;
        tr.dataset.peso   = parseFloat(item.peso);
        tr.dataset.precio = parseFloat(item.precio_unitario);
        tr.dataset.grupo  = item.grupo;
        tr.dataset.cantidad = parseInt(item.cantidad);

        const peso   = parseFloat(item.peso).toFixed(2);
        const precio = parseFloat(item.precio_unitario).toFixed(2);

        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-md flex-shrink-0 me-2">
                        <span class="avatar-title bg-primary-subtle rounded-circle">
                            <img src="${getRandomLogo()}" height="22">
                        </span>
                    </div>
                    <div>
                        <span class="text-muted fs-12">${item.modelo}</span><br>
                        <h5 class="fs-14 mt-1">${item.descripcion}</h5>
                    </div>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">${item.categoria}</span>
                <h5 class="fs-14 mt-1 fw-normal">${item.grupo}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Cantidad</span>
                <h5 class="fs-14 mt-1 fw-normal text-center">${item.cantidad}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Peso</span>
                <h5 class="fs-14 mt-1 fw-normal">${peso}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Precio Uni.</span>
                <h5 class="fs-14 mt-1 fw-normal">${formatNumber(precio)}</h5>
            </td>

            <td><span class="text-muted fs-12">Factor PU</span><h5 class="fs-14 factor-precio">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio M</span><h5 class="fs-14 precio-m">0.00</h5></td>
            <td><span class="text-muted fs-12">Margen</span><h5 class="fs-14 margen">0%</h5></td>
            <td><span class="text-muted fs-12">Utilidad</span><h5 class="fs-14 utilidad">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio Cliente</span><h5 class="fs-14 precio-cliente">0.00</h5></td>

            <td>
                <span class="text-muted fs-12">Status</span>
                <h5 class="fs-14">
                    <i class="ti ti-circle-filled fs-12 ${item.status === "Active" ? "text-success" : "text-danger"}"></i>
                    ${item.status}
                </h5>
            </td>
        `;

        tbody.appendChild(tr);
    }

    /* ===================================================
       RECÁLCULO TOTAL
    =================================================== */
    function recalculateTotals() {

        let totalItems = 0, totalPeso = 0, totalFob = 0;
        const rows = tbody.querySelectorAll("tr");

        if (!rows.length) {
            totalItemsEl.textContent  = "0";
            totalPesoEl.textContent   = "0.00";
            totalFobEl.textContent    = "0.00";
            totalFleteEl.textContent  = "0.00";
            totalGastoEl.textContent  = "0.00";
            totalPeruEl.textContent   = "0.00";
            totalFactorEl.textContent = "0.0000";
            return;
        }

        rows.forEach(tr => {
            const qty    = parseInt(tr.dataset.cantidad);
            const peso   = parseFloat(tr.dataset.peso);
            const precio = parseFloat(tr.dataset.precio);

            totalItems += qty;
            totalPeso  += peso * qty;
            totalFob   += precio * qty;
        });

        totalItemsEl.textContent = totalItems;
        totalPesoEl.textContent  = totalPeso.toFixed(2);
        totalFobEl.textContent   = totalFob.toFixed(2);

        const flete = calcularFlete(totalPeso);
        const gasto = calcularGasto(totalFob);
        const totalPeru = totalFob + flete + gasto;
        const rawFactor = totalFob ? (gasto + flete) / totalFob : 0;

        totalFleteEl.textContent  = flete.toFixed(2);
        totalGastoEl.textContent  = gasto.toFixed(2);
        totalPeruEl.textContent   = totalPeru.toFixed(2);
        totalFactorEl.textContent = rawFactor.toFixed(4);

        rows.forEach(tr => {
            const precio = parseFloat(tr.dataset.precio);
            const margen = getMargenByGrupo(tr.dataset.grupo);

            const factorPU = decimalAdjust('round', precio * decimalAdjust('round', rawFactor, '-4'), '-2');
            const precioM  = decimalAdjust('round', precio + factorPU, '-2');
            const utilidad = decimalAdjust('round', precioM * margen, '-2');
            const precioCliente = decimalAdjust('round', precioM + utilidad, '-2');

            tr.querySelector(".factor-precio").textContent  = factorPU.toFixed(2);
            tr.querySelector(".precio-m").textContent       = precioM.toFixed(2);
            tr.querySelector(".margen").textContent         = (margen * 100).toFixed(0) + "%";
            tr.querySelector(".utilidad").textContent       = utilidad.toFixed(2);
            tr.querySelector(".precio-cliente").textContent = precioCliente.toFixed(2);
        });
    }

    function setHeader(cotizacion) {
        usuarioEl.textContent = cotizacion.usuario ?? "";
        fechaEl.textContent = cotizacion.created_at ?? "";;
        estadoEl.textContent = cotizacion.estado ?? "";;
        cotizacionIdEl.textContent = md5(cotizacion.id) ?? "";
        setEstadoIcon(cotizacion.estado);
    }

    function setEstadoIcon(estado) {
        const avatar = estadoEl
            .closest(".d-flex")
            .querySelector(".avatar-lg");

        let icon = "solar:refresh-square-bold";
        let color = "text-primary";

        if (!estado) return;

        switch (estado) {
            case "Aprobada":
                icon  = "solar:verified-check-broken";
                color = "text-success";
                break;

            case "Anulada":
                icon  = "solar:folder-error-broken";
                color = "text-danger";
                break;
        }

        avatar.innerHTML = `
            <iconify-icon icon="${icon}" class="fs-28 ${color}"></iconify-icon>
        `;
    }


});
