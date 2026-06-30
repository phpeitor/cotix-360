document.addEventListener("DOMContentLoaded", () => {
    const tableEl = document.getElementById("table-gridjs");
    const btnNuevo = document.getElementById("btnNuevo");
    const modalEl = document.getElementById("categoriaModal");
    const modalTitle = document.getElementById("categoriaModalTitle");
    const form = document.getElementById("categoriaForm");
    const modal = new bootstrap.Modal(modalEl);

    const endpoint = "controller/receta_item_categoria.php";
    let currentRows = [];

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
        document.getElementById("estado").value = String(row?.estado ?? 1);
        modalTitle.textContent = row ? "Modificar Categoría" : "Nueva Categoría";
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

    btnNuevo?.addEventListener("click", () => {
        fillForm();
        modal.show();
    });

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            return;
        }

        const id = document.getElementById("categoriaId").value;
        const params = new URLSearchParams(new FormData(form));
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
