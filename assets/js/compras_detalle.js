document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const tbody = document.getElementById("comprasDetalleBody");
    const semaforoWrap = document.getElementById("semaforo-wrap");
    const itemSearchBody = document.getElementById("recetaItemsTableBody");
    const itemsResultCount = document.getElementById("itemsResultCount");

    const fields = {
        id: document.getElementById("compra_id"),
        nombre: document.getElementById("compra_nombre_display"),
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
        btnBuscarItems: document.getElementById("btnBuscarItems"),
        clienteRuc: document.getElementById("clienteRuc"),
        clienteRazonSocial: document.getElementById("clienteRazonSocial"),
        clienteDireccion: document.getElementById("clienteDireccion"),
        clienteNombreCompleto: document.getElementById("clienteNombreCompleto"),
        clienteCorreo: document.getElementById("clienteCorreo"),
        clienteCelular: document.getElementById("clienteCelular"),
        clienteMotivo: document.getElementById("clienteMotivo"),
        clienteModal: document.getElementById("cliente-modal"),
        condicionesModal: document.getElementById("condiciones-modal"),
        btnGuardarCondiciones: document.getElementById("btnGuardarCondiciones"),
        tiempoEntrega: document.getElementById("tiempoEntrega"),
        condicionesPago: document.getElementById("condicionesPago"),
        vendedor: document.getElementById("vendedor"),
        vendedorCorreo: document.getElementById("vendedorCorreo"),
        vendedorTelefono: document.getElementById("vendedorTelefono"),
        descripcionReceta: document.getElementById("descripcionReceta"),
        cantidadItemsReceta: document.getElementById("cantidadItemsReceta"),
        condicionesEconomicasDias: document.getElementById("condicionesEconomicasDias"),
        condicionesEconomicasVisible: document.getElementById("condicionesEconomicasVisible"),
        adicionalesNegativosBody: document.getElementById("adicionalesNegativosBody"),
        totalAdicionalesNegativos: document.getElementById("totalAdicionalesNegativos"),
        adicionalesPositivosBody: document.getElementById("adicionalesPositivosBody"),
        totalAdicionalesPositivos: document.getElementById("totalAdicionalesPositivos"),
        detalleSearch: document.getElementById("comprasDetalleSearch"),
        itemsDisponiblesSearch: document.getElementById("itemsDisponiblesSearch")
    };

    const baseSelect = document.getElementById("filterBase");
    const categoriaSelect = document.getElementById("categoria");
    const subCat1Select = document.getElementById("subCat1");
    const subCat2Select = document.getElementById("subCat2");
    const tipoAgregadoRadios = document.querySelectorAll('input[name="tipoAgregadoCompras"]');
    const productoFiltersWrap = document.getElementById("productoFiltersWrap");
    const marcaSelect = document.getElementById("filterMarca");
    const modeloSelect = document.getElementById("filterModelo");

    let compra = null;
    let detalle = [];
    let totales = null;
    let semaforo = null;
    let condiciones = {};
    let permisos = { puede_editar: false, puede_ver_montos: true, estado: "Validado" };

    const MAX_CANTIDAD = 5000;
    const cantidadTimers = new Map();
    const precioTimers = new Map();
    const dataAttr = {
        total_compra_dolares: 0,
        total_receta_dolares: 0,
        total_origen_dolares: 0,
        total_adicionales_negativos_dolares: 0,
    };

    if (!hash) {
        alertify.error("ID inválido");
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">ID inválido</td></tr>`;
        return;
    }

    init();

    function init() {
        initTooltips();
        loadCompra();
        cargarBases();

        baseSelect?.addEventListener("change", cargarCategorias);
        categoriaSelect?.addEventListener("change", cargarSubCat1);
        subCat1Select?.addEventListener("change", cargarSubCat2);
        subCat2Select?.addEventListener("change", onSubCat2Change);
        tipoAgregadoRadios.forEach(radio => radio.addEventListener("change", cargarItems));
        marcaSelect?.addEventListener("change", cargarItems);
        modeloSelect?.addEventListener("change", cargarItems);

        document.addEventListener("click", event => {
            const delBtn = event.target.closest("[data-delete-detalle]");
            if (delBtn) {
                eliminarDetalle(Number(delBtn.dataset.deleteDetalle || 0));
                return;
            }

            const qtyBtn = event.target.closest("[data-qty-detalle]");
            if (qtyBtn) {
                const wrapper = qtyBtn.closest(".input-step");
                const input = wrapper?.querySelector("[data-qty-input-detalle]");
                const next = clampCantidad(Number(input?.value || 1) + Number(qtyBtn.dataset.delta || 0));
                if (input) input.value = String(next);
                cambiarCantidad(Number(qtyBtn.dataset.qtyDetalle || 0), next);
                return;
            }

            const addBtn = event.target.closest("[data-add-item]");
            if (addBtn) {
                const row = addBtn.closest("tr");
                const qtyInput = row?.querySelector(".qty-input, .item-cantidad");
                agregarItem(Number(addBtn.dataset.addItem || 0), clampCantidad(qtyInput?.value || 1));
            }
        });

        document.addEventListener("input", event => {
            const input = event.target.closest("[data-qty-input-detalle]");
            if (input) {
                if (Number(input.value) > MAX_CANTIDAD) input.value = String(MAX_CANTIDAD);
                if (input.value === "") return;
                cambiarCantidad(Number(input.dataset.qtyInputDetalle || 0), input.value);
                return;
            }

            const precioInput = event.target.closest("[data-precio-input-detalle]");
            if (precioInput) {
                cambiarPrecio(Number(precioInput.dataset.precioInputDetalle || 0), precioInput.value);
            }
        });

        document.addEventListener("change", event => {
            const input = event.target.closest("[data-qty-input-detalle]");
            if (input) {
                input.value = String(clampCantidad(input.value));
                cambiarCantidad(Number(input.dataset.qtyInputDetalle || 0), input.value);
                return;
            }

            const monedaSelect = event.target.closest("[data-moneda-select-detalle]");
            if (monedaSelect) {
                guardarPrecio(Number(monedaSelect.dataset.monedaSelectDetalle || 0), true);
            }
        });

        document.addEventListener("keydown", event => {
            const input = event.target.closest("[data-qty-input-detalle]");
            if (input && event.key === "Enter") {
                event.preventDefault();
                input.value = String(clampCantidad(input.value));
                cambiarCantidad(Number(input.dataset.qtyInputDetalle || 0), input.value, true);
                return;
            }

            const precioInput = event.target.closest("[data-precio-input-detalle]");
            if (precioInput && event.key === "Enter") {
                event.preventDefault();
                guardarPrecio(Number(precioInput.dataset.precioInputDetalle || 0), true);
            }
        });

        fields.btnBuscarItems?.addEventListener("click", () => {
            if (!puedeEditar()) {
                alertify.error("No tiene permisos para agregar items");
                return;
            }
        });
        fields.detalleSearch?.addEventListener("input", filtrarDetalleCompra);
        fields.itemsDisponiblesSearch?.addEventListener("input", filtrarItemsDisponibles);

        fields.condicionesModal?.addEventListener("show.bs.modal", renderCondicionesModal);
        fields.clienteModal?.addEventListener("show.bs.modal", renderClienteModal);
        fields.btnGuardarCondiciones?.addEventListener("click", guardarCondicionesComerciales);
    }

    function initTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            if (!bootstrap.Tooltip.getInstance(el)) new bootstrap.Tooltip(el);
        });
    }

    function puedeEditar() {
        return Boolean(permisos.puede_editar) && ["pendiente", "validado"].includes(String(compra?.estado || "").trim().toLowerCase());
    }

    function verMontos() {
        return Boolean(permisos.puede_ver_montos);
    }

    function esAdicional(item) {
        return Number(item?.es_adicional || 0) === 1;
    }

    function signoAdicional(item) {
        return String(item?.adicional_signo || "positivo") === "negativo" ? "negativo" : "positivo";
    }

    function tipoAgregadoActual() {
        const selected = Array.from(tipoAgregadoRadios).find(radio => radio.checked);
        const value = String(selected?.value || "normal");
        return {
            esAdicional: value !== "normal",
            signo: value === "adicional_negativo" ? "negativo" : "positivo"
        };
    }

    async function loadCompra() {
        try {
            const res = await fetch(`controller/compras/get_compra.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();
            if (!res.ok || data.success === false) {
                throw new Error(data.message || "No se pudo cargar la compra");
            }

            compra = data.compra || {};
            detalle = Array.isArray(data.detalle) ? data.detalle : [];
            totales = data.totales || {};
            semaforo = data.semaforo || null;
            condiciones = data.condiciones || {};
            permisos = data.permisos || permisos;
            dataAttr.total_compra_dolares = Number(data.total_compra_dolares ?? 0);
            dataAttr.total_receta_dolares = Number(data.total_receta_dolares ?? 0);
            dataAttr.total_origen_dolares = Number(data.total_origen_dolares ?? 0);
            dataAttr.total_adicionales_negativos_dolares = Number(data.total_adicionales_negativos_dolares ?? 0);

            renderHeader();
            renderSemaforo();
            renderTotales();
            renderDetalle();
            renderAdicionales();
            initTooltips();
        } catch (error) {
            alertify.error(error.message || "No se pudo cargar la compra");
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">${escapeHtml(error.message || "Error")}</td></tr>`;
        }
    }

    function renderHeader() {
        fields.id.textContent = compra.id || "-";
        fields.nombre.textContent = compra.nombre || "Sin nombre";
        fields.usuario.textContent = compra.usuario || "-";
        fields.aprobador.textContent = compra.usuario_aprobador || "-";
        fields.estado.innerHTML = renderEstado(compra.estado || "Validado");
        fields.fecha.textContent = compra.created_at || "-";
        fields.tipoCambio.textContent = Number(totales?.tipo_cambio || compra.tipo_cambio || 0).toFixed(3);

        if (fields.btnBuscarItems) {
            const habilitado = puedeEditar();
            fields.btnBuscarItems.disabled = !habilitado;
            fields.btnBuscarItems.classList.toggle("disabled", !habilitado);
            fields.btnBuscarItems.setAttribute("aria-disabled", habilitado ? "false" : "true");
        }

        if (fields.clienteRuc) fields.clienteRuc.value = compra.cliente_ruc || "";
        if (fields.clienteRazonSocial) fields.clienteRazonSocial.value = compra.cliente_razon_social_empresa || "";
        if (fields.clienteNombreCompleto) fields.clienteNombreCompleto.value = compra.cliente_nombre_completo || "";
        if (fields.clienteCorreo) fields.clienteCorreo.value = compra.cliente_correo || "";
        if (fields.clienteCelular) fields.clienteCelular.value = compra.cliente_celular || "";
        if (fields.clienteMotivo) fields.clienteMotivo.value = compra.cliente_motivo || "";
        if (fields.clienteDireccion) fields.clienteDireccion.value = compra.cliente_direccion || "";
    }

    function renderCondicionesModal() {
        const data = condiciones || {};
        if (fields.clienteRuc) fields.clienteRuc.value = data.ruc || "";
        if (fields.clienteRazonSocial) fields.clienteRazonSocial.value = data.razon_social_empresa || "";
        if (fields.clienteNombreCompleto) fields.clienteNombreCompleto.value = data.nombre_completo || "";
        if (fields.clienteCorreo) fields.clienteCorreo.value = data.correo || "";
        if (fields.clienteCelular) fields.clienteCelular.value = data.celular || "";
        if (fields.clienteMotivo) fields.clienteMotivo.value = data.motivo || "";
        if (fields.clienteDireccion) fields.clienteDireccion.value = data.direccion || "";
        if (fields.tiempoEntrega) fields.tiempoEntrega.value = String(data.tiempo_entrega || "").replace(/\D/g, "");
        if (fields.condicionesPago) fields.condicionesPago.value = data.condiciones_pago || "";
        if (fields.vendedor) fields.vendedor.value = data.vendedor || "";
        if (fields.vendedorCorreo) fields.vendedorCorreo.value = data.vendedor_correo || "";
        if (fields.vendedorTelefono) fields.vendedorTelefono.value = data.vendedor_telefono || "";
        if (fields.descripcionReceta) fields.descripcionReceta.value = data.descripcion || "";
        if (fields.cantidadItemsReceta) fields.cantidadItemsReceta.value = data.cantidad_items || "";
        if (fields.condicionesEconomicasDias) fields.condicionesEconomicasDias.value = data.condiciones_economicas_dias || "";
        if (fields.condicionesEconomicasVisible) fields.condicionesEconomicasVisible.checked = String(data.condiciones_economicas_visible || "0") === "1";
    }

    function renderClienteModal() {
        const data = condiciones || {};
        if (fields.clienteRuc) fields.clienteRuc.value = data.ruc || compra.cliente_ruc || "";
        if (fields.clienteRazonSocial) fields.clienteRazonSocial.value = data.razon_social_empresa || compra.cliente_razon_social_empresa || "";
        if (fields.clienteNombreCompleto) fields.clienteNombreCompleto.value = data.nombre_completo || compra.cliente_nombre_completo || "";
        if (fields.clienteCorreo) fields.clienteCorreo.value = data.correo || compra.cliente_correo || "";
        if (fields.clienteCelular) fields.clienteCelular.value = data.celular || compra.cliente_celular || "";
        if (fields.clienteMotivo) fields.clienteMotivo.value = data.motivo || "";
        if (fields.clienteDireccion) fields.clienteDireccion.value = data.direccion || compra.cliente_direccion || "";
    }

    function getCondicionesPayload() {
        return {
            tiempo_entrega: String(fields.tiempoEntrega?.value || "").replace(/\D/g, "").trim(),
            condiciones_pago: String(fields.condicionesPago?.value || "").trim(),
            vendedor: String(fields.vendedor?.value || "").trim(),
            vendedor_correo: String(fields.vendedorCorreo?.value || "").trim(),
            vendedor_telefono: String(fields.vendedorTelefono?.value || "").replace(/\D/g, "").trim(),
            descripcion: String(fields.descripcionReceta?.value || "").trim(),
            cantidad_items: String(fields.cantidadItemsReceta?.value || "").replace(/\D/g, "").trim(),
            condiciones_economicas_dias: String(fields.condicionesEconomicasDias?.value || "").replace(/\D/g, "").trim(),
            condiciones_economicas_visible: fields.condicionesEconomicasVisible?.checked ? "1" : "0",
        };
    }

    async function guardarCondicionesComerciales() {
        const recetaOrigenId = Number(compra?.id_receta_duplicada || 0);
        if (recetaOrigenId <= 0) {
            alertify.error("Receta origen inválida");
            return;
        }

        const payload = getCondicionesPayload();
        if (!payload.tiempo_entrega || !payload.condiciones_pago || !payload.vendedor || !payload.vendedor_correo || !payload.vendedor_telefono || !payload.descripcion || !payload.cantidad_items || !payload.condiciones_economicas_dias) {
            alertify.error("Completa tiempo de entrega, vendedor, descripcion, cantidad, condiciones de pago y días de suspensión");
            return;
        }

        fields.btnGuardarCondiciones.disabled = true;
        try {
            const fd = new FormData();
            fd.append("receta_id", String(recetaOrigenId));
            Object.entries(payload).forEach(([key, value]) => fd.append(key, value));
            const res = await fetch("controller/upd_receta_condiciones.php", { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok || !json.ok) throw new Error(json.message || "No se pudieron guardar los datos comerciales");
            condiciones = { ...(condiciones || {}), ...(json.condiciones || payload) };
            alertify.success("Datos comerciales guardados");
            (bootstrap.Modal.getInstance(fields.condicionesModal) || new bootstrap.Modal(fields.condicionesModal)).hide();
        } catch (error) {
            alertify.error(error.message || "Error al guardar datos comerciales");
        } finally {
            fields.btnGuardarCondiciones.disabled = false;
        }
    }

    function renderSemaforo() {
        if (!semaforoWrap) return;
        if (!semaforo || semaforo.nivel === "gris") {
            semaforoWrap.classList.add("d-none");
            semaforoWrap.innerHTML = "";
            return;
        }

        const totalCompra = Number(dataAttr?.total_compra_dolares ?? 0);
        const totalReceta = Number(dataAttr?.total_receta_dolares ?? 0);
        const totalIngenieria = Number(dataAttr?.total_origen_dolares ?? 0);
        const tieneReceta = totalReceta > 0;

        semaforoWrap.classList.remove("d-none");
        semaforoWrap.innerHTML = `
            <span class="semaforo-badge semaforo-${escapeHtml(semaforo.nivel)}" data-bs-toggle="tooltip" data-bs-title="${escapeHtml(semaforo.mensaje)}">
                <span class="semaforo-indicator"></span>
                <span class="semaforo-main">${escapeHtml(resumenSemaforo(semaforo.nivel))}</span>
                ${tieneReceta ? `
                    <span class="semaforo-diff">
                        Compra: $ ${formatNumber(totalCompra)} | Receta: $ ${formatNumber(totalReceta)} | Ingeniería: $ ${formatNumber(totalIngenieria)}
                    </span>
                ` : ""}
            </span>
        `;
    }

    function resumenSemaforo(nivel) {
        const map = {
            verde: "Mejora económica",
            naranja: "Dentro del rango",
            rojo: "Supera receta",
            gris: "Sin referencia",
        };
        return map[String(nivel || "gris")] || "Sin referencia";
    }

    function renderTotales() {
        const t = totales || {};
        fields.totalItem.textContent = String(t.total_items || 0);
        fields.totalSoles.textContent = formatNumber(t.total_soles || 0);
        fields.totalDolares.textContent = formatNumber(t.total_dolares || 0);
        fields.totalPeru.textContent = formatNumber(t.total_peru || 0);
        fields.totalPeruDolares.textContent = formatNumber(t.total_peru_dolares || 0);
    }

    function renderDetalle() {
        const editable = puedeEditar();

        if (!detalle.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay items en compras</td></tr>`;
            return;
        }

        tbody.innerHTML = detalle.map(item => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const total = cantidad * precio;
            const moneda = String(item.moneda || "").toUpperCase();
            const simbolo = monedaSimbolo(moneda);
            const adicional = esAdicional(item);
            const adicionalSigno = signoAdicional(item);
            const adicionalBadge = adicional
                ? `<span class="badge ${adicionalSigno === "negativo" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"} mt-1 d-inline-flex flex-shrink-0">Adicional ${adicionalSigno === "negativo" ? "-" : "+"}</span>`
                : "";

            const accionHtml = editable
                ? `<button type="button" class="btn btn-sm btn-danger" data-delete-detalle="${item.id}" data-bs-toggle="tooltip" data-bs-title="Eliminar"><i class="ti ti-trash"></i></button>`
                : `<span class="text-muted">-</span>`;

            const precioHtml = editable && verMontos()
                ? `
                    <div class="d-inline-flex align-items-center gap-1 justify-content-end">
                        <select class="form-select form-select-sm compras-moneda-select" data-moneda-select-detalle="${item.id}">
                            <option value="SOL" ${moneda === "SOL" ? "selected" : ""}>S/.</option>
                            <option value="DOLLAR" ${moneda === "DOLLAR" ? "selected" : ""}>$</option>
                        </select>
                        <input type="number" class="form-control form-control-sm compras-precio-input" value="${precio}"
                               min="0" step="0.01" inputmode="decimal" data-precio-input-detalle="${item.id}">
                    </div>
                `
                : `<span class="text-muted fs-12">${simbolo}</span> <h5 class="fs-14 mt-1 fw-normal mb-0">${money(precio)}</h5>`;

            const cantidadHtml = editable
                ? `
                    <div class="input-step border bg-body-secondary px-1 py-0 rounded-pill d-inline-flex align-items-center overflow-visible" style="height:30px;">
                        <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:22px;min-width:22px;height:22px;" data-qty-detalle="${item.id}" data-delta="-1">-</button>
                        <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:46px;font-size:12px;" value="${cantidad}" min="1" max="${MAX_CANTIDAD}" step="1" inputmode="numeric" pattern="[0-9]*" data-qty-input-detalle="${item.id}">
                        <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:22px;min-width:22px;height:22px;" data-qty-detalle="${item.id}" data-delta="1">+</button>
                    </div>
                `
                : `<span>${cantidad}</span>`;

            const itemNombre = escapeHtml(item.nombre || "-");
            const itemDescripcion = escapeHtml(normalizarTextoDetalle(item.descripcion) || "-");
            const detalleLinea1 = escapeHtml(formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]) || "-");
            const detalleLinea2 = escapeHtml(formatearRutaDetalle([item.marca, item.modelo, item.uni_medida]) || "-");
            const tipo = String(item.tipo || "-").toUpperCase();
            const tipoColor = tipo === "PRODUCTO" ? "text-success" : "text-info";
            const searchText = escapeHtml([
                item.nombre,
                item.descripcion,
                item.categoria,
                item.sub_cat_1,
                item.sub_cat_2,
                item.marca,
                item.modelo,
                item.uni_medida,
                tipo,
                adicional ? `adicional ${adicionalSigno}` : "normal"
            ].join(" ").toLowerCase());

            return `
                <tr data-detalle-id="${item.id}" data-search-text="${searchText}" class="${adicional ? "table-light" : ""}">
                    <td class="text-wrap" style="min-width: 280px; max-width: 520px; white-space: normal; overflow-wrap: anywhere;">
                        <div class="d-flex align-items-center">
                            <div class="avatar-md flex-shrink-0 me-2">
                                <span class="avatar-title bg-primary-subtle rounded-circle">
                                    <img src="${getRandomLogo()}" alt="" height="22">
                                </span>
                            </div>
                            <div class="min-w-0 w-100" style="min-width:0;">
                                <div class="d-flex align-items-start gap-1 flex-wrap">
                                    <span class="text-muted fs-12 text-break">${itemNombre}</span>
                                    ${adicionalBadge}
                                </div>
                                <h5 class="fs-14 mt-1 item-description text-break mb-0">${itemDescripcion}</h5>
                                ${adicional ? `<small class="text-muted d-block mt-1">${adicionalSigno === "negativo" ? "Descuenta del total y semáforo" : "No afecta el total ni semáforo"}</small>` : ""}
                            </div>
                        </div>
                    </td>
                    <td class="text-wrap" style="min-width: 240px; max-width: 420px; white-space: normal; overflow-wrap: anywhere;">
                        <span class="text-muted fs-12 text-break">${detalleLinea1}</span>
                        <h5 class="fs-14 mt-1 fw-normal text-break mb-0">${detalleLinea2}</h5>
                    </td>
                    <td>
                        <span class="text-muted fs-12">Tipo</span>
                        <h5 class="fs-14 mt-1 fw-normal">
                            <i class="ti ti-circle-filled fs-12 ${tipoColor}"></i>
                            ${escapeHtml(tipo)}
                        </h5>
                    </td>
                    <td class="text-center">${cantidadHtml}</td>
                    <td class="text-end">${verMontos() ? precioHtml : '<span class="text-muted">-</span>'}</td>
                    <td class="text-end item-total-value">${verMontos() ? `<span class="text-muted fs-12">${simbolo}</span> <h5 class="fs-14 mt-1 fw-normal mb-0">${money(total)}</h5>${adicional ? `<span class="badge bg-light text-muted mt-1">${adicionalSigno === "negativo" ? "Descuenta" : "No suma"}</span>` : ""}` : "-"}</td>
                    <td class="text-center">${accionHtml}</td>
                </tr>
            `;
        }).join("");
        filtrarDetalleCompra();
    }

    function filtrarDetalleCompra() {
        if (!fields.detalleSearch || !tbody) return;
        const query = String(fields.detalleSearch.value || "").trim().toLowerCase();
        const rows = Array.from(tbody.querySelectorAll("tr[data-detalle-id]"));
        let visibles = 0;

        rows.forEach(row => {
            const match = !query || String(row.dataset.searchText || "").includes(query);
            row.classList.toggle("d-none", !match);
            if (match) visibles += 1;
        });

        const emptyRow = tbody.querySelector("tr[data-detalle-search-empty]");
        if (!query || visibles > 0) {
            emptyRow?.remove();
            return;
        }

        if (!emptyRow && rows.length) {
            tbody.insertAdjacentHTML("beforeend", '<tr data-detalle-search-empty><td colspan="7" class="text-center text-muted py-4">No hay items que coincidan con la búsqueda.</td></tr>');
        }
    }

    function actualizarFilaCantidad(detalleId, cantidad) {
        const row = tbody.querySelector(`tr[data-detalle-id="${CSS.escape(String(detalleId))}"]`);
        if (!row) return;
        const item = detalle.find(rowItem => Number(rowItem.id) === Number(detalleId));
        if (!item) return;

        const input = row.querySelector("[data-qty-input-detalle]");
        if (input && document.activeElement !== input) input.value = String(cantidad);

        const totalEl = row.querySelector(".item-total-value");
        if (totalEl && verMontos()) {
            const moneda = String(item.moneda || "").toUpperCase();
            const simbolo = monedaSimbolo(moneda);
            totalEl.innerHTML = `<span class="text-muted fs-12">${simbolo}</span> <h5 class="fs-14 mt-1 fw-normal mb-0">${money(Number(item.precio || 0) * cantidad)}</h5>${esAdicional(item) ? `<span class="badge bg-light text-muted mt-1">${signoAdicional(item) === "negativo" ? "Descuenta" : "No suma"}</span>` : ""}`;
        }
    }

    function montoDolares(item) {
        const monto = Number(item?.precio || 0) * Number(item?.cantidad || 0);
        const tipoCambio = Number(totales?.tipo_cambio || compra?.tipo_cambio || 0) || 1;
        return String(item?.moneda || "").toUpperCase() === "DOLLAR" ? monto : monto / tipoCambio;
    }

    function renderAdicionales() {
        renderAdicionalesPorSigno("negativo", fields.adicionalesNegativosBody, fields.totalAdicionalesNegativos);
        renderAdicionalesPorSigno("positivo", fields.adicionalesPositivosBody, fields.totalAdicionalesPositivos);
    }

    function renderAdicionalesPorSigno(signo, bodyEl, totalEl) {
        if (!bodyEl || !totalEl) return;
        const items = detalle.filter(item => esAdicional(item) && signoAdicional(item) === signo);
        const total = items.reduce((sum, item) => sum + montoDolares(item), 0);

        totalEl.textContent = formatNumber(total);
        if (signo === "negativo") {
            dataAttr.total_adicionales_negativos_dolares = total;
        }

        if (!items.length) {
            bodyEl.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Sin adicionales ${signo === "negativo" ? "negativos" : "positivos"}.</td></tr>`;
            return;
        }

        bodyEl.innerHTML = items.map(item => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const moneda = String(item.moneda || "").toUpperCase();
            const detalleTexto = formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]) || "-";
            return `
                <tr>
                    <td class="fw-semibold text-wrap">${escapeHtml(item.nombre || "-")}</td>
                    <td class="text-wrap">${escapeHtml(detalleTexto)}</td>
                    <td class="text-end">${cantidad}</td>
                    <td class="text-end">${monedaSimbolo(moneda)} ${money(precio)}</td>
                    <td class="text-end fw-semibold">$ ${formatNumber(montoDolares(item))}</td>
                </tr>
            `;
        }).join("");
    }

    function actualizarTotalesDetalle() {
        let totalItems = 0;
        let totalSoles = 0;
        let totalDolares = 0;

        detalle.forEach(item => {
            const cantidad = Number(item.cantidad || 0);
            const total = cantidad * Number(item.precio || 0);
            totalItems += cantidad;
            if (!esAdicional(item) || signoAdicional(item) === "negativo") {
                const factor = esAdicional(item) ? -1 : 1;
                if (String(item.moneda || "").toUpperCase() === "DOLLAR") totalDolares += factor * total;
                else totalSoles += factor * total;
            }
        });

        const tipoCambio = Number(totales?.tipo_cambio || compra?.tipo_cambio || 0) || 1;
        const totalPeru = totalSoles + totalDolares * tipoCambio;

        totales = {
            ...(totales || {}),
            total_items: totalItems,
            total_soles: totalSoles,
            total_dolares: totalDolares,
            total_peru: totalPeru,
            total_peru_dolares: tipoCambio > 0 ? totalPeru / tipoCambio : 0,
        };
        renderTotales();
        dataAttr.total_compra_dolares = totales.total_peru_dolares;
        renderSemaforo();
        renderAdicionales();
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

    function aplicarResultado(json) {
        if (json.totales) {
            totales = { ...(totales || {}), ...json.totales };
        }
        if (json.semaforo) {
            semaforo = json.semaforo;
            dataAttr.total_compra_dolares = json.total_compra_dolares ?? dataAttr.total_compra_dolares;
            dataAttr.total_receta_dolares = json.total_receta_dolares ?? dataAttr.total_receta_dolares;
            dataAttr.total_origen_dolares = json.total_origen_dolares ?? dataAttr.total_origen_dolares;
            dataAttr.total_adicionales_negativos_dolares = json.total_adicionales_negativos_dolares ?? dataAttr.total_adicionales_negativos_dolares;
            renderSemaforo();
        }
        renderTotales();
        renderAdicionales();
    }

    async function guardarCantidad(detalleId, cantidad) {
        cantidadTimers.delete(detalleId);
        try {
            const json = await post("controller/compras/upd_compra_detalle.php", {
                hash, accion: "cantidad", detalle_id: String(detalleId), cantidad: String(cantidad)
            });
            aplicarResultado(json);
        } catch (error) {
            alertify.error(error.message);
            await loadCompra();
        }
    }

    function cambiarCantidad(detalleId, cantidad, guardarAhora = false) {
        if (!puedeEditar()) return;
        const item = detalle.find(row => Number(row.id) === detalleId);
        if (!item) return;

        const next = clampCantidad(cantidad);
        if (Number(item.cantidad || 0) === next) return;

        item.cantidad = next;
        actualizarFilaCantidad(detalleId, next);
        actualizarTotalesDetalle();

        if (cantidadTimers.has(detalleId)) clearTimeout(cantidadTimers.get(detalleId));
        const guardar = () => guardarCantidad(detalleId, next);
        if (guardarAhora) {
            guardar();
            return;
        }
        cantidadTimers.set(detalleId, setTimeout(guardar, 550));
    }

    function cambiarPrecio(detalleId, valor) {
        if (!puedeEditar()) return;
        const item = detalle.find(row => Number(row.id) === detalleId);
        if (!item) return;

        const parsed = parseFloat(String(valor).replace(",", "."));
        if (!Number.isFinite(parsed) || parsed < 0) return;

        item.precio = parsed;
        actualizarFilaCantidad(detalleId, Number(item.cantidad || 0));
        actualizarTotalesDetalle();

        if (precioTimers.has(detalleId)) clearTimeout(precioTimers.get(detalleId));
        precioTimers.set(detalleId, setTimeout(() => guardarPrecio(detalleId, true), 550));
    }

    async function guardarPrecio(detalleId, forzar = false) {
        const item = detalle.find(row => Number(row.id) === detalleId);
        if (!item) return;
        const precio = Number(item.precio || 0);
        const moneda = String(item.moneda || "SOL").toUpperCase();
        const input = tbody.querySelector(`[data-precio-input-detalle="${CSS.escape(String(detalleId))}"]`);
        const monedaSelect = tbody.querySelector(`[data-moneda-select-detalle="${CSS.escape(String(detalleId))}"]`);
        const valorInput = input ? parseFloat(String(input.value).replace(",", ".")) : precio;
        const monedaNueva = monedaSelect?.value || moneda;

        if (!Number.isFinite(valorInput) || valorInput < 0) {
            if (input) input.value = String(precio);
            return;
        }

        item.precio = valorInput;
        item.moneda = monedaNueva;

        actualizarFilaCantidad(detalleId, Number(item.cantidad || 0));
        actualizarTotalesDetalle();

        if (!forzar && Number(item.precio) === precio && monedaNueva === moneda) {
            return;
        }

        precioTimers.delete(detalleId);
        try {
            const json = await post("controller/compras/upd_compra_detalle.php", {
                hash, accion: "precio", detalle_id: String(detalleId),
                precio: String(valorInput), moneda: monedaNueva
            });
            aplicarResultado(json);
        } catch (error) {
            alertify.error(error.message);
            await loadCompra();
        }
    }

    function eliminarDetalle(detalleId) {
        if (!detalleId) return;
        if (!puedeEditar()) return;
        alertify.confirm("Eliminar", "¿Deseas eliminar este item de la compra?", async () => {
            try {
                const json = await post("controller/compras/upd_compra_detalle.php", {
                    hash, accion: "eliminar", detalle_id: String(detalleId)
                });
                alertify.success("Item eliminado");
                await loadCompra();
            } catch (error) {
                alertify.error(error.message);
            }
        }, () => {});
    }

    async function agregarItem(itemId, cantidad) {
        if (!itemId) return;
        if (!puedeEditar()) {
            alertify.error("No tiene permisos para agregar items");
            return;
        }

        const tipoAgregado = tipoAgregadoActual();
        const existente = detalle.find(row => {
            if (Number(row.item_id || 0) !== Number(itemId)) return false;
            if (!tipoAgregado.esAdicional) return !esAdicional(row);
            return esAdicional(row) && signoAdicional(row) === tipoAgregado.signo;
        });
        if (existente) {
            const tipoTexto = !tipoAgregado.esAdicional ? "normal" : `adicional ${tipoAgregado.signo === "negativo" ? "negativo" : "positivo"}`;
            alertify.error(`Este item ya existe como ${tipoTexto}. Cambia la cantidad del item existente.`);
            return;
        }

        try {
            const json = await post("controller/compras/upd_compra_detalle.php", {
                hash,
                accion: "agregar",
                item_id: String(itemId),
                cantidad: String(clampCantidad(cantidad)),
                es_adicional: tipoAgregado.esAdicional ? "1" : "0",
                adicional_signo: tipoAgregado.signo
            });
            alertify.success(tipoAgregado.esAdicional ? "Adicional agregado" : "Item agregado");
            await loadCompra();
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
        if (!selectEl) return;
        const options = rows
            .map(row => row?.[key])
            .filter(value => value !== null && value !== undefined && String(value).trim() !== "")
            .map(value => ({ value, label: value }));

        selectEl.disabled = options.length === 0;

        if (selectEl.choicesInstance) {
            selectEl.choicesInstance.clearChoices();
            selectEl.choicesInstance.setChoices(
                [{ value: "", label: placeholder, disabled: true, selected: true }, ...options],
                "value",
                "label",
                true
            );
            options.length === 0 ? selectEl.choicesInstance.disable() : selectEl.choicesInstance.enable();
            return;
        }

        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.label;
            selectEl.appendChild(opt);
        });
    }

    function resetSelect(selectEl, placeholder) {
        if (!selectEl) return;
        selectEl.disabled = true;
        if (selectEl.choicesInstance) {
            selectEl.choicesInstance.clearChoices();
            selectEl.choicesInstance.setChoices([
                { value: "", label: placeholder, disabled: true, selected: true }
            ], "value", "label", true);
            selectEl.choicesInstance.disable();
            return;
        }
        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
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

    function renderItemsDisponibles(items) {
        if (fields.itemsDisponiblesSearch) fields.itemsDisponiblesSearch.value = "";
        itemsResultCount.textContent = `${items.length} resultados`;
        const editable = puedeEditar();
        if (!items.length) {
            itemSearchBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Sin items disponibles.</td></tr>`;
            return;
        }
        itemSearchBody.innerHTML = items.map(item => {
            const simbolo = monedaSimbolo(item.moneda);
            const tipoAgregado = tipoAgregadoActual();
            const yaExisteTipo = detalle.some(row => {
                if (Number(row.item_id || 0) !== Number(item.id)) return false;
                if (!tipoAgregado.esAdicional) return !esAdicional(row);
                return esAdicional(row) && signoAdicional(row) === tipoAgregado.signo;
            });
            const bloquearDuplicado = yaExisteTipo;
            const itemNombre = escapeHtml(item.nombre || "-");
            const itemDescripcion = escapeHtml(normalizarTextoDetalle(item.descripcion) || "-");
            const detalleLinea1 = escapeHtml(formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]) || "-");
            const detalleLinea2 = escapeHtml(formatearRutaDetalle([item.marca, item.modelo, item.uni_medida]) || "-");
            const searchText = escapeHtml([item.nombre, item.descripcion, item.categoria, item.sub_cat_1, item.sub_cat_2, item.marca, item.modelo, item.uni_medida, item.moneda].join(" ").toLowerCase());
            return `
                <tr data-item-row="1" data-search-text="${searchText}">
                    <td>
                        <div class="item-title">${itemNombre}</div>
                        ${itemDescripcion !== "-" ? `<div class="item-subtitle">${itemDescripcion}</div>` : ""}
                        <div class="item-title">${detalleLinea1}</div>
                        <div class="item-subtitle">${detalleLinea2}</div>
                    </td>
                    <td class="text-center align-middle receta-qty-cell">
                        <div class="input-step border bg-body-secondary px-1 py-0 mt-1 rounded-pill d-inline-flex align-items-center overflow-visible" style="height:28px;">
                            <button type="button" class="qty-minus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:20px;min-width:20px;height:20px;">-</button>
                            <input type="number" class="qty-input text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:46px;font-size:12px;" value="1" min="1" max="${MAX_CANTIDAD}" step="1" inputmode="numeric" pattern="[0-9]*">
                            <button type="button" class="qty-plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:20px;min-width:20px;height:20px;">+</button>
                        </div>
                    </td>
                    <td class="text-end">${verMontos() ? `${simbolo} ${money(item.precio)}` : "-"}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-primary" data-add-item="${item.id}" ${(!editable || bloquearDuplicado) ? "disabled" : ""}>
                            <i class="ti ti-plus"></i>
                        </button>
                        ${bloquearDuplicado ? `<small class="text-muted d-block mt-1">Ya existe; cambia cantidad</small>` : ""}
                    </td>
                </tr>
            `;
        }).join("");

        itemSearchBody.querySelectorAll("tr").forEach(row => {
            const input = row.querySelector(".qty-input");
            if (!input) return;
            row.querySelector(".qty-minus")?.addEventListener("click", () => {
                input.value = String(clampCantidad(Number(input.value) - 1));
            });
            row.querySelector(".qty-plus")?.addEventListener("click", () => {
                input.value = String(clampCantidad(Number(input.value) + 1));
            });
            input.addEventListener("change", () => {
                input.value = String(clampCantidad(input.value));
            });
        });
        filtrarItemsDisponibles();
    }

    function filtrarItemsDisponibles() {
        if (!fields.itemsDisponiblesSearch || !itemSearchBody) return;
        const query = String(fields.itemsDisponiblesSearch.value || "").trim().toLowerCase();
        const rows = Array.from(itemSearchBody.querySelectorAll("tr[data-item-row]"));
        let visibles = 0;

        rows.forEach(row => {
            const match = !query || String(row.dataset.searchText || "").includes(query);
            row.classList.toggle("d-none", !match);
            if (match) visibles += 1;
        });

        itemsResultCount.textContent = `${query ? visibles : rows.length} resultados`;

        const emptyRow = itemSearchBody.querySelector("tr[data-items-search-empty]");
        if (!query || visibles > 0) {
            emptyRow?.remove();
            return;
        }

        if (!emptyRow && rows.length) {
            itemSearchBody.insertAdjacentHTML("beforeend", '<tr data-items-search-empty><td colspan="4" class="text-center text-muted py-4">No hay resultados para la búsqueda.</td></tr>');
        }
    }

    function renderEstado(value) {
        const estado = String(value || "Validado").trim();
        const badgeClass = estado === "Aprobada"
            ? "badge-outline-success"
            : estado === "Anulada"
                ? "badge-outline-danger"
                : "badge-outline-warning";
        return `<span class="badge ${badgeClass}">${escapeHtml(estado)}</span>`;
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function money(value) {
        return formatNumber(value);
    }

    function monedaSimbolo(moneda) {
        return String(moneda || "").toUpperCase() === "DOLLAR" ? "$" : "S/.";
    }

    function getRandomLogo() {
        const n = Math.floor(Math.random() * 9) + 1;
        return `assets/images/products/logo/logo-${n}.svg`;
    }

    function normalizarTextoDetalle(valor) {
        const texto = String(valor ?? "").trim();
        return texto === "" || texto === "-" ? "" : texto;
    }

    function formatearRutaDetalle(valores) {
        const partes = [];
        valores.forEach(valor => {
            const texto = normalizarTextoDetalle(valor);
            if (!texto || partes[partes.length - 1] === texto) return;
            partes.push(texto);
        });
        return partes.join(" / ");
    }

    function clampCantidad(value) {
        const parsed = Number.parseInt(String(value ?? "1"), 10);
        if (!Number.isFinite(parsed)) return 1;
        return Math.min(MAX_CANTIDAD, Math.max(1, parsed));
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
});
