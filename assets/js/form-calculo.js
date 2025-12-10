document.addEventListener("DOMContentLoaded", () => {

    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");

    const btnAdd = document.querySelector(".btn.btn-sm.btn-primary.rounded-circle.btn-icon");
    const tbody = document.querySelector("table.table tbody");

    // ---------------------------
    // CARGAR ITEMS SEGÚN LA BASE
    // ---------------------------
    baseSelect.addEventListener("change", async () => {

        const baseId = baseSelect.value;
        const choices = itemSelect.choicesInstance; // ✔ correcto

        try {
            choices.clearChoices();

            if (!baseId) {
                choices.setChoices(
                    [
                        {
                            value: "",
                            label: "-- Seleccione base --",
                            disabled: true,
                            selected: true
                        }
                    ],
                    "value",
                    "label",
                    true
                );
                return;
            }

            // placeholder inicial
            choices.setChoices(
                [
                    {
                        value: "",
                        label: "-- Seleccione item --",
                        disabled: true,
                        selected: true
                    }
                ],
                "value",
                "label",
                true
            );

            // Cargar datos de items
            const res = await fetch(`controller/get_select_item.php?id=${baseId}`);
            const data = await res.json();

            if (data.length > 0) {
                choices.setChoices(
                    data.map(i => ({
                        value: i.modelo,
                        label: i.modelo,
                        customProperties: {
                            descripcion: i.descripcion,
                            categoria: i.categoria_producto,
                            grupo: i.grupo_descuento,
                            clase: i.clase_producto,
                            peso: i.peso,
                            precio: i.precio_unitario,
                            moneda: i.moneda,
                            status: i.status,
                            pais: i.pais_origen
                        }
                    })),
                    "value",
                    "label",
                    false
                );
            }

        } catch (error) {
            console.error("Error al cargar ítems:", error);

            choices.clearChoices();
            choices.setChoices(
                [
                    {
                        value: "",
                        label: "-- Error al cargar items --",
                        disabled: true,
                        selected: true
                    }
                ],
                "value",
                "label",
                true
            );
        }
    });

    // ---------------------------
    // BOTÓN + : AGREGAR A TABLA
    // ---------------------------
    btnAdd.addEventListener("click", () => {

        const selected = itemSelect.choicesInstance.getValue(); // devuelve OBJETO
        console.log("SELECTED =>", selected);

        if (!selected || !selected.value) {
            alertify.error("Seleccione un item");
            return;
        }

        const item = selected.customProperties;
        if (!item) {
            alertify.error("Error: el item no tiene datos asociados.");
            return;
        }

        console.log("ITEM =>", item);

        // Crear fila
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-md flex-shrink-0 me-2">
                        <span class="avatar-title bg-primary-subtle rounded-circle">
                            <img src="assets/images/products/logo/logo-8.svg" alt="" height="22">
                        </span>
                    </div>
                    <div>
                        <span class="text-muted fs-12">${selected.value}</span> <br>
                        <h5 class="fs-14 mt-1">${item.descripcion}</h5>
                    </div>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">${item.categoria}</span>
                <h5 class="fs-14 mt-1 fw-normal">${item.grupo}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Cantidad</span> <br>
                <div data-touchspin class="input-step border bg-body-secondary p-1 mt-1 rounded-pill d-inline-flex overflow-visible">
                    <button type="button" class="minus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">-</button>
                    <input type="number" class="text-dark text-center border-0 bg-body-secondary rounded h-100" value="1" min="0" max="100" readonly="">
                    <button type="button" class="plus bg-light text-dark border-0 rounded-circle fs-20 lh-1 h-100">+</button>
                </div>
            </td>

            <td>
                <span class="text-muted fs-12">Peso</span>
                <h5 class="fs-14 mt-1 fw-normal">${item.peso}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Precio Uni.</span>
                <h5 class="fs-14 mt-1 fw-normal">${item.precio} ${item.moneda}</h5>
            </td>

            <td>
                <span class="text-muted fs-12">Status</span>
                <h5 class="fs-14 mt-1 fw-normal">
                    <i class="ti ti-circle-filled fs-12 ${item.status === "Active" ? "text-success" : "text-danger"}"></i>
                    ${item.status}
                </h5>
            </td>

            <td style="width: 30px;">
                <div class="dropdown">
                    <a href="#" class="dropdown-toggle text-muted card-drop p-0" data-bs-toggle="dropdown">
                        <i class="ti ti-dots-vertical"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" class="dropdown-item btnDeleteItem">Eliminar</a>
                        <a href="javascript:void(0);" class="dropdown-item">Detalle</a>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
        alertify.success("Item agregado");
    });

});
