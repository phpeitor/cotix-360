document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const tbody = document.getElementById("ingenieriaDetalleBody");
    const itemSearchBody = document.getElementById("recetaItemsTableBody");
    const itemsResultCount = document.getElementById("itemsResultCount");

    const baseSelect = document.getElementById("filterBase");
    const categoriaSelect = document.getElementById("categoria");
    const subCat1Select = document.getElementById("subCat1");
    const subCat2Select = document.getElementById("subCat2");
    const productoFiltersWrap = document.getElementById("productoFiltersWrap");
    const marcaSelect = document.getElementById("filterMarca");
    const modeloSelect = document.getElementById("filterModelo");

    const fields = {
        form: document.querySelector("form.form-ingenieria"),
        id: document.getElementById("ingenieria_id"),
        nombre: document.getElementById("receta_nombre_display"),
        nombreInput: document.getElementById("inputRecetaNombre"),
        btnNombre: document.getElementById("btnEditRecetaNombre"),
        usuario: document.getElementById("usuario"),
        aprobador: document.getElementById("usuario_aprobador"),
        estado: document.getElementById("estado"),
        fecha: document.getElementById("fecha"),
        totalItem: document.getElementById("total_item"),
        totalSoles: document.getElementById("total_soles"),
        totalDolares: document.getElementById("total_dolares"),
        totalPeru: document.getElementById("total_peru"),
        totalPeruDolares: document.getElementById("total_peru_dolares"),
        tipoCambio: document.getElementById("tipo_cambio_sunat"),
        tipoCambioInput: document.getElementById("tipo_cambio_input"),
        btnTipoCambio: document.getElementById("btnEditTipoCambio"),
        clienteRuc: document.getElementById("clienteRuc"),
        clienteRazonSocial: document.getElementById("clienteRazonSocial"),
        clienteNombreCompleto: document.getElementById("clienteNombreCompleto"),
        clienteCorreo: document.getElementById("clienteCorreo"),
        clienteCelular: document.getElementById("clienteCelular"),
        clienteMotivo: document.getElementById("clienteMotivo"),
        clienteDireccion: document.getElementById("clienteDireccion")
    };

    let receta = null;
    let detalle = [];
    let cliente = null;

    if (!hash) {
        alertify.error("ID inválido");
        return;
    }

    init();

    function init() {
        initTooltips();
        loadIngenieria();
        cargarBases();

        baseSelect?.addEventListener("change", cargarCategorias);
        categoriaSelect?.addEventListener("change", cargarSubCat1);
        subCat1Select?.addEventListener("change", cargarSubCat2);
        subCat2Select?.addEventListener("change", onSubCat2Change);
        marcaSelect?.addEventListener("change", cargarItems);
        modeloSelect?.addEventListener("change", cargarItems);

        fields.btnNombre?.addEventListener("click", () => toggleNombre());
        fields.nombreInput?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                toggleNombre(true);
            }
            if (event.key === "Escape") cancelNombre();
        });

        fields.btnTipoCambio?.addEventListener("click", () => toggleTipoCambio());
        fields.tipoCambioInput?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                toggleTipoCambio(true);
            }
            if (event.key === "Escape") cancelTipoCambio();
        });

        fields.form?.addEventListener("submit", event => {
            event.preventDefault();
            alertify.success("Receta ingeniería guardada");
            loadIngenieria();
        });

        document.addEventListener("click", event => {
            const delBtn = event.target.closest("[data-delete-detalle]");
            if (delBtn) {
                eliminarDetalle(Number(delBtn.dataset.deleteDetalle || 0));
                return;
            }

            const qtyBtn = event.target.closest("[data-qty-detalle]");
            if (qtyBtn) {
                cambiarCantidad(Number(qtyBtn.dataset.qtyDetalle || 0), Number(qtyBtn.dataset.delta || 0));
                return;
            }

            const addBtn = event.target.closest("[data-add-item]");
            if (addBtn) {
                agregarItem(Number(addBtn.dataset.addItem || 0), Number(addBtn.dataset.cantidad || 1));
            }
        });
    }

    async function loadIngenieria() {
        try {
            const res = await fetch(`controller/get_ingenieria.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();

            if (!res.ok || data.error) {
                alertify.error(data.message || "No se pudo cargar la receta de ingeniería");
                return;
            }

            receta = data.receta || {};
            detalle = Array.isArray(data.detalle) ? data.detalle : [];
            cliente = data.cliente || null;

            renderHeader();
            renderDetalle();
            initTooltips();
        } catch (error) {
            console.error(error);
            alertify.error("Error de conexión al cargar ingeniería");
        }
    }

    function initTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            if (!bootstrap.Tooltip.getInstance(el)) new bootstrap.Tooltip(el);
        });
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function money(value) {
        return Number(value || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function monedaSimbolo(moneda) {
        return String(moneda || "").toUpperCase() === "DOLLAR" ? "$" : "S/.";
    }

    function setText(el, value) {
        if (el) el.textContent = value || "-";
    }

    function renderHeader() {
        setText(fields.id, receta.id);
        setText(fields.nombre, receta.nombre || "-");
        setText(fields.usuario, receta.usuario);
        setText(fields.aprobador, receta.usuario_aprobador);
        fields.estado.innerHTML = `<span class="badge badge-outline-success">${escapeHtml(receta.estado || "GANADO")}</span>`;
        setText(fields.fecha, receta.created_at);
        setText(fields.tipoCambio, Number(receta.tipo_cambio || 0).toFixed(3));

        fields.clienteRuc.value = cliente?.ruc || "";
        fields.clienteRazonSocial.value = cliente?.razon_social_empresa || "";
        fields.clienteNombreCompleto.value = cliente?.nombre_completo || "";
        fields.clienteCorreo.value = cliente?.correo || "";
        fields.clienteCelular.value = cliente?.celular || "";
        fields.clienteMotivo.value = cliente?.motivo || "";
        fields.clienteDireccion.value = cliente?.direccion || "";
    }

    function renderDetalle() {
        let totalSoles = 0;
        let totalDolares = 0;
        let totalItems = 0;

        tbody.innerHTML = detalle.map(item => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const total = cantidad * precio;
            const simbolo = monedaSimbolo(item.moneda);

            totalItems += cantidad;
            if (String(item.moneda || "").toUpperCase() === "DOLLAR") totalDolares += total;
            else totalSoles += total;

            const detalleLinea1 = [item.categoria, item.sub_cat_1, item.sub_cat_2].filter(Boolean).join(" / ");
            const detalleLinea2 = [item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ");

            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                                <iconify-icon icon="solar:box-bold-duotone" class="fs-22 text-primary"></iconify-icon>
                            </div>
                            <div>
                                <span class="text-muted fs-12">${escapeHtml(item.nombre || "-")}</span>
                                <h5 class="fs-14 mt-1 fw-semibold mb-0">${escapeHtml(detalleLinea2 || "-")}</h5>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="text-muted fs-12">${escapeHtml(detalleLinea1 || "-")}</span>
                        <h5 class="fs-14 mt-1 fw-normal">${escapeHtml(item.descripcion || "-")}</h5>
                    </td>
                    <td><span class="text-muted fs-12">Tipo</span><h5 class="fs-14 mt-1 fw-normal"><span class="badge bg-info-subtle text-info rounded-circle me-1">&nbsp;</span>${escapeHtml(item.tipo || "-")}</h5></td>
                    <td class="text-center">
                        <div class="input-step border bg-body-secondary p-1 rounded-pill d-inline-flex align-items-center justify-content-center">
                            <button type="button" class="minus bg-light text-dark border-0 rounded-circle" data-qty-detalle="${item.id}" data-delta="-1">-</button>
                            <span class="px-3 fw-semibold">${cantidad}</span>
                            <button type="button" class="plus bg-light text-dark border-0 rounded-circle" data-qty-detalle="${item.id}" data-delta="1">+</button>
                        </div>
                    </td>
                    <td class="text-end">${simbolo}<br>${money(precio)}</td>
                    <td class="text-end fw-semibold">${simbolo}<br>${money(total)}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-soft-danger btn-icon btn-sm" data-delete-detalle="${item.id}" data-bs-toggle="tooltip" data-bs-title="Eliminar">
                            <i class="ti ti-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        if (!detalle.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Sin detalle registrado</td></tr>`;
        }

        setText(fields.totalItem, String(totalItems));
        setText(fields.totalSoles, money(totalSoles));
        setText(fields.totalDolares, money(totalDolares));

        const tipoCambio = Number(receta?.tipo_cambio) || 1;
        const totalPE = totalSoles + (totalDolares * tipoCambio);
        const totalPEDolares = tipoCambio > 0 ? totalPE / tipoCambio : 0;

        setText(fields.totalPeru, money(totalPE));
        setText(fields.totalPeruDolares, money(totalPEDolares));
    }

    async function post(url, body) {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(body)
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "No se pudo actualizar");
        return json;
    }

    async function toggleNombre(save = false) {
        const editing = fields.nombreInput && !fields.nombreInput.classList.contains("d-none");
        if (!editing && !save) {
            fields.nombreInput.value = receta?.nombre || "";
            fields.nombre.classList.add("d-none");
            fields.nombreInput.classList.remove("d-none");
            fields.nombreInput.focus();
            fields.btnNombre.innerHTML = '<i class="ti ti-check"></i>';
            return;
        }

        const value = String(fields.nombreInput.value || "").trim();
        if (!value) {
            alertify.error("El nombre no puede estar vacío");
            return;
        }

        try {
            await post("controller/upd_ingenieria_header.php", { hash, field: "nombre", value });
            receta.nombre = value;
            setText(fields.nombre, value);
            alertify.success("Nombre actualizado");
            cancelNombre();
        } catch (error) {
            alertify.error(error.message);
        }
    }

    function cancelNombre() {
        fields.nombreInput.classList.add("d-none");
        fields.nombre.classList.remove("d-none");
        fields.btnNombre.innerHTML = '<i class="ti ti-edit"></i>';
    }

    async function toggleTipoCambio(save = false) {
        const editing = fields.tipoCambioInput && !fields.tipoCambioInput.classList.contains("d-none");
        if (!editing && !save) {
            fields.tipoCambioInput.value = Number(receta?.tipo_cambio || 0).toFixed(3);
            fields.tipoCambio.classList.add("d-none");
            fields.tipoCambioInput.classList.remove("d-none");
            fields.tipoCambioInput.focus();
            fields.btnTipoCambio.innerHTML = '<i class="ti ti-check"></i>';
            return;
        }

        const value = Number(fields.tipoCambioInput.value || 0);
        if (!Number.isFinite(value) || value <= 0) {
            alertify.error("Tipo de cambio inválido");
            return;
        }

        try {
            await post("controller/upd_ingenieria_header.php", { hash, field: "tipo_cambio", value: String(value) });
            receta.tipo_cambio = value;
            setText(fields.tipoCambio, value.toFixed(3));
            renderDetalle();
            alertify.success("Tipo de cambio actualizado");
            cancelTipoCambio();
        } catch (error) {
            alertify.error(error.message);
        }
    }

    function cancelTipoCambio() {
        fields.tipoCambioInput.classList.add("d-none");
        fields.tipoCambio.classList.remove("d-none");
        fields.btnTipoCambio.innerHTML = '<i class="ti ti-edit"></i>';
    }

    async function eliminarDetalle(detalleId) {
        if (!detalleId) return;
        alertify.confirm("Eliminar", "¿Deseas eliminar este item?", async () => {
            try {
                await post("controller/upd_ingenieria_detalle.php", { hash, accion: "eliminar", detalle_id: String(detalleId) });
                alertify.success("Item eliminado");
                await loadIngenieria();
            } catch (error) {
                alertify.error(error.message);
            }
        }, () => {});
    }

    async function cambiarCantidad(detalleId, delta) {
        const item = detalle.find(row => Number(row.id) === detalleId);
        if (!item) return;
        const next = Math.max(1, Number(item.cantidad || 1) + delta);
        try {
            await post("controller/upd_ingenieria_detalle.php", { hash, accion: "cantidad", detalle_id: String(detalleId), cantidad: String(next) });
            item.cantidad = next;
            renderDetalle();
        } catch (error) {
            alertify.error(error.message);
        }
    }

    async function agregarItem(itemId, cantidad) {
        if (!itemId) return;
        try {
            await post("controller/upd_ingenieria_detalle.php", { hash, accion: "agregar", item_id: String(itemId), cantidad: String(cantidad || 1) });
            alertify.success("Item agregado");
            await loadIngenieria();
        } catch (error) {
            alertify.error(error.message);
        }
    }

    async function fetchOpciones(params) {
        const res = await fetch(`controller/get_receta_item.php?${new URLSearchParams(params).toString()}`);
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) throw new Error(data.message || "No se pudieron cargar opciones");
        return data;
    }

    function setOptions(selectEl, rows, placeholder, key) {
        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
        rows.forEach(row => {
            const value = row?.[key];
            if (!value) return;
            const opt = document.createElement("option");
            opt.value = value;
            opt.textContent = value;
            selectEl.appendChild(opt);
        });
        selectEl.disabled = rows.length === 0;
    }

    function filtros() {
        return {
            tipo: baseSelect?.value || "",
            categoria: categoriaSelect?.value || "",
            sub_cat_1: subCat1Select?.value || "",
            sub_cat_2: subCat2Select?.value || "",
            marca: marcaSelect?.value || "",
            modelo: modeloSelect?.value || ""
        };
    }

    function isProducto() {
        return String(baseSelect?.value || "").toUpperCase() === "PRODUCTO";
    }

    async function cargarBases() {
        try {
            setOptions(baseSelect, await fetchOpciones({ nivel: "bases" }), "-- Seleccione --", "tipo");
        } catch (error) {
            alertify.error("Error al cargar bases");
        }
    }

    async function cargarCategorias() {
        resetSelect(categoriaSelect, "-- Seleccione --");
        resetSelect(subCat1Select, "-- Seleccione --");
        resetSelect(subCat2Select, "-- Seleccione --");
        renderItemsDisponibles([]);
        if (!baseSelect.value) return;
        setOptions(categoriaSelect, await fetchOpciones({ nivel: "categorias", tipo: baseSelect.value }), "-- Seleccione --", "categoria");
    }

    async function cargarSubCat1() {
        resetSelect(subCat1Select, "-- Seleccione --");
        resetSelect(subCat2Select, "-- Seleccione --");
        renderItemsDisponibles([]);
        const f = filtros();
        if (!f.tipo || !f.categoria) return;
        setOptions(subCat1Select, await fetchOpciones({ nivel: "subcat1", tipo: f.tipo, categoria: f.categoria }), "-- Seleccione --", "sub_cat_1");
    }

    async function cargarSubCat2() {
        resetSelect(subCat2Select, "-- Seleccione --");
        renderItemsDisponibles([]);
        const f = filtros();
        if (!f.tipo || !f.categoria || !f.sub_cat_1) return;
        setOptions(subCat2Select, await fetchOpciones({ nivel: "subcat2", tipo: f.tipo, categoria: f.categoria, sub_cat_1: f.sub_cat_1 }), "-- Seleccione --", "sub_cat_2");
    }

    async function onSubCat2Change() {
        productoFiltersWrap.classList.toggle("d-none", !isProducto());
        resetSelect(marcaSelect, "-- Seleccione Marca --");
        resetSelect(modeloSelect, "-- Seleccione Modelo --");
        const f = filtros();
        if (isProducto() && f.sub_cat_2) {
            setOptions(marcaSelect, await fetchOpciones({ nivel: "marcas", tipo: f.tipo, categoria: f.categoria, sub_cat_1: f.sub_cat_1, sub_cat_2: f.sub_cat_2 }), "-- Seleccione Marca --", "marca");
        }
        await cargarItems();
    }

    async function cargarItems() {
        const f = filtros();
        if (!f.tipo || !f.categoria || !f.sub_cat_1 || !f.sub_cat_2) {
            renderItemsDisponibles([]);
            return;
        }
        const params = { tipo: f.tipo, categoria: f.categoria, sub_cat_1: f.sub_cat_1, sub_cat_2: f.sub_cat_2 };
        if (isProducto()) {
            if (f.marca) params.marca = f.marca;
            if (f.modelo) params.modelo = f.modelo;
            if (f.marca && !f.modelo) {
                setOptions(modeloSelect, await fetchOpciones({ nivel: "modelos", ...params }), "-- Seleccione Modelo --", "modelo");
            }
        }
        renderItemsDisponibles(await fetchOpciones(params));
    }

    function resetSelect(selectEl, placeholder) {
        if (!selectEl) return;
        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
        selectEl.disabled = true;
    }

    function renderItemsDisponibles(items) {
        itemsResultCount.textContent = `${items.length} resultados`;
        if (!items.length) {
            itemSearchBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Sin items disponibles.</td></tr>`;
            return;
        }
        itemSearchBody.innerHTML = items.map(item => {
            const simbolo = monedaSimbolo(item.moneda);
            return `
                <tr>
                    <td>
                        <div class="fw-semibold">${escapeHtml(item.nombre || "-")}</div>
                        <span class="text-muted fs-12">${escapeHtml([item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ") || "-")}</span>
                    </td>
                    <td class="text-center"><input type="number" class="form-control form-control-sm mx-auto item-cantidad" value="1" min="1" max="5000" style="width:80px"></td>
                    <td class="text-end">${simbolo} ${money(item.precio)}</td>
                    <td class="text-center"><button type="button" class="btn btn-soft-success btn-icon btn-sm" data-add-item="${item.id}" onclick="this.dataset.cantidad=this.closest('tr').querySelector('.item-cantidad').value"><i class="ti ti-plus"></i></button></td>
                </tr>
            `;
        }).join("");
    }
});
