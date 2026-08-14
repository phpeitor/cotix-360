document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("table.table tbody");
    const recetaForm = document.querySelector("form.form-receta");

    const recetaIdEl = document.getElementById("receta_id");
    const recetaNombreDisplayEl = document.getElementById("receta_nombre_display");
    const usuarioEl = document.getElementById("usuario");
    const fechaEl = document.getElementById("fecha");
    const estadoEl = document.getElementById("estado");
    const totalItemEl = document.getElementById("total_item");
    const totalSolesEl = document.getElementById("total_soles");
    const totalDolaresEl = document.getElementById("total_dolares");
    const totalPeruEl = document.getElementById("total_peru");
    const totalPeruDolaresEl = document.getElementById("total_peru_dolares");
    const tipoCambioEl = document.getElementById("tipo_cambio_sunat");
    const btnEditTipoCambio = document.getElementById("btnEditTipoCambio");
    const tipoCambioInputEl = document.getElementById("tipo_cambio_input");
    const btnReloadPrecios = document.getElementById("btnReloadPrecios");
    const alertPrecioCambioEl = document.getElementById("alertPrecioCambio");
    const infoCategoriaModalEl = document.getElementById("info-categoria-modal");
    const btnObservacion = document.getElementById("btnObservacion");
    const observacionModalEl = document.getElementById("observacionModal");
    const observacionText = document.getElementById("observacionText");
    const btnSaveObservacion = document.getElementById("btnSaveObservacion");
    const alertCategoriaRecetaEl = document.getElementById("alertCategoriaReceta");
    const recetaCategoriaTableBody = document.getElementById("recetaCategoriaTableBody");
    const btnGuardarRecetaCategoria = document.getElementById("btnGuardarRecetaCategoria");
    const totalFormulaDolaresEl = document.getElementById("totalFormulaDolares");
    const totalMargenFormulaDolaresEl = document.getElementById("totalMargenFormulaDolares");
    const categoriaDetalleModalEl = document.getElementById("categoria-detalle-modal");
    const categoriaDetalleModalLabel = document.getElementById("categoria-detalle-modalLabel");
    const categoriaDetalleTableBody = document.getElementById("categoriaDetalleTableBody");
    const categoriaDetalleTotalGeneralEl = document.getElementById("categoriaDetalleTotalGeneral");
    const inputRecetaNombre = document.getElementById("inputRecetaNombre");
    const btnEditRecetaNombre = document.getElementById("btnEditRecetaNombre");
    const clienteModalEl = document.getElementById("cliente-modal");
    const btnGuardarCliente = document.getElementById("btnGuardarCliente");
    const clienteRazonSocialEl = document.getElementById("clienteRazonSocial");
    const clienteRucEl = document.getElementById("clienteRuc");
    const clienteNombreCompletoEl = document.getElementById("clienteNombreCompleto");
    const clienteCorreoEl = document.getElementById("clienteCorreo");
    const clienteCelularEl = document.getElementById("clienteCelular");
    const clienteMotivoEl = document.getElementById("clienteMotivo");
    const clienteDireccionEl = document.getElementById("clienteDireccion");
    const condicionesModalEl = document.getElementById("condiciones-modal");
    const btnGuardarCondiciones = document.getElementById("btnGuardarCondiciones");
    const tiempoEntregaEl = document.getElementById("tiempoEntrega");
    const tiempoEntregaUnidadEl = document.getElementById("tiempoEntregaUnidad");
    const condicionesPagoEl = document.getElementById("condicionesPago");
    const vendedorEl = document.getElementById("vendedor");
    const vendedorCorreoEl = document.getElementById("vendedorCorreo");
    const vendedorTelefonoEl = document.getElementById("vendedorTelefono");
    const descripcionRecetaEl = document.getElementById("descripcionReceta");
    const cantidadItemsRecetaEl = document.getElementById("cantidadItemsReceta");
    const condicionesEconomicasDiasEl = document.getElementById("condicionesEconomicasDias");
    const condicionesEconomicasVisibleEl = document.getElementById("condicionesEconomicasVisible");
    const observacionesComercialesEl = document.getElementById("observacionesComerciales");

    const baseSelect = document.getElementById("filterBase");
    const categoriaSelect = document.getElementById("categoria");
    const subCat1Select = document.getElementById("subCat1");
    const subCat2Select = document.getElementById("subCat2");
    const productoFiltersWrap = document.getElementById("productoFiltersWrap");
    const marcaSelect = document.getElementById("filterMarca");
    const modeloSelect = document.getElementById("filterModelo");
    const itemsTableBody = document.getElementById("recetaItemsTableBody");
    const itemsResultCount = document.getElementById("itemsResultCount");

    const paginationFromEl = document.getElementById("pagination_from");
    const paginationToEl = document.getElementById("pagination_to");
    const paginationWrapper = document.getElementById("pagination_wrapper");
    const paginationList = document.getElementById("pagination_list");

    const userCargo = Number(recetaForm?.dataset?.userCargo || 0);
    const isTecnico = userCargo === 4;
    const canEditDetallePrice = [1, 3].includes(userCargo);
    const btnInfoCategoriaModal = document.querySelector('[data-bs-target="#info-categoria-modal"]');

    if (isTecnico && btnInfoCategoriaModal) {
        btnInfoCategoriaModal.disabled = true;
        btnInfoCategoriaModal.setAttribute("aria-disabled", "true");
        btnInfoCategoriaModal.title = "No disponible para este cargo";
        btnInfoCategoriaModal.classList.add("opacity-50", "cursor-not-allowed");
    }

    const PAGE_SIZE = 15;
    const MAX_CANTIDAD = 5000;
    let currentPage = 1;
    let receta = null;
    let detalle = [];
    let cambiosPrecioActuales = [];
    let cambiosPrecioByItem = new Map();
    let cambiosStreamSignature = "";
    let cambiosEventSource = null;
    let streamHabilitado = true;
    let sincronizandoPrecios = false;
    let cliente = null;
    const btnReloadPreciosContent = btnReloadPrecios?.innerHTML || '<i class="ti ti-refresh"></i>';
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

    function normalizarClaveCambio(valor) {
        return String(valor ?? "").trim().toLowerCase();
    }

    function configurarConsultaRuc(rucInput, nombreInput, direccionInput) {
        if (!rucInput || !nombreInput) return;

        let lastRucConsulted = null;

        rucInput.addEventListener("input", async () => {
            const ruc = String(rucInput.value || "").replace(/\D/g, "").slice(0, 11);
            if (rucInput.value !== ruc) {
                rucInput.value = ruc;
            }

            if (ruc.length < 11) {
                lastRucConsulted = null;
                return;
            }

            if (ruc === lastRucConsulted) return;
            lastRucConsulted = ruc;

            try {
                const res = await fetch(`./config/api-ruc.php?ruc=${encodeURIComponent(ruc)}`);
                const data = await res.json();

                if (!res.ok || !data.ok) {
                    throw new Error(data.message || "No se pudo consultar el RUC");
                }

                nombreInput.value = data.nombre || "";
                if (direccionInput && data.direccion) {
                    direccionInput.value = data.direccion;
                }
            } catch (error) {
                console.error("Error RUC:", error);
                lastRucConsulted = null;
                alertify.error(error.message || "Error al consultar RUC");
            }
        });
    }

    function getClaveCambioPrecio(item) {
        return [item?.nombre, item?.categoria, item?.sub_cat_1, item?.sub_cat_2, item?.descripcion]
            .map(normalizarClaveCambio)
            .join("|");
    }

    function formatFechaCambioTooltip(valor) {
        const raw = String(valor ?? "").trim();
        if (!raw) {
            return "-";
        }

        const normalizado = raw.replace(" ", "T");
        const fecha = new Date(normalizado);
        if (Number.isNaN(fecha.getTime())) {
            return raw;
        }

        return new Intl.DateTimeFormat("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(fecha);
    }

    init();

    function toggleEditTipoCambio(save = false) {
        if (!tipoCambioEl || !tipoCambioInputEl || !btnEditTipoCambio || !receta) return;
        if (!isTipoCambioEditable()) return;

        const editing = !tipoCambioInputEl.classList.contains('d-none');

        if (!editing && !save) {
            // activar edición
            tipoCambioEl.classList.add('d-none');
            tipoCambioInputEl.classList.remove('d-none');
            tipoCambioInputEl.focus();
            btnEditTipoCambio.innerHTML = '<i class="ti ti-check"></i>';
            return;
        }

        // si estaba en edición y se pide guardar
        const nuevoValor = parseFloat(String(tipoCambioInputEl.value || '').replace(/,/g, '.'));
        if (!Number.isFinite(nuevoValor) || nuevoValor <= 0) {
            alertify.error('Tipo de cambio inválido');
            tipoCambioInputEl.focus();
            return;
        }

        // enviar al servidor
        btnEditTipoCambio.disabled = true;

        const fd = new FormData();
        fd.append('receta_id', String(receta.id));
        fd.append('tipo_cambio', String(nuevoValor));

        fetch('controller/upd_tipo_cambio.php', {
            method: 'POST',
            body: fd
        }).then(res => res.json()).then(json => {
            if (!json || !json.ok) {
                throw new Error(json?.message || 'No se pudo actualizar tipo de cambio');
            }

            receta.tipo_cambio = nuevoValor;
            renderHeader();
            calcularTotales();
            alertify.success('Tipo de cambio actualizado');
        }).catch(err => {
            console.error(err);
            alertify.error(err.message || 'Error al actualizar tipo de cambio');
        }).finally(() => {
            btnEditTipoCambio.disabled = false;
            // restaurar modo view
            tipoCambioEl.classList.remove('d-none');
            tipoCambioInputEl.classList.add('d-none');
            btnEditTipoCambio.innerHTML = '<i class="ti ti-edit"></i>';
        });
    }

    function toggleEditRecetaNombre(save = false) {
        if (!recetaNombreDisplayEl || !inputRecetaNombre || !btnEditRecetaNombre || !receta) return;

        const editing = !inputRecetaNombre.classList.contains('d-none');

        if (!editing && !save) {
            // activar edición
            recetaNombreDisplayEl.classList.add('d-none');
            inputRecetaNombre.classList.remove('d-none');
            inputRecetaNombre.focus();
            inputRecetaNombre.select();
            btnEditRecetaNombre.innerHTML = '<i class="ti ti-check"></i>';
            return;
        }

        // si estaba en edición y se pide guardar
        const nuevoNombre = String(inputRecetaNombre.value || '').trim();
        if (!nuevoNombre) {
            alertify.error('El nombre no puede estar vacío');
            inputRecetaNombre.focus();
            return;
        }

        // enviar al servidor
        btnEditRecetaNombre.disabled = true;

        const fd = new FormData();
        fd.append('hash', String(hash || ''));
        fd.append('nombre', nuevoNombre);

        fetch('controller/upd_nombre_receta.php', {
            method: 'POST',
            body: fd
        }).then(res => res.json()).then(json => {
            if (!json || !json.success) {
                throw new Error(json?.message || 'No se pudo actualizar nombre');
            }

            receta.nombre = nuevoNombre;
            renderHeader();
            alertify.success('Nombre actualizado');
        }).catch(err => {
            console.error(err);
            alertify.error(err.message || 'Error al actualizar nombre');
        }).finally(() => {
            btnEditRecetaNombre.disabled = false;
            // restaurar modo view
            recetaNombreDisplayEl.classList.remove('d-none');
            inputRecetaNombre.classList.add('d-none');
            btnEditRecetaNombre.innerHTML = '<i class="ti ti-edit"></i>';
        });
    }

    if (btnEditRecetaNombre) {
        btnEditRecetaNombre.addEventListener('click', (e) => {
            e.preventDefault();
            const editing = inputRecetaNombre && !inputRecetaNombre.classList.contains('d-none');
            if (!editing) {
                toggleEditRecetaNombre(false);
                return;
            }

            toggleEditRecetaNombre(true);
        });

        if (inputRecetaNombre) {
            inputRecetaNombre.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    toggleEditRecetaNombre(true);
                }

                if (e.key === 'Escape') {
                    // cancelar edición
                    inputRecetaNombre.classList.add('d-none');
                    recetaNombreDisplayEl.classList.remove('d-none');
                    btnEditRecetaNombre.innerHTML = '<i class="ti ti-edit"></i>';
                }
            });
        }
    }

    if (btnEditTipoCambio) {
        btnEditTipoCambio.addEventListener('click', (e) => {
            e.preventDefault();
            const editing = tipoCambioInputEl && !tipoCambioInputEl.classList.contains('d-none');
            if (!editing) {
                toggleEditTipoCambio(false);
                return;
            }

            toggleEditTipoCambio(true);
        });

        if (tipoCambioInputEl) {
            tipoCambioInputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    toggleEditTipoCambio(true);
                }

                if (e.key === 'Escape') {
                    // cancelar edición
                    tipoCambioInputEl.classList.add('d-none');
                    tipoCambioEl.classList.remove('d-none');
                    btnEditTipoCambio.innerHTML = '<i class="ti ti-edit"></i>';
                }
            });
        }
    }

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
        subCat2Select?.addEventListener("change", onSubCat2Change);
        marcaSelect?.addEventListener("change", onMarcaChange);
        modeloSelect?.addEventListener("change", onModeloChange);

        recetaForm?.addEventListener("submit", guardarReceta);
        btnReloadPrecios?.addEventListener("click", sincronizarPrecios);
        btnGuardarRecetaCategoria?.addEventListener("click", guardarCategoriasRecetaModal);
        infoCategoriaModalEl?.addEventListener("show.bs.modal", cargarCategoriasRecetaModal);
        btnObservacion?.addEventListener("click", () => {
            if (!observacionModalEl) return;
            // populate textarea with existing observation
            if (observacionText) {
                observacionText.value = String(receta?.observacion || "");
            }
            const modal = new bootstrap.Modal(observacionModalEl);
            modal.show();
        });

        btnSaveObservacion?.addEventListener("click", async () => {
            if (!observacionText) return;
            const value = String(observacionText.value || "").trim();
            if (value.length > 300) {
                alertify.error("Observación demasiado larga (máx 300)");
                return;
            }

            btnSaveObservacion.disabled = true;
            try {
                const fd = new FormData();
                fd.append('hash', String(hash || ''));
                fd.append('observacion', value);

                const res = await fetch('controller/upd_receta_observacion.php', {
                    method: 'POST',
                    body: fd
                });

                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.message || 'No se pudo actualizar observación');
                }

                // update local receta and UI
                receta = receta || {};
                receta.observacion = value;
                alertify.success(json.message || 'Observación guardada');
                // hide modal
                const modalEl = bootstrap.Modal.getInstance(observacionModalEl) || new bootstrap.Modal(observacionModalEl);
                modalEl.hide();
            } catch (err) {
                console.error(err);
                alertify.error(err.message || 'Error al guardar observación');
            } finally {
                btnSaveObservacion.disabled = false;
            }
        });

        btnGuardarCliente?.addEventListener("click", async () => {
            if (!receta?.id) {
                alertify.error("Receta inválida");
                return;
            }

            const payload = getClienteModalPayload();

            if (!payload.razon_social_empresa || !payload.direccion || !payload.ruc || !payload.nombre_completo || !payload.correo || !payload.celular || !payload.motivo) {
                alertify.error("Completa todos los datos del cliente");
                return;
            }

            if (!/^[0-9]{11}$/.test(payload.ruc)) {
                alertify.error("El RUC debe contener 11 dígitos");
                return;
            }

            if (!/^[0-9]{9}$/.test(payload.celular)) {
                alertify.error("El celular debe contener 9 dígitos");
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(payload.correo)) {
                alertify.error("El correo del cliente no es válido");
                return;
            }

            btnGuardarCliente.disabled = true;
            try {
                const fd = new FormData();
                fd.append("receta_id", String(receta.id));
                fd.append("razon_social_empresa", payload.razon_social_empresa);
                fd.append("direccion", payload.direccion);
                fd.append("ruc", payload.ruc);
                fd.append("nombre_completo", payload.nombre_completo);
                fd.append("correo", payload.correo);
                fd.append("celular", payload.celular);
                fd.append("motivo", payload.motivo);

                const res = await fetch("controller/upd_receta_cliente.php", {
                    method: "POST",
                    body: fd
                });

                const json = await res.json();
                if (!res.ok || !json.ok) {
                    throw new Error(json.message || "No se pudo guardar el cliente");
                }

                cliente = json.cliente || payload;
                alertify.success("Información del cliente guardada");
                const modal = bootstrap.Modal.getInstance(clienteModalEl) || new bootstrap.Modal(clienteModalEl);
                modal.hide();
            } catch (error) {
                console.error(error);
                alertify.error(error.message || "Error al guardar el cliente");
            } finally {
                btnGuardarCliente.disabled = false;
            }
        });

        clienteModalEl?.addEventListener("show.bs.modal", async () => {
            await cargarClienteDesdeServidor();
            renderClienteModal();
        });

        condicionesModalEl?.addEventListener("show.bs.modal", async () => {
            await cargarClienteDesdeServidor();
            renderCondicionesModal();
        });

        btnGuardarCondiciones?.addEventListener("click", guardarCondicionesComerciales);

        configurarConsultaRuc(clienteRucEl, clienteRazonSocialEl, clienteDireccionEl);

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
            cliente = data.cliente || null;
            detalle = Array.isArray(data.detalle) ? data.detalle : [];
            const cambiosPrecio = Array.isArray(data.cambios_precio) ? data.cambios_precio : [];
            cambiosPrecioActuales = cambiosPrecio;
            cambiosPrecioByItem = new Map(cambiosPrecio.map(item => [getClaveCambioPrecio(item), item]));
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

    async function cargarClienteDesdeServidor() {
        if (!hash) {
            cliente = null;
            return;
        }

        try {
            const res = await fetch(`controller/get_receta.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();

            if (!res.ok || data.error || !data.receta) {
                return;
            }

            cliente = data.cliente || null;
        } catch (error) {
            console.error(error);
        }
    }

    function renderClienteModal() {
        const data = cliente || {};

        if (clienteRazonSocialEl) clienteRazonSocialEl.value = data.razon_social_empresa || "";
        if (clienteRucEl) clienteRucEl.value = data.ruc || "";
        if (clienteNombreCompletoEl) clienteNombreCompletoEl.value = data.nombre_completo || "";
        if (clienteCorreoEl) clienteCorreoEl.value = data.correo || "";
        if (clienteCelularEl) clienteCelularEl.value = data.celular || "";
        if (clienteMotivoEl) clienteMotivoEl.value = data.motivo || "";
        if (clienteDireccionEl) clienteDireccionEl.value = data.direccion || "";
    }

    function renderCondicionesModal() {
        const data = cliente || {};

        if (tiempoEntregaEl) tiempoEntregaEl.value = String(data.tiempo_entrega || "").replace(/\D/g, "");
        if (tiempoEntregaUnidadEl) tiempoEntregaUnidadEl.value = ["dias", "semanas"].includes(String(data.tiempo_entrega_unidad || "dias")) ? data.tiempo_entrega_unidad : "dias";
        if (condicionesPagoEl) condicionesPagoEl.value = data.condiciones_pago || "";
        if (vendedorEl) vendedorEl.value = data.vendedor || "";
        if (vendedorCorreoEl) vendedorCorreoEl.value = data.vendedor_correo || "";
        if (vendedorTelefonoEl) vendedorTelefonoEl.value = data.vendedor_telefono || "";
        if (descripcionRecetaEl) descripcionRecetaEl.value = data.descripcion || "";
        if (cantidadItemsRecetaEl) cantidadItemsRecetaEl.value = data.cantidad_items || "";
        if (condicionesEconomicasDiasEl) condicionesEconomicasDiasEl.value = data.condiciones_economicas_dias || "";
        if (condicionesEconomicasVisibleEl) condicionesEconomicasVisibleEl.checked = String(data.condiciones_economicas_visible || "0") === "1";
        if (observacionesComercialesEl) observacionesComercialesEl.value = data.observaciones || "";
    }

    function getClienteModalPayload() {
        return {
            razon_social_empresa: String(clienteRazonSocialEl?.value || "").trim(),
            direccion: String(clienteDireccionEl?.value || "").trim(),
            ruc: String(clienteRucEl?.value || "").replace(/\D/g, "").trim(),
            nombre_completo: String(clienteNombreCompletoEl?.value || "").trim(),
            correo: String(clienteCorreoEl?.value || "").trim(),
            celular: String(clienteCelularEl?.value || "").replace(/\D/g, "").trim(),
            motivo: String(clienteMotivoEl?.value || "").trim(),
        };
    }

    function getCondicionesPayload() {
        return {
tiempo_entrega: String(tiempoEntregaEl?.value || "").replace(/\D/g, "").trim(),
            tiempo_entrega_unidad: String(tiempoEntregaUnidadEl?.value || "dias").trim(),
            condiciones_pago: String(condicionesPagoEl?.value || "").trim(),
            vendedor: String(vendedorEl?.value || "").trim(),
            vendedor_correo: String(vendedorCorreoEl?.value || "").trim(),
            vendedor_telefono: String(vendedorTelefonoEl?.value || "").replace(/\D/g, "").trim(),
            descripcion: String(descripcionRecetaEl?.value || "").trim(),
            cantidad_items: String(cantidadItemsRecetaEl?.value || "").replace(/\D/g, "").trim(),
            condiciones_economicas_dias: String(condicionesEconomicasDiasEl?.value || "").replace(/\D/g, "").trim(),
            condiciones_economicas_visible: condicionesEconomicasVisibleEl?.checked ? "1" : "0",
            observaciones: String(observacionesComercialesEl?.value || "").trim(),
        };
    }

    async function guardarCondicionesComerciales() {
        if (!receta?.id) {
            alertify.error("Receta inválida");
            return;
        }

        const payload = getCondicionesPayload();

        if (!payload.tiempo_entrega || !payload.condiciones_pago || !payload.vendedor || !payload.vendedor_correo || !payload.vendedor_telefono || !payload.descripcion || !payload.cantidad_items || !payload.condiciones_economicas_dias) {
            alertify.error("Completa tiempo de entrega, vendedor, descripcion, cantidad, condiciones de pago y días de suspensión");
            return;
        }

        btnGuardarCondiciones.disabled = true;
        try {
            const fd = new FormData();
            fd.append("receta_id", String(receta.id));
            fd.append("tiempo_entrega", payload.tiempo_entrega);
            fd.append("condiciones_pago", payload.condiciones_pago);
            fd.append("vendedor", payload.vendedor);
            fd.append("vendedor_correo", payload.vendedor_correo);
            fd.append("vendedor_telefono", payload.vendedor_telefono);
            fd.append("descripcion", payload.descripcion);
            fd.append("cantidad_items", payload.cantidad_items);
fd.append("condiciones_economicas_dias", payload.condiciones_economicas_dias);
            fd.append("condiciones_economicas_visible", payload.condiciones_economicas_visible);
            fd.append("tiempo_entrega_unidad", payload.tiempo_entrega_unidad);
            fd.append("observaciones", payload.observaciones);

            const res = await fetch("controller/upd_receta_condiciones.php", {
                method: "POST",
                body: fd
            });

            const json = await res.json();
            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudieron guardar los datos comerciales");
            }

            cliente = {
                ...(cliente || {}),
                ...(json.condiciones || payload)
            };
            alertify.success("Datos comerciales guardados");
            const modal = bootstrap.Modal.getInstance(condicionesModalEl) || new bootstrap.Modal(condicionesModalEl);
            modal.hide();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al guardar datos comerciales");
        } finally {
            btnGuardarCondiciones.disabled = false;
        }
    }

    function clienteCompleto(data = cliente) {
        const clienteData = data || {};
        return [
            clienteData.razon_social_empresa,
            clienteData.direccion,
            clienteData.ruc,
            clienteData.nombre_completo,
            clienteData.correo,
            clienteData.celular,
            clienteData.motivo,
        ].every(value => String(value ?? "").trim() !== "");
    }

    function renderHeader() {
        if (!receta) return;

        if (recetaIdEl) recetaIdEl.textContent = receta.id ?? "";
        if (recetaNombreDisplayEl) {
            let raw = String(receta?.nombre || "").trim();
            raw = raw.replace(/^PROY-?/i, '').replace(/^PRO-?/i, '');
            raw = raw.replace(/(?:-\d+)+$/, '');
            recetaNombreDisplayEl.textContent = raw || "(Sin nombre)";
        }
        if (usuarioEl) usuarioEl.textContent = receta.usuario ?? "";
        if (fechaEl) fechaEl.textContent = receta.created_at ?? "";
        if (estadoEl) estadoEl.textContent = receta.estado ?? "";
        if (tipoCambioEl) tipoCambioEl.textContent = Number(receta.tipo_cambio || 0).toFixed(3);
        if (tipoCambioInputEl) tipoCambioInputEl.value = Number(receta.tipo_cambio || 0).toFixed(3);
        if (inputRecetaNombre) {
            let raw = String(receta?.nombre || "").trim();
            raw = raw.replace(/^PROY-?/i, '').replace(/^PRO-?/i, '');
            raw = raw.replace(/(?:-\d+)+$/, '');
            inputRecetaNombre.value = raw;
        }

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

    function isTipoCambioEditable() {
        return ["enviada", "ofertado", "aprobada"].includes(String(receta?.estado || "").toLowerCase());
    }

    function aplicarBloqueoPorEstado() {
        const editable = isRecetaEditable();
        const tipoCambioEditable = isTipoCambioEditable();
        const estado = String(receta?.estado || "").toLowerCase();
        const isAnulada = estado === "anulada";
        const btnGuardar = recetaForm?.querySelector("[type='submit']");
        const btnBuscar = document.querySelector("[data-bs-target='#info-header-modal']");
        const setButtonLock = (button, locked, title) => {
            if (!button) return;

            button.disabled = locked;
            button.classList.toggle("opacity-50", locked);
            button.classList.toggle("cursor-not-allowed", locked);
            button.title = locked ? title : "";
        };

        [
            [btnGuardar, !editable, "Solo editable cuando el estado es Enviada"],
            [btnReloadPrecios, !editable || sincronizandoPrecios, sincronizandoPrecios ? "Sincronizando precios..." : "Solo disponible cuando el estado es Enviada"],
            [btnBuscar, !editable, "Solo disponible cuando el estado es Enviada"],
            [btnEditTipoCambio, !tipoCambioEditable, "Solo editable cuando el estado es Enviada, Ofertado o Aprobada"],
        ].forEach(([button, locked, title]) => setButtonLock(button, locked, title));

        if (btnInfoCategoriaModal) {
            const bloquearCategoria = isTecnico || isAnulada;
            btnInfoCategoriaModal.setAttribute("aria-disabled", bloquearCategoria ? "true" : "false");
            setButtonLock(btnInfoCategoriaModal, bloquearCategoria, isTecnico
                ? "No disponible para este cargo"
                : "No disponible cuando el estado es Anulada");
        }
    }

    function getCambiosPrecioSignature(cambios) {
        const normalized = (Array.isArray(cambios) ? cambios : [])
            .map(item => ({
                clave: getClaveCambioPrecio(item),
                precio_receta: Number(item.precio_receta || 0),
                moneda_receta: String(item.moneda_receta || ""),
                precio_actual: Number(item.precio_actual || 0),
                moneda_actual: String(item.moneda_actual || "")
            }))
            .sort((a, b) => a.clave.localeCompare(b.clave));

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

    function quitarCambioPrecioManual(item) {
        const clave = getClaveCambioPrecio(item);
        if (!clave || !cambiosPrecioByItem.has(clave)) return;

        cambiosPrecioByItem.delete(clave);
        cambiosPrecioActuales = cambiosPrecioActuales.filter(cambio => getClaveCambioPrecio(cambio) !== clave);
        cambiosStreamSignature = getCambiosPrecioSignature(cambiosPrecioActuales);
        renderAlertasCambioPrecio(cambiosPrecioActuales, false);
    }

    function renderCategoriasRecetaModal(rows, source) {
        if (!recetaCategoriaTableBody) return;

        const limpiarResumenFormula = () => {
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
                    <td colspan="6" class="text-center text-muted py-4">No hay categorías para mostrar.</td>
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
            const markup = subtotal > 0 ? (totalConMargen / subtotal) : 0;
            // Evitar mostrar duplicados como "X (X)" — si el contenido dentro
            // del paréntesis es igual al texto base, mostrar solo el base.
            const rawSubCat = String(row.sub_cat_1 || "-").trim();
            let displayCategoria = rawSubCat;
            const m = rawSubCat.match(/^(.+?)\s*\((.+)\)\s*$/);
            if (m) {
                const base = m[1].trim();
                const inside = m[2].trim();
                if (base.toUpperCase() === inside.toUpperCase()) {
                    displayCategoria = base;
                }
            }
            const categoriaTexto = escapeHtml(displayCategoria);
            const categoriaAttr = escapeAttr(row.sub_cat_1 || "");
            const monedaRaw = String(row.moneda || "");
            const monedaSimbolo = monedaRaw.toUpperCase() === "DOLLAR" ? "$" : "S/.";

            return `
                <tr class="receta-categoria-row" data-idx="${idx}" data-tipo="${escapeAttr(row.tipo || "")}" data-subcat="${escapeAttr(row.sub_cat_1 || "")}" data-subtotal="${subtotal}" data-cantidad="${cantidad}" data-margen="${margen}" data-moneda="${escapeAttr(monedaRaw)}">
                    <td>
                        <button type="button" class="btn btn-link p-0 text-start fw-bold receta-categoria-detalle-btn" data-tipo="${escapeAttr(row.tipo || "")}" data-subcat="${categoriaAttr}" data-categoria="${escapeAttr(displayCategoria)}">${categoriaTexto}</button>
                    </td>
                    <td class="text-end">${format2(decimalAdjust("round", cantidad, "-2"))}</td>
                    <td class="text-end">${monedaSimbolo} ${format2(decimalAdjust("round", subtotal, "-2"))}</td>
                    <td class="text-center">
                        <div class="input-step border bg-body-secondary p-1 rounded-pill d-inline-flex align-items-center overflow-visible" style="min-width:140px;">
                            <button type="button" class="btn-margen-minus bg-light text-dark border-0 rounded-circle fs-18 lh-1" data-bs-title="Disminuir margen" data-bs-placement="top" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;padding:0;">−</button>
                            <input type="number" class="input-margen-categoria text-dark text-center border-0 bg-body-secondary rounded" value="${margen.toFixed(2)}" min="0" max="5000" step="0.01" style="width:70px;height:26px;font-size:14px;">
                            <button type="button" class="btn-margen-plus bg-light text-dark border-0 rounded-circle fs-18 lh-1" data-bs-title="Aumentar margen" data-bs-placement="top" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;padding:0;">+</button>
                        </div>
                    </td>
                    <td class="text-end fw-semibold total-margen-cell">${monedaSimbolo} ${format2(decimalAdjust("round", totalConMargen, "-2"))}</td>
                    <td class="text-end fw-semibold markup-cell">${Number(decimalAdjust("round", markup, "-4")).toFixed(4)}</td>
                </tr>
            `;
        }).join("");

        recetaCategoriaTableBody.querySelectorAll(".receta-categoria-row").forEach((tr, idx) => {
            const input = tr.querySelector(".input-margen-categoria");
            const totalCell = tr.querySelector(".total-margen-cell");
            const markupCell = tr.querySelector(".markup-cell");
            const monedaRow = String(tr.getAttribute("data-moneda") || "").toUpperCase();
            const monedaSimboloRow = monedaRow === "DOLLAR" ? "$" : "S/.";
            if (!input) return;

            const actualizarResumenFormula = () => {
                let totalSoles = 0;
                let totalDolares = 0;
                let totalMargenSoles = 0;
                let totalMargenDolares = 0;

                recetaCategoriaTableBody.querySelectorAll(".receta-categoria-row").forEach(row => {
                    const subtotalRow = Number(row.getAttribute("data-subtotal") || 0);
                    const monedaRowRaw = String(row.getAttribute("data-moneda") || "").toUpperCase();
                    const inputRow = row.querySelector(".input-margen-categoria");
                    const margenRow = Number(String(inputRow?.value ?? "0").replace(/,/g, "."));
                    const margenNormalizado = Number.isFinite(margenRow) ? Math.min(100, Math.max(0, margenRow)) : 0;
                    const totalRow = calcularTotalConMargen(subtotalRow, margenNormalizado);
                    const margenMonto = totalRow - subtotalRow;

                    if (monedaRowRaw === "DOLLAR") {
                        totalDolares += totalRow;
                        totalMargenDolares += margenMonto;
                    } else {
                        totalSoles += totalRow;
                        totalMargenSoles += margenMonto;
                    }
                });

                if (totalFormulaDolaresEl) {
                    totalFormulaDolaresEl.textContent = format2(decimalAdjust("round", totalDolares, "-2"));
                }

                if (totalMargenFormulaDolaresEl) {
                    totalMargenFormulaDolaresEl.textContent = format2(decimalAdjust("round", totalMargenDolares, "-2"));
                }
            };

            const actualizarTotalConMargen = () => {
                if (!totalCell) return;

                const subtotalRow = Number(tr.getAttribute("data-subtotal") || 0);
                const margenRow = Number(String(input.value ?? "0").replace(/,/g, "."));
                const margenNormalizado = Number.isFinite(margenRow) ? Math.min(100, Math.max(0, margenRow)) : 0;
                const total = calcularTotalConMargen(subtotalRow, margenNormalizado);
                const markup = subtotalRow > 0 ? (total / subtotalRow) : 0;
                totalCell.textContent = `${monedaSimboloRow} ${format2(decimalAdjust("round", total, "-2"))}`;
                if (markupCell) {
                    markupCell.textContent = Number(decimalAdjust("round", markup, "-4")).toFixed(4);
                }
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

        recetaCategoriaTableBody.querySelectorAll(".receta-categoria-detalle-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                mostrarDetalleCategoria(btn.dataset.subcat || "", btn.dataset.categoria || "Categoría", btn.dataset.tipo || "");
            });
        });

        if (!recetaCategoriaTableBody.querySelector(".receta-categoria-row")) {
            limpiarResumenFormula();
        }

        initTooltips(recetaCategoriaTableBody);
    }

    function getCategoriaBase(value) {
        return String(value ?? "").replace(/\s*\(.+\)\s*$/, "").trim();
    }

    function mostrarDetalleCategoria(subCat, categoriaLabel, tipoCategoria = "") {
        if (!categoriaDetalleModalEl || !categoriaDetalleTableBody) return;

        const table = categoriaDetalleTableBody.closest("table");
        const theadRow = table?.querySelector("thead tr");
        if (theadRow) {
            theadRow.innerHTML = `
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th class="text-end">Cantidad</th>
                <th class="text-end">Precio</th>
                <th class="text-end">Total</th>
            `;
        }

        const normalizar = value => String(value ?? "").trim().toUpperCase();
        const subCatBase = getCategoriaBase(subCat);
        const tipo = normalizar(tipoCategoria);
        const items = detalle.filter(item => {
            if (tipo === "SERVICIO") {
                return normalizar(item.tipo) === tipo && normalizar(item.categoria) === normalizar(subCatBase);
            }

            if (tipo === "PRODUCTO") {
                return normalizar(item.tipo) === tipo && normalizar(item.sub_cat_1) === normalizar(subCatBase);
            }

            return [item.categoria, item.sub_cat_1, item.sub_cat_2].some(value => normalizar(value) === normalizar(subCatBase));
        });

        if (categoriaDetalleModalLabel) {
            categoriaDetalleModalLabel.textContent = `Detalle: ${categoriaLabel || subCat || "Categoría"}`;
        }

        if (!items.length) {
            categoriaDetalleTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay items para esta categoría.</td></tr>';
            if (categoriaDetalleTotalGeneralEl) categoriaDetalleTotalGeneralEl.textContent = "0.00";
        } else {
            let totalGeneral = 0;
            const rowsHtml = items.map(item => {
                const moneda = String(item.moneda || "").toUpperCase();
                const tipoCambio = Number(receta?.tipo_cambio) > 0 ? Number(receta.tipo_cambio) : 1;
                const cantidad = Number(item.cantidad) || 0;
                const precio = Number(item.precio) || 0;
                const precioDolares = moneda === "DOLLAR" ? precio : precio / tipoCambio;
                const total = cantidad * precioDolares;
                totalGeneral += total;
                return `
                    <tr>
                        <td class="fw-semibold">${escapeHtml(item.nombre || "-")}</td>
                        <td>${escapeHtml(item.descripcion || "-")}</td>
                        <td>${escapeHtml(item.marca || "-")}</td>
                        <td class="text-end">${Math.round(cantidad)}</td>
                        <td class="text-end">$ ${format2(precioDolares)}</td>
                        <td class="text-end fw-semibold">$ ${format2(total)}</td>
                    </tr>
                `;
            }).join("");

            categoriaDetalleTableBody.innerHTML = rowsHtml + `
                <tr class="table-light">
                    <td colspan="5" class="text-end fw-bold">Total general</td>
                    <td class="text-end fw-bold">$ ${format2(totalGeneral)}</td>
                </tr>
            `;
            if (categoriaDetalleTotalGeneralEl) categoriaDetalleTotalGeneralEl.textContent = format2(totalGeneral);
        }

        bootstrap.Modal.getOrCreateInstance(categoriaDetalleModalEl).show();
    }

    async function cargarCategoriasRecetaModal() {
        if (!receta?.id) {
            return;
        }

        if (recetaCategoriaTableBody) {
            recetaCategoriaTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">Cargando categorías...</td>
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
            // el nombre ahora se sincroniza desde renderHeader, así que solo nos aseguramos de que el input tenga el valor correcto
            if (inputRecetaNombre) {
                let raw = String(receta?.nombre || "").trim();
                raw = raw.replace(/^PROY-?/i, '').replace(/^PRO-?/i, '');
                raw = raw.replace(/(?:-\d+)+$/, '');
                inputRecetaNombre.value = raw;
            }
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
                        <td colspan="6" class="text-center text-muted py-4">No se pudieron cargar las categorías.</td>
                    </tr>
                `;
            }

            alertify.error(error.message || "Error al cargar categorías");
        }
    }

    // El envío/actualización del nombre se realiza al pulsar el botón Guardar; no actualizamos aquí al perder foco.

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
                cambiosPrecioActuales = cambios;
                cambiosPrecioByItem = new Map(cambios.map(item => [getClaveCambioPrecio(item), item]));

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
        return `${getMonedaSimbolo(moneda)} ${format2(Number(monto) || 0)}`;
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
        return Math.min(MAX_CANTIDAD, Math.max(1, parsed));
    }

    function esTeclaNumericaPermitida(e) {
        const teclasPermitidas = [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "Enter",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End"
        ];

        if (teclasPermitidas.includes(e.key)) return true;
        if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(String(e.key).toLowerCase())) return true;
        return /^[0-9]$/.test(e.key);
    }

    function restringirSoloNumeros(input) {
        input.addEventListener("keydown", (e) => {
            if (!esTeclaNumericaPermitida(e)) {
                e.preventDefault();
            }
        });

        input.addEventListener("input", () => {
            const soloDigitos = String(input.value ?? "").replace(/\D/g, "");
            if (input.value !== soloDigitos) {
                input.value = soloDigitos;
            }
        });

        input.addEventListener("blur", () => {
            input.value = String(clampCantidad(input.value));
        });
    }

    function normalizarPrecio(value) {
        const parsed = parseFloat(String(value ?? "").replace(/,/g, "."));
        if (!Number.isFinite(parsed) || parsed < 0) return 0;
        return parsed;
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
        const totalPEDolares = tipoCambio > 0 ? totalPE / tipoCambio : 0;

        return { totalItems, totalSoles, totalDolares, totalPE, totalPEDolares };
    }

    function calcularTotales() {
        const { totalItems, totalSoles, totalDolares, totalPE, totalPEDolares } = getResumenTotales();

        if (totalItemEl) totalItemEl.textContent = totalItems;
        if (totalSolesEl) totalSolesEl.textContent = format2(decimalAdjust("round", totalSoles, "-2"));
        if (totalDolaresEl) totalDolaresEl.textContent = format2(decimalAdjust("round", totalDolares, "-2"));
        if (totalPeruEl) totalPeruEl.textContent = format2(decimalAdjust("round", totalPE, "-2"));
        if (totalPeruDolaresEl) totalPeruDolaresEl.textContent = format2(decimalAdjust("round", totalPEDolares, "-2"));
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

    function actualizarSubtotalFila(itemId, cantidad = null) {
        if (!tbody) return;

        const row = tbody.querySelector(`tr[data-item-id="${CSS.escape(String(itemId))}"]`);
        if (!row) return;

        const item = detalle.find(x => Number(x.item_id) === Number(itemId));
        if (!item) return;

        const subtotal = getSubtotal({ ...item, cantidad: cantidad ?? item.cantidad });
        const subtotalEl = row.querySelector(".item-subtotal-value");
        if (subtotalEl) {
            subtotalEl.textContent = format2(subtotal);
        }

        if (cantidad !== null) {
            row.dataset.cantidad = String(cantidad);
        }
    }

    function actualizarCantidadDesdeInput(itemId, value) {
        if (!isRecetaEditable()) {
            alertify.error("Solo se puede modificar recetas con estado Enviada");
            return;
        }

        const idx = detalle.findIndex(x => Number(x.item_id) === Number(itemId));
        if (idx < 0) return;

        const nueva = clampCantidad(value);
        detalle[idx].cantidad = nueva;
        actualizarSubtotalFila(itemId, nueva);
        calcularTotales();
    }

    function actualizarPrecioDesdeInput(itemId, value) {
        if (!isRecetaEditable()) {
            alertify.error("Solo se puede modificar recetas con estado Enviada");
            return;
        }

        if (!canEditDetallePrice) {
            alertify.error("No tienes permisos para modificar precios");
            return;
        }

        const idx = detalle.findIndex(x => Number(x.item_id) === Number(itemId));
        if (idx < 0) return;

        detalle[idx].precio = normalizarPrecio(value);
        detalle[idx].precio_manual = 1;
        quitarCambioPrecioManual(detalle[idx]);
        actualizarSubtotalFila(itemId);
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
            const itemId = Number(item.item_id) || Number(item.id) || 0;
            const cantidad = Number(item.cantidad) || 0;
            const precio = Number(item.precio) || 0;
            const subtotal = getSubtotal(item);
            const monedaSimbolo = getMonedaSimbolo(item.moneda);
            const itemDescripcion = normalizarTextoDetalle(item.descripcion);
            const detalleLinea1 = formatearRutaDetalle([item.categoria, item.sub_cat_1, item.sub_cat_2]);
            const detalleLinea2 = [item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ");
            const claveCambio = getClaveCambioPrecio(item);
            const cambioPrecio = cambiosPrecioByItem.get(claveCambio);
            const precioUpdatedAt = item.precio_updated_at || item.updated_at || "";
            const tooltipPrecio = escapeAttr(`Última actualización: ${formatFechaCambioTooltip(precioUpdatedAt)}`);
            const tooltipCambioPrecio = cambioPrecio
                ? escapeAttr(`Precio actualizado\n Anterior: ${formatMoneda(cambioPrecio.moneda_receta, cambioPrecio.precio_receta)} - ${formatFechaCambioTooltip(cambioPrecio.fecha_anterior)}\n Actual: ${formatMoneda(cambioPrecio.moneda_actual, cambioPrecio.precio_actual)} - ${formatFechaCambioTooltip(cambioPrecio.fecha_cambio)}`)
                : "";
            const precioEditable = editable && canEditDetallePrice;
            const precioCell = precioEditable
                ? `<div class="d-inline-flex align-items-center justify-content-end gap-1">
                        <span class="text-muted fs-12">${monedaSimbolo}</span>
                        <input type="number" class="form-control form-control-sm text-end item-price-input" style="width:96px;" min="0" step="0.01" value="${precio.toFixed(2)}" data-id="${itemId}">
                   </div>`
                : `<span class="text-muted fs-12">${monedaSimbolo}</span>
                   <h5 class="fs-14 mt-1 fw-normal mb-0">${format2(precio)}</h5>`;

            return `
                <tr data-item-id="${itemId}" data-cantidad="${cantidad}" class="${cambioPrecio ? "table-warning" : ""}">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-md flex-shrink-0 me-2">
                                <span class="avatar-title bg-primary-subtle rounded-circle">
                                    <img src="${getRandomLogo()}" alt="" height="22">
                                </span>
                            </div>
                            <div>
                                <span class="text-muted fs-12">${item.nombre || ""}
                                    ${cambioPrecio ? `<span class="ms-1" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-precio-cambio" data-bs-title="${tooltipCambioPrecio}"><i class="ti ti-alert-circle text-warning fs-16"></i></span>` : ""}
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
                            <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold btn-qty-input" style="width:46px;font-size:12px;" value="${cantidad}" min="1" max="${MAX_CANTIDAD}" step="1" inputmode="numeric" pattern="[0-9]*" data-id="${itemId}" ${editable ? "" : "disabled"}>
                            <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-16 lh-1 d-inline-flex align-items-center justify-content-center btn-qty-plus" style="width:22px;min-width:22px;height:22px;" data-id="${itemId}" ${editable ? "" : "disabled"}>+</button>
                        </div>
                    </td>
                    <td class="text-end precio-tooltip ${isTecnico ? "d-none" : ""}" data-bs-toggle="tooltip" data-bs-title="${tooltipPrecio}">
                        ${precioCell}
                    </td>
                    <td class="text-end ${isTecnico ? "d-none" : ""}">
                        <span class="text-muted fs-12">${monedaSimbolo}</span>
                        <h5 class="fs-14 mt-1 fw-normal mb-0 item-subtotal-value">${format2(subtotal)}</h5>
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

        tbody.querySelectorAll(".btn-qty-input").forEach(input => {
            restringirSoloNumeros(input);
            input.addEventListener("input", () => {
                if (Number(input.value) > MAX_CANTIDAD) {
                    input.value = String(MAX_CANTIDAD);
                }
                actualizarCantidadDesdeInput(input.dataset.id, input.value);
            });
            input.addEventListener("change", () => {
                input.value = String(clampCantidad(input.value));
                actualizarCantidadDesdeInput(input.dataset.id, input.value);
            });
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    input.value = String(clampCantidad(input.value));
                    actualizarCantidadDesdeInput(input.dataset.id, input.value);
                }
            });
        });

        tbody.querySelectorAll(".item-price-input").forEach(input => {
            input.addEventListener("input", () => {
                actualizarPrecioDesdeInput(input.dataset.id, input.value);
            });
            input.addEventListener("change", () => {
                const precio = normalizarPrecio(input.value);
                input.value = precio.toFixed(2);
                actualizarPrecioDesdeInput(input.dataset.id, precio);
            });
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    const precio = normalizarPrecio(input.value);
                    input.value = precio.toFixed(2);
                    actualizarPrecioDesdeInput(input.dataset.id, precio);
                    input.blur();
                }
            });
        });

        tbody.querySelectorAll(".btn-delete-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemId = btn.dataset.id;
                alertify.confirm(
                    "Confirmar eliminación",
                    "¿Seguro que deseas eliminar este item de la receta?",
                    () => eliminarItem(itemId),
                    () => {}
                );
            });
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

        if (!clienteCompleto()) {
            alertify.error("Completa y guarda la información del cliente antes de actualizar la receta");
            if (clienteModalEl) {
                const modal = new bootstrap.Modal(clienteModalEl);
                modal.show();
            }
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
                precio_manual: Number(item.precio_manual) ? 1 : 0,
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
        if (sincronizandoPrecios) return;

        if (!isRecetaEditable()) {
            alertify.error("Solo se puede recargar precios en recetas con estado Enviada");
            return;
        }

        sincronizandoPrecios = true;
        if (btnReloadPrecios) {
            btnReloadPrecios.disabled = true;
            btnReloadPrecios.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            btnReloadPrecios.setAttribute("aria-label", "Sincronizando precios");
        }
        aplicarBloqueoPorEstado();

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
        } finally {
            sincronizandoPrecios = false;
            if (btnReloadPrecios) {
                btnReloadPrecios.innerHTML = btnReloadPreciosContent;
                btnReloadPrecios.setAttribute("aria-label", "Sincronizar precios actualizados");
            }
            aplicarBloqueoPorEstado();
        }
    }

    function resetNativeSelect(selectEl, placeholder, disabled = true) {
        if (!selectEl) return;

        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
        selectEl.disabled = disabled;
    }

    function setNativeSelectOptions(selectEl, rows, placeholder, valueKey) {
        if (!selectEl) return;

        const options = rows
            .map(row => row?.[valueKey])
            .filter(value => value !== null && value !== undefined && String(value).trim() !== "")
            .map(value => ({ value, label: value }));

        if (selectEl.choicesInstance) {
            selectEl.disabled = options.length === 0;
            selectEl.choicesInstance.clearChoices();
            selectEl.choicesInstance.setChoices(
                [{ value: "", label: placeholder, disabled: true, selected: true }, ...options],
                "value",
                "label",
                true
            );
            if (options.length === 0) {
                selectEl.choicesInstance.disable();
            } else {
                selectEl.choicesInstance.enable();
            }
            return;
        }

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
        const url = `controller/get_receta_item.php?${query.toString()}`;
        // debug: log request URL for troubleshooting
        console.debug("cargarRecetaOpciones -> fetch url:", url);
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
            throw new Error(data?.message || "No se pudieron cargar las opciones");
        }

        // debug: log data size for marcas/modelos
        if (params?.nivel && (params.nivel === "marcas" || params.nivel === "modelos")) {
            console.debug(`cargarRecetaOpciones -> nivel=${params.nivel} returned ${data.length} rows`, data.slice(0,5));
        }

        return data;
    }

    function getFiltrosReceta() {
        const filtros = {
            tipo: baseSelect?.value || "",
            categoria: categoriaSelect?.value || "",
            sub_cat_1: subCat1Select?.value || "",
            sub_cat_2: subCat2Select?.value || ""
        };

        if (isTipoProducto()) {
            filtros.marca = marcaSelect?.value || "";
            filtros.modelo = modeloSelect?.value || "";
        }

        return filtros;
    }

    function isTipoProducto() {
        return String(baseSelect?.value || "").trim().toUpperCase() === "PRODUCTO";
    }

    function mostrarFiltrosProducto(mostrar) {
        if (!productoFiltersWrap || !marcaSelect || !modeloSelect) return;

        productoFiltersWrap.classList.toggle("d-none", !mostrar);
        marcaSelect.disabled = !mostrar;
        modeloSelect.disabled = !mostrar;

        if (marcaSelect.choicesInstance) {
            mostrar ? marcaSelect.choicesInstance.enable() : marcaSelect.choicesInstance.disable();
        }

        if (modeloSelect.choicesInstance) {
            mostrar ? modeloSelect.choicesInstance.enable() : modeloSelect.choicesInstance.disable();
        }

        if (!mostrar) {
            resetNativeSelect(marcaSelect, "-- Seleccione Marca --");
            resetNativeSelect(modeloSelect, "-- Seleccione Modelo --");
        }
    }

    function resetFiltrosProducto() {
        resetNativeSelect(marcaSelect, "-- Seleccione Marca --");
        resetNativeSelect(modeloSelect, "-- Seleccione Modelo --");
        mostrarFiltrosProducto(false);
    }

    async function cargarBasesReceta() {
        try {
            const bases = await cargarRecetaOpciones({ nivel: "bases" });
            setNativeSelectOptions(baseSelect, bases, "-- Seleccione --", "tipo");
            resetNativeSelect(categoriaSelect, "-- Seleccione --");
            resetNativeSelect(subCat1Select, "-- Seleccione --");
            resetNativeSelect(subCat2Select, "-- Seleccione --");
            resetFiltrosProducto();
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
        if (!isTipoProducto()) {
            resetFiltrosProducto();
        }
        renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");

        if (!tipo) return;

        try {
            const categorias = await cargarRecetaOpciones({ nivel: "categorias", tipo });
            setNativeSelectOptions(categoriaSelect, categorias, "-- Seleccione --", "categoria");
            resetNativeSelect(subCat1Select, "-- Seleccione --");
            resetNativeSelect(subCat2Select, "-- Seleccione --");
            if (isTipoProducto()) {
                mostrarFiltrosProducto(false);
            } else {
                resetFiltrosProducto();
            }
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

        if (!tipo || !categoria) {
            if (!isTipoProducto()) {
                resetFiltrosProducto();
            }
            return;
        }

        try {
            const subCategorias1 = await cargarRecetaOpciones({ nivel: "subcat1", tipo, categoria });
            setNativeSelectOptions(subCat1Select, subCategorias1, "-- Seleccione --", "sub_cat_1");
            resetNativeSelect(subCat2Select, "-- Seleccione --");
            if (isTipoProducto()) {
                mostrarFiltrosProducto(false);
            }
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
            if (isTipoProducto()) {
                mostrarFiltrosProducto(false);
            }
            renderItemsTable([], "Selecciona Base, Categoria y Sub Categorias para cargar los items.");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar sub categoría 2");
        }
    }

    async function onSubCat2Change() {
        if (isTipoProducto()) {
            await cargarMarcasReceta();
        }

        await cargarItemsReceta();
    }

    async function cargarMarcasReceta() {
        const { tipo, categoria, sub_cat_1, sub_cat_2 } = getFiltrosReceta();

        if (!isTipoProducto()) {
            resetFiltrosProducto();
            return;
        }

        try {
            mostrarFiltrosProducto(!!sub_cat_2);
            resetNativeSelect(marcaSelect, "-- Seleccione Marca --");
            resetNativeSelect(modeloSelect, "-- Seleccione Modelo --");

            if (!tipo || !categoria || !sub_cat_1 || !sub_cat_2) {
                return;
            }

            console.debug('cargarMarcasReceta params', { nivel: 'marcas', tipo, categoria, sub_cat_1, sub_cat_2 });
            const marcas = await cargarRecetaOpciones({ nivel: "marcas", tipo, categoria, sub_cat_1, sub_cat_2 });
            setNativeSelectOptions(marcaSelect, marcas, "-- Seleccione Marca --", "marca");
            resetNativeSelect(modeloSelect, "-- Seleccione Modelo --");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar marcas");
        }
    }

    async function cargarModelosReceta() {
        const { tipo, categoria, sub_cat_1, sub_cat_2, marca } = getFiltrosReceta();

        if (!isTipoProducto()) {
            resetFiltrosProducto();
            return;
        }


        try {
            mostrarFiltrosProducto(true);
            resetNativeSelect(modeloSelect, "-- Seleccione Modelo --");

            if (!tipo || !categoria || !sub_cat_1 || !sub_cat_2 || !marca) {
                return;
            }

            console.debug('cargarModelosReceta params', { nivel: 'modelos', tipo, categoria, sub_cat_1, sub_cat_2, marca });
            const modelos = await cargarRecetaOpciones({ nivel: "modelos", tipo, categoria, sub_cat_1, sub_cat_2, marca });
            setNativeSelectOptions(modeloSelect, modelos, "-- Seleccione Modelo --", "modelo");
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar modelos");
        }
    }

    async function onMarcaChange() {
        if (!isTipoProducto()) return;

        renderItemsTable([], "Cargando items...");
        await cargarModelosReceta();
        await cargarItemsReceta();
    }

    async function onModeloChange() {
        await cargarItemsReceta();
    }

    async function cargarItemsReceta() {
        const filtros = getFiltrosReceta();

        renderItemsTable([], "Cargando items...");

        const requiereProducto = String(filtros.tipo || "").toUpperCase() === "PRODUCTO";
        if (requiereProducto) {
            const puedePorMarca = filtros.categoria && filtros.sub_cat_1 && filtros.sub_cat_2 && filtros.marca;
            const puedePorModelo = filtros.categoria && filtros.sub_cat_1 && filtros.sub_cat_2 && filtros.marca && filtros.modelo;

            if (!filtros.tipo || (!puedePorMarca && !puedePorModelo)) {
                renderItemsTable([], "Selecciona Marca o Modelo para ver los items.");
                return;
            }
        } else {
            const faltanBase = !filtros.tipo || !filtros.categoria || !filtros.sub_cat_1 || !filtros.sub_cat_2;
            if (faltanBase) {
                renderItemsTable([], "Selecciona todos los filtros para ver los items.");
                return;
            }
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
        const precioColumnHidden = isTecnico;

        if (itemsResultCount) {
            itemsResultCount.textContent = `${rows.length} resultado${rows.length === 1 ? "" : "s"}`;
        }

        if (!rows.length) {
            itemsTableBody.innerHTML = `
                <tr>
                    <td colspan="${precioColumnHidden ? 3 : 4}" class="text-center text-muted py-4">${emptyMessage}</td>
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
            const precio = Number(item.precio) || 0;
            const itemId = Number(item.id) || Number(item.item_id) || 0;
            const editUrl = itemId > 0 && typeof md5 === "function"
                ? `upd_item_receta.php?hash=${md5(String(itemId))}`
                : "";
            const precioTexto = precio <= 0
                ? `
                    <span class="badge bg-danger precio-cero-label">${monedaSimbolo} ${format2(precio)}</span>
                    ${editUrl ? `<a href="${editUrl}" class="btn btn-sm btn-outline-danger btn-icon ms-1" data-bs-toggle="tooltip" data-bs-title="Editar item"><i class="ti ti-pencil"></i></a>` : ""}
                `
                : `${monedaSimbolo} ${format2(precio)}`;
            const itemPayload = encodeURIComponent(JSON.stringify(item));

            const detalleLinea2 = formatearRutaDetalle([item.marca, item.modelo, item.uni_medida]);

            return `
                <tr data-item-payload="${itemPayload}">
                    <td>
                        <div class="item-title">${itemNombre}</div>
                        ${itemDescripcion ? `<div class="item-subtitle">${itemDescripcion}</div>` : ""}
                        <div class="item-title">${detalleLinea1 || "-"}</div>
                        <div class="item-subtitle">${detalleLinea2 || "-"}</div>
                    </td>
                    <td class="text-center align-middle receta-qty-cell"></td>
                    <td class="text-end ${precioColumnHidden ? "d-none" : ""}">${precioTexto}</td>
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
                    <input type="number" class="qty-input text-dark text-center border-0 bg-body-secondary rounded h-100 fw-semibold" style="width:46px;font-size:12px;" value="1" min="1" max="${MAX_CANTIDAD}" step="1" inputmode="numeric" pattern="[0-9]*">
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

        const precio = Number(item.precio) || 0;

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
            precio,
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
