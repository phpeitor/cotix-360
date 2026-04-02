document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");

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
                    label: i.nombre + (i.descripcion ? ` ⮞ ${i.descripcion}` : ""),
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
                        moneda: i.moneda
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
});
