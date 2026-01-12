document.addEventListener("DOMContentLoaded", () => {

    const grid = new gridjs.Grid({
        columns: [
            {
                id: "IDPERSONAL",
                name: "ID",
                width: "80px",
                formatter: (cell) => gridjs.html(`<span class="fw-semibold">${cell}</span>`)
            },
            {
                id: "CARGO",
                name: "Cargo",
                hidden: true
            },
            {
                id: "nombre_completo",
                name: "Nombre Completo",
                width: "220px",
                formatter: (cell, row) => {

                    const cargo = row.cells[1].data; 
                    const badge = cargo == 1
                        ? `<span class="badge badge-outline-dark rounded-pill">Admin</span>`
                        : `<span class="badge badge-outline-secondary rounded-pill">Gestor</span>`;

                    return gridjs.html(`
                            <span>${cell}</span>
                            ${badge}
                    `);
                }
            },
            {
                id: "DOC",
                name: "Documento",
                width: "120px"
            },
            {
                id: "SEXO",
                name: "Sexo",
                width: "180px",
                formatter: (cell) => {
                    const v = String(cell ?? "").trim();
                    if (v === "1") {
                        return gridjs.html(`
                            <div style="display:flex;align-items:center;gap:.5rem;">
                                <img src="assets/images/users/avatar-2.jpg"
                                    style="height:40px;width:40px;border-radius:9999px;" />
                                <span class="badge badge-outline-info">Masculino</span>
                            </div>
                        `);
                    }
                    if (v === "2") {
                        return gridjs.html(`
                            <div style="display:flex;align-items:center;gap:.5rem;">
                                <img src="assets/images/users/avatar-10.jpg"
                                    style="height:40px;width:40px;border-radius:9999px;" />
                                <span class="badge badge-outline-warning">Femenino</span>
                            </div>
                        `);
                    }
                    return gridjs.html(`<span class="badge badge-outline-dark">Otro</span>`);
                }
            },
            {
                id: "IDESTADO",
                name: "Estado",
                width: "120px",
                formatter: (cell) => {
                    const v = String(cell ?? "").trim();
                    if (v === "1") {
                        return gridjs.html(`<span class="badge bg-success">ACTIVE</span>`);
                    }
                    if (v === "0") {
                        return gridjs.html(`<span class="badge bg-danger">SUSPENDED</span>`);
                    }
                    return gridjs.html(`<span class="badge bg-dark text-light">NDF</span>`);
                }
            },
            {
                id: "fecha_registro",
                name: "Fec. Registro",
                width: "180px"
            },
            {
                id: "acciones",
                name: "Opciones",
                width: "160px",
                sort: false,
                formatter: (_, row) => {
                    const cells = row.cells;

                    const id = cells[0].data;
                    const estado = String(cells[5].data).trim();
                    const idHash = md5(String(id));

                    const btnDelete = estado === "1"
                    ? `
                        <button class="btn-delete btn btn-soft-danger btn-icon" data-id="${id}">
                            <i class="ti ti-trash-x"></i>
                        </button>
                    `
                    : ``;

                    return gridjs.html(`
                        <div style="gap:.5rem;justify-content:center;">
                            <button class="btn-edit btn btn-outline-primary btn-icon" data-hash="${idHash}">
                                <i class="ti ti-pencil-bolt"></i>
                            </button>
                             ${btnDelete}
                        </div>
                    `);
                }
            }
        ],

        server: {
            url: "controller/table_usuario.php",
            method: "GET",
            then: (data) => data 
        },

        search: true,
        sort: true,
        pagination: {
            enabled: true,
            limit: 10
        }
    })
    .render(document.getElementById("table-gridjs"));

    document.addEventListener("click", async (e) => {

        // --- BOTÓN EDITAR ---
        const btnEdit = e.target.closest(".btn-edit");
        if (btnEdit) {
            const idHash = btnEdit.getAttribute("data-hash");
            console.log("Editar ID Hash:", idHash);
            if (!idHash) return;
            window.location.href = "upd_usuario.php?hash=" + idHash;
            return;
        }

        // --- BOTÓN ELIMINAR ---
        const btnDelete = e.target.closest(".btn-delete");
        if (btnDelete) {
            const id = btnDelete.dataset.id;
            if (!id) return;

            const confirmed = await new Promise((resolve) => {
                alertify.confirm(
                    "Confirmar eliminación",
                    "¿Seguro que deseas eliminar el registro " + id + "?",
                    function () { resolve(true); },    // OK
                    function () { resolve(false); }    // Cancelar
                );
            });

            if (!confirmed) return;

            try {
                const res = await fetch("controller/delete_usuario.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: "id=" + encodeURIComponent(id)
                });

                const json = await res.json();

                if (json.ok) {
                    alertify.success("✅ Registro suspendido correctamente");

                    grid.updateConfig({
                        server: {
                            url: "controller/table_usuario.php",
                            method: "GET",
                            then: (data) => data
                        }
                    }).forceRender();

                } else {
                    alertify.error("❌ Error al suspender: " + json.message);
                }

            } catch (err) {
                console.error(err);
                alertify.error("❌ Error de red al suspender");
            }

            return;
        }

    });
});