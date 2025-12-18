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

    function calcularFlete(totalPeso) {
        if (fleteTable.length === 0) return 0;

        for (const row of fleteTable) {
            if (parseFloat(row.peso) >= totalPeso) {
                return parseFloat(row.flete);
            }
        }

        return parseFloat(fleteTable[fleteTable.length - 1].flete);
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

    /* ---------------------------------------------------
       FUNCIÓN: RE-CALCULAR TOTALES
    --------------------------------------------------- */

    function getMargenByGrupo(grupo) {
        if (!grupo) return 0.32;
        const g = grupo.toString().toLowerCase();
        if (g.includes("1")) return 0.25;
        if (g.includes("2")) return 0.15;
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

            totalItems += qty;
            totalPeso += peso * qty;
            totalFob += precio * qty;
        });

        totalItemsEl.textContent = totalItems;
        totalPesoEl.textContent = totalPeso.toFixed(2);
        totalFobEl.textContent = totalFob.toFixed(2);

        const flete = calcularFlete(totalPeso);
        totalFleteEl.textContent = flete.toFixed(2);

        const gasto = calcularGasto(totalFob);
        totalGastoEl.textContent = gasto.toFixed(2);

        const totalPeru = totalFob + flete + gasto;
        totalPeruEl.textContent = totalPeru.toFixed(2);

        const rawFactor = totalFob > 0
            ? (gasto + flete) / totalFob
            : 0;

        totalFactorEl.textContent = rawFactor.toFixed(4);

        /* ==========================
        2️⃣ CÁLCULOS POR FILA
        ========================== */
        rows.forEach(tr => {

            const precio = parseFloat(tr.dataset.precio);
            const grupo  = tr.dataset.grupo;

            // Factor PU
            const factorPU = decimalAdjust(
                'round',
                precio * decimalAdjust('round', rawFactor, '-4'),
                '-2'
            );
            tr.querySelector(".factor-precio").textContent = factorPU.toFixed(2);

            // Precio M
            const precioM = decimalAdjust(
                'round',
                precio + factorPU,
                '-2'
            );
            tr.querySelector(".precio-m").textContent = precioM.toFixed(2);

            // Margen
            const margen = getMargenByGrupo(grupo);
            tr.querySelector(".margen").textContent =
                (margen * 100).toFixed(0) + "%";

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
    function itemAlreadyAdded(modelo) {
        return [...tbody.querySelectorAll("tr")].some(tr => tr.dataset.modelo === modelo);
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

        if (!item) {
            alertify.error("El item no contiene información válida");
            return;
        }

        // Validación de duplicado
        if (itemAlreadyAdded(modelo)) {
            alertify.error("Este item ya fue agregado");
            return;
        }

        // Crear fila
        const tr = document.createElement("tr");
        tr.dataset.modelo = modelo;
        tr.dataset.peso = item.peso;
        tr.dataset.precio = item.precio;
        tr.dataset.grupo = item.grupo;

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
                <h5 class="fs-14 mt-1 fw-normal">${item.grupo}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Cantidad</span> <br>
                <div data-touchspin class="input-step border bg-body-secondary p-1 mt-1 rounded-pill d-inline-flex overflow-visible">
                    <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">-</button>
                    <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="1" min="0" max="100" readonly="">
                    <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">+</button>
                </div>
            </td>

            <td><span class="text-muted fs-12">Peso</span><h5 class="fs-14 mt-1 fw-normal">${item.peso}</h5></td>
            <td><span class="text-muted fs-12">Precio Uni.</span><h5 class="fs-14 mt-1 fw-normal">${item.precio} ${item.moneda}</h5></td>
            <td><span class="text-muted fs-12">Factor PU</span><h5 class="fs-14 mt-1 fw-normal factor-precio">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio M</span><h5 class="fs-14 mt-1 fw-normal precio-m">0.00</h5></td>
            <td><span class="text-muted fs-12">Margen</span><h5 class="fs-14 mt-1 fw-normal margen">0.00</h5></td>
            <td><span class="text-muted fs-12">Utilidad</span><h5 class="fs-14 mt-1 fw-normal utilidad">0.00</h5></td>
            <td><span class="text-muted fs-12">Precio Cliente</span><h5 class="fs-14 mt-1 fw-normal precio-cliente">0.00</h5></td>
            <td>
                <span class="text-muted fs-12">Status</span>
                <h5 class="fs-14 mt-1 fw-normal">
                    <i class="ti ti-circle-filled fs-12 ${item.status === "Active" ? "text-success" : "text-danger"}"></i>
                    ${item.status}
                </h5>
            </td>

            <td>
                <a href="javascript:void(0)" class="text-danger btnDeleteItem">
                    <i class="ti ti-trash fs-18"></i>
                </a>
            </td>
        `;

        tbody.appendChild(tr);
        alertify.success("Item agregado");

        recalculateTotals();
    });

    /* ---------------------------------------------------
       EVENTO GLOBAL: + / – / eliminar
    --------------------------------------------------- */
    tbody.addEventListener("click", (e) => {

        // SUMAR
        if (e.target.classList.contains("plus")) {
            const input = e.target.parentNode.querySelector("input");
            input.value = parseInt(input.value) + 1;
            recalculateTotals();
        }

        // RESTAR
        if (e.target.classList.contains("minus")) {
            const input = e.target.parentNode.querySelector("input");
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                recalculateTotals();
            }
        }

        // ELIMINAR ITEM
        if (e.target.closest(".btnDeleteItem")) {
            e.target.closest("tr").remove();
            recalculateTotals();
            alertify.error("Item eliminado");
        }
    });

});
