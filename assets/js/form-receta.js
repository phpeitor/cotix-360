document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");
    const btnAdd = document.getElementById("btnAdd");
    const tbody = document.querySelector("table.table tbody");
    /* ---------------------------------------------------
       CARGAR ITEMS SEGÚN BASE
    --------------------------------------------------- */
    baseSelect.addEventListener("change", async () => {

        const baseId = baseSelect.value;
        const choices = itemSelect.choicesInstance;

        try {
            choices.clearChoices();

            choices.setChoices([{ value: "", label: "-- Seleccione item --", disabled: true, selected: true }], "value", "label", true);

            if (!baseId) return;

            const res = await fetch(`controller/get_receta_item.php?tipo=${baseId}`);
            const data = await res.json();

            choices.setChoices(
                data.map(i => ({
                    value: i.id,
                    label: i.nombre + (validarDescripcion(i.descripcion) ? ` ⮞ ${i.descripcion}` : ""),
                    customProperties: {
                        id: i.id,
                        descripcion: i.descripcion,
                        uni_medida: i.uni_medida,
                        precio: i.precio,
                        categoria: i.categoria,
                        sub_cat_1: i.sub_cat_1,
                        sub_cat_2: i.sub_cat_2,
                        marca: i.marca,
                        modelo: i.modelo,
                        nombre: i.nombre,
                        moneda: i.moneda,
                        tipo: i.tipo
                    }
                })),
                "value",
                "label",
                false
            );

        } catch (error) {
            console.error(error);
            alertify.error("Error al cargar items");
        }
    });

    /* ---------------------------------------------------
       BOTÓN + → AGREGAR ITEM
    --------------------------------------------------- */
    btnAdd.addEventListener("click", () => {

        const selected = itemSelect.choicesInstance.getValue();

        if (!selected || !selected.value) {
            alertify.error("Seleccione un item");
            return;
        }

        const item = selected.customProperties;
        const itemId  = item.id;

        if (!item) {
            alertify.error("El item no contiene información válida");
            return;
        }

        if (itemAlreadyAdded(tbody, itemId)) {
            alertify.error("Este item ya fue agregado");
            return;
        }

        const tr = document.createElement("tr");
        tr.dataset.itemId  = itemId ;

        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-md flex-shrink-0 me-2">
                        <span class="avatar-title bg-primary-subtle rounded-circle">
                            <img src="${getRandomLogo()}" alt="" height="22">
                        </span>
                    </div>
                    <div>
                        <span class="text-muted fs-12">${item.nombre}</span><br>
                        <h5 class="fs-14 mt-1 item-description">${item.descripcion}</h5>
                    </div>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">${item.categoria}</span>
                <h5 class="fs-14 mt-1 fw-normal isadmin">${item.sub_cat_1}</h5>
                <h5 class="fs-11 mt-1 fw-normal">${item.sub_cat_2}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Tipo</span>
                <h5 class="fs-14 mt-1 fw-normal">
                    <i class="ti ti-circle-filled fs-12 ${item.tipo === "PRODUCTO" ? "text-success" : "text-info"}"></i>
                    ${item.tipo}
                </h5>
            </td>

            <td>
                <span class="text-muted fs-12">Cantidad</span> <br>
                <div data-touchspin class="input-step border bg-body-secondary p-1 mt-1 rounded-pill d-inline-flex overflow-visible">
                    <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">-</button>
                    <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="1" min="0" max="100" readonly />
                    <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">+</button>
                </div>
            </td>

            <td><span class="text-muted fs-12">MSRP</span><h5 class="fs-14 mt-1 fw-normal">${format4(item.precio)} ${item.moneda}</h5></td>
            
            <td>
                <a href="javascript:void(0)" class="text-danger btnDeleteItem">
                    <i class="ti ti-trash fs-18"></i>
                </a>
            </td>
        `;

        tbody.appendChild(tr);
        validarTdAdmin(tr);
        alertify.success("Item agregado");
    });

});
