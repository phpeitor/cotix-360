document.addEventListener("DOMContentLoaded", () => {
    const tipoSelect = document.getElementById("filterTipo");
    const categoriaSelect = document.getElementById("filterCategoria");
    const subCat1Select = document.getElementById("filterSubCategoria1");
    const subCat2Select = document.getElementById("filterSubCategoria2");

    if (!tipoSelect || !categoriaSelect || !subCat1Select || !subCat2Select) {
        return;
    }

    const initialState = {
        categoria: collectOptions(categoriaSelect),
        subCat1: collectOptions(subCat1Select),
        subCat2: collectOptions(subCat2Select),
    };

    function collectOptions(selectEl) {
        return Array.from(selectEl.options)
            .map(opt => String(opt.value || "").trim())
            .filter(Boolean);
    }

    function setOptions(selectEl, values, placeholder = "-- Seleccione --") {
        const selectedBefore = selectEl.value;
        const uniqueValues = [...new Set(values.map(v => String(v || "").trim()).filter(Boolean))];

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

        selectEl.disabled = uniqueValues.length === 0;
    }

    function resetToInitial() {
        setOptions(categoriaSelect, initialState.categoria, "-- Seleccione --");
        setOptions(subCat1Select, initialState.subCat1, "-- Seleccione --");
        setOptions(subCat2Select, initialState.subCat2, "-- Seleccione --");
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

    async function loadCategoriasByTipo() {
        const tipo = tipoSelect.value || "";

        if (!tipo) {
            resetToInitial();
            return;
        }

        const categorias = await fetchRecetaOpciones({ nivel: "categorias", tipo });
        setOptions(categoriaSelect, extractValues(categorias, "categoria"), "-- Seleccione --");

        const subcat1 = await fetchRecetaOpciones({ nivel: "subcat1", tipo });
        setOptions(subCat1Select, extractValues(subcat1, "sub_cat_1"), "-- Seleccione --");

        const subcat2 = await fetchRecetaOpciones({ nivel: "subcat2", tipo });
        setOptions(subCat2Select, extractValues(subcat2, "sub_cat_2"), "-- Seleccione --");
    }

    async function loadSubCat1ByTipoCategoria() {
        const tipo = tipoSelect.value || "";
        const categoria = categoriaSelect.value || "";

        if (!tipo) {
            setOptions(subCat1Select, initialState.subCat1, "-- Seleccione --");
            setOptions(subCat2Select, initialState.subCat2, "-- Seleccione --");
            return;
        }

        const subcat1 = await fetchRecetaOpciones({ nivel: "subcat1", tipo, categoria });
        setOptions(subCat1Select, extractValues(subcat1, "sub_cat_1"), "-- Seleccione --");

        const subcat2 = await fetchRecetaOpciones({ nivel: "subcat2", tipo, categoria });
        setOptions(subCat2Select, extractValues(subcat2, "sub_cat_2"), "-- Seleccione --");
    }

    async function loadSubCat2ByTipoCategoriaSubCat1() {
        const tipo = tipoSelect.value || "";
        const categoria = categoriaSelect.value || "";
        const sub_cat_1 = subCat1Select.value || "";

        if (!tipo) {
            setOptions(subCat2Select, initialState.subCat2, "-- Seleccione --");
            return;
        }

        const subcat2 = await fetchRecetaOpciones({ nivel: "subcat2", tipo, categoria, sub_cat_1 });
        setOptions(subCat2Select, extractValues(subcat2, "sub_cat_2"), "-- Seleccione --");
    }

    tipoSelect.addEventListener("change", async () => {
        try {
            await loadCategoriasByTipo();
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar categorías");
        }
    });

    categoriaSelect.addEventListener("change", async () => {
        try {
            await loadSubCat1ByTipoCategoria();
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar sub categoría 1");
        }
    });

    subCat1Select.addEventListener("change", async () => {
        try {
            await loadSubCat2ByTipoCategoriaSubCat1();
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar sub categoría 2");
        }
    });
});
