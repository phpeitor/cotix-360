document.addEventListener("DOMContentLoaded", () => {
    const filterBase = document.getElementById("filterBase");
    const filterGrupo = document.getElementById("filterGrupo");
    const filterClase = document.getElementById("filterClase");
    const filterCategoria = document.getElementById("filterCategoria");
    const filtrosRow = document.getElementById("filtros");
    const filterMd5Input = document.getElementById("filterMd5");
    const urlParams = new URLSearchParams(window.location.search);
    const hashParam = urlParams.get("id");

    const initialSelectState = {
        grupo: getSelectValues(filterGrupo),
        clase: getSelectValues(filterClase),
        categoria: getSelectValues(filterCategoria)
    };

    const selectLabels = {
        grupo: "Grupo Descuento",
        clase: "Clase Producto",
        categoria: "Categoría Producto"
    };

    function getSelectValues(selectEl) {
        if (!selectEl) return [];

        return Array.from(selectEl.options)
            .map(option => option.value)
            .filter(value => String(value).trim() !== "");
    }

    function setSelectOptions(selectEl, values, label) {
        if (!selectEl) return;

        const selectedBefore = selectEl.value;
        const sanitized = [...new Set(values.map(v => String(v).trim()).filter(Boolean))];

        selectEl.innerHTML = `<option value="">-- Todos --</option>`;

        sanitized.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            selectEl.appendChild(option);
        });

        if (sanitized.includes(selectedBefore)) {
            selectEl.value = selectedBefore;
        } else {
            selectEl.value = "";
        }

        selectEl.disabled = sanitized.length === 0;
        if (sanitized.length === 0) {
            selectEl.title = `Sin ${label} para la base seleccionada`;
        } else {
            selectEl.removeAttribute("title");
        }
    }

    function applyInitialDependentSelects() {
        setSelectOptions(filterGrupo, initialSelectState.grupo, selectLabels.grupo);
        setSelectOptions(filterClase, initialSelectState.clase, selectLabels.clase);
        setSelectOptions(filterCategoria, initialSelectState.categoria, selectLabels.categoria);
    }

    async function cargarFiltrosDependientes(baseId) {
        if (!baseId) {
            applyInitialDependentSelects();
            return;
        }

        try {
            const res = await fetch(`controller/get_select_item.php?id=${encodeURIComponent(baseId)}`);
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                throw new Error(data?.message || "No se pudieron cargar los filtros por base");
            }

            const grupos = data.map(item => item.grupo_descuento);
            const clases = data.map(item => item.clase_producto);
            const categorias = data.map(item => item.categoria_producto);

            setSelectOptions(filterGrupo, grupos, selectLabels.grupo);
            setSelectOptions(filterClase, clases, selectLabels.clase);
            setSelectOptions(filterCategoria, categorias, selectLabels.categoria);
        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar filtros por base");
            applyInitialDependentSelects();
        }
    }

    const isMd5 = (val) => /^[a-f0-9]{32}$/i.test(val);
    if (
        (filterMd5Input && isMd5(filterMd5Input.value)) ||
        (hashParam && isMd5(hashParam))
    ) {
        console.log("MD5 detectado, eliminando filtros");
        filtrosRow?.remove();
    }

    if (hashParam && /^[a-f0-9]{32}$/i.test(hashParam)) {
        console.log("Detectado hash MD5 en URL:", hashParam);
        document.getElementById("filterMd5").value = hashParam;
        setTimeout(() => {
            document.getElementById("btn_buscar").click();
        }, 300);
    }

    function loadTable() {
        const md5Value = document.getElementById("filterMd5").value;

        const params = new URLSearchParams({
            base: filterBase.value,
            grupo: filterGrupo.value,
            clase: filterClase.value,
            categoria: filterCategoria.value
        });

        if (md5Value) params.append("md5_id", md5Value);

        grid.updateConfig({
            server: {
                url: "controller/table_item.php?" + params.toString(),
                method: "GET",
                then: data => data
            }
        }).forceRender();
    }

    document.getElementById("btn_buscar").addEventListener("click", loadTable);

    filterBase?.addEventListener("change", async () => {
        await cargarFiltrosDependientes(filterBase.value);
    });

    const grid = new gridjs.Grid({
        columns: [
            {
                id: "id",
                name: "ID",
                width: "70px",
                formatter: (cell) => gridjs.html(`<span class="fw-semibold">${cell}</span>`)
            },
            {
                id: "modelo",
                name: "Modelo",
                width: "120px"
            },
            {
                id: "descripcion",
                name: "Descripción",
                width: "200px"
            },
            {
                id: "moneda",
                hidden: true
            },
            {
                id: "precio_unitario",
                name: "Precio",
                width: "80px",
                formatter: (cell, row) => {
                    const moneda = row.cells[3].data;
                    return gridjs.html(`<span>${cell} ${moneda}</span>`);
                }
            },
            {
                id: "grupo_descuento",
                name: "Grupo",
                width: "80px"
            },
            {
                id: "clase_producto",
                name: "Clase",
                width: "80px"
            },
            {
                id: "categoria_producto",
                name: "Categoría",
                width: "100px"
            },
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
                    const estado = String(cells[8].data).trim(); 
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
            url: "controller/table_item.php",
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

        const btnEdit = e.target.closest(".btn-edit");
        if (btnEdit) {
            const idHash = btnEdit.getAttribute("data-hash");
            console.log("Editar ID Hash:", idHash);
            if (!idHash) return;
            window.location.href = "upd_item.php?hash=" + idHash;
            return;
        }

        const btnDelete = e.target.closest(".btn-delete");
        if (btnDelete) {
            const id = btnDelete.dataset.id;
            if (!id) return;

            const confirmed = await new Promise((resolve) => {
                alertify.confirm(
                    "Confirmar eliminación",
                    "¿Seguro que deseas eliminar el registro " + id + "?",
                    function () { resolve(true); },    
                    function () { resolve(false); }   
                );
            });

            if (!confirmed) return;

            try {
                const res = await fetch("controller/delete_item.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: "id=" + encodeURIComponent(id)
                });

                const json = await res.json();

                if (json.ok) {
                    alertify.success("✅ Registro suspendido correctamente");

                    grid.updateConfig({
                        server: {
                            url: "controller/table_item.php",
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