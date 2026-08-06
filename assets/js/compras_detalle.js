document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const tbody = document.getElementById("comprasDetalleBody");

    const fields = {
        id: document.getElementById("compra_id"),
        nombre: document.getElementById("compra_nombre_display"),
        usuario: document.getElementById("usuario"),
        aprobador: document.getElementById("usuario_aprobador"),
        estado: document.getElementById("estado"),
        fecha: document.getElementById("fecha"),
        totalItem: document.getElementById("total_item"),
        clienteRuc: document.getElementById("clienteRuc"),
        clienteRazonSocial: document.getElementById("clienteRazonSocial"),
        clienteDireccion: document.getElementById("clienteDireccion"),
        clienteNombreCompleto: document.getElementById("clienteNombreCompleto"),
        clienteCorreo: document.getElementById("clienteCorreo"),
        clienteCelular: document.getElementById("clienteCelular")
    };

    initTooltips();

    if (!hash) {
        alertify.error("ID inválido");
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">ID inválido</td></tr>`;
        return;
    }

    fetch(`controller/compras/get_compra.php?id=${encodeURIComponent(hash)}`)
        .then(async response => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.success === false) {
                throw new Error(data.message || "No se pudo cargar la compra");
            }
            return data;
        })
        .then(data => {
            renderHeader(data.compra || {});
            renderDetalle(data.detalle || []);
        })
        .catch(error => {
            alertify.error(error.message || "No se pudo cargar la compra");
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${escapeHtml(error.message || "Error")}</td></tr>`;
        });

    function initTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"], .btn-tooltip').forEach(el => {
            if (!bootstrap.Tooltip.getInstance(el)) {
                new bootstrap.Tooltip(el);
            }
        });
    }

    function renderHeader(compra) {
        fields.id.textContent = compra.id || "-";
        fields.nombre.textContent = compra.nombre || "Sin nombre";
        fields.usuario.textContent = compra.usuario || "-";
        fields.aprobador.textContent = compra.usuario_aprobador || "-";
        fields.estado.innerHTML = renderEstado(compra.estado || "Pendiente");
        fields.fecha.textContent = compra.created_at || "-";
        fields.clienteRuc.textContent = compra.cliente_ruc || "-";
        fields.clienteRazonSocial.textContent = compra.cliente_razon_social_empresa || "-";
        fields.clienteDireccion.textContent = compra.cliente_direccion || "-";
        fields.clienteNombreCompleto.textContent = compra.cliente_nombre_completo || "-";
        fields.clienteCorreo.textContent = compra.cliente_correo || "-";
        fields.clienteCelular.textContent = compra.cliente_celular || "-";
    }

    function renderDetalle(detalle) {
        fields.totalItem.textContent = detalle.reduce((sum, item) => sum + Number(item.cantidad || 0), 0);

        if (!detalle.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No hay items en compras</td></tr>`;
            return;
        }

        tbody.innerHTML = detalle.map(item => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const total = cantidad * precio;

            return `
                <tr>
                    <td>
                        <div class="fw-medium">${escapeHtml(item.nombre || "-")}</div>
                        <small class="text-muted">${escapeHtml(item.marca || "")} ${escapeHtml(item.modelo || "")}</small>
                    </td>
                    <td>
                        <div>${escapeHtml(item.descripcion || "-")}</div>
                        <small class="text-muted">${escapeHtml(item.categoria || "")} / ${escapeHtml(item.sub_cat_1 || "")} / ${escapeHtml(item.sub_cat_2 || "")}</small>
                    </td>
                    <td>${escapeHtml(item.tipo || "-")}</td>
                    <td class="text-center">${cantidad}</td>
                    <td class="text-end">${escapeHtml(item.moneda || "")} ${formatNumber(precio)}</td>
                    <td class="text-end">${escapeHtml(item.moneda || "")} ${formatNumber(total)}</td>
                </tr>
            `;
        }).join("");
    }

    function renderEstado(value) {
        const estado = String(value || "Pendiente").trim();
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

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
});
