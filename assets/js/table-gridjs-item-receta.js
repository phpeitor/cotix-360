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
                name: "Descripción",
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
            { id: "categoria", name: "Categoría", width: "120px" },
            { id: "sub_cat_1", name: "Sub Cat 1", width: "120px" },
            { id: "sub_cat_2", name: "Sub Cat 2", width: "120px" },
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
            { id: "moneda", hidden: true }
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

});