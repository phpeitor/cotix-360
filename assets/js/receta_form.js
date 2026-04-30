document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("table.table tbody");
    const recetaForm = document.querySelector("form.form-receta");

    const recetaIdEl = document.getElementById("receta_id");
    const usuarioEl = document.getElementById("usuario");
    const fechaEl = document.getElementById("fecha");
    const estadoEl = document.getElementById("estado");
    const totalItemEl = document.getElementById("total_item");
    const totalSolesEl = document.getElementById("total_soles");
    const totalDolaresEl = document.getElementById("total_dolares");
    const totalPeruEl = document.getElementById("total_peru");
    const tipoCambioEl = document.getElementById("tipo_cambio_sunat");
    const btnReloadPrecios = document.getElementById("btnReloadPrecios");
    const alertPrecioCambioEl = document.getElementById("alertPrecioCambio");
    const infoCategoriaModalEl = document.getElementById("info-categoria-modal");
    const alertCategoriaRecetaEl = document.getElementById("alertCategoriaReceta");
    const recetaCategoriaTableBody = document.getElementById("recetaCategoriaTableBody");
    const btnGuardarRecetaCategoria = document.getElementById("btnGuardarRecetaCategoria");
    const totalFormulaSolesEl = document.getElementById("totalFormulaSoles");
    const totalFormulaDolaresEl = document.getElementById("totalFormulaDolares");

    const baseSelect = document.getElementById("filterBase");
    const categoriaSelect = document.getElementById("categoria");
    const subCat1Select = document.getElementById("subCat1");
    const subCat2Select = document.getElementById("subCat2");
    const itemsTableBody = document.getElementById("recetaItemsTableBody");
    const itemsResultCount = document.getElementById("itemsResultCount");

    const paginationFromEl = document.getElementById("pagination_from");
    const paginationToEl = document.getElementById("pagination_to");
    const paginationWrapper = document.getElementById("pagination_wrapper");
    const paginationList = document.getElementById("pagination_list");

    const PAGE_SIZE = 10;
    let currentPage = 1;
    let receta = null;
    let detalle = [];
    let cambiosPrecioByItem = new Map();
    let cambiosStreamSignature = "";
    let cambiosEventSource = null;
    let streamHabilitado = true;
    const hash = getQueryParam("id");

    function normalizarTextoDetalle(valor) {
        const texto = String(valor ?? "").trim();
        return texto === "" || texto === "-" ? "" : texto;
    }

    function formatearRutaDetalle(valores) {
        const partes = [];

        valores.forEach(valor => {
            const texto = normalizarTextoDetalle(valor);

            if (!texto) {
                return;
            }

            if (partes[partes.length - 1] === texto) {
                return;
            }

            partes.push(texto);
        });

        return partes.join(" / ");
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    init();

    function init() {
        if (!hash) {
            alertify.error("ID de receta inválido");
            return;
        }

        initTooltips();
        conectarStreamCambiosPrecio();

        cargarReceta(hash);

        baseSelect?.addEventListener("change", cargarCategoriasReceta);
        categoriaSelect?.addEventListener("change", cargarSubCategorias1Receta);
        subCat1Select?.addEventListener("change", cargarSubCategorias2Receta);
        subCat2Select?.addEventListener("change", cargarItemsReceta);

        recetaForm?.addEventListener("submit", guardarReceta);
        btnReloadPrecios?.addEventListener("click", sincronizarPrecios);
        btnGuardarRecetaCategoria?.addEventListener("click", guardarCategoriasRecetaModal);
        infoCategoriaModalEl?.addEventListener("show.bs.modal", cargarCategoriasRecetaModal);

        cargarBasesReceta();

        window.addEventListener("beforeunload", () => {
            detenerStreamCambios(false);
        });
    }

    function detenerStreamCambios(desactivar = false) {
        if (cambiosEventSource) {
            cambiosEventSource.close();
            cambiosEventSource = null;
        }

        if (desactivar) {
            streamHabilitado = false;
        }
    }

    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    async function cargarReceta(hashId) {
        try {
            const res = await fetch(`controller/get_receta.php?id=${encodeURIComponent(hashId)}`);
            const data = await res.json();

            if (!res.ok || data.error || !data.receta) {
                throw new Error(data.message || "No se pudo cargar la receta");
            }

            receta = data.receta;
            detalle = Array.isArray(data.detalle) ? data.detalle : [];
            const cambiosPrecio = Array.isArray(data.cambios_precio) ? data.cambios_precio : [];
            cambiosPrecioByItem = new Map(cambiosPrecio.map(item => [Number(item.item_id), item]));
            cambiosStreamSignature = getCambiosPrecioSignature(cambiosPrecio);
            currentPage = 1;

            renderHeader();
            aplicarBloqueoPorEstado();

            if (!isRecetaEditable()) {
                detenerStreamCambios(true);
            }

            renderAlertasCambioPrecio(cambiosPrecio, false);
            renderBody();
            renderPagination();
            calcularTotales();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error cargando receta");
            renderEmptyState("No se pudo cargar la receta.");
        }
    }

    function renderHeader() {
        if (!receta) return;

        if (recetaIdEl) recetaIdEl.textContent = receta.id ?? "";
        if (usuarioEl) usuarioEl.textContent = receta.usuario ?? "";
        if (fechaEl) fechaEl.textContent = receta.created_at ?? "";
        if (estadoEl) estadoEl.textContent = receta.estado ?? "";
        if (tipoCambioEl) tipoCambioEl.textContent = Number(receta.tipo_cambio || 0).toFixed(3);

        setEstadoIcon(receta.estado);
    }

    function setEstadoIcon(estado) {
        const avatar = estadoEl?.closest(".d-flex")?.querySelector(".avatar-lg");
        if (!avatar) return;

        let icon = "solar:refresh-square-bold";
        let color = "text-primary";

        switch (estado) {
            case "Aprobada":
                icon = "solar:verified-check-broken";
                color = "text-success";
                break;
            case "Anulada":
                icon = "solar:folder-error-broken";
                color = "text-danger";
                break;
        }

        avatar.innerHTML = `<iconify-icon icon="${icon}" class="fs-28 ${color}"></iconify-icon>`;
    }

    function isRecetaEditable() {
        return String(receta?.estado || "").toLowerCase() === "enviada";
    }

    function aplicarBloqueoPorEstado() {
        const editable = isRecetaEditable();
        const btnGuardar = recetaForm?.querySelector("[type='submit']");
        const btnBuscar = document.querySelector("[data-bs-target='#info-header-modal']");

        if (btnGuardar) {
            btnGuardar.disabled = !editable;
            btnGuardar.classList.toggle("opacity-50", !editable);
            btnGuardar.classList.toggle("cursor-not-allowed", !editable);
            btnGuardar.title = editable ? "" : "Solo editable cuando el estado es Enviada";
        }

        if (btnReloadPrecios) {
            btnReloadPrecios.disabled = !editable;
            btnReloadPrecios.classList.toggle("opacity-50", !editable);
            btnReloadPrecios.classList.toggle("cursor-not-allowed", !editable);
            btnReloadPrecios.title = editable ? "" : "Solo disponible cuando el estado es Enviada";
        }

        if (btnBuscar) {
            btnBuscar.disabled = !editable;
            btnBuscar.classList.toggle("opacity-50", !editable);
            btnBuscar.classList.toggle("cursor-not-allowed", !editable);
            btnBuscar.title = editable ? "" : "Solo disponible cuando el estado es Enviada";
        }
    }

    function getCambiosPrecioSignature(cambios) {
        const normalized = (Array.isArray(cambios) ? cambios : [])
            .map(item => ({
                item_id: Number(item.item_id || 0),
                precio_receta: Number(item.precio_receta || 0),
                moneda_receta: String(item.moneda_receta || ""),
                precio_actual: Number(item.precio_actual || 0),
                moneda_actual: String(item.moneda_actual || "")
            }))
            .sort((a, b) => a.item_id - b.item_id);

        return JSON.stringify(normalized);
    }

    function renderAlertasCambioPrecio(cambios, shouldNotify = true) {
        if (!alertPrecioCambioEl) return;

        if (!cambios.length) {
            alertPrecioCambioEl.classList.add("d-none");
            alertPrecioCambioEl.textContent = "";
            if (btnReloadPrecios) btnReloadPrecios.classList.add("d-none");
            return;
        }

        alertPrecioCambioEl.classList.remove("d-none");
        alertPrecioCambioEl.innerHTML = `Se detectaron <b>${cambios.length}</b> item(s) con precio actualizado en catálogo. Usa <b>reload</b> para sincronizar.`;

        if (btnReloadPrecios) btnReloadPrecios.classList.remove("d-none");

        if (shouldNotify) {
            alertify.warning(`Se detectaron ${cambios.length} cambios de precio.`);
        }
    }

    function renderCategoriasRecetaModal(rows, source) {
        if (!recetaCategoriaTableBody) return;

        const limpiarResumenFormula = () => {
            if (totalFormulaSolesEl) totalFormulaSolesEl.textContent = "0.00";
            if (totalFormulaDolaresEl) totalFormulaDolaresEl.textContent = "0.00";
        };

        if (alertCategoriaRecetaEl) {
            alertCategoriaRecetaEl.classList.remove("d-none");
            alertCategoriaRecetaEl.classList.toggle("alert-warning", source === "detalle");
            alertCategoriaRecetaEl.classList.toggle("alert-info", source !== "detalle");
            alertCategoriaRecetaEl.textContent = source === "detalle"
                ? "No existen registros. Se muestran los totales por categoría para que definas los márgenes."
                : "Se muestran los márgenes guardados previamente.";
        }

        if (!rows.length) {
            recetaCategoriaTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">No hay categorías para mostrar.</td>
                </tr>
            `;
            limpiarResumenFormula();
            return;
        }

        const parseSubtotal = value => {
            const texto = String(value ?? "").replace(/[^\d.,-]/g, "").replace(/,/g, "");
            const parsed = parseFloat(texto);
            return Number.isFinite(parsed) ? parsed : 0;
        };

        const calcularTotalConMargen = (subtotal, margenPct) => {
            const subtotalNum = Number(subtotal) || 0;
            const margenDecimal = (Number(margenPct) || 0) / 100;

            if (margenDecimal >= 1) {
                return 0;
            }

            return subtotalNum / (1 - margenDecimal);
        };

        recetaCategoriaTableBody.innerHTML = rows.map((row, idx) => {
            const subtotal = parseSubtotal(row.subtotal);
            const cantidad = Number(row.cantidad) || 0;
            const margen = Math.min(100, Math.max(0, Number(row.margen) || 0));
            const totalConMargen = calcularTotalConMargen(subtotal, margen);
            const categoriaTexto = escapeHtml(row.sub_cat_1 || "-");
            const monedaRaw = String(row.moneda || "");
            const monedaSimbolo = monedaRaw.toUpperCase() === "DOLLAR" ? "$" : "S/.";

            return `
                <tr class="receta-categoria-row" data-idx="${idx}" data-subcat="${escapeHtml(row.sub_cat_1 || "")}" data-subtotal="${subtotal}" data-cantidad="${cantidad}" data-margen="${margen}" data-moneda="${escapeAttr(monedaRaw)}">
                    <td>
                        <strong>${categoriaTexto}</strong>
                    </td>
                    <td class="text-end">${format2(decimalAdjust("round", cantidad, "-2"))}</td>
                    <td class="text-end">${monedaSimbolo} ${format2(decimalAdjust("round", subtotal, "-2"))}</td>
                    <td class="text-center">
                        <div class="input-step border bg-body-secondary p-1 rounded-pill d-inline-flex align-items-center overflow-visible" style="min-width:140px;">
                            <button type="button" class="btn-margen-minus bg-light text-dark border-0 rounded-circle fs-18 lh-1" data-bs-title="Disminuir margen" data-bs-placement="top" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;padding:0;">−</button>
                            <input type="number" class="input-margen-categoria text-dark text-center border-0 bg-body-secondary rounded" value="${margen.toFixed(2)}" min="0" max="100" step="0.01" style="width:70px;height:26px;font-size:14px;">
                            <button type="button" class="btn-margen-plus bg-light text-dark border-0 rounded-circle fs-18 lh-1" data-bs-title="Aumentar margen" data-bs-placement="top" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;padding:0;">+</button>
                        </div>
                    </td>
                    <td class="text-end fw-semibold total-margen-cell">${monedaSimbolo} ${format2(decimalAdjust("round", totalConMargen, "-2"))}</td>
                </tr>
            `;
        }).join("");

        recetaCategoriaTableBody.querySelectorAll(".receta-categoria-row").forEach((tr, idx) => {
            const input = tr.querySelector(".input-margen-categoria");
            const totalCell = tr.querySelector(".total-margen-cell");
            const monedaRow = String(tr.getAttribute("data-moneda") || "").toUpperCase();
            const monedaSimboloRow = monedaRow === "DOLLAR" ? "$" : "S/.";
            if (!input) return;

            const actualizarResumenFormula = () => {
                let totalSoles = 0;
                let totalDolares = 0;

                recetaCategoriaTableBody.querySelectorAll(".receta-categoria-row").forEach(row => {
                    const subtotalRow = Number(row.getAttribute("data-subtotal") || 0);
                    const monedaRowRaw = String(row.getAttribute("data-moneda") || "").toUpperCase();
                    const inputRow = row.querySelector(".input-margen-categoria");
                    const margenRow = Number(String(inputRow?.value ?? "0").replace(/,/g, "."));
                    const margenNormalizado = Number.isFinite(margenRow) ? Math.min(100, Math.max(0, margenRow)) : 0;
                    const totalRow = calcularTotalConMargen(subtotalRow, margenNormalizado);

                    if (monedaRowRaw === "DOLLAR") {
                        totalDolares += totalRow;
                    } else {
                        totalSoles += totalRow;
                    }
                });

                if (totalFormulaSolesEl) {
                    totalFormulaSolesEl.textContent = format2(decimalAdjust("round", totalSoles, "-2"));
                }

                if (totalFormulaDolaresEl) {
                    totalFormulaDolaresEl.textContent = format2(decimalAdjust("round", totalDolares, "-2"));
                }
            };

            const actualizarTotalConMargen = () => {
                if (!totalCell) return;

                const subtotalRow = Number(tr.getAttribute("data-subtotal") || 0);
                const margenRow = Number(String(input.value ?? "0").replace(/,/g, "."));
                const margenNormalizado = Number.isFinite(margenRow) ? Math.min(100, Math.max(0, margenRow)) : 0;
                const total = calcularTotalConMargen(subtotalRow, margenNormalizado);
                totalCell.textContent = `${monedaSimboloRow} ${format2(decimalAdjust("round", total, "-2"))}`;
                actualizarResumenFormula();
            };

            const normalizarMargen = () => {
                const parsed = Number(String(input.value ?? "").replace(/,/g, "."));

                if (!Number.isFinite(parsed)) {
                    input.value = "0.00";
                    return 0;
                }

                const clamped = Math.min(100, Math.max(0, parsed));
                input.value = clamped.toFixed(2);
                actualizarTotalConMargen();
                return clamped;
            };

            input.addEventListener("input", () => {
                const parsed = Number(String(input.value ?? "").replace(/,/g, "."));

                if (!Number.isFinite(parsed)) {
                    return;
                }

                if (parsed > 100) {
                    input.value = "100";
                    actualizarTotalConMargen();
                    return;
                }

                if (parsed < 0) {
                    input.value = "0";
                }

                actualizarTotalConMargen();
            });

            input.addEventListener("blur", () => {
                normalizarMargen();
            });

            tr.querySelector(".btn-margen-minus")?.addEventListener("click", (e) => {
                e.preventDefault();
                input.value = Math.max(0, normalizarMargen() - 0.01).toFixed(2);
                actualizarTotalConMargen();
            });
            tr.querySelector(".btn-margen-plus")?.addEventListener("click", (e) => {
                e.preventDefault();
                input.value = Math.min(100, normalizarMargen() + 0.01).toFixed(2);
                actualizarTotalConMargen();
            });

            actualizarTotalConMargen();
        });

        if (!recetaCategoriaTableBody.querySelector(".receta-categoria-row")) {
            limpiarResumenFormula();
        }

        initTooltips(recetaCategoriaTableBody);
    }

    async function cargarCategoriasRecetaModal() {
        if (!receta?.id) {
            return;
        }

        if (recetaCategoriaTableBody) {
            recetaCategoriaTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">Cargando categorías...</td>
                </tr>
            `;
        }

        try {
            const res = await fetch(`controller/get_receta_categoria.php?id=${encodeURIComponent(receta.id)}`);
            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.message || "No se pudieron cargar las categorías");
            }

            renderCategoriasRecetaModal(Array.isArray(data.rows) ? data.rows : [], data.source || "detalle");
        } catch (error) {
            console.error(error);
            if (alertCategoriaRecetaEl) {
                alertCategoriaRecetaEl.classList.remove("d-none");
                alertCategoriaRecetaEl.classList.remove("alert-info");
                alertCategoriaRecetaEl.classList.add("alert-danger");
                alertCategoriaRecetaEl.textContent = error.message || "Error al cargar categorías";
            }

            if (recetaCategoriaTableBody) {
                recetaCategoriaTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-muted py-4">No se pudieron cargar las categorías.</td>
                    </tr>
                `;
            }

            alertify.error(error.message || "Error al cargar categorías");
        }
    }

    async function guardarCategoriasRecetaModal() {
        if (!receta?.id) {
            alertify.error("Receta inválida");
            return;
        }

        const tableRows = recetaCategoriaTableBody?.querySelectorAll(".receta-categoria-row");
        const rows = [];
        
        tableRows?.forEach(tr => {
            const subCat = tr.getAttribute("data-subcat") || tr.querySelector("strong")?.textContent || "";
            if (!subCat?.trim()) {
                return;
            }
            
            const margenInput = tr.querySelector(".input-margen-categoria");
            const margenValue = Number(String(margenInput?.value || 0).replace(/,/g, "."));
            if (!Number.isFinite(margenValue)) {
                alertify.error("El margen debe ser numérico.");
                return;
            }

            if (margenValue > 100) {
                alertify.error("El margen máximo permitido es 100%.");
                margenInput.value = "100.00";
                return;
            }
            
            rows.push({
                sub_cat_1: subCat,
                subtotal: Number(tr.getAttribute("data-subtotal") || 0),
                cantidad: Number(tr.getAttribute("data-cantidad") || 0),
                margen: Math.min(100, Math.max(0, margenValue)),
                moneda: tr.getAttribute("data-moneda") || '',
            });
        });
        
        if (!rows.length) {
            alertify.error("No hay categorías para guardar");
            return;
        }

        const btn = btnGuardarRecetaCategoria;
        if (btn) {
            btn.disabled = true;
        }

        try {
            const formData = new FormData();
            formData.append("receta_id", String(receta.id));
            formData.append("items", JSON.stringify(rows));

            const res = await fetch("controller/upd_receta_categoria.php", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudieron guardar las categorías");
            }

            alertify.success(`Se guardaron ${json.guardados || rows.length} categorías`);
            await cargarCategoriasRecetaModal();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al guardar categorías");
        } finally {
            if (btn) {
                btn.disabled = false;
            }
        }
    }

    function conectarStreamCambiosPrecio() {
        if (!hash || typeof window.EventSource === "undefined" || !streamHabilitado) {
            return;
        }

        detenerStreamCambios(false);

        const streamUrl = `controller/stream_receta_cambios.php?id=${encodeURIComponent(hash)}`;
        cambiosEventSource = new EventSource(streamUrl);

        cambiosEventSource.addEventListener("price_changes", event => {
            try {
                const payload = JSON.parse(event.data || "{}");
                const cambios = Array.isArray(payload.cambios) ? payload.cambios : [];
                const nextSignature = getCambiosPrecioSignature(cambios);

                if (nextSignature === cambiosStreamSignature) {
                    return;
                }

                cambiosStreamSignature = nextSignature;
                cambiosPrecioByItem = new Map(cambios.map(item => [Number(item.item_id), item]));

                if (receta && typeof payload.estado === "string") {
                    receta.estado = payload.estado;
                    aplicarBloqueoPorEstado();

                    if (!isRecetaEditable()) {
                        detenerStreamCambios(true);
                        return;
                    }
                }

                renderAlertasCambioPrecio(cambios, cambios.length > 0);
                renderBody();
            } catch (error) {
                console.error("Error procesando evento SSE:", error);
            }
        });

        cambiosEventSource.addEventListener("stream_disabled", event => {
            try {
                const payload = JSON.parse(event.data || "{}");
                if (receta && typeof payload.estado === "string") {
                    receta.estado = payload.estado;
                    aplicarBloqueoPorEstado();
                }

                detenerStreamCambios(true);
            } catch (error) {
                detenerStreamCambios(true);
            }
        });

        cambiosEventSource.addEventListener("error", () => {
            // EventSource reconecta automaticamente.
        });
    }

    function getMonedaSimbolo(moneda) {
        return String(moneda || "").toUpperCase() === "DOLLAR" ? "$" : "S/.";
    }

    function formatMoneda(moneda, monto) {
        return `${getMonedaSimbolo(moneda)} ${formatDecimal(Number(monto) || 0)}`;
    }

    function escapeAttr(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function initTooltips(scope = document) {
        if (typeof bootstrap === "undefined" || !bootstrap.Tooltip) return;
        scope.querySelectorAll('[data-bs-toggle="tooltip"], [data-bs-title]').forEach(el => {
            bootstrap.Tooltip.getOrCreateInstance(el);
        });
    }

    function getSubtotal(item) {
        return (Number(item.cantidad) || 0) * (Number(item.precio) || 0);
    }

    function clampCantidad(value) {
        const parsed = parseInt(value, 10);
        if (!Number.isInteger(parsed)) return 1;
        return Math.min(100, Math.max(1, parsed));
    }

    function getResumenTotales() {
        let totalItems = 0;
        let totalSoles = 0;
        let totalDolares = 0;

        detalle.forEach(item => {
            const cantidad = Number(item.cantidad) || 0;
            const precio = Number(item.precio) || 0;
            const moneda = String(item.moneda || "").toUpperCase();

            totalItems += cantidad;

            if (moneda === "DOLLAR") {
                totalDolares += precio * cantidad;
            } else {
                totalSoles += precio * cantidad;
            }
        });

        const tipoCambio = Number(receta?.tipo_cambio) || 1;
        const totalPE = totalSoles + (totalDolares * tipoCambio);

        return { totalItems, totalSoles, totalDolares, totalPE };
    }

    function calcularTotales() {
        const { totalItems, totalSoles, totalDolares, totalPE } = getResumenTotales();

        if (totalItemEl) totalItemEl.textContent = totalItems;
        if (totalSolesEl) totalSolesEl.textContent = format2(decimalAdjust("round", totalSoles, "-2"));
        if (totalDolaresEl) totalDolaresEl.textContent = format2(decimalAdjust("round", totalDolares, "-2"));
        if (totalPeruEl) totalPeruEl.textContent = format2(decimalAdjust("round", totalPE, "-2"));
    }

    function getVisibleRows() {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return detalle.slice(startIndex, startIndex + PAGE_SIZE);
    }

    function actualizarCantidad(itemId, delta) {
        if (!isRecetaEditable()) {
            alertify.error("Solo se puede modificar recetas con estado Enviada");
            return;
        }

        const idx = detalle.findIndex(x => Number(x.item_id) === Number(itemId));
        if (idx < 0) return;

        const nueva = clampCantidad((Number(detalle[idx].cantidad) || 1) + delta);
        detalle[idx].cantidad = nueva;
        renderBody();
        renderPagination();
        calcularTotales();
    }

    function eliminarItem(itemId) {
        if (!isRecetaEditable()) {
            alertify.error("Solo se puede modificar recetas con estado Enviada");
            return;
        }

        detalle = detalle.filter(x => Number(x.item_id) !== Number(itemId));

        if (!detalle.length) {
            renderEmptyState("No hay items para mostrar.");
        } else {
            renderBody();
            renderPagination();
        }

        calcularTotales();
    }

    function renderBody() {
        if (!tbody) return;

        const rows = getVisibleRows();

        if (!rows.length) {
            renderEmptyState("No hay items para mostrar.");
            return;
        }

        tbody.innerHTML = rows.map(item => {
            const editable = isRecetaEditable();
            const cantidad = Number(item.cantidad) || 0;
            const precio = Number(item.precio) || 0;
            const subtotal = getSubtotal(item);
            const monedaSimbolo = getMonedaSimbolo(item.moneda);
            const itemDescripcion = normalizarTextoDetalle(item.descripcion);
            const detalleLinea1 = formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]);
            const detalleLinea2 = [item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ");
            const itemId = Number(item.item_id) || Number(item.id) || 0;
            const cambioPrecio = cambiosPrecioByItem.get(itemId);
            const tooltipCambioPrecio = cambioPrecio
                ? escapeAttr(`Precio actualizado: ${formatMoneda(cambioPrecio.moneda_receta, cambioPrecio.precio_receta)} -> ${formatMoneda(cambioPrecio.moneda_actual, cambioPrecio.precio_actual)}`)
                : "";

            return `
                <tr data-item-id="${itemId}" class="${cambioPrecio ? "table-warning" : ""}">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-md flex-shrink-0 me-2">
                                <span class="avatar-title bg-primary-subtle rounded-circle">
                                    <img src="${getRandomLogo()}" alt="" height="22">
                                </span>
                            </div>
                            <div>
                                <span class="text-muted fs-12">${item.nombre || ""}
                                    ${cambioPrecio ? `<span class="ms-1" data-bs-toggle="tooltip" data-bs-title="${tooltipCambioPrecio}"><i class="ti ti-alert-circle text-warning fs-16"></i></span>` : ""}
                                </span><br>
                                <h5 class="fs-14 mt-1 item-description">${itemDescripcion}</h5>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="text-muted fs-12">${detalleLinea1 || "-"}</span>
                        <h5 class="fs-14 mt-1 fw-normal">${detalleLinea2 || "-"}</h5>
                    </td>
                    <td>
                        <span class="text-muted fs-12">Tipo</span>
                        <h5 class="fs-14 mt-1 fw-normal">
                            <i class="ti ti-circle-filled fs-12 ${String(item.tipo || "").toUpperCase() === "PRODUCTO" ? "text-success" : "text-info"}"></i>
                            ${item.tipo || "-"}
                        </h5>
                    </td>
                    <td class="text-center">
                        <div class="input-step border bg-body-secondary px-1 py-0 rounded-pill d-inline-flex align-items-center overflow-visible" style="height:30px;">
                            <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center btn-qty-minus" style="width:22px;min-width:22px;height:22px;" data-id="${itemId}" ${editable ? "" : "disabled"}>-</button>
                            <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:30px;font-size:12px;" value="${cantidad}" readonly>
                            <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center btn-qty-plus" style="width:22px;min-width:22px;height:22px;" data-id="${itemId}" ${editable ? "" : "disabled"}>+</button>
                        </div>
                    </td>
                    <td class="text-end">
                        <span class="text-muted fs-12">${monedaSimbolo}</span>
                        <h5 class="fs-14 mt-1 fw-normal mb-0">${formatDecimal(precio)}</h5>
                    </td>
                    <td class="text-end">
                        <span class="text-muted fs-12">${monedaSimbolo}</span>
                        <h5 class="fs-14 mt-1 fw-normal mb-0">${formatDecimal(subtotal)}</h5>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-danger btn-delete-item" data-id="${itemId}" ${editable ? "" : "disabled"}>
                            <i class="ti ti-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.querySelectorAll(".btn-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => actualizarCantidad(btn.dataset.id, 1));
        });

        tbody.querySelectorAll(".btn-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => actualizarCantidad(btn.dataset.id, -1));
        });

        tbody.querySelectorAll(".btn-delete-item").forEach(btn => {
            btn.addEventListener("click", () => eliminarItem(btn.dataset.id));
        });

        initTooltips(tbody);
    }

    function renderEmptyState(message) {
        if (!tbody) return;

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">${message}</td>
            </tr>
        `;

        if (paginationWrapper) paginationWrapper.classList.add("d-none");
        if (paginationFromEl) paginationFromEl.textContent = "0";
        if (paginationToEl) paginationToEl.textContent = "0";
    }

    function renderPagination() {
        const totalRows = detalle.length;
        const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        if (paginationFromEl) {
            paginationFromEl.textContent = totalRows === 0 ? "0" : String((currentPage - 1) * PAGE_SIZE + 1);
        }

        if (paginationToEl) {
            paginationToEl.textContent = totalRows === 0 ? "0" : String(Math.min(currentPage * PAGE_SIZE, totalRows));
        }

        if (!paginationWrapper || !paginationList) return;

        paginationWrapper.classList.toggle("d-none", totalRows <= PAGE_SIZE);

        if (totalRows <= PAGE_SIZE) {
            paginationList.innerHTML = "";
            return;
        }

        paginationList.innerHTML = "";

        const createPageItem = (label, page, disabled = false, active = false, icon = false) => {
            const li = document.createElement("li");
            li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`.trim();

            const a = document.createElement("a");
            a.href = "#";
            a.className = "page-link";
            a.innerHTML = icon ? label : label;

            if (!disabled) {
                a.addEventListener("click", event => {
                    event.preventDefault();
                    currentPage = page;
                    renderBody();
                    renderPagination();
                });
            }

            li.appendChild(a);
            return li;
        };

        paginationList.appendChild(createPageItem('<i class="ti ti-chevron-left"></i>', Math.max(1, currentPage - 1), currentPage === 1, false, true));

        for (let page = 1; page <= totalPages; page += 1) {
            paginationList.appendChild(createPageItem(String(page), page, false, page === currentPage));
        }

        paginationList.appendChild(createPageItem('<i class="ti ti-chevron-right"></i>', Math.min(totalPages, currentPage + 1), currentPage === totalPages, false, true));
    }

    async function guardarReceta(e) {
        e.preventDefault();

        if (!isRecetaEditable()) {
            alertify.error("Solo se puede modificar recetas con estado Enviada");
            return;
        }

        if (!receta || !receta.id) {
            alertify.error("Receta inválida");
            return;
        }

        if (!detalle.length) {
            alertify.error("Debe existir al menos un item en la receta");
            return;
        }

        const submitBtn = recetaForm?.querySelector("[type='submit']");
        if (submitBtn?.disabled) return;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-50", "cursor-not-allowed");
        }

        try {
            const payloadItems = detalle.map(item => ({
                item_id: Number(item.item_id) || Number(item.id) || 0,
                categoria: item.categoria || "",
                sub_cat_1: item.sub_cat_1 || "",
                sub_cat_2: item.sub_cat_2 || "",
                marca: item.marca || "",
                modelo: item.modelo || "",
                nombre: item.nombre || "",
                descripcion: item.descripcion || "",
                uni_medida: item.uni_medida || "",
                precio: Number(item.precio) || 0,
                moneda: item.moneda || "",
                tipo: item.tipo || "",
                cantidad: clampCantidad(item.cantidad)
            }));

            const fd = new FormData();
            fd.append("receta_id", String(receta.id));
            fd.append("tipo_cambio", String(Number(receta.tipo_cambio) || 1));
            fd.append("items", JSON.stringify(payloadItems));

            const res = await fetch("controller/upd_receta.php", {
                method: "POST",
                body: fd
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudo actualizar la receta");
            }

            alertify.success("Receta actualizada correctamente");
            await cargarReceta(hash);
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al actualizar receta");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
        }
    }

    async function sincronizarPrecios() {
        if (!hash) return;

        if (!isRecetaEditable()) {
            alertify.error("Solo se puede recargar precios en recetas con estado Enviada");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("id", hash);

            const res = await fetch("controller/reload_receta_precios.php", {
                method: "POST",
                body: fd
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudo sincronizar precios");
            }

            if (Number(json.actualizados) > 0) {
                alertify.success(`Se actualizaron ${json.actualizados} item(s) con nuevo precio.`);
            } else {
                alertify.message("No hubo cambios de precios por aplicar.");
            }

            await cargarReceta(hash);
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al recargar precios");
        }
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

    function renderItemsTable(rows, emptyMessage = "No hay items para mostrar con los filtros actuales.") {
        if (!itemsTableBody) return;

        if (itemsResultCount) {
            itemsResultCount.textContent = `${rows.length} resultado${rows.length === 1 ? "" : "s"}`;
        }

        if (!rows.length) {
            itemsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-4">${emptyMessage}</td>
                </tr>
            `;
            return;
        }

        itemsTableBody.innerHTML = rows.map(item => {
            const editable = isRecetaEditable();
            const itemNombre = item.nombre || "-";
            const itemDescripcion = normalizarTextoDetalle(item.descripcion);
            const detalleLinea1 = formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]);
            const monedaSimbolo = String(item.moneda || "").toUpperCase() === "DOLLAR" ? "$" : "S/.";
            const precioTexto = `${monedaSimbolo} ${formatDecimal(item.precio)}`;
            const itemPayload = encodeURIComponent(JSON.stringify(item));

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
                        <button type="button" class="btn btn-sm btn-primary btn-add-item-row" ${editable ? "" : "disabled"}>
                            <i class="ti ti-plus"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        itemsTableBody.querySelectorAll("tr[data-item-payload]").forEach(row => {
            const qtyCell = row.querySelector(".receta-qty-cell");
            if (!qtyCell) return;

            qtyCell.innerHTML = `
                <div data-touchspin class="input-step border bg-body-secondary px-1 py-0 mt-1 rounded-pill d-inline-flex align-items-center overflow-visible" style="height:28px;">
                    <button type="button" class="qty-minus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:20px;min-width:20px;height:20px;">-</button>
                    <input type="number" class="qty-input text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:30px;font-size:12px;" value="1" min="1" max="100" readonly>
                    <button type="button" class="qty-plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center" style="width:20px;min-width:20px;height:20px;">+</button>
                </div>
            `;

            const input = qtyCell.querySelector(".qty-input");
            qtyCell.querySelector(".qty-minus").addEventListener("click", () => {
                input.value = String(clampCantidad(Number(input.value) - 1));
            });
            qtyCell.querySelector(".qty-plus").addEventListener("click", () => {
                input.value = String(clampCantidad(Number(input.value) + 1));
            });
        });

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
    }

    function agregarItemReceta(item, qtyInicial = 1) {
        if (!isRecetaEditable()) {
            alertify.error("Solo se puede modificar recetas con estado Enviada");
            return;
        }

        const itemId = Number(item.id) || Number(item.item_id) || 0;
        if (!itemId) {
            alertify.error("Item inválido");
            return;
        }

        const existente = detalle.some(x => Number(x.item_id) === itemId);
        if (existente) {
            alertify.error("Este item ya fue agregado");
            return;
        }

        detalle.push({
            item_id: itemId,
            categoria: item.categoria || "",
            sub_cat_1: item.sub_cat_1 || "",
            sub_cat_2: item.sub_cat_2 || "",
            marca: item.marca || "",
            modelo: item.modelo || "",
            nombre: item.nombre || "",
            descripcion: item.descripcion || "",
            uni_medida: item.uni_medida || "",
            precio: Number(item.precio) || 0,
            moneda: item.moneda || "SOL",
            tipo: item.tipo || "",
            cantidad: clampCantidad(qtyInicial)
        });

        currentPage = Math.ceil(detalle.length / PAGE_SIZE);
        renderBody();
        renderPagination();
        calcularTotales();
        alertify.success("Item agregado");
    }
});
