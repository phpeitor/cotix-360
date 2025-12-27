document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       📅 FECHAS POR DEFECTO (HOY y -7 DÍAS)
    --------------------------------------------------- */
    const dateInput = document.getElementById("filterDate");

    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);

    // Helpers
    const formatISO = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD
    const formatFlatpickr = (d) =>
        d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const defaultRangeText =
        `${formatFlatpickr(pastDate)} to ${formatFlatpickr(today)}`;

    // Inicializar Flatpickr
    flatpickr(dateInput, {
        mode: "range",
        dateFormat: "d M Y",
        defaultDate: [pastDate, today]
    });

    dateInput.value = defaultRangeText;

    /* ---------------------------------------------------
       📊 GRID
    --------------------------------------------------- */
    const grid = new gridjs.Grid({
        columns: [
            { id: "id", name: "ID", width: "70px" },
            { id: "usuario", name: "Usuario", width: "80px" },
            { id: "estado", name: "Estado", width: "100px" },
            { id: "items", name: "Items", width: "250px" },
            { id: "total_items", name: "Cant.", width: "80px" },
            { id: "created_at", name: "Fecha", width: "140px" }
        ],
        server: {
            url: buildUrl(),
            method: "GET",
            then: res => res.data
        },
        pagination: {
            enabled: true,
            limit: 10
        },
        sort: true,
        search: true
    }).render(document.getElementById("table-gridjs"));

    /* ---------------------------------------------------
       🔎 BOTÓN BUSCAR
    --------------------------------------------------- */
    document.getElementById("btn_buscar").addEventListener("click", () => {
        grid.updateConfig({
            server: {
                url: buildUrl(),
                method: "GET",
                then: res => res.data
            }
        }).forceRender();
    });

    function buildUrl() {
        const fp = dateInput._flatpickr;
        let fec_ini, fec_fin;

        if (fp && fp.selectedDates.length === 2) {
            fec_ini = formatISO(fp.selectedDates[0]);
            fec_fin = formatISO(fp.selectedDates[1]);
        } else {
            fec_ini = formatISO(pastDate);
            fec_fin = formatISO(today);
        }

        return "controller/table_cotizacion.php?" + new URLSearchParams({
            fec_ini,
            fec_fin
        });
    }

});
