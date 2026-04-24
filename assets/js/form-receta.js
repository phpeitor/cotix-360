document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const categoriaSelect = document.getElementById("categoria");
    const subCat1Select = document.getElementById("subCat1");
    const subCat2Select = document.getElementById("subCat2");
    const tbody = document.querySelector("table.table tbody");
    const itemsTableBody = document.getElementById("recetaItemsTableBody");
    const itemsResultCount = document.getElementById("itemsResultCount");
    
    // Elementos de totales
    const totalItemEl = document.getElementById("total_item");
    const totalSolesEl = document.getElementById("total_soles");
    const totalDolaresEl = document.getElementById("total_dolares");
    const totalPeruEl = document.getElementById("total_peru");
    const tipoCambioInput = document.getElementById("tipo_cambio_sunat");
    const tipoCambioFechaEl = document.getElementById("tipo_cambio_sunat_fecha");
    const tcMinusBtn = document.querySelector(".tc-minus");
    const tcPlusBtn = document.querySelector(".tc-plus");
    const previewButton = document.getElementById("btnPreviewReceta");
    const previewModalEl = document.getElementById("previewRecetaModal");
    const previewTableBody = document.getElementById("previewRecetaTableBody");
    const previewTotalItemsEl = document.getElementById("previewTotalItems");
    const previewTotalSolesEl = document.getElementById("previewTotalSoles");
    const previewTotalDolaresEl = document.getElementById("previewTotalDolares");
    const previewTotalPEEl = document.getElementById("previewTotalPE");
    const recetaForm = document.querySelector("form.form-receta");
    const paginationFromEl = document.getElementById("pagination_from");
    const paginationToEl = document.getElementById("pagination_to");
    const paginationWrapper = document.getElementById("pagination_wrapper");
    const paginationList = document.getElementById("pagination_list");
    const PAGE_SIZE = 10;
    let currentPage = 1;

    function getTipoCambioActual() {
        const tc = parseFloat(tipoCambioInput?.value);
        return Number.isFinite(tc) && tc > 0 ? tc : 1;
    }

    function clampCantidad(value) {
        const parsed = parseInt(value, 10);
        if (!Number.isInteger(parsed)) return 1;
        return Math.min(100, Math.max(1, parsed));
    }

    function createQtyStep(initialValue = 1) {
        const wrapper = document.createElement("div");
        wrapper.className = "input-step border bg-body-secondary p-1 rounded-pill d-inline-flex overflow-visible receta-qty-step";
        wrapper.innerHTML = `
            <button type="button" class="qty-minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">-</button>
            <input type="number" class="qty-input text-dark text-center border-0 bg-body-secondary rounded h-100" value="${clampCantidad(initialValue)}" min="1" max="100" readonly />
            <button type="button" class="qty-plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">+</button>
        `;

        const input = wrapper.querySelector(".qty-input");
        wrapper.querySelector(".qty-minus").addEventListener("click", () => {
            input.value = String(clampCantidad(parseInt(input.value, 10) - 1));
        });

        wrapper.querySelector(".qty-plus").addEventListener("click", () => {
            input.value = String(clampCantidad(parseInt(input.value, 10) + 1));
        });

        return { wrapper, input };
    }

    function resetNativeSelect(selectEl, placeholder, disabled = true) {
        if (!selectEl) return;

        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
        selectEl.disabled = disabled;
    }

    function setNativeSelectOptions(selectEl, rows, placeholder, valueKey) {
        if (!selectEl) return;

        selectEl.innerHTML = `<option value="">${placeholder}</option>`;

        rows.forEach(row => {
            const value = row[valueKey];
            if (value === null || value === undefined || String(value).trim() === "") {
                return;
            }

            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            selectEl.appendChild(option);
        });

        selectEl.disabled = rows.length === 0;
    }

    function renderItemsTable(rows, emptyMessage = "No hay items para mostrar con los filtros actuales.") {
        if (!itemsTableBody) return;

        if (itemsResultCount) {
            itemsResultCount.textContent = `${rows.length} resultado${rows.length === 1 ? "" : "s"}`;
        }

        if (!rows.length) {
            itemsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">${emptyMessage}</td>
                </tr>
            `;
            return;
        }

        itemsTableBody.innerHTML = rows.map(item => {
            const itemNombre = item.nombre || "-";
            const itemDescripcion = item.descripcion || "";
            const detalleLinea1 = [item.categoria, item.sub_cat_1, item.sub_cat_2].filter(Boolean).join(" / ");
            const detalleLinea2 = [item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ");
            const monedaSimbolo = item.moneda === "DOLLAR" ? "$" : "S/.";
            const precioTexto = `${monedaSimbolo} ${formatDecimal(item.precio)}`;
            const itemPayload = encodeURIComponent(JSON.stringify({
                id: item.id,
                descripcion: item.descripcion,
                uni_medida: item.uni_medida,
                precio: item.precio,
                categoria: item.categoria,
                sub_cat_1: item.sub_cat_1,
                sub_cat_2: item.sub_cat_2,
                marca: item.marca,
                modelo: item.modelo,
                nombre: item.nombre,
                moneda: item.moneda,
                tipo: item.tipo
            }));

            return `
                <tr data-item-payload="${itemPayload}">
                    <td>
                        <div class="item-title">${itemNombre}</div>
                        ${itemDescripcion ? `<div class="item-subtitle">${itemDescripcion}</div>` : ""}
                        <div class="item-title">${detalleLinea1 || "-"}</div>
                    </td>
                    <td class="text-center align-middle receta-qty-cell"></td>
                    <td class="text-end">${precioTexto}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-primary btn-add-item-row">
                            <i class="ti ti-plus"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        itemsTableBody.querySelectorAll(".btn-add-item-row").forEach(button => {
            button.addEventListener("click", () => {
                const row = button.closest("tr");
                const payload = row?.dataset.itemPayload;
                const qtyInput = row?.querySelector(".qty-input");
                const qty = clampCantidad(qtyInput?.value);
                if (!payload) return;

                try {
                    const item = JSON.parse(decodeURIComponent(payload));
                    agregarItemReceta(item, qty);
                } catch (error) {
                    console.error(error);
                    alertify.error("No se pudo agregar el item");
                }
            });
        });

        itemsTableBody.querySelectorAll("tr[data-item-payload]").forEach(row => {
            const payload = row.dataset.itemPayload;
            if (!payload) return;

            const qtyCell = row.querySelector(".receta-qty-cell");
            if (!qtyCell) return;

            const { wrapper } = createQtyStep(1);
            qtyCell.appendChild(wrapper);
        });
    }

    async function cargarRecetaOpciones(params) {
        const query = new URLSearchParams(params);
        const res = await fetch(`controller/get_receta_item.php?${query.toString()}`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
            throw new Error(data?.message || "No se pudieron cargar las opciones");
        }

        return data;
    }

    function getFiltrosReceta() {
        return {
            tipo: baseSelect?.value || "",
            categoria: categoriaSelect?.value || "",
            sub_cat_1: subCat1Select?.value || "",
            sub_cat_2: subCat2Select?.value || ""
        };
    }

    async function cargarBasesReceta() {
        try {
            const bases = await cargarRecetaOpciones({ nivel: "bases" });
            setNativeSelectOptions(baseSelect, bases, "-- Seleccione --", "tipo");
            resetNativeSelect(categoriaSelect, "-- Seleccione --");
            resetNativeSelect(subCat1Select, "-- Seleccione --");
            resetNativeSelect(subCat2Select, "-- Seleccione --");
            renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar bases");
        }
    }

    async function cargarCategoriasReceta() {
        const { tipo } = getFiltrosReceta();

        resetNativeSelect(categoriaSelect, "-- Seleccione --");
        resetNativeSelect(subCat1Select, "-- Seleccione --");
        resetNativeSelect(subCat2Select, "-- Seleccione --");
        renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");

        if (!tipo) return;

        try {
            const categorias = await cargarRecetaOpciones({ nivel: "categorias", tipo });
            setNativeSelectOptions(categoriaSelect, categorias, "-- Seleccione --", "categoria");
            resetNativeSelect(subCat1Select, "-- Seleccione --");
            resetNativeSelect(subCat2Select, "-- Seleccione --");
            renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar categorías");
        }
    }

    async function cargarSubCategorias1Receta() {
        const { tipo, categoria } = getFiltrosReceta();

        resetNativeSelect(subCat1Select, "-- Seleccione --");
        resetNativeSelect(subCat2Select, "-- Seleccione --");
        renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");

        if (!tipo || !categoria) return;

        try {
            const subCategorias1 = await cargarRecetaOpciones({ nivel: "subcat1", tipo, categoria });
            setNativeSelectOptions(subCat1Select, subCategorias1, "-- Seleccione --", "sub_cat_1");
            resetNativeSelect(subCat2Select, "-- Seleccione --");
            renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar sub categoría 1");
        }
    }

    async function cargarSubCategorias2Receta() {
        const { tipo, categoria, sub_cat_1 } = getFiltrosReceta();

        resetNativeSelect(subCat2Select, "-- Seleccione --");
        renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");

        if (!tipo || !categoria || !sub_cat_1) return;

        try {
            const subCategorias2 = await cargarRecetaOpciones({ nivel: "subcat2", tipo, categoria, sub_cat_1 });
            setNativeSelectOptions(subCat2Select, subCategorias2, "-- Seleccione --", "sub_cat_2");
            renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar sub categoría 2");
        }
    }

    async function cargarItemsReceta() {
        const filtros = getFiltrosReceta();

        renderItemsTable([], "Cargando items...");

        if (!filtros.tipo || !filtros.categoria || !filtros.sub_cat_1 || !filtros.sub_cat_2) {
            renderItemsTable([], "Selecciona todos los filtros para ver los items.");
            return;
        }

        try {
            const items = await cargarRecetaOpciones({ nivel: "items", ...filtros });
            renderItemsTable(items, "No hay items para mostrar con los filtros actuales.");
        } catch (error) {
            console.error(error);
            renderItemsTable([], "Error al cargar items.");
            alertify.error("Error al cargar items");
        }
    }

    baseSelect?.addEventListener("change", cargarCategoriasReceta);
    categoriaSelect?.addEventListener("change", cargarSubCategorias1Receta);
    subCat1Select?.addEventListener("change", cargarSubCategorias2Receta);
    subCat2Select?.addEventListener("change", cargarItemsReceta);

    cargarBasesReceta();

    function agregarItemReceta(item, qtyInicial = 1) {
        const itemId = item.id;
        const qtyNormalizada = clampCantidad(qtyInicial);

        if (!item) {
            alertify.error("El item no contiene información válida");
            return;
        }

        if (!Number.isInteger(qtyNormalizada) || qtyNormalizada < 1 || qtyNormalizada > 100) {
            alertify.error("Ingrese una cantidad valida (1 a 100)");
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
        tr.dataset.nombre = item.nombre;
        tr.dataset.descripcion = item.descripcion;
        tr.dataset.categoria = item.categoria;
        tr.dataset.subcat1 = item.sub_cat_1;
        tr.dataset.subcat2 = item.sub_cat_2;
        tr.dataset.marca = item.marca;
        tr.dataset.modelo = item.modelo;
        tr.dataset.unimedida = item.uni_medida;
        tr.dataset.tipo = item.tipo;

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
                    <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="${qtyNormalizada}" min="0" max="100" readonly />
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
        currentPage = Math.ceil(getRows().length / PAGE_SIZE);
        calcularTotales();

        const inputQty = tr.querySelector("input");
        inputQty.value = String(qtyNormalizada);
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
    }

    function getRows() {
        return [...tbody.querySelectorAll("tr")];
    }

    function getResumenTotales() {
        let contadorItems = 0;
        let totalSoles = 0;
        let totalDolares = 0;

        getRows().forEach(tr => {
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

        const tc = getTipoCambioActual();
        const totalPE = totalSoles + (totalDolares * tc);

        return { contadorItems, totalSoles, totalDolares, totalPE };
    }

    function renderPreviewTable() {
        if (!previewTableBody) return;

        const { contadorItems, totalSoles, totalDolares, totalPE } = getResumenTotales();

        if (previewTotalItemsEl) previewTotalItemsEl.textContent = contadorItems;
        if (previewTotalSolesEl) previewTotalSolesEl.textContent = format2(decimalAdjust('round', totalSoles, '-2'));
        if (previewTotalDolaresEl) previewTotalDolaresEl.textContent = format2(decimalAdjust('round', totalDolares, '-2'));
        if (previewTotalPEEl) previewTotalPEEl.textContent = format2(decimalAdjust('round', totalPE, '-2'));

        previewTableBody.innerHTML = "";

        getRows().forEach(tr => {
            const qty = parseInt(tr.querySelector("input").value);
            const precio = parseFloat(tr.dataset.precio);
            const moneda = tr.dataset.moneda;
            const monedaSimbolo = moneda === "DOLLAR" ? "$" : "S/.";

            const itemNombre = tr.dataset.nombre || "";
            const itemDescripcion = tr.dataset.descripcion || "";
            const detalleLinea1 = [tr.dataset.categoria, tr.dataset.subcat1, tr.dataset.subcat2].filter(Boolean).join(" / ");
            const detalleLinea2 = [tr.dataset.marca, tr.dataset.modelo, tr.dataset.unimedida].filter(Boolean).join(" / ");

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="item-title">${itemNombre}</div>
                    ${itemDescripcion ? `<div class="item-subtitle">${itemDescripcion}</div>` : ""}
                </td>
                <td>
                    <div class="item-title">${detalleLinea1 || "-"}</div>
                    <div class="item-subtitle">${detalleLinea2 || "-"}</div>
                </td>
                <td>${tr.dataset.tipo || "-"}</td>
                <td class="text-center">${qty}</td>
                <td class="text-end">${monedaSimbolo} ${formatDecimal(precio)}</td>
            `;

            previewTableBody.appendChild(row);
        });
    }

    function renderPagination() {
        const rows = getRows();
        const totalRows = rows.length;
        const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        rows.forEach((row, index) => {
            row.classList.toggle("d-none", !(index >= startIndex && index < endIndex));
        });

        if (paginationFromEl) {
            paginationFromEl.textContent = totalRows === 0 ? 0 : startIndex + 1;
        }

        if (paginationToEl) {
            paginationToEl.textContent = Math.min(endIndex, totalRows);
        }

        if (paginationWrapper) {
            paginationWrapper.classList.toggle("d-none", totalRows <= PAGE_SIZE);
        }

        if (!paginationList) return;

        paginationList.innerHTML = "";

        if (totalRows <= PAGE_SIZE) {
            return;
        }

        const createPageItem = (label, page, disabled = false, active = false, icon = false) => {
            const li = document.createElement("li");
            li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`.trim();

            const a = document.createElement("a");
            a.href = "#";
            a.className = "page-link";
            a.innerHTML = icon ? label : label;

            if (!disabled) {
                a.addEventListener("click", (event) => {
                    event.preventDefault();
                    currentPage = page;
                    renderPagination();
                });
            }

            li.appendChild(a);
            return li;
        };

        paginationList.appendChild(createPageItem('<i class="ti ti-chevron-left"></i>', Math.max(1, currentPage - 1), currentPage === 1, false, true));

        for (let page = 1; page <= totalPages; page++) {
            paginationList.appendChild(createPageItem(String(page), page, false, page === currentPage));
        }

        paginationList.appendChild(createPageItem('<i class="ti ti-chevron-right"></i>', Math.min(totalPages, currentPage + 1), currentPage === totalPages, false, true));
    }

    function calcularTotales() {
        const { contadorItems, totalSoles, totalDolares, totalPE } = getResumenTotales();

        if (totalItemEl) totalItemEl.textContent = contadorItems;
        if (totalSolesEl) totalSolesEl.textContent = format2(decimalAdjust('round', totalSoles, '-2'));
        if (totalDolaresEl) totalDolaresEl.textContent = format2(decimalAdjust('round', totalDolares, '-2'));
        if (totalPeruEl) totalPeruEl.textContent = format2(decimalAdjust('round', totalPE, '-2'));

        renderPagination();
    }

    function getItemsParaGuardarReceta() {
        return getRows().map(tr => ({
            item_id: parseInt(tr.dataset.itemId, 10) || 0,
            categoria: tr.dataset.categoria || "",
            sub_cat_1: tr.dataset.subcat1 || "",
            sub_cat_2: tr.dataset.subcat2 || "",
            marca: tr.dataset.marca || "",
            modelo: tr.dataset.modelo || "",
            nombre: tr.dataset.nombre || "",
            descripcion: tr.dataset.descripcion || "",
            uni_medida: tr.dataset.unimedida || "",
            precio: parseFloat(tr.dataset.precio) || 0,
            moneda: tr.dataset.moneda || "",
            tipo: tr.dataset.tipo || "",
            cantidad: clampCantidad(tr.querySelector("input")?.value)
        }));
    }

    function limpiarRecetaGuardada() {
        tbody.innerHTML = "";
        currentPage = 1;
        calcularTotales();
    }

    recetaForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = recetaForm.querySelector("[type='submit']");

        if (submitBtn?.disabled) {
            return;
        }

        const items = getItemsParaGuardarReceta();

        if (!items.length) {
            alertify.error("Agrega al menos un item antes de guardar la receta");
            return;
        }

        if (items.some(item => !item.item_id || item.cantidad < 1)) {
            alertify.error("Hay items inválidos en la receta");
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-50", "cursor-not-allowed");
        }

        try {
            const formData = new FormData();
            formData.append("items", JSON.stringify(items));
            formData.append("tipo_cambio", String(getTipoCambioActual()));

            const res = await fetch("controller/add_receta.php", {
                method: "POST",
                body: formData,
            });

            const ct = res.headers.get("content-type") || "";
            const json = ct.includes("application/json")
                ? await res.json()
                : { ok: false, message: await res.text() };

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudo guardar la receta");
            }

            limpiarRecetaGuardada();
            alertify.success("Receta guardada correctamente");
            window.location.href = `receta_list.php?id=${md5(String(json.id))}`;

        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Fallo al guardar la receta");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
        }
    });

    async function cargarTipoCambioSunat() {
        try {
            const res = await fetch("controller/get_tipo_cambio.php");
            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.message || "No se pudo obtener tipo de cambio SUNAT");
            }

            if (tipoCambioInput) {
                tipoCambioInput.value = Number(data.venta || 1).toFixed(3);
            }

            if (tipoCambioFechaEl && data.fecha) {
                tipoCambioFechaEl.textContent = `- ${data.fecha}`;
            }

            calcularTotales();
        } catch (error) {
            console.error(error);
            if (tipoCambioInput) {
                tipoCambioInput.value = "1.000";
            }
            if (tipoCambioFechaEl) {
                tipoCambioFechaEl.textContent = "";
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

        valor = valor.replace(/[^\d.]/g, "");

        const primerPunto = valor.indexOf(".");
        if (primerPunto !== -1) {
            valor = valor.slice(0, primerPunto + 1) + valor.slice(primerPunto + 1).replace(/\./g, "");
        }

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

    previewButton?.addEventListener("click", renderPreviewTable);
    previewModalEl?.addEventListener("show.bs.modal", renderPreviewTable);

    cargarTipoCambioSunat();

});
