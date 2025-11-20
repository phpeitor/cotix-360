new gridjs.Grid({
    columns: [
        {
            id: "IDPERSONAL",
            name: "ID",
            width: "80px",
            formatter: (cell) => gridjs.html(`<span class="fw-semibold">${cell}</span>`)
        },
        {
            id: "nombre_completo",
            name: "Nombre Completo",
            width: "200px"
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
                const data = row.cells;
                const id = data[0].data;
                const idHash = md5(String(id));

                return gridjs.html(`
                    <div style="gap:.5rem;justify-content:center;">
                        <button class="btn-edit btn btn-outline-primary btn-icon data-hash="${idHash}">
                            <i class="ti ti-pencil-bolt"></i>
                        </button>
                        <button class="btn-delete btn btn-soft-danger btn-icon" data-id="${id}">
                            <i class="ti ti-trash-x"></i>
                        </button>
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
