document.addEventListener("DOMContentLoaded", async () => {

    const cotizacionesContainer = document.getElementById("dashboard-cotizaciones");
    const itemsContainer        = document.getElementById("dashboard-items");
    const contUser = document.getElementById("total_user");
    const contItem = document.getElementById("total_item");
    const contCoti = document.getElementById("total_cotizacion");
    const contCarga = document.getElementById("total_carga");

    const dateInput = document.getElementById("filterDate");

    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);

    const formatFlatpickr = (d) =>
        d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const defaultRangeText =
        `${formatFlatpickr(pastDate)} to ${formatFlatpickr(today)}`;

    flatpickr(dateInput, {
        mode: "range",
        dateFormat: "d M",
        defaultDate: [pastDate, today]
    });

    dateInput.value = defaultRangeText;

    try {
        const res  = await fetch("controller/dashboard.php");
        const json = await res.json();

        if (json.error || !json.data) {
            if (cotizacionesContainer) {
                cotizacionesContainer.innerHTML = `<p class="text-danger">Error al cargar datos</p>`;
            }
            return;
        }

        /* ===============================
           CONTADORES
        =============================== */
        const contadores = json.data?.contadores?.[0];

        if (contadores) {
            contUser.textContent  = contadores.usuarios     ?? 0;
            contItem.textContent  = contadores.items        ?? 0;
            contCoti.textContent  = contadores.cotizaciones ?? 0;
            contCarga.textContent = contadores.carga        ?? 0;
        }

        /* =====================================================
           COTIZACIONES (YA LO TENÍAS)
        ===================================================== */
        if (cotizacionesContainer && Array.isArray(json.data.cotizaciones)) {

            const cotizaciones = json.data.cotizaciones
                .sort((a, b) => b.id - a.id)
                .slice(0, 3);

            const logos = [1, 2, 3];
            let logoIndex = 0;

            const badgeByEstado = (estado) => {
                switch (estado) {
                    case "Aprobada": return "badge-soft-success";
                    case "Anulada":  return "badge-soft-danger";
                    case "Enviada":  return "badge-soft-info";
                    default:         return "badge-soft-secondary";
                }
            };

            cotizacionesContainer.innerHTML = "";

            cotizaciones.forEach((coti) => {
                const logo = logos[logoIndex % logos.length];
                logoIndex++;

                cotizacionesContainer.insertAdjacentHTML("beforeend", `
                    <div class="d-flex align-items-start gap-2 position-relative mb-2">
                        <div class="avatar-md flex-shrink-0">
                            <img src="assets/images/brands/${logo}.svg" height="22">
                        </div>

                        <div class="flex-grow-1">
                            <h5 class="fs-13 my-1">
                                <a href="form_cotizacion.php?id=${md5(String(coti.id))}"
                                   class="stretched-link link-reset">
                                   Cotización #${coti.id}
                                </a>
                            </h5>
                            ${renderItemsString(coti.items)}
                        </div>

                        <div class="ms-auto">
                            <span class="badge ${badgeByEstado(coti.estado)} px-2 py-1">
                                ${coti.estado}
                            </span>
                        </div>
                    </div>
                `);
            });
        }

        /* =====================================================
           TIMELINE ITEMS (NUEVO)
        ===================================================== */
        if (itemsContainer && Array.isArray(json.data.items)) {

            const icons = [
                { icon: "ti-basket", color: "info" },
                { icon: "ti-rocket", color: "primary" },
                { icon: "ti-message", color: "info" },
                { icon: "ti-photo",  color: "primary" }
            ];

            itemsContainer.innerHTML = "";

            json.data.items.slice(0, 5).forEach((item, index) => {
                const icon = icons[index % icons.length];

                itemsContainer.insertAdjacentHTML("beforeend", `
                    <div class="timeline-item">
                        <i class="ti ${icon.icon} bg-${icon.color}-subtle text-${icon.color} timeline-icon"></i>
                        <div class="timeline-item-info">
                            <a href="javascript:void(0);"
                               class="link-reset fw-semibold mb-1 d-block fs-12">
                               ${item.modelo}
                            </a>
                            <span class="mb-1 fs-11">
                                ${item.descripcion?.replace(/\n/g, " ") || ""}
                            </span>
                            <p class="mb-0 pb-3">
                                <small class="text-muted">
                                    ${item.precio_unitario} ${item.moneda}
                                </small>
                            </p>
                        </div>
                    </div>
                `);
            });
        }

    } catch (err) {
        console.error("❌ Dashboard error:", err);
    }

    /* =====================================================
       Helpers
    ===================================================== */
    function renderItemsString(itemsString) {
        if (!itemsString) return '';

        const items = itemsString
            .split('|')
            .map(i => i.trim())
            .filter(Boolean);

        if (items.length >= 2) {
            return `
                <ul class="text-muted fs-10 ps-3 mb-0">
                    ${items.map(i => `<li>${i}</li>`).join("")}
                </ul>
            `;
        }

        return `<span class="text-muted fs-10">${items[0]}</span>`;
    }

});
