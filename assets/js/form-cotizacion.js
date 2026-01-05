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
    function calcularGasto(totalFob) {
        if (gastoTable.length === 0) return 0;

        for (const row of gastoTable) {
            const min = parseFloat(row.valor_inicial);
            const max = parseFloat(row.valor_final);

            if (totalFob >= min && totalFob <= max) {
                return parseFloat(row.costo);
            }
        }

        return parseFloat(gastoTable[gastoTable.length - 1].costo);
    }

    function normalizarPais(pais) {
        return pais && pais.toString().trim().toUpperCase() === "USA"
            ? "USA"
            : "CHINA";
    }

    function getPesoPorPais() {
        const pesos = {};

        tbody.querySelectorAll("tr").forEach(tr => {
            const qty  = parseInt(tr.dataset.cantidad);
            const peso = parseFloat(tr.dataset.peso);
            const pais = normalizarPais(tr.dataset.pais);

            if (!pesos[pais]) pesos[pais] = 0;
            pesos[pais] += peso * qty;
        });

        return pesos;
    }

    function calcularFletePorPais(pais, pesoTotal) {
        const paisCalc = normalizarPais(pais);
        let tarifas = fleteTable.filter(r => r.pais === paisCalc);
        
        if (tarifas.length === 0) {
            tarifas = fleteTable.filter(r => r.pais === "CHINA");
        }

        tarifas.sort((a, b) => parseFloat(a.peso) - parseFloat(b.peso));

        for (const row of tarifas) {
            if (pesoTotal <= parseFloat(row.peso)) {
                return parseFloat(row.flete);
            }
        }

        return parseFloat(tarifas[tarifas.length - 1].flete);
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
        tr.dataset.pais   = item.pais_origen;

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
                <h5 class="fs-14 mt-1 fw-normal">${item.pais_origen}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Status</span>
                <h5 class="fs-14">
                    <i class="ti ti-circle-filled fs-12 ${item.status === "Active" ? "text-success" : "text-danger"}"></i>
                    ${item.status}
                </h5>
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

            <td><span class="text-muted fs-12">Valor</span><h5 class="fs-14 mt-1 fw-normal margen">0.00</h5></td>
            <td><span class="text-muted fs-12">Dscto</span><h5 class="fs-14 mt-1 fw-normal margen_dscto">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio Dscto</span><h5 class="fs-14 mt-1 fw-normal precio_dscto">0.00</h5></td>
            <td><span class="text-muted fs-12">Factor PU</span><h5 class="fs-14 mt-1 fw-normal factor-precio">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio M</span><h5 class="fs-14 mt-1 fw-normal precio-m">0.00</h5></td>
            <td><span class="text-muted fs-12">Utilidad</span><h5 class="fs-14 mt-1 fw-normal utilidad">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio Cliente</span><h5 class="fs-14 mt-1 fw-normal precio-cliente">0.00</h5></td>
        `;

        tbody.appendChild(tr);
    }

    /* ===================================================
       RECÁLCULO TOTAL
    =================================================== */
    function recalculateTotals() {
        let totalItems = 0;
        let totalPeso = 0;
        let totalFob = 0;

        const rows = tbody.querySelectorAll("tr");

        if (rows.length === 0) {
            totalItemsEl.textContent = "0";
            totalPesoEl.textContent = "0.00";
            totalFobEl.textContent = "0.00";
            totalFleteEl.textContent = "0.00";
            totalGastoEl.textContent = "0.00";
            totalPeruEl.textContent  = "0.00";
            totalFactorEl.textContent = "0.0000";
            return;
        }

        /* ==========================
        1️⃣ ACUMULAR TOTALES
        ========================== */
        rows.forEach(tr => {
            const qty = parseInt(tr.dataset.cantidad);
            const peso = parseFloat(tr.dataset.peso);
            const precio = parseFloat(tr.dataset.precio);
            const grupo  = tr.dataset.grupo;

            const margen = getMargenByGrupo(grupo);
            const precio_dscto = precio * (1 - margen);

            totalItems += qty;
            totalPeso  += peso * qty;
            totalFob   += precio_dscto * qty;
        });

        totalItemsEl.textContent = totalItems;
        totalPesoEl.textContent = totalPeso.toFixed(2);
        totalFobEl.textContent = totalFob.toFixed(2);

        const pesosPorPais = getPesoPorPais();
        let totalFlete = 0;

        for (const pais in pesosPorPais) {
            totalFlete += calcularFletePorPais(pais, pesosPorPais[pais]);
        }

        totalFleteEl.textContent = totalFlete.toFixed(2);

        const gasto = calcularGasto(totalFob);
        totalGastoEl.textContent = gasto.toFixed(2);

        const totalPeru = totalFob + totalFlete + gasto;
        totalPeruEl.textContent = totalPeru.toFixed(2);

        const rawFactor = totalFob > 0
            ? (gasto + totalFlete) / totalFob
            : 0;

        totalFactorEl.textContent = rawFactor.toFixed(4);

        /* ==========================
        2️⃣ CÁLCULOS POR FILA
        ========================== */
        rows.forEach(tr => {

            const precio = parseFloat(tr.dataset.precio);
            const grupo  = tr.dataset.grupo;

            // Margen
            const margen = getMargenByGrupo(grupo);
            tr.querySelector(".margen").textContent =
                (margen * 100).toFixed(0) + "%";
            
            // Margen_dscto
            const margen_dscto = precio * margen;
            const precio_dscto = precio * (1 - margen);

            // Precio Dscto
            tr.querySelector(".margen_dscto").textContent =
                decimalAdjust('round',margen_dscto,'-2').toFixed(2);
            tr.querySelector(".precio_dscto").textContent =
                decimalAdjust('round',precio_dscto,'-2').toFixed(2);

            // Factor PU
            const factorPU = decimalAdjust(
                'round',
                precio_dscto * decimalAdjust('round', rawFactor, '-4'),
                '-2'
            );
            tr.querySelector(".factor-precio").textContent = factorPU.toFixed(2);
            
            // Precio M
            const precioM = decimalAdjust(
                'round',
                precio_dscto + factorPU,
                '-2'
            );
            tr.querySelector(".precio-m").textContent = precioM.toFixed(2);

            // Utilidad
            const utilidad = decimalAdjust(
                'round',
                precioM * margen,
                '-2'
            );
            tr.querySelector(".utilidad").textContent = utilidad.toFixed(2);

            // Precio Cliente
            const precioCliente = decimalAdjust(
                'round',
                precioM + utilidad,
                '-2'
            );
            tr.querySelector(".precio-cliente").textContent =
                precioCliente.toFixed(2);
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
