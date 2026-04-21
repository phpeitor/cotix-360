document.addEventListener("DOMContentLoaded", () => {
    const tbody          = document.querySelector("table.table tbody");
    const totalItemsEl   = document.getElementById("total_item");
    const totalPesoEl    = document.getElementById("total_peso");
    const totalFobEl     = document.getElementById("total_fob");
    const totalFleteEl   = document.getElementById("total_flete");
    const totalGastoEl   = document.getElementById("total_gasto");
    const totalImpuestoEl = document.getElementById("total_impuesto");
    const totalAjusteRedondeoEl = document.getElementById("total_ajuste_redondeo");
    const totalPeruEl    = document.getElementById("total_peru");
    const totalFactorEl  = document.getElementById("total_factor");
    const usuarioEl = document.getElementById("usuario");
    const fechaEl   = document.getElementById("fecha");
    const estadoEl  = document.getElementById("estado");
    const cotizacionIdEl = document.getElementById("cotizacion_id");

    const FINANCIAMIENTO_CUOTAS = 5;
    let cuotaFinanciamiento = null;
    let tasaFinanciamiento = null;

    function round2(value) {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }

    function calcularInteresFinanciamiento(totalPeruBase) {
        if (cuotaFinanciamiento === null || Number.isNaN(cuotaFinanciamiento)) {
            return 0;
        }

        if (tasaFinanciamiento !== null && !Number.isNaN(tasaFinanciamiento) && tasaFinanciamiento > 0) {
            const iAnual = tasaFinanciamiento / 100;
            const iMensual = Math.pow(1 + iAnual, 1 / 12) - 1;
            let saldo = totalPeruBase;
            let interesAcumulado = 0;

            for (let t = 1; t <= FINANCIAMIENTO_CUOTAS; t++) {
                const interes = saldo * iMensual;
                const amortizacion = cuotaFinanciamiento - interes;
                saldo = saldo - amortizacion;
                interesAcumulado += round2(interes);
            }

            return interesAcumulado > 0 ? round2(interesAcumulado) : 0;
        }

        const totalCuotas = cuotaFinanciamiento * FINANCIAMIENTO_CUOTAS;
        const interes = totalCuotas - totalPeruBase;

        return interes > 0 ? round2(interes) : 0;
    }

    let fleteTable = [];
    let gastoTable = [];

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
            data.detalle.forEach(item => {
                const tr = renderItemRow(item); 
                validarTdAdmin(tr);             
            });
            recalculateTotals();
            alertify.success("Cotización cargada");
        })
        .catch(err => {
            console.error(err);
            alertify.error("Error cargando cotización");
        });
    }

    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    function getRandomLogo() {
        const n = Math.floor(Math.random() * 9) + 1;
        return `assets/images/products/logo/logo-${n}.svg`;
    }

    function getMargenByGrupo(grupo) {
        if (!grupo) return 0.32;
        const g = grupo.toString().toLowerCase();
        if (g.includes("0")) return 0;
        if (g.includes("1")) return 0.15;
        if (g.includes("2")) return 0.25;
        if (g.includes("3")) return 0.28;
        if (g.includes("4")) return 0.30;
        if (g.includes("5")) return 0.31;
        if (g.includes("6")) return 0.33;
        if (g.includes("7")) return 0.35;
        if (g.includes("8")) return 0.36;
        if (g.includes("9")) return 0.40;
        if (g.includes("10")) return 0.45;
        if (g.includes("11")) return 0.50;
        if (g.includes("12")) return 0.55;
        return 0.32;
    }

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

    function renderItemRow(item) {
        const tr = document.createElement("tr");
        tr.dataset.itemId = item.item_id;
        tr.dataset.peso   = parseFloat(item.peso);
        tr.dataset.precio = parseFloat(item.precio_unitario);
        tr.dataset.grupo  = item.grupo;
        tr.dataset.cantidad = parseInt(item.cantidad);
        tr.dataset.pais   = item.pais_origen;
        tr.dataset.margen   = parseFloat(item.margen);

        const peso   = parseFloat(item.peso);
        const precio = parseFloat(item.precio_unitario);

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
                        <h5 class="fs-14 mt-1 item-description">${item.descripcion}</h5>
                    </div>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">${item.categoria}</span>
                <h5 class="fs-14 mt-1 fw-normal isadmin">${item.grupo}</h5>
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
                <h5 class="fs-14 mt-1 fw-normal">${format2(peso)}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">MSRP</span>
                <h5 class="fs-14 mt-1 fw-normal">${format2(precio)}</h5>
            </td>

            <td class="isadmin"><span class="text-muted fs-12">Valor</span><h5 class="fs-14 mt-1 fw-normal margen">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Dscto</span><h5 class="fs-14 mt-1 fw-normal margen_dscto">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Precio Dscto</span><h5 class="fs-14 mt-1 fw-normal precio_dscto">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Factor PU</span><h5 class="fs-14 mt-1 fw-normal factor-precio">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Precio M</span><h5 class="fs-14 mt-1 fw-normal precio-m">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Margen</span><h5 class="fs-14 mt-1 fw-normal margen_uti">${item.margen}</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Utilidad</span><h5 class="fs-14 mt-1 fw-normal utilidad">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio Cliente</span><h5 class="fs-14 mt-1 fw-normal precio-cliente">0.00</h5></td>
        `;

        tbody.appendChild(tr);
        return tr; 
    }

    function recalculateTotals() {
        let totalItems = 0;
        let totalPeso = 0;
        let totalFob = 0;

        const rows = tbody.querySelectorAll("tr");

        if (rows.length === 0) {
            totalItemsEl.textContent = "0";
            totalPesoEl.textContent = format2(0);
            totalFobEl.textContent = format2(0);
            totalFleteEl.textContent = format2(0);
            totalGastoEl.textContent = format2(0);
            if (totalImpuestoEl) totalImpuestoEl.textContent = format2(0);
            if (totalAjusteRedondeoEl) totalAjusteRedondeoEl.textContent = format2(0);
            totalPeruEl.textContent  = format2(0);
            totalFactorEl.textContent = format4(0);
            return;
        }

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

        totalItemsEl.textContent = formatInt(totalItems);
        totalPesoEl.textContent = format2(totalPeso);
        totalFobEl.textContent = format2(totalFob);

        const pesosPorPais = getPesoPorPais();
        let totalFlete = 0;

        for (const pais in pesosPorPais) {
            totalFlete += calcularFletePorPais(pais, pesosPorPais[pais]);
        }

        totalFleteEl.textContent = format2(totalFlete);

        const gastoBase = calcularGasto(totalFob);
        const totalPeruBase = totalFob + totalFlete + gastoBase;
        const interesFinanciamiento = calcularInteresFinanciamiento(totalPeruBase);
        const gastoTotal = gastoBase + interesFinanciamiento;

        totalGastoEl.textContent = format2(gastoBase);
        if (totalImpuestoEl) totalImpuestoEl.textContent = format2(interesFinanciamiento);

        const totalPeruObjetivo = totalPeruBase + interesFinanciamiento;

        const rawFactor = totalFob > 0
            ? (gastoTotal + totalFlete) / totalFob
            : 0;

        totalFactorEl.textContent = format4(rawFactor);

        let totalPeruDesdeItems = 0;

        rows.forEach(tr => {
            const precio = parseFloat(tr.dataset.precio);
            const qty = parseInt(tr.dataset.cantidad);
            const grupo  = tr.dataset.grupo;
            const margen_uti  = parseFloat(tr.dataset.margen || 0);

            // Margen
            const margen = getMargenByGrupo(grupo);
            tr.querySelector(".margen").textContent =
                (margen * 100).toFixed(0) + "%";
            
            // Margen_dscto
            const margen_dscto = precio * margen;
            const precio_dscto = precio * (1 - margen);

            // Precio Dscto
            tr.querySelector(".margen_dscto").textContent =
                format2(decimalAdjust('round',margen_dscto,'-2'));
            tr.querySelector(".precio_dscto").textContent =
                format2(decimalAdjust('round',precio_dscto,'-2'));

            // Factor PU
            const factorPU = decimalAdjust(
                'round',
                precio_dscto * decimalAdjust('round', rawFactor, '-4'),
                '-2'
            );
            tr.querySelector(".factor-precio").textContent = format2(factorPU);
            
            // Precio M
            const precioM = decimalAdjust(
                'round',
                precio_dscto + factorPU,
                '-2'
            );
            tr.querySelector(".precio-m").textContent = format2(precioM);

            // Mantener el mismo criterio de redondeo visible para cuadrar con Total PE.
            const totalFilaPeru = decimalAdjust(
                'round',
                precioM * qty,
                '-2'
            );
            totalPeruDesdeItems += totalFilaPeru;

            // Utilidad
            const utilidad = decimalAdjust(
                'round',
                precioM * margen_uti,
                '-2'
            );
            tr.querySelector(".utilidad").textContent = format2(utilidad);

            // Precio Cliente
            const precioCliente = decimalAdjust(
                'round',
                precioM + utilidad,
                '-2'
            );
            tr.querySelector(".precio-cliente").textContent =
                format2(precioCliente);
        });

        const ajusteRedondeo = decimalAdjust(
            'round',
            totalPeruObjetivo - totalPeruDesdeItems,
            '-2'
        );

        // Mostrar Total PE teorico y exponer la diferencia por redondeo de lineas.
        totalPeruEl.textContent = format2(totalPeruObjetivo);
        if (totalAjusteRedondeoEl) {
            totalAjusteRedondeoEl.textContent = format2(Math.abs(ajusteRedondeo));
        }
    }

    function setHeader(cotizacion) {
        usuarioEl.textContent = cotizacion.usuario ?? "";
        fechaEl.textContent = cotizacion.created_at ?? "";;
        estadoEl.textContent = cotizacion.estado ?? "";;
        cotizacionIdEl.textContent = cotizacion.id ?? "";

        const cuotaValida =
            cotizacion.cuota !== null &&
            cotizacion.cuota !== "" &&
            !Number.isNaN(Number(cotizacion.cuota));

        cuotaFinanciamiento = cuotaValida
            ? parseFloat(cotizacion.cuota)
            : null;

        const tasaValida =
            cotizacion.tasa !== null &&
            cotizacion.tasa !== "" &&
            !Number.isNaN(Number(cotizacion.tasa));

        tasaFinanciamiento = tasaValida
            ? parseFloat(cotizacion.tasa)
            : null;

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