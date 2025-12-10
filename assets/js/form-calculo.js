document.addEventListener("DOMContentLoaded", () => {
    const baseSelect = document.getElementById("filterBase");
    const itemSelect = document.getElementById("choices-single-default");

    baseSelect.addEventListener("change", async () => {
        const baseId = baseSelect.value;
        const choices = itemSelect.choicesInstance;

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

            // Cargar items vía fetch
            const res = await fetch(`controller/get_select_item.php?id=${baseId}`);
            const data = await res.json();

            // Agregar items si existen
            if (data.length > 0) {
                choices.setChoices(
                    data.map(i => ({
                        value: i.modelo,
                        label: i.modelo
                    })),
                    "value",
                    "label",
                    false
                );
            }
        } catch (error) {
            console.error("Error al cargar ítems:", error);

            // Dejar un placeholder de error
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

});
