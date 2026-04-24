document.addEventListener("DOMContentLoaded", () => {
    const filterTipo = document.getElementById("filterTipo");
    const filterCategoria = document.getElementById("filterCategoria");
    const filterSubCategoria1 = document.getElementById("filterSubCategoria1");
    const filterSubCategoria2 = document.getElementById("filterSubCategoria2");
    const btnBuscar = document.getElementById("btn_buscar");
    const tableEl = document.getElementById("table-gridjs");

    function collectOptions(selectEl) {
        return Array.from(selectEl?.options || [])
            .map(opt => opt.value)
            .filter(value => String(value).trim() !== "");
    }

    const initialState = {
        categoria: collectOptions(filterCategoria),
        subCat1: collectOptions(filterSubCategoria1),
        subCat2: collectOptions(filterSubCategoria2)
    };

    function setOptions(selectEl, values, placeholder = "-- Todas --") {
        if (!selectEl) return;

        const selectedBefore = selectEl.value;
        const uniqueValues = [...new Set(values.map(v => String(v).trim()).filter(Boolean))];

        selectEl.innerHTML = `<option value="">${placeholder}</option>`;

        uniqueValues.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            selectEl.appendChild(option);
        });

        if (uniqueValues.includes(selectedBefore)) {
            selectEl.value = selectedBefore;
        } else {
            selectEl.value = "";
        }
    }

    function extractValues(rows, key) {
        return rows
            .map(row => row?.[key])
            .filter(value => value !== null && value !== undefined && String(value).trim() !== "");
    }

    async function fetchRecetaOpciones(params) {
        const query = new URLSearchParams(params);
        const res = await fetch(`controller/get_receta_item.php?${query.toString()}`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
            throw new Error(data?.message || "No se pudieron cargar opciones");
        }

        return data;
    }

    async function cargarCategoriasDependientes() {
        const tipo = filterTipo?.value || "";

        if (!tipo) {
            setOptions(filterCategoria, initialState.categoria, "-- Todos --");
            setOptions(filterSubCategoria1, initialState.subCat1, "-- Todas --");
            setOptions(filterSubCategoria2, initialState.subCat2, "-- Todas --");
            return;
        }

        const categorias = await fetchRecetaOpciones({ nivel: "categorias", tipo });
        setOptions(filterCategoria, extractValues(categorias, "categoria"), "-- Todos --");

        const subcat1 = await fetchRecetaOpciones({ nivel: "subcat1", tipo });
        setOptions(filterSubCategoria1, extractValues(subcat1, "sub_cat_1"), "-- Todas --");

        const subcat2 = await fetchRecetaOpciones({ nivel: "subcat2", tipo });
        setOptions(filterSubCategoria2, extractValues(subcat2, "sub_cat_2"), "-- Todas --");
    }

    async function cargarSubCategorias1Dependientes() {
        const tipo = filterTipo?.value || "";
        const categoria = filterCategoria?.value || "";

        if (!tipo) {
            setOptions(filterSubCategoria1, initialState.subCat1, "-- Todas --");
            setOptions(filterSubCategoria2, initialState.subCat2, "-- Todas --");
            return;
        }

        const subcat1 = await fetchRecetaOpciones({ nivel: "subcat1", tipo, categoria });
        setOptions(filterSubCategoria1, extractValues(subcat1, "sub_cat_1"), "-- Todas --");

        const subcat2 = await fetchRecetaOpciones({ nivel: "subcat2", tipo, categoria });
        setOptions(filterSubCategoria2, extractValues(subcat2, "sub_cat_2"), "-- Todas --");
    }

    async function cargarSubCategorias2Dependientes() {
        const tipo = filterTipo?.value || "";
        const categoria = filterCategoria?.value || "";
        const sub_cat_1 = filterSubCategoria1?.value || "";

        if (!tipo) {
            setOptions(filterSubCategoria2, initialState.subCat2, "-- Todas --");
            return;
        }

        const subcat2 = await fetchRecetaOpciones({ nivel: "subcat2", tipo, categoria, sub_cat_1 });
        setOptions(filterSubCategoria2, extractValues(subcat2, "sub_cat_2"), "-- Todas --");
    }

    function getFiltros() {
        return {
            tipo: filterTipo?.value || "",
            categoria: filterCategoria?.value || "",
            sub_cat_1: filterSubCategoria1?.value || "",
            sub_cat_2: filterSubCategoria2?.value || ""
        };
    }

    const grid = new gridjs.Grid({
        columns: [
            { id: "id", name: "ID", width: "70px" },
            {
                id: "nombre",
                name: "Nombre Descripción",
                width: "220px",
                formatter: (cell, row) => {
                    const nombre = String(cell || "").trim();
                    const descripcion = String(row?.cells?.[2]?.data || "").trim();

                    if (!descripcion) {
                        return gridjs.html(`<div>${nombre}</div>`);
                    }

                    return gridjs.html(`
                        <div>
                            <div class="fw-semibold">${nombre}</div>
                            <div class="text-muted">${descripcion}</div>
                        </div>
                    `);
                }
            },
            { id: "descripcion", hidden: true },
            {
                id: "categoria",
                name: "Categoría | SubCat1 | SubCat2",
                width: "260px",
                formatter: (cell, row) => {
                    const categoria = String(cell || "").trim();
                    const subCat1 = String(row?.cells?.[4]?.data || "").trim();
                    const subCat2 = String(row?.cells?.[5]?.data || "").trim();
                    const parts = [categoria, subCat1, subCat2].filter(Boolean);

                    return parts.join(" | ") || "-";
                }
            },
            { id: "sub_cat_1", hidden: true },
            { id: "sub_cat_2", hidden: true },
            { id: "marca", name: "Marca", width: "100px" },
            { id: "modelo", name: "Modelo", width: "100px" },
            { id: "uni_medida", name: "Uni. Medida", width: "100px" },
            { id: "tipo", name: "Tipo", width: "110px" },
            {
                id: "precio",
                name: "Precio",
                width: "100px",
                formatter: (cell, row) => {
                    const moneda = row?.cells?.[11]?.data;
                    const simbolo = moneda === "DOLLAR" ? "$" : "S/.";
                    return gridjs.html(`${simbolo} ${Number(cell || 0).toFixed(2)}`);
                }
            },
            { id: "moneda", hidden: true },
            {
                id: "estado",
                name: "Estado",
                width: "80px",
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
                id: "acciones",
                name: "Opciones",
                width: "90px",
                sort: false,
                formatter: (_, row) => {
                    const cells = row.cells;

                    const id = cells[0].data;
                    const estado = String(cells[12].data).trim(); 
                    const idHash = md5(String(id));
                    console.log("ID:", id, "Estado:", estado, "Hash:", idHash);

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
        data: [],
        search: true,
        sort: true,
        pagination: {
            enabled: true,
            limit: 10
        }
    }).render(tableEl);

    async function cargarTabla() {
        try {
            const filtros = getFiltros();
            const rows = await fetchRecetaOpciones({ nivel: "items", ...filtros });
            grid.updateConfig({ data: rows }).forceRender();
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar items receta");
            grid.updateConfig({ data: [] }).forceRender();
        }
    }

    filterTipo?.addEventListener("change", async () => {
        try {
            await cargarCategoriasDependientes();
        } catch (error) {
            console.error(error);
            alertify.error("Error al filtrar categorías");
        }
    });

    filterCategoria?.addEventListener("change", async () => {
        try {
            await cargarSubCategorias1Dependientes();
        } catch (error) {
            console.error(error);
            alertify.error("Error al filtrar sub categorías 1");
        }
    });

    filterSubCategoria1?.addEventListener("change", async () => {
        try {
            await cargarSubCategorias2Dependientes();
        } catch (error) {
            console.error(error);
            alertify.error("Error al filtrar sub categorías 2");
        }
    });

    btnBuscar?.addEventListener("click", (event) => {
        event.preventDefault();
        cargarTabla();
    });

    cargarTabla();

    document.addEventListener("click", async (e) => {

        // --- BOTÓN EDITAR ---
        const btnEdit = e.target.closest(".btn-edit");
        if (btnEdit) {
            const idHash = btnEdit.getAttribute("data-hash");
            console.log("Editar ID Hash:", idHash);
            if (!idHash) return;
            window.location.href = "upd_item_receta.php?hash=" + idHash;
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
                const res = await fetch("controller/delete_item_receta.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: "id=" + encodeURIComponent(id)
                });

                const json = await res.json();

                if (json.ok) {
                    alertify.success("✅ Registro suspendido correctamente");

                    grid.updateConfig({
                        server: {
                            url: "",
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