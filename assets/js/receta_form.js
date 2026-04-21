document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("table.table tbody");
    const recetaIdEl = document.getElementById("receta_id");
    const usuarioEl = document.getElementById("usuario");
    const fechaEl = document.getElementById("fecha");
    const estadoEl = document.getElementById("estado");
    const totalItemEl = document.getElementById("total_item");
    const totalSolesEl = document.getElementById("total_soles");
    const totalDolaresEl = document.getElementById("total_dolares");
    const totalPeruEl = document.getElementById("total_peru");
    const tipoCambioEl = document.getElementById("tipo_cambio_sunat");
    const paginationFromEl = document.getElementById("pagination_from");
    const paginationToEl = document.getElementById("pagination_to");
    const paginationWrapper = document.getElementById("pagination_wrapper");
    const paginationList = document.getElementById("pagination_list");
    const PAGE_SIZE = 10;

    let receta = null;
    let detalle = [];
    let currentPage = 1;

    init();

    function init() {
        const hash = getQueryParam("id");
        if (!hash) {
            alertify.error("ID de receta inválido");
            return;
        }

        cargarReceta(hash);
    }

    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    async function cargarReceta(hash) {
        try {
            const res = await fetch(`controller/get_receta.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();

            if (!res.ok || data.error || !data.receta) {
                throw new Error(data.message || "No se pudo cargar la receta");
            }

            receta = data.receta;
            detalle = Array.isArray(data.detalle) ? data.detalle : [];
            currentPage = 1;

            renderHeader();
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
        if (tipoCambioEl) tipoCambioEl.textContent = format3(receta.tipo_cambio ?? 0);

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

    function getMonedaSimbolo(moneda) {
        return moneda === "DOLLAR" ? "$" : "S/.";
    }

    function getSubtotal(item) {
        const cantidad = Number(item.cantidad) || 0;
        const precio = Number(item.precio) || 0;
        return cantidad * precio;
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
        if (totalSolesEl) totalSolesEl.textContent = format2(decimalAdjust('round', totalSoles, '-2'));
        if (totalDolaresEl) totalDolaresEl.textContent = format2(decimalAdjust('round', totalDolares, '-2'));
        if (totalPeruEl) totalPeruEl.textContent = format2(decimalAdjust('round', totalPE, '-2'));
    }

    function getVisibleRows() {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return detalle.slice(startIndex, startIndex + PAGE_SIZE);
    }

    function renderBody() {
        if (!tbody) return;

        const rows = getVisibleRows();

        if (!rows.length) {
            renderEmptyState("No hay items para mostrar.");
            return;
        }

        tbody.innerHTML = rows.map(item => {
            const cantidad = Number(item.cantidad) || 0;
            const precio = Number(item.precio) || 0;
            const subtotal = getSubtotal(item);
            const monedaSimbolo = getMonedaSimbolo(item.moneda);
            const detalleLinea1 = [item.categoria, item.sub_cat_1, item.sub_cat_2].filter(Boolean).join(" / ");
            const detalleLinea2 = [item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ");

            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-md flex-shrink-0 me-2">
                                <span class="avatar-title bg-primary-subtle rounded-circle">
                                    <img src="${getRandomLogo()}" alt="" height="22">
                                </span>
                            </div>
                            <div>
                                <span class="text-muted fs-12">${item.nombre || ""}</span><br>
                                <h5 class="fs-14 mt-1 item-description">${item.descripcion || ""}</h5>
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
                        <span class="fw-semibold">${cantidad}</span>
                    </td>
                    <td class="text-end">
                        <span class="text-muted fs-12">${monedaSimbolo}</span>
                        <h5 class="fs-14 mt-1 fw-normal mb-0">${formatDecimal(precio)}</h5>
                    </td>
                    <td class="text-end">
                        <span class="text-muted fs-12">${monedaSimbolo}</span>
                        <h5 class="fs-14 mt-1 fw-normal mb-0">${formatDecimal(subtotal)}</h5>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function renderEmptyState(message) {
        if (!tbody) return;

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">${message}</td>
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
});