document.addEventListener("DOMContentLoaded", () => {
    const tbody          = document.querySelector("table.table tbody");
    const integerFormatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0
    });
    const decimal2Formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const decimal4Formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    });

    function round2(value) {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }

    function formatInt(value) {
        return integerFormatter.format(Number(value) || 0);
    }

    function format2(value) {
        return decimal2Formatter.format(Number(value) || 0);
    }

    function format4(value) {
        return decimal4Formatter.format(Number(value) || 0);
    }

    init();

    function init() {
        const hash = getQueryParam("id");
        if (!hash) return;

        Promise.all([
            fetch(`controller/get_cotizacion.php?id=${hash}`)
        ])
        .then(res => res ? res.json() : null)
        .then(data => {
            if (!data || !data.cotizacion) return;
            setHeader(data.cotizacion);
            data.detalle.forEach(item => {
                const tr = renderItemRow(item); 
                validarTdAdmin(tr);             
            });
            recalculateTotals();
            alertify.success("Receta cargada");
        })
        .catch(err => {
            console.error(err);
            alertify.error("Error cargando receta");
        });
    }

    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    function getRandomLogo() {
        const n = Math.floor(Math.random() * 9) + 1;
        return `assets/images/products/logo/logo-${n}.svg`;
    }

    function renderItemRow(item) {
        const tr = document.createElement("tr");
        tr.dataset.itemId = item.item_id;

        tr.innerHTML = `
            
        `;

        tbody.appendChild(tr);
        return tr; 
    }

    function setHeader(cotizacion) {
        usuarioEl.textContent = cotizacion.usuario ?? "";
        fechaEl.textContent = cotizacion.created_at ?? "";;
        estadoEl.textContent = cotizacion.estado ?? "";;
        cotizacionIdEl.textContent = cotizacion.id ?? "";
        setEstadoIcon(cotizacion.estado);
    }

    function setEstadoIcon(estado) {
        const avatar = estadoEl
            .closest(".d-flex")
            .querySelector(".avatar-lg");

        let icon = "solar:refresh-square-bold";
        let color = "text-primary";

        if (!estado) return;

        switch (estado) {
            case "Aprobada":
                icon  = "solar:verified-check-broken";
                color = "text-success";
                break;

            case "Anulada":
                icon  = "solar:folder-error-broken";
                color = "text-danger";
                break;
        }

        avatar.innerHTML = `
            <iconify-icon icon="${icon}" class="fs-28 ${color}"></iconify-icon>
        `;
    }
});