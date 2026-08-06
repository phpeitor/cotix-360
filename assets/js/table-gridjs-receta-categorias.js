document.addEventListener("DOMContentLoaded", () => {
    const tableEl = document.getElementById("table-gridjs");
    const btnNuevo = document.getElementById("btnNuevo");
    const btnOrdenSubCat = document.getElementById("btnOrdenSubCat");
    const ordenSubCatModalEl = document.getElementById("ordenSubCatModal");
    const ordenSubCatContent = document.getElementById("ordenSubCatContent");
    const btnGuardarOrdenSubCat = document.getElementById("btnGuardarOrdenSubCat");
    const modalEl = document.getElementById("categoriaModal");
    const modalTitle = document.getElementById("categoriaModalTitle");
    const form = document.getElementById("categoriaForm");
    const estadoWrap = document.getElementById("estadoWrap");
    const estadoSwitch = document.getElementById("estadoSwitch");
    const modal = new bootstrap.Modal(modalEl);
    const ordenSubCatModal = ordenSubCatModalEl ? new bootstrap.Modal(ordenSubCatModalEl) : null;

    const endpoint = "controller/receta_item_categoria.php";
    let currentRows = [];
    let ordenRows = [];

    function estadoBadge(value) {
        return String(value) === "1"
            ? `<span class="badge bg-success">ACTIVE</span>`
            : `<span class="badge bg-danger">SUSPENDED</span>`;
    }

    function fillForm(row = null) {
        form.reset();
        form.classList.remove("was-validated");
        document.getElementById("categoriaId").value = row?.id || "";
        document.getElementById("tipo").value = row?.tipo || "";
        document.getElementById("categoria").value = row?.categoria || "";
        document.getElementById("sub_cat_1").value = row?.sub_cat_1 || "";
        document.getElementById("sub_cat_2").value = row?.sub_cat_2 || "";
        estadoWrap?.classList.toggle("d-none", !row);
        if (estadoSwitch) {
            estadoSwitch.checked = String(row?.estado ?? 1) === "1";
        }
        modalTitle.textContent = row ? "Modificar Categoría" : "Nueva Categoría";
    }

    function normalize(value) {
        return String(value || "").trim().toUpperCase();
    }

    function hasDuplicate(formData) {
        const id = normalize(formData.get("id"));
        const tipo = normalize(formData.get("tipo"));
        const categoria = normalize(formData.get("categoria"));
        const subCat1 = normalize(formData.get("sub_cat_1"));
        const subCat2 = normalize(formData.get("sub_cat_2"));

        return currentRows.some(row => {
            return normalize(row.id) !== id
                && normalize(row.tipo) === tipo
                && normalize(row.categoria) === categoria
                && normalize(row.sub_cat_1) === subCat1
                && normalize(row.sub_cat_2) === subCat2;
        });
    }

    const grid = new gridjs.Grid({
        columns: [
            { id: "id", name: "ID", width: "80px" },
            { id: "tipo", name: "Tipo", width: "120px" },
            { id: "categoria", name: "Categoría", width: "180px" },
            { id: "sub_cat_1", name: "Sub Categoría 1", width: "180px" },
            { id: "sub_cat_2", name: "Sub Categoría 2", width: "180px" },
            {
                id: "estado",
                name: "Estado",
                width: "100px",
                formatter: (cell) => gridjs.html(estadoBadge(cell))
            },
            { id: "created_at", name: "Fec. Registro", width: "150px" },
            { id: "updated_at", hidden: true },
            {
                id: "acciones",
                name: "Opciones",
                sort: false,
                width: "120px",
                formatter: (_, row) => {
                    const id = row.cells[0].data;
                    const estado = String(row.cells[5].data);
                    const deleteBtn = estado === "1"
                        ? `<button class="btn-delete btn btn-soft-danger btn-icon" data-id="${id}"><i class="ti ti-trash-x"></i></button>`
                        : "";

                    return gridjs.html(`
                        <div style="gap:.5rem;justify-content:center;">
                            <button class="btn-edit btn btn-outline-primary btn-icon" data-id="${id}">
                                <i class="ti ti-pencil-bolt"></i>
                            </button>
                            ${deleteBtn}
                        </div>
                    `);
                }
            }
        ],
        server: {
            url: `${endpoint}?action=list`,
            method: "GET",
            then: data => {
                currentRows = Array.isArray(data) ? data : [];
                return currentRows;
            }
        },
        search: true,
        sort: true,
        pagination: { enabled: true, limit: 10 }
    }).render(tableEl);

    function reloadGrid() {
        grid.updateConfig({
            server: {
                url: `${endpoint}?action=list`,
                method: "GET",
                then: data => {
                    currentRows = Array.isArray(data) ? data : [];
                    return currentRows;
                }
            }
        }).forceRender();
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function groupOrdenRows(rows) {
        return rows.reduce((groups, row) => {
            const tipo = String(row.tipo || "SIN TIPO").trim() || "SIN TIPO";
            if (!groups[tipo]) groups[tipo] = [];
            groups[tipo].push(row);
            return groups;
        }, {});
    }

    function renderOrdenSubCat(rows) {
        if (!ordenSubCatContent) return;

        const groups = groupOrdenRows(rows);
        const html = Object.entries(groups).map(([tipo, items]) => `
            <div class="col-lg-6">
                <div class="card border h-100 mb-0">
                    <div class="card-header bg-light py-2">
                        <h6 class="mb-0 text-uppercase">${escapeHtml(tipo)}</h6>
                    </div>
                    <div class="card-body">
                        <div class="subcat-order-list" data-tipo="${escapeHtml(tipo)}">
                            ${items.map((item, idx) => `
                                <div class="subcat-order-item" draggable="true" data-tipo="${escapeHtml(item.tipo)}" data-subcat="${escapeHtml(item.sub_cat_1)}">
                                    <span class="subcat-order-handle"><i class="ti ti-grip-vertical"></i></span>
                                    <span class="badge bg-primary-subtle text-primary order-number">${idx + 1}</span>
                                    <span class="fw-semibold flex-grow-1">${escapeHtml(item.sub_cat_1)}</span>
                                    <div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-light btn-order-up" title="Subir"><i class="ti ti-arrow-up"></i></button>
                                        <button type="button" class="btn btn-light btn-order-down" title="Bajar"><i class="ti ti-arrow-down"></i></button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `).join("");

        ordenSubCatContent.innerHTML = html || '<div class="col-12 text-center text-muted py-4">No hay sub categorías para ordenar.</div>';
        refreshOrderNumbers();
    }

    function refreshOrderNumbers() {
        document.querySelectorAll(".subcat-order-list").forEach(list => {
            list.querySelectorAll(".subcat-order-item").forEach((item, idx) => {
                const number = item.querySelector(".order-number");
                if (number) number.textContent = String(idx + 1);
            });
        });
    }

    async function cargarOrdenSubCat() {
        if (!ordenSubCatContent) return;
        ordenSubCatContent.innerHTML = '<div class="col-12 text-center text-muted py-4">Cargando orden...</div>';

        const res = await fetch(`${endpoint}?action=order_list`);
        const json = await res.json();

        if (!res.ok || !Array.isArray(json)) {
            throw new Error(json.message || "No se pudo cargar el orden");
        }

        ordenRows = json;
        renderOrdenSubCat(ordenRows);
    }

    function moveOrderItem(item, direction) {
        const sibling = direction === "up" ? item.previousElementSibling : item.nextElementSibling;
        if (!sibling) return;

        if (direction === "up") {
            item.parentElement.insertBefore(item, sibling);
        } else {
            item.parentElement.insertBefore(sibling, item);
        }

        refreshOrderNumbers();
    }

    function getOrdenPayload() {
        const payload = [];
        document.querySelectorAll(".subcat-order-list").forEach(list => {
            list.querySelectorAll(".subcat-order-item").forEach((item, idx) => {
                payload.push({
                    tipo: item.dataset.tipo || "",
                    sub_cat_1: item.dataset.subcat || "",
                    orden: idx + 1,
                });
            });
        });
        return payload;
    }

    btnNuevo?.addEventListener("click", () => {
        fillForm();
        modal.show();
    });

    btnOrdenSubCat?.addEventListener("click", async () => {
        try {
            ordenSubCatModal?.show();
            await cargarOrdenSubCat();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al cargar el orden");
        }
    });

    btnGuardarOrdenSubCat?.addEventListener("click", async () => {
        const payload = getOrdenPayload();
        if (!payload.length) {
            alertify.error("No hay sub categorías para guardar");
            return;
        }

        btnGuardarOrdenSubCat.disabled = true;
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ action: "order_save", orden: JSON.stringify(payload) }).toString()
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudo guardar el orden");
            }

            alertify.success(json.message || "Orden guardado correctamente");
            ordenSubCatModal?.hide();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al guardar el orden");
        } finally {
            btnGuardarOrdenSubCat.disabled = false;
        }
    });

    ordenSubCatContent?.addEventListener("click", (event) => {
        const item = event.target.closest(".subcat-order-item");
        if (!item) return;

        if (event.target.closest(".btn-order-up")) {
            moveOrderItem(item, "up");
            return;
        }

        if (event.target.closest(".btn-order-down")) {
            moveOrderItem(item, "down");
        }
    });

    ordenSubCatContent?.addEventListener("dragstart", (event) => {
        const item = event.target.closest(".subcat-order-item");
        if (!item) return;
        item.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
    });

    ordenSubCatContent?.addEventListener("dragend", (event) => {
        event.target.closest(".subcat-order-item")?.classList.remove("dragging");
        refreshOrderNumbers();
    });

    ordenSubCatContent?.addEventListener("dragover", (event) => {
        const list = event.target.closest(".subcat-order-list");
        const dragging = document.querySelector(".subcat-order-item.dragging");
        if (!list || !dragging || dragging.parentElement !== list) return;

        event.preventDefault();
        const siblings = [...list.querySelectorAll(".subcat-order-item:not(.dragging)")];
        const next = siblings.find(item => event.clientY <= item.getBoundingClientRect().top + item.offsetHeight / 2);
        list.insertBefore(dragging, next || null);
    });

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            return;
        }

        const id = document.getElementById("categoriaId").value;
        const formData = new FormData(form);

        if (hasDuplicate(formData)) {
            alertify.error("Ya existe una categoría con la misma combinación");
            return;
        }

        const params = new URLSearchParams(formData);
        params.append("action", id ? "update" : "create");

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString()
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudo guardar");
            }

            modal.hide();
            alertify.success(json.message || "Guardado correctamente");
            reloadGrid();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al guardar");
        }
    });

    document.addEventListener("click", async (event) => {
        const editBtn = event.target.closest(".btn-edit");
        if (editBtn) {
            const id = editBtn.dataset.id;
            const row = currentRows.find(item => String(item.id) === String(id));
            if (row) {
                fillForm(row);
                modal.show();
            }
            return;
        }

        const deleteBtn = event.target.closest(".btn-delete");
        if (!deleteBtn) return;

        const id = deleteBtn.dataset.id;
        const confirmed = await new Promise(resolve => {
            alertify.confirm(
                "Confirmar eliminación",
                `¿Seguro que deseas suspender la categoría ${id}?`,
                () => resolve(true),
                () => resolve(false)
            );
        });

        if (!confirmed) return;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ action: "delete", id }).toString()
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "No se pudo suspender");
            }

            alertify.success(json.message || "Suspendido correctamente");
            reloadGrid();
        } catch (error) {
            console.error(error);
            alertify.error(error.message || "Error al suspender");
        }
    });
});
