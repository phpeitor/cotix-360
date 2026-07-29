document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const tbody = document.getElementById("ingenieriaDetalleBody");

    const fields = {
        id: document.getElementById("ingenieria_id"),
        nombre: document.getElementById("receta_nombre_display"),
        usuario: document.getElementById("usuario"),
        aprobador: document.getElementById("usuario_aprobador"),
        estado: document.getElementById("estado"),
        fecha: document.getElementById("fecha"),
        totalItem: document.getElementById("total_item"),
        totalSoles: document.getElementById("total_soles"),
        totalDolares: document.getElementById("total_dolares"),
        tipoCambio: document.getElementById("tipo_cambio"),
        clienteRazon: document.getElementById("cliente_razon"),
        clienteRuc: document.getElementById("cliente_ruc"),
        clienteDireccion: document.getElementById("cliente_direccion"),
        clienteContacto: document.getElementById("cliente_contacto"),
        clienteCorreo: document.getElementById("cliente_correo"),
        clienteCelular: document.getElementById("cliente_celular")
    };

    if (!hash) {
        alertify.error("ID inválido");
        return;
    }

    loadIngenieria();

    async function loadIngenieria() {
        try {
            const res = await fetch(`controller/get_ingenieria.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();

            if (!res.ok || data.error) {
                alertify.error(data.message || "No se pudo cargar la receta de ingeniería");
                return;
            }

            renderHeader(data.receta || {}, data.cliente || null);
            renderDetalle(Array.isArray(data.detalle) ? data.detalle : []);
        } catch (error) {
            console.error(error);
            alertify.error("Error de conexión al cargar ingeniería");
        }
    }

    function setText(el, value) {
        if (el) el.textContent = value || "-";
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
        const num = Number(value || 0);
        return num.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function renderHeader(receta, cliente) {
        setText(fields.id, receta.id);
        setText(fields.nombre, receta.nombre || "-");
        setText(fields.usuario, receta.usuario);
        setText(fields.aprobador, receta.usuario_aprobador);
        setText(fields.estado, receta.estado || "GANADO");
        setText(fields.fecha, receta.created_at);
        setText(fields.tipoCambio, Number(receta.tipo_cambio || 0).toFixed(3));

        setText(fields.clienteRazon, cliente?.razon_social_empresa);
        setText(fields.clienteRuc, cliente?.ruc);
        setText(fields.clienteDireccion, cliente?.direccion);
        setText(fields.clienteContacto, cliente?.nombre_completo);
        setText(fields.clienteCorreo, cliente?.correo);
        setText(fields.clienteCelular, cliente?.celular);
    }

    function renderDetalle(detalle) {
        let totalSoles = 0;
        let totalDolares = 0;
        let totalItems = 0;

        tbody.innerHTML = detalle.map(item => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const total = cantidad * precio;
            const moneda = String(item.moneda || "").toUpperCase();
            const simbolo = moneda === "DOLLAR" ? "$" : "S/.";

            totalItems += cantidad;
            if (moneda === "DOLLAR") {
                totalDolares += total;
            } else {
                totalSoles += total;
            }

            const detalleLinea = [item.categoria, item.sub_cat_1, item.sub_cat_2].filter(Boolean).join(" / ");
            const modeloLinea = [item.marca, item.modelo, item.uni_medida].filter(Boolean).join(" / ");

            return `
                <tr>
                    <td>
                        <h5 class="fs-14 mb-1 fw-normal">${escapeHtml(item.nombre || "-")}</h5>
                        <span class="text-muted fs-12">${escapeHtml(modeloLinea || "-")}</span>
                    </td>
                    <td>
                        <span class="text-muted fs-12">${escapeHtml(detalleLinea || "-")}</span>
                        <h5 class="fs-14 mt-1 fw-normal">${escapeHtml(item.descripcion || "-")}</h5>
                    </td>
                    <td>${escapeHtml(item.tipo || "-")}</td>
                    <td class="text-center">${cantidad}</td>
                    <td class="text-end">${simbolo} ${money(precio)}</td>
                    <td class="text-end fw-semibold">${simbolo} ${money(total)}</td>
                </tr>
            `;
        }).join("");

        if (!detalle.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Sin detalle registrado</td></tr>`;
        }

        setText(fields.totalItem, String(totalItems));
        setText(fields.totalSoles, money(totalSoles));
        setText(fields.totalDolares, money(totalDolares));
    }
});
