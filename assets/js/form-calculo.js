document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");

    baseSelect.addEventListener("change", async () => {
        const baseId = baseSelect.value;

        const choices = itemSelect.choicesInstance; // ← instancia real

        // limpiar items
        choices.clearStore();     // limpia el store interno
        choices.clearChoices();   // limpia las opciones
        choices.clearInput();     // limpia la vista

        if (!baseId) {
            choices.setChoices([{ value: "", label: "-- Seleccione base --", disabled: true }], "value", "label", true);
            return;
        }

        try {
            const res = await fetch(`controller/get_select_item.php?id=${baseId}`);
            const data = await res.json();

            if (!data || data.length === 0) {
                choices.setChoices([{ value: "", label: "-- Sin items --", disabled: true }], "value", "label", true);
                return;
            }

            choices.setChoices(
                data.map(item => ({
                    value: item.modelo,
                    label: item.modelo
                })),
                "value", "label", true
            );

        } catch (e) {
            console.error("Error cargando items:", e);
            choices.setChoices([{ value: "", label: "Error cargando items", disabled: true }], "value", "label", true);
        }
    });
});
