document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");
    const btnAdd = document.getElementById("btnAdd");
    const tbody = document.querySelector("table.table tbody");
    
    // Elementos de totales
    const totalItemEl = document.getElementById("total_item");
    const totalSolesEl = document.getElementById("total_soles");
    const totalDolaresEl = document.getElementById("total_dolares");
    const totalPeruEl = document.getElementById("total_peru");
    const tipoCambioInput = document.getElementById("tipo_cambio_sunat");
    const tcMinusBtn = document.querySelector(".tc-minus");
    const tcPlusBtn = document.querySelector(".tc-plus");

    function getTipoCambioActual() {
        const tc = parseFloat(tipoCambioInput?.value);
        return Number.isFinite(tc) && tc > 0 ? tc : 1;
    }

    // Función para calcular totales
    function calcularTotales() {
        let contadorItems = 0;
        let totalSoles = 0;
        let totalDolares = 0;

        tbody.querySelectorAll("tr").forEach(tr => {
            const qty = parseInt(tr.querySelector("input").value);
            const precio = parseFloat(tr.dataset.precio);
            const moneda = tr.dataset.moneda;

            contadorItems += qty;

            if (moneda === "DOLLAR") {
                totalDolares += precio * qty;
            } else {
                totalSoles += precio * qty;
            }
        });

        totalItemEl.textContent = contadorItems;
        totalSolesEl.textContent = format2(decimalAdjust('round', totalSoles, '-2'));
        totalDolaresEl.textContent = format2(decimalAdjust('round', totalDolares, '-2'));

        const tc = getTipoCambioActual();
        const totalPE = totalSoles + (totalDolares * tc);
        totalPeruEl.textContent = format2(decimalAdjust('round', totalPE, '-2'));
    }

    async function cargarTipoCambioSunat() {
        try {
            const res = await fetch("controller/get_tipo_cambio.php");
            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.message || "No se pudo obtener tipo de cambio SUNAT");
            }

            // Para cotizar usamos tipo de cambio VENTA.
            if (tipoCambioInput) {
                tipoCambioInput.value = Number(data.venta || 1).toFixed(3);
            }

            calcularTotales();
        } catch (error) {
            console.error(error);
            if (tipoCambioInput) {
                tipoCambioInput.value = "1.000";
            }
            calcularTotales();
            alertify.error("No se pudo cargar TC SUNAT; se usa 1.000");
        }
    }

    function ajustarTipoCambio(delta) {
        if (!tipoCambioInput) return;

        const actual = getTipoCambioActual();
        const nuevo = Math.max(0, decimalAdjust('round', actual + delta, '-3'));
        tipoCambioInput.value = nuevo.toFixed(3);
        calcularTotales();
    }

    function normalizarTipoCambio(rawValue) {
        let valor = String(rawValue ?? "").replace(",", ".");

        // Permitir solo digitos y punto decimal.
        valor = valor.replace(/[^\d.]/g, "");

        // Mantener solo el primer punto.
        const primerPunto = valor.indexOf(".");
        if (primerPunto !== -1) {
            valor = valor.slice(0, primerPunto + 1) + valor.slice(primerPunto + 1).replace(/\./g, "");
        }

        // Limitar a maximo 3 decimales.
        const partes = valor.split(".");
        if (partes.length > 1) {
            partes[1] = partes[1].slice(0, 3);
            valor = `${partes[0]}.${partes[1]}`;
        }

        return valor;
    }

    if (tipoCambioInput) {
        tipoCambioInput.addEventListener("input", () => {
            tipoCambioInput.value = normalizarTipoCambio(tipoCambioInput.value);

            const tc = parseFloat(tipoCambioInput.value);
            if (Number.isFinite(tc) && tc >= 0) {
                calcularTotales();
                return;
            }

            calcularTotales();
        });

        tipoCambioInput.addEventListener("blur", () => {
            const tc = parseFloat(normalizarTipoCambio(tipoCambioInput.value));
            const valorFinal = Number.isFinite(tc) && tc >= 0 ? tc : 0;
            tipoCambioInput.value = valorFinal.toFixed(3);
            calcularTotales();
        });
    }

    tcMinusBtn?.addEventListener("click", () => ajustarTipoCambio(-0.001));
    tcPlusBtn?.addEventListener("click", () => ajustarTipoCambio(0.001));

    cargarTipoCambioSunat();
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

            const res = await fetch(`controller/get_receta_item.php?tipo=${baseId}`);
            const data = await res.json();

            choices.setChoices(
                data.map(i => ({
                    value: i.id,
                    label: i.nombre + (validarDescripcion(i.descripcion) ? ` ⮞ ${i.descripcion}` : ""),
                    customProperties: {
                        id: i.id,
                        descripcion: i.descripcion,
                        uni_medida: i.uni_medida,
                        precio: i.precio,
                        categoria: i.categoria,
                        sub_cat_1: i.sub_cat_1,
                        sub_cat_2: i.sub_cat_2,
                        marca: i.marca,
                        modelo: i.modelo,
                        nombre: i.nombre,
                        moneda: i.moneda,
                        tipo: i.tipo
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

        const item = selected.customProperties;
        const itemId  = item.id;

        if (!item) {
            alertify.error("El item no contiene información válida");
            return;
        }

        if (itemAlreadyAdded(tbody, itemId)) {
            alertify.error("Este item ya fue agregado");
            return;
        }

        const tr = document.createElement("tr");
        tr.dataset.itemId  = itemId;
        tr.dataset.precio = item.precio;
        tr.dataset.moneda = item.moneda;

        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-md flex-shrink-0 me-2">
                        <span class="avatar-title bg-primary-subtle rounded-circle">
                            <img src="${getRandomLogo()}" alt="" height="22">
                        </span>
                    </div>
                    <div>
                        <span class="text-muted fs-12">${item.nombre}</span><br>
                        <h5 class="fs-14 mt-1 item-description">${item.descripcion}</h5>
                    </div>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">${item.categoria}</span>
                <h5 class="fs-14 mt-1 fw-normal isadmin">${item.sub_cat_1}</h5>
                <h5 class="fs-11 mt-1 fw-normal">${item.sub_cat_2}</h5>
            </td>
             <td>
                <span class="text-muted fs-12">${item.marca}</span>
                <h5 class="fs-14 mt-1 fw-normal isadmin">${item.modelo}</h5>
                <h5 class="fs-14 mt-1 fw-normal">${item.uni_medida}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Tipo</span>
                <h5 class="fs-14 mt-1 fw-normal">
                    <i class="ti ti-circle-filled fs-12 ${item.tipo === "PRODUCTO" ? "text-success" : "text-info"}"></i>
                    ${item.tipo}
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

            <td><span class="text-muted fs-12">Precio</span><h5 class="fs-14 mt-1 fw-normal">${item.moneda === 'DOLLAR' ? '$' : 'S/.'}${formatDecimal(item.precio)}</h5></td>
            
            <td>
                <a href="javascript:void(0)" class="text-danger btnDeleteItem">
                    <i class="ti ti-trash fs-18"></i>
                </a>
            </td>
        `;

        tbody.appendChild(tr);
        validarTdAdmin(tr);
        alertify.success("Item agregado");
        calcularTotales();

        // Eventos para cambiar cantidad
        const inputQty = tr.querySelector("input");
        const btnPlus = tr.querySelector(".plus");
        const btnMinus = tr.querySelector(".minus");
        const btnDelete = tr.querySelector(".btnDeleteItem");

        btnPlus.addEventListener("click", () => {
            inputQty.value = parseInt(inputQty.value) + 1;
            calcularTotales();
        });

        btnMinus.addEventListener("click", () => {
            if (parseInt(inputQty.value) > 1) {
                inputQty.value = parseInt(inputQty.value) - 1;
                calcularTotales();
            }
        });

        btnDelete.addEventListener("click", () => {
            tr.remove();
            alertify.error("Item eliminado");
            calcularTotales();
        });
    });

});
