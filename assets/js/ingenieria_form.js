document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const tbody = document.getElementById("ingenieriaDetalleBody");
    const itemSearchBody = document.getElementById("recetaItemsTableBody");
    const itemsResultCount = document.getElementById("itemsResultCount");
    const historialBody = document.getElementById("ingenieriaHistorialBody");
    const historialCount = document.getElementById("historialIngenieriaCount");
    const historialInfo = document.getElementById("ingenieriaHistorialInfo");
    const historialPagination = document.getElementById("ingenieriaHistorialPagination");

    const baseSelect = document.getElementById("filterBase");
    const categoriaSelect = document.getElementById("categoria");
    const subCat1Select = document.getElementById("subCat1");
    const subCat2Select = document.getElementById("subCat2");
    const tipoAgregadoRadios = document.querySelectorAll('input[name="tipoAgregadoIngenieria"]');
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
        btnBuscarItems: document.querySelector('[data-bs-target="#info-header-modal"]'),
        btnGuardarIngenieria: document.getElementById("btnGuardarIngenieria"),
        clienteRuc: document.getElementById("clienteRuc"),
        clienteRazonSocial: document.getElementById("clienteRazonSocial"),
        clienteNombreCompleto: document.getElementById("clienteNombreCompleto"),
        clienteCorreo: document.getElementById("clienteCorreo"),
        clienteCelular: document.getElementById("clienteCelular"),
        clienteMotivo: document.getElementById("clienteMotivo"),
        clienteDireccion: document.getElementById("clienteDireccion"),
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
        condicionesEconomicasVisible: document.getElementById("condicionesEconomicasVisible")
    };

    let receta = null;
    let detalle = [];
    let cliente = null;
    const MAX_CANTIDAD = 5000;
    const userCargo = Number(fields.form?.dataset?.userCargo || 0);
    const esCargoIngenieria = userCargo === 6;
    const HISTORIAL_PAGE_SIZE = 10;
    let historialPage = 1;
    const cantidadTimers = new Map();

    if (!hash) {
        alertify.error("ID inválido");
        return;
    }

    init();

    function init() {
        initTooltips();
        loadIngenieria();
        if (historialBody) cargarHistorialIngenieria();
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
            guardarIngenieria();
        });

        fields.condicionesModal?.addEventListener("show.bs.modal", renderCondicionesModal);
        fields.btnGuardarCondiciones?.addEventListener("click", guardarCondicionesComerciales);

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
            if (!input) return;
            if (Number(input.value) > MAX_CANTIDAD) input.value = String(MAX_CANTIDAD);
            if (input.value === "") return;
            cambiarCantidad(Number(input.dataset.qtyInputDetalle || 0), input.value);
        });

        document.addEventListener("change", event => {
            const input = event.target.closest("[data-qty-input-detalle]");
            if (!input) return;
            input.value = String(clampCantidad(input.value));
            cambiarCantidad(Number(input.dataset.qtyInputDetalle || 0), input.value);
        });

        document.addEventListener("keydown", event => {
            const input = event.target.closest("[data-qty-input-detalle]");
            if (!input || event.key !== "Enter") return;
            event.preventDefault();
            input.value = String(clampCantidad(input.value));
            cambiarCantidad(Number(input.dataset.qtyInputDetalle || 0), input.value, true);
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

    function getRandomLogo() {
        const n = Math.floor(Math.random() * 9) + 1;
        return `assets/images/products/logo/logo-${n}.svg`;
    }

    function clampCantidad(value) {
        const parsed = Number.parseInt(String(value ?? "1"), 10);
        if (!Number.isFinite(parsed)) return 1;
        return Math.min(MAX_CANTIDAD, Math.max(1, parsed));
    }

    function isIngenieriaAprobada() {
        return ["aprobada", "validado"].includes(String(receta?.estado || "").trim().toLowerCase());
    }

    function validarIngenieriaEditable() {
        if (!isIngenieriaAprobada()) return true;
        alertify.error("La ingeniería validada no permite modificar items");
        return false;
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

    function setText(el, value) {
        if (el) el.textContent = value || "-";
    }

    function parseJsonSeguro(value) {
        if (!value) return {};
        if (typeof value === "object") return value;
        try {
            return JSON.parse(value);
        } catch (error) {
            return {};
        }
    }

    function labelAccionHistorial(accion) {
        const map = {
            agregar_item: "Agregar item",
            eliminar_item: "Eliminar item",
            cambiar_cantidad: "Cambiar cantidad",
            guardar_ingenieria: "Guardar ingeniería",
        };
        return map[accion] || String(accion || "-").replace(/_/g, " ");
    }

    function claseAccionHistorial(accion) {
        const map = {
            agregar_item: "bg-success-subtle text-success",
            eliminar_item: "bg-danger-subtle text-danger",
            cambiar_cantidad: "bg-warning-subtle text-warning-emphasis",
            guardar_ingenieria: "bg-info-subtle text-info",
        };
        return map[accion] || "bg-secondary-subtle text-secondary";
    }

    function resumenHistorial(row) {
        const accion = String(row.accion || "");
        const antes = parseJsonSeguro(row.antes_json);
        const despues = parseJsonSeguro(row.despues_json);
        const nombre = despues.nombre || antes.nombre || "";
        const adicionalData = esAdicional(despues) ? despues : (esAdicional(antes) ? antes : null);
        const adicionalSigno = signoAdicional(adicionalData || {});
        const itemMarca = adicionalData
            ? `<span class="badge ${adicionalSigno === "negativo" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"} ms-1">Adicional ${adicionalSigno === "negativo" ? "-" : "+"}</span>`
            : "";

        if (accion === "cambiar_cantidad") {
            return `${nombre ? escapeHtml(nombre) + itemMarca + "<br>" : ""}Cantidad: ${escapeHtml(antes.cantidad ?? "-")} <span class="mx-1">⮞</span> ${escapeHtml(despues.cantidad ?? "-")}`;
        }

        if (accion === "agregar_item") {
            return `${escapeHtml(nombre || "Item agregado")}${itemMarca}<br>Cantidad: ${escapeHtml(despues.cantidad ?? "-")}`;
        }

        if (accion === "eliminar_item") {
            return `${escapeHtml(nombre || "Item eliminado")}${itemMarca}<br>Cantidad: ${escapeHtml(antes.cantidad ?? "-")}`;
        }

        if (accion === "guardar_ingenieria") {
            const totalOrigen = Number(antes.total_origen_dolares || 0).toFixed(2);
            const totalIngenieria = Number(despues.total_ingenieria_dolares || 0).toFixed(2);
            return `Total origen: $ ${escapeHtml(totalOrigen)}<br>Total ingeniería: $ ${escapeHtml(totalIngenieria)}`;
        }

        return "-";
    }

    function renderHistorialIngenieria(historial) {
        const rows = Array.isArray(historial?.rows) ? historial.rows : [];
        const total = Number(historial?.total || 0);
        const page = Number(historial?.page || 1);
        const perPage = Number(historial?.per_page || HISTORIAL_PAGE_SIZE);
        const totalPages = Math.max(1, Number(historial?.total_pages || 1));

        if (historialCount) historialCount.textContent = `${total} registro${total === 1 ? "" : "s"}`;

        if (!rows.length) {
            if (historialBody) historialBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Sin historial registrado.</td></tr>`;
            if (historialInfo) historialInfo.textContent = "Showing 0 of 0 Results";
            if (historialPagination) historialPagination.innerHTML = "";
            return;
        }

        if (historialBody) {
            historialBody.innerHTML = rows.map(row => `
                <tr>
                    <td>${escapeHtml(row.created_at || "-")}</td>
                    <td>${escapeHtml(row.usuario || row.usuario_id || "-")}</td>
                    <td><span class="badge ${claseAccionHistorial(row.accion)}">${escapeHtml(labelAccionHistorial(row.accion))}</span></td>
                    <td class="text-wrap">${resumenHistorial(row)}</td>
                </tr>
            `).join("");
        }

        const from = total === 0 ? 0 : ((page - 1) * perPage) + 1;
        const to = Math.min(total, page * perPage);
        if (historialInfo) historialInfo.textContent = `Showing ${from} to ${to} of ${total} Results`;

        if (historialPagination) {
            let html = `
                <li class="page-item ${page <= 1 ? "disabled" : ""}">
                    <a class="page-link" href="#" data-historial-page="${page - 1}"><i class="ti ti-chevron-left"></i></a>
                </li>`;
            for (let i = 1; i <= totalPages; i++) {
                html += `<li class="page-item ${i === page ? "active" : ""}"><a class="page-link" href="#" data-historial-page="${i}">${i}</a></li>`;
            }
            html += `
                <li class="page-item ${page >= totalPages ? "disabled" : ""}">
                    <a class="page-link" href="#" data-historial-page="${page + 1}"><i class="ti ti-chevron-right"></i></a>
                </li>`;
            historialPagination.innerHTML = html;
        }
    }

    async function cargarHistorialIngenieria(page = historialPage) {
        if (!historialBody) return;
        historialPage = Math.max(1, Number(page || 1));
        try {
            const res = await fetch(`controller/get_ingenieria_historial.php?${new URLSearchParams({ id: hash, page: String(historialPage), per_page: String(HISTORIAL_PAGE_SIZE) }).toString()}`);
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "No se pudo cargar historial");
            renderHistorialIngenieria(data.historial);
        } catch (error) {
            historialBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">${escapeHtml(error.message || "Error al cargar historial")}</td></tr>`;
        }
    }

    function renderHeader() {
        setText(fields.id, receta.id);
        setText(fields.nombre, receta.nombre || "-");
        setText(fields.usuario, receta.usuario);
        setText(fields.aprobador, receta.usuario_aprobador);
        if (fields.estado) fields.estado.innerHTML = `<span class="badge badge-outline-success">${escapeHtml(receta.estado || "GANADO")}</span>`;
        setText(fields.fecha, receta.created_at);
        setText(fields.tipoCambio, Number(receta.tipo_cambio || 0).toFixed(3));

        if (fields.btnBuscarItems) {
            fields.btnBuscarItems.disabled = isIngenieriaAprobada();
            fields.btnBuscarItems.classList.toggle("disabled", isIngenieriaAprobada());
            fields.btnBuscarItems.setAttribute("aria-disabled", isIngenieriaAprobada() ? "true" : "false");
        }

        if (fields.btnGuardarIngenieria) {
            fields.btnGuardarIngenieria.disabled = isIngenieriaAprobada();
            fields.btnGuardarIngenieria.classList.toggle("disabled", isIngenieriaAprobada());
            fields.btnGuardarIngenieria.setAttribute("aria-disabled", isIngenieriaAprobada() ? "true" : "false");
        }

        if (fields.clienteRuc) fields.clienteRuc.value = cliente?.ruc || "";
        if (fields.clienteRazonSocial) fields.clienteRazonSocial.value = cliente?.razon_social_empresa || "";
        if (fields.clienteNombreCompleto) fields.clienteNombreCompleto.value = cliente?.nombre_completo || "";
        if (fields.clienteCorreo) fields.clienteCorreo.value = cliente?.correo || "";
        if (fields.clienteCelular) fields.clienteCelular.value = cliente?.celular || "";
        if (fields.clienteMotivo) fields.clienteMotivo.value = cliente?.motivo || "";
        if (fields.clienteDireccion) fields.clienteDireccion.value = cliente?.direccion || "";
    }

    function renderCondicionesModal() {
        const data = cliente || {};
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
        const recetaOrigenId = Number(receta?.id_receta_duplicada || 0);
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
            cliente = { ...(cliente || {}), ...(json.condiciones || payload) };
            alertify.success("Datos comerciales guardados");
            (bootstrap.Modal.getInstance(fields.condicionesModal) || new bootstrap.Modal(fields.condicionesModal)).hide();
        } catch (error) {
            alertify.error(error.message || "Error al guardar datos comerciales");
        } finally {
            fields.btnGuardarCondiciones.disabled = false;
        }
    }

    function renderDetalle() {
        if (!tbody) return;

        let totalSoles = 0;
        let totalDolares = 0;
        let totalItems = 0;

        tbody.innerHTML = detalle.map(item => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const adicional = esAdicional(item);
            const total = cantidad * precio;
            const simbolo = monedaSimbolo(item.moneda);

            totalItems += cantidad;
            if (!adicional) {
                if (String(item.moneda || "").toUpperCase() === "DOLLAR") totalDolares += total;
                else totalSoles += total;
            }

            const itemNombre = escapeHtml(item.nombre || "-");
            const itemDescripcion = escapeHtml(normalizarTextoDetalle(item.descripcion) || "-");
            const detalleLinea1 = escapeHtml(formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]) || "-");
            const detalleLinea2 = escapeHtml(formatearRutaDetalle([item.marca, item.modelo, item.uni_medida]) || "-");
            const tipo = String(item.tipo || "-").toUpperCase();
            const tipoColor = tipo === "PRODUCTO" ? "text-success" : "text-info";
            const adicionalBadge = adicional
                ? `<span class="badge ${signoAdicional(item) === "negativo" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"} mt-1 d-inline-flex flex-shrink-0">Adicional ${signoAdicional(item) === "negativo" ? "-" : "+"}</span>`
                : "";

            return `
                <tr data-detalle-id="${item.id}">
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
                    <td class="text-center">
                        <div class="input-step border bg-body-secondary px-1 py-0 rounded-pill d-inline-flex align-items-center overflow-visible" style="height:30px;">
                            <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:22px;min-width:22px;height:22px;" data-qty-detalle="${item.id}" data-delta="-1" ${isIngenieriaAprobada() ? "disabled" : ""}>-</button>
                            <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:46px;font-size:12px;" value="${cantidad}" min="1" max="${MAX_CANTIDAD}" step="1" inputmode="numeric" pattern="[0-9]*" data-qty-input-detalle="${item.id}" ${isIngenieriaAprobada() ? "disabled" : ""}>
                            <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:22px;min-width:22px;height:22px;" data-qty-detalle="${item.id}" data-delta="1" ${isIngenieriaAprobada() ? "disabled" : ""}>+</button>
                        </div>
                    </td>
                    ${esCargoIngenieria ? "" : `
                        <td class="text-end">
                            <span class="text-muted fs-12">${simbolo}</span>
                            <h5 class="fs-14 mt-1 fw-normal mb-0">${money(precio)}</h5>
                        </td>
                        <td class="text-end">
                            <span class="text-muted fs-12">${simbolo}</span>
                            <h5 class="fs-14 mt-1 fw-normal mb-0 item-total-value">${money(total)}</h5>
                            ${adicional ? `<span class="badge bg-light text-muted mt-1">No suma al total</span>` : ""}
                        </td>
                    `}
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-danger" data-delete-detalle="${item.id}" data-bs-toggle="tooltip" data-bs-title="Eliminar" ${isIngenieriaAprobada() ? "disabled" : ""}>
                            <i class="ti ti-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        if (!detalle.length) {
            tbody.innerHTML = `<tr><td colspan="${esCargoIngenieria ? 5 : 7}" class="text-center text-muted py-4">Sin detalle registrado</td></tr>`;
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

    function actualizarFilaCantidad(detalleId, cantidad) {
        const row = tbody.querySelector(`tr[data-detalle-id="${CSS.escape(String(detalleId))}"]`);
        if (!row) return;

        const item = detalle.find(rowItem => Number(rowItem.id) === Number(detalleId));
        if (!item) return;

        const input = row.querySelector("[data-qty-input-detalle]");
        if (input && document.activeElement !== input) input.value = String(cantidad);

        const totalEl = row.querySelector(".item-total-value");
        if (totalEl) totalEl.textContent = money(Number(item.precio || 0) * cantidad);
    }

    function actualizarTotalesDetalle() {
        let totalSoles = 0;
        let totalDolares = 0;
        let totalItems = 0;

        detalle.forEach(item => {
            const cantidad = Number(item.cantidad || 0);
            const total = cantidad * Number(item.precio || 0);
            totalItems += cantidad;
            if (!esAdicional(item)) {
                if (String(item.moneda || "").toUpperCase() === "DOLLAR") totalDolares += total;
                else totalSoles += total;
            }
        });

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

    function renderSkeletonSincronizacion() {
        if (!tbody) return;

        const filas = Math.min(Math.max(detalle.length || 6, 4), 8);
        const ocultarPrecio = esCargoIngenieria ? "d-none" : "";
        const celda = (w, h, extra = "") => `<div class="skeleton-item ${extra}" style="width:${w};height:${h};"></div>`;

        tbody.innerHTML = Array.from({ length: filas }, () => `
            <tr style="pointer-events:none;">
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-md flex-shrink-0">
                            <div class="skeleton-item rounded-circle" style="width:38px;height:38px;"></div>
                        </div>
                        <div class="flex-grow-1">
                            ${celda("55%", "14px", "mb-1")}
                            ${celda("35%", "12px")}
                        </div>
                    </div>
                </td>
                <td>${celda("70%", "14px", "mb-1")}${celda("45%", "12px")}</td>
                <td>${celda("60%", "13px")}</td>
                <td class="text-center">${celda("60%", "26px", "rounded-pill mx-auto")}</td>
                <td class="text-end ${ocultarPrecio}">${celda("55%", "26px", "ms-auto")}</td>
                <td class="text-end ${ocultarPrecio}">${celda("55%", "14px", "ms-auto")}</td>
                <td class="text-center">${celda("18px", "18px", "rounded-circle mx-auto")}</td>
            </tr>
        `).join("");
    }

    function bloquearControlesSincronizacion(activo) {
        const scope = fields.form?.closest(".card");
        if (scope) {
            scope.querySelectorAll("button").forEach(btn => {
                btn.disabled = activo;
            });
        }

        document.querySelectorAll(".ingenieria-header-actions button, .receta-header-actions button").forEach(btn => {
            btn.disabled = activo;
        });

        tbody?.querySelectorAll("input, button").forEach(el => {
            el.disabled = activo;
        });

        if (fields.tipoCambioInput) fields.tipoCambioInput.disabled = activo;
    }

    async function guardarIngenieria() {
        if (!validarIngenieriaEditable()) return;

        const submitBtn = fields.btnGuardarIngenieria;
        if (submitBtn?.disabled) return;

        const submitBtnContent = submitBtn?.innerHTML || '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-50", "cursor-not-allowed");
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            submitBtn.setAttribute("aria-label", "Guardando ingeniería");
        }
        bloquearControlesSincronizacion(true);
        renderSkeletonSincronizacion();

        try {
            await post("controller/guardar_ingenieria.php", { hash });
            alertify.success("Receta ingeniería guardada");
            await loadIngenieria();
            if (historialBody) await cargarHistorialIngenieria(1);
        } catch (error) {
            alertify.alert("Validación de ingeniería", error.message || "No se pudo guardar ingeniería");
            renderDetalle();
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = submitBtnContent;
                submitBtn.setAttribute("aria-label", "");
                submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
            bloquearControlesSincronizacion(false);
            renderHeader();
        }
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
        if (!validarIngenieriaEditable()) return;
        alertify.confirm("Eliminar", "¿Deseas eliminar este item?", async () => {
            try {
                await post("controller/upd_ingenieria_detalle.php", { hash, accion: "eliminar", detalle_id: String(detalleId) });
                alertify.success("Item eliminado");
                await loadIngenieria();
                if (historialBody) await cargarHistorialIngenieria(1);
            } catch (error) {
                alertify.error(error.message);
            }
        }, () => {});
    }

    function cambiarCantidad(detalleId, cantidad, guardarAhora = false) {
        if (!validarIngenieriaEditable()) return;
        const item = detalle.find(row => Number(row.id) === detalleId);
        if (!item) return;

        const next = clampCantidad(cantidad);
        if (Number(item.cantidad || 0) === next) return;

        item.cantidad = next;
        actualizarFilaCantidad(detalleId, next);
        actualizarTotalesDetalle();

        if (cantidadTimers.has(detalleId)) {
            clearTimeout(cantidadTimers.get(detalleId));
        }

        const guardar = () => guardarCantidad(detalleId, next);
        if (guardarAhora) {
            guardar();
            return;
        }

        cantidadTimers.set(detalleId, setTimeout(guardar, 550));
    }

    async function guardarCantidad(detalleId, cantidad) {
        cantidadTimers.delete(detalleId);
        try {
            await post("controller/upd_ingenieria_detalle.php", { hash, accion: "cantidad", detalle_id: String(detalleId), cantidad: String(cantidad) });
            if (historialBody) await cargarHistorialIngenieria(1);
        } catch (error) {
            alertify.error(error.message);
            await loadIngenieria();
            if (historialBody) await cargarHistorialIngenieria(1);
        }
    }

    async function agregarItem(itemId, cantidad) {
        if (!itemId) return;
        if (!validarIngenieriaEditable()) return;

        const itemDisponible = Array.from(document.querySelectorAll("[data-add-item]")).find(btn => Number(btn.dataset.addItem || 0) === Number(itemId));
        if (itemDisponible?.dataset?.precioCero === "1") {
            alertify.error("No se puede agregar un item con precio 0");
            return;
        }

        const agregado = tipoAgregadoActual();
        const existente = detalle.some(row => Number(row.item_id || row.id_item || 0) === Number(itemId) && !esAdicional(row));
        if (!agregado.esAdicional && existente) {
            alertify.error("Este item ya fue agregado");
            return;
        }

        const cantidadNormalizada = clampCantidad(cantidad);
        try {
            await post("controller/upd_ingenieria_detalle.php", {
                hash,
                accion: "agregar",
                item_id: String(itemId),
                cantidad: String(cantidadNormalizada),
                es_adicional: agregado.esAdicional ? "1" : "0",
                adicional_signo: agregado.signo
            });
            alertify.success(agregado.esAdicional ? "Item adicional agregado" : "Item agregado");
            await loadIngenieria();
            if (historialBody) await cargarHistorialIngenieria(1);
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

    function renderItemsDisponibles(items) {
        itemsResultCount.textContent = `${items.length} resultados`;
        if (!items.length) {
            itemSearchBody.innerHTML = `<tr><td colspan="${esCargoIngenieria ? 3 : 4}" class="text-center text-muted py-4">Sin items disponibles.</td></tr>`;
            return;
        }
        itemSearchBody.innerHTML = items.map(item => {
            const simbolo = monedaSimbolo(item.moneda);
            const precioVisible = Object.prototype.hasOwnProperty.call(item, "precio");
            const precio = precioVisible ? Number(item.precio || 0) : null;
            const precioCero = precioVisible ? precio <= 0 : item.precio_cero === true;
            const itemNombre = escapeHtml(item.nombre || "-");
            const itemDescripcion = escapeHtml(normalizarTextoDetalle(item.descripcion) || "-");
            const detalleLinea1 = escapeHtml(formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]) || "-");
            const detalleLinea2 = escapeHtml(formatearRutaDetalle([item.marca, item.modelo, item.uni_medida]) || "-");
            return `
                <tr class="${precioCero ? "table-warning" : ""}">
                    <td>
                        <div class="item-title">${itemNombre}</div>
                        ${itemDescripcion !== "-" ? `<div class="item-subtitle">${itemDescripcion}</div>` : ""}
                        <div class="item-title">${detalleLinea1}</div>
                        <div class="item-subtitle">${detalleLinea2}</div>
                        ${precioCero ? `<span class="badge bg-warning-subtle text-warning-emphasis mt-1">Precio pendiente</span>` : ""}
                    </td>
                    <td class="text-center align-middle receta-qty-cell">
                        <div data-touchspin class="input-step border bg-body-secondary px-1 py-0 mt-1 rounded-pill d-inline-flex align-items-center overflow-visible" style="height:28px;">
                            <button type="button" class="qty-minus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:20px;min-width:20px;height:20px;">-</button>
                            <input type="number" class="qty-input text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:46px;font-size:12px;" value="1" min="1" max="${MAX_CANTIDAD}" step="1" inputmode="numeric" pattern="[0-9]*">
                            <button type="button" class="qty-plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:20px;min-width:20px;height:20px;">+</button>
                        </div>
                    </td>
                    ${esCargoIngenieria ? "" : `<td class="text-end ${precioCero ? "text-warning fw-semibold" : ""}">${simbolo} ${money(precio)}</td>`}
                    <td class="text-center"><button type="button" class="btn btn-sm ${precioCero ? "btn-secondary" : "btn-primary"}" data-add-item="${item.id}" data-precio-cero="${precioCero ? "1" : "0"}" ${isIngenieriaAprobada() || precioCero ? "disabled" : ""} data-bs-toggle="tooltip" data-bs-title="${precioCero ? "No se puede agregar con precio 0" : "Agregar"}"><i class="ti ${precioCero ? "ti-lock" : "ti-plus"}"></i></button></td>
                </tr>
            `;
        }).join("");

        initTooltips();

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
    }

    historialPagination?.addEventListener("click", event => {
        const link = event.target.closest("[data-historial-page]");
        if (!link || link.closest(".disabled") || link.closest(".active")) return;
        event.preventDefault();
        cargarHistorialIngenieria(Number(link.dataset.historialPage || 1));
    });
});
