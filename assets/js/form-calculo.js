document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");
    const btnAdd = document.getElementById("btnAdd");
    const tbody = document.querySelector("table.table tbody");
    const totalItemsEl = document.getElementById("total_item");
    const totalPesoEl = document.getElementById("total_peso");
    const totalFobEl = document.getElementById("total_fob");
    const totalFleteEl = document.getElementById("total_flete");
    const totalGastoEl = document.getElementById("total_gasto");
    const totalPeruEl = document.getElementById("total_peru");
    const totalFactorEl = document.getElementById("total_factor");
    const LIMITE_PESO = 100;
    let fleteTable = [];

    fetch("controller/get_flete.php")
        .then(res => res.json())
        .then(data => fleteTable = data)
        .catch(err => console.error("Error cargando flete:", err));

    let gastoTable = [];

    fetch("controller/get_gastos.php")
        .then(res => res.json())
        .then(data => gastoTable  = data)
        .catch(err => console.error("Error cargando gastos:", err));


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
            const qty  = parseInt(tr.querySelector("input").value);
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

    /* ---------------------------------------------------
       FUNCIÓN: RE-CALCULAR TOTALES
    --------------------------------------------------- */
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
            const qty = parseInt(tr.querySelector("input").value);
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
            const selectMargen = tr.querySelector(".margen-uti");
            const margenUti = selectMargen ? parseFloat(selectMargen.value) : 0.15;

            const utilidad = decimalAdjust(
                'round',
                precioM * margenUti,
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

    /* ---------------------------------------------------
       FUNCIÓN: LOGO ALEATORIO
    --------------------------------------------------- */
    function getRandomLogo() {
        const n = Math.floor(Math.random() * 9) + 1; // 1 al 9
        return `assets/images/products/logo/logo-${n}.svg`;
    }

    /* ---------------------------------------------------
       EVITAR AGREGAR DUPLICADOS
    --------------------------------------------------- */
    function itemAlreadyAdded(itemId) {
        return [...tbody.querySelectorAll("tr")]
            .some(tr => tr.dataset.itemId == itemId);
    }

    function getTotalPesoActual() {
        let total = 0;
        tbody.querySelectorAll("tr").forEach(tr => {
            const qty  = parseInt(tr.querySelector("input").value);
            const peso = parseFloat(tr.dataset.peso);
            total += peso * qty;
        });
        return total;
    }

    /* ---------------------------------------------------
       CARGAR ITEMS SEGÚN BASE
    --------------------------------------------------- */
    baseSelect.addEventListener("change", async () => {

        const baseId = baseSelect.value;
        const choices = itemSelect.choicesInstance;

        try {
            choices.clearChoices();

            choices.setChoices([{ value: "", label: "-- Seleccione item --", disabled: true, selected: true }], "value", "label", true);

            if (!baseId) return;

            const res = await fetch(`controller/get_select_item.php?id=${baseId}`);
            const data = await res.json();

            choices.setChoices(
                data.map(i => ({
                    value: i.modelo,
                    label: i.modelo,
                    customProperties: {
                        id: i.id,
                        descripcion: i.descripcion,
                        categoria: i.categoria_producto,
                        grupo: i.grupo_descuento,
                        clase: i.clase_producto,
                        peso: parseFloat(i.peso),
                        precio: parseFloat(i.precio_unitario),
                        moneda: i.moneda,
                        status: i.status,
                        pais: i.pais_origen
                    }
                })),
                "value",
                "label",
                false
            );

        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar items");
        }
    });

    /* ---------------------------------------------------
       BOTÓN + → AGREGAR ITEM
    --------------------------------------------------- */
    btnAdd.addEventListener("click", () => {

        const selected = itemSelect.choicesInstance.getValue();

        if (!selected || !selected.value) {
            alertify.error("Seleccione un item");
            return;
        }

        const modelo = selected.value;
        const item = selected.customProperties;
        const itemId  = item.id;

        if (!item) {
            alertify.error("El item no contiene información válida");
            return;
        }

        if (!item.peso || parseFloat(item.peso) === 0) {
            alertify.alert(
                "Peso inválido",
                "No se puede cotizar items con peso 0.<br>Por favor, comuníquese con el administrador"
            );
            return;
        }

        if (itemAlreadyAdded(itemId)) {
            alertify.error("Este item ya fue agregado");
            return;
        }

        const pesoActual = getTotalPesoActual();
        if (pesoActual + item.peso > LIMITE_PESO) {
            alertify.alert(
                "Límite de peso",
                "No se puede agregar este item porque el peso total superará los 100 Kg.<br>Por favor, contacte al administrador."
            );
            return;
        }

        const tr = document.createElement("tr");
        tr.dataset.itemId  = itemId ;
        tr.dataset.modelo = modelo;
        tr.dataset.peso = item.peso;
        tr.dataset.precio = item.precio;
        tr.dataset.grupo = item.grupo;
        tr.dataset.pais   = item.pais;

        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-md flex-shrink-0 me-2">
                        <span class="avatar-title bg-primary-subtle rounded-circle">
                            <img src="${getRandomLogo()}" alt="" height="22">
                        </span>
                    </div>
                    <div>
                        <span class="text-muted fs-12">${modelo}</span><br>
                        <h5 class="fs-14 mt-1">${item.descripcion}</h5>
                    </div>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">${item.categoria}</span>
                <h5 class="fs-14 mt-1 fw-normal isadmin">${item.grupo}</h5>
                <h5 class="fs-11 mt-1 fw-normal">${item.pais}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Status</span>
                <h5 class="fs-14 mt-1 fw-normal">
                    <i class="ti ti-circle-filled fs-12 ${item.status === "Active" ? "text-success" : "text-danger"}"></i>
                    ${item.status}
                </h5>
            </td>

            <td>
                <span class="text-muted fs-12">Cantidad</span> <br>
                <div data-touchspin class="input-step border bg-body-secondary p-1 mt-1 rounded-pill d-inline-flex overflow-visible">
                    <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">-</button>
                    <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="1" min="0" max="100" readonly />
                    <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">+</button>
                </div>
            </td>

            <td><span class="text-muted fs-12">Peso</span><h5 class="fs-14 mt-1 fw-normal">${item.peso}</h5></td>
            <td><span class="text-muted fs-12">MSRP</span><h5 class="fs-14 mt-1 fw-normal">${item.precio.toFixed(2)} ${item.moneda}</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Valor</span><h5 class="fs-14 mt-1 fw-normal margen">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Dscto</span><h5 class="fs-14 mt-1 fw-normal margen_dscto">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Precio Dscto</span><h5 class="fs-14 mt-1 fw-normal precio_dscto">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Factor PU</span><h5 class="fs-14 mt-1 fw-normal factor-precio">0.00</h5></td>
            <td class="isadmin"><span class="text-muted fs-12">Precio M</span><h5 class="fs-14 mt-1 fw-normal precio-m">0.00</h5></td>
            <td><span class="text-muted fs-12">Margen</span><br>
            <select class="form-select-sm margen-uti" data-default="0.15"><option value="0.25">Lista 1</option><option value="0.30">Lista 2</option><option value="0.35">Lista 3</option><option value="0.40">Lista 4</option><option value="0.45">Lista 5</option><option value="0.50">Lista 6</option></select></td>
            <td class="isadmin"><span class="text-muted fs-12">Utilidad</span><h5 class="fs-14 mt-1 fw-normal utilidad">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio Cliente</span><h5 class="fs-14 mt-1 fw-normal precio-cliente">0.00</h5></td>
            <td>
                <a href="javascript:void(0)" class="text-danger btnDeleteItem">
                    <i class="ti ti-trash fs-18"></i>
                </a>
            </td>
        `;

        tbody.appendChild(tr);
        validarTdAdmin(tr);
        alertify.success("Item agregado");
        recalculateTotals();
    });

    /* ---------------------------------------------------
       EVENTO GLOBAL: + / – / eliminar
    --------------------------------------------------- */
    tbody.addEventListener("click", (e) => {

        if (e.target.classList.contains("plus")) {
            const input = e.target.parentNode.querySelector("input");
            const tr = e.target.closest("tr");
            const pesoItem = parseFloat(tr.dataset.peso);
            const totalPesoActual = getTotalPesoActual();

            if (totalPesoActual + pesoItem > LIMITE_PESO) {
                alertify.alert(
                    "Límite de peso",
                    "Items con un peso total mayor a 100 Kg. <br>Por favor, contacte al administrador"
                );
                return;
            }

            input.value = parseInt(input.value) + 1;
            recalculateTotals();
        }


        if (e.target.classList.contains("minus")) {
            const input = e.target.parentNode.querySelector("input");
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                recalculateTotals();
            }
        }

        if (e.target.closest(".btnDeleteItem")) {
            e.target.closest("tr").remove();
            recalculateTotals();
            alertify.error("Item eliminado");
        }
    });

    tbody.addEventListener("change", (e) => {
        if (e.target.classList.contains("margen-uti")) {
            recalculateTotals();
        }
    });

    /* ---------------------------------------------------
    SUBMIT COTIZACIÓN
    --------------------------------------------------- */
    const formCotizacion = document.getElementById("formCotizacion");

    formCotizacion.addEventListener("submit", (e) => {
        e.preventDefault();

        const rows = tbody.querySelectorAll("tr");
        if (rows.length === 0) {
            alertify.error("Debe agregar al menos un item para continuar");
            return;
        }

        for (const tr of rows) {
            const peso = parseFloat(tr.dataset.peso);

            if (!peso || peso === 0) {
                alertify.alert(
                    "Peso inválido",
                    "No se puede cotizar items con peso 0.<br>Por favor, comuníquese con el administrador"
                );
                return;
            }
        }

        const pesoTotal = getTotalPesoActual();
        if (pesoTotal > LIMITE_PESO) {
            alertify.alert(
                "Límite de peso",
                "El peso total de la cotización supera los 100 Kg.<br>No se puede continuar."
            );
            return;
        }

        const items = [];

        rows.forEach(tr => {
             const selectMargen = tr.querySelector(".margen-uti");
            const margenUti = selectMargen ? parseFloat(selectMargen.value) : 0.15;

            items.push({
                item_id: tr.dataset.itemId, 
                modelo: tr.dataset.modelo,
                descripcion: tr.querySelector("h5").innerText,
                categoria: tr.querySelector("td:nth-child(2) span").innerText,
                grupo: tr.dataset.grupo,
                cantidad: parseInt(tr.querySelector("input").value),
                peso: parseFloat(tr.dataset.peso),
                precio: parseFloat(tr.dataset.precio),
                status: 'Active',
                pais: tr.dataset.pais,
                margen: margenUti
            });
        });

        const formData = new FormData();
        formData.append("estado", "Borrador");
        formData.append("items", JSON.stringify(items));

        fetch("controller/add_cotizacion.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(resp => {
            if (!resp.ok) {
                alertify.error(resp.message || "Error al guardar cotización");
                return;
            }

            alertify.success("Cotización guardada correctamente");
            window.location.href = `cotizaciones.php?id=${md5(String(resp.id))}`;
        })
        .catch(err => {
            console.error(err);
            alertify.error("Error de conexión con el servidor");
        });
    });
});
