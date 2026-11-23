document.addEventListener("DOMContentLoaded", async () => {

    const upgradeCard = document.getElementById("dashboardUpgradeCard");
    const upgradeButton = document.getElementById("dashboardUpgradeActivate");
    const puzzlePiece = document.getElementById("dashboardPuzzlePiece");
    const upgradeHint = document.getElementById("dashboardUpgradeHint");
    if (upgradeCard && upgradeButton && puzzlePiece) {
        const puzzleSlot = upgradeCard.querySelector(".dashboard-puzzle-slot");
        const puzzleTiles = Array.from(upgradeCard.querySelectorAll(".dashboard-puzzle-piece[data-puzzle-letter]"));
        const movingLetter = puzzlePiece.querySelector(".dashboard-puzzle-moving-letter");
        const slotLetter = puzzleSlot?.querySelector(".dashboard-puzzle-slot-letter");
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let dragging = false;
        let dragGhost = null;
        let snapTimer = 0;
        let puzzleIntroTimer = 0;
        const snapDuration = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 60 : 460;
        const puzzleIntroDuration = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 180;

        const resetPuzzleBoard = () => {
            puzzleTiles.forEach(tile => { tile.hidden = false; });
            if (puzzleSlot) {
                puzzleSlot.hidden = true;
                puzzleSlot.classList.remove("has-tab-right", "has-tab-bottom", "is-ready", "is-snapping");
                puzzleSlot.style.gridRow = "";
                puzzleSlot.style.gridColumn = "";
                puzzleSlot.setAttribute("aria-label", "Espacio vacío para completar COTIX360");
            }
            if (movingLetter) movingLetter.textContent = "?";
            if (slotLetter) slotLetter.textContent = "";
        };

        const prepareRandomPuzzle = () => {
            if (!puzzleTiles.length || !puzzleSlot || !slotLetter || !movingLetter) return;
            puzzleTiles.forEach(tile => { tile.hidden = false; });
            const missingTile = puzzleTiles[Math.floor(Math.random() * puzzleTiles.length)];
            const letter = String(missingTile.dataset.puzzleLetter || "");
            missingTile.hidden = true;
            puzzleSlot.hidden = false;
            puzzleSlot.style.gridRow = String(missingTile.dataset.puzzleRow || "1");
            puzzleSlot.style.gridColumn = String(missingTile.dataset.puzzleColumn || "1");
            puzzleSlot.classList.toggle("has-tab-right", missingTile.classList.contains("has-tab-right"));
            puzzleSlot.classList.toggle("has-tab-bottom", missingTile.classList.contains("has-tab-bottom"));
            puzzleSlot.setAttribute("aria-label", `Espacio vacío para la pieza ${letter} de COTIX360`);
            slotLetter.textContent = "";
            movingLetter.textContent = letter;
        };

        const resetPiece = () => {
            puzzlePiece.classList.remove("is-dragging", "is-snapping");
            puzzlePiece.style.opacity = "";
            puzzlePiece.style.left = "";
            puzzlePiece.style.top = "";
            puzzlePiece.style.position = "";
            puzzlePiece.style.transform = "";
            puzzlePiece.style.right = "";
            puzzlePiece.style.bottom = "";
            if (dragGhost) {
                dragGhost.remove();
                dragGhost = null;
            }
        };

        const completePuzzle = () => {
            if (upgradeCard.classList.contains("is-complete")) return;
            window.clearTimeout(snapTimer);
            window.clearTimeout(puzzleIntroTimer);
            dragging = false;
            upgradeCard.classList.remove("is-puzzle-ready", "is-activating", "is-completing");
            upgradeCard.classList.add("is-complete");
            puzzlePiece.disabled = true;
            puzzlePiece.classList.remove("is-dragging", "is-wrong", "is-snapping");
            puzzlePiece.style.opacity = "";
            dragGhost?.remove();
            dragGhost = null;
            puzzleSlot?.classList.remove("is-ready");
            upgradeButton.disabled = true;
            const actionLabel = upgradeButton.querySelector(".dashboard-upgrade-action-label");
            if (actionLabel) actionLabel.textContent = "Listo";
            if (upgradeHint) upgradeHint.textContent = "Reto completado. Contacta a Administración para confirmar la activación.";
            if (slotLetter && movingLetter) {
                slotLetter.textContent = movingLetter.textContent;
                puzzleSlot?.setAttribute("aria-label", `COTIX360 completado, pieza ${movingLetter.textContent} encajada`);
            }
        };

        const snapPieceIntoSlot = () => {
            if (upgradeCard.classList.contains("is-completing") || upgradeCard.classList.contains("is-complete")) return;
            const slotRect = puzzleSlot?.getBoundingClientRect();
            if (!slotRect) {
                resetPiece();
                return;
            }
            dragging = false;
            upgradeCard.classList.add("is-completing");
            upgradeButton.disabled = true;
            puzzleSlot.classList.add("is-ready", "is-snapping");
            if (upgradeHint) upgradeHint.textContent = "Encajando la ficha…";

            const puzzleRect = upgradeCard.querySelector(".dashboard-puzzle").getBoundingClientRect();
            const hadGhost = Boolean(dragGhost);
            if (!hadGhost) {
                puzzlePiece.style.position = "absolute";
                puzzlePiece.style.left = `${slotRect.left - puzzleRect.left}px`;
                puzzlePiece.style.top = `${slotRect.top - puzzleRect.top}px`;
                puzzlePiece.style.transform = "none";
                puzzlePiece.style.opacity = "1";
                puzzlePiece.classList.add("is-snapping");
            } else {
                puzzlePiece.style.opacity = ".18";
                const targetLeft = slotRect.left + (slotRect.width - dragGhost.offsetWidth) / 2;
                const targetTop = slotRect.top + (slotRect.height - dragGhost.offsetHeight) / 2;
                dragGhost.classList.add("is-snapping");
                requestAnimationFrame(() => {
                    if (!dragGhost) return;
                    dragGhost.style.left = `${targetLeft}px`;
                    dragGhost.style.top = `${targetTop}px`;
                    dragGhost.style.transform = "rotate(180deg) scale(.86)";
                });
            }

            snapTimer = window.setTimeout(() => {
                dragGhost?.remove();
                dragGhost = null;
                if (hadGhost) {
                    const finalPuzzleRect = upgradeCard.querySelector(".dashboard-puzzle").getBoundingClientRect();
                    puzzlePiece.style.position = "absolute";
                    puzzlePiece.style.left = `${slotRect.left - finalPuzzleRect.left}px`;
                    puzzlePiece.style.top = `${slotRect.top - finalPuzzleRect.top}px`;
                    puzzlePiece.style.transform = "none";
                    puzzlePiece.style.opacity = "1";
                }
                puzzleSlot.classList.remove("is-snapping");
                completePuzzle();
            }, snapDuration);
        };

        upgradeButton.addEventListener("click", () => {
            if (upgradeCard.classList.contains("is-complete") || upgradeCard.classList.contains("is-completing")) return;
            if (upgradeCard.classList.contains("is-puzzle-ready")) {
                window.clearTimeout(puzzleIntroTimer);
                upgradeCard.classList.remove("is-puzzle-ready", "is-activating");
                resetPuzzleBoard();
                puzzlePiece.disabled = false;
                upgradeButton.querySelector(".dashboard-upgrade-action-label").textContent = "Activar";
                if (upgradeHint) upgradeHint.textContent = "Completa el reto visual para continuar con tu actualización.";
                resetPiece();
                return;
            }
            upgradeCard.classList.add("is-puzzle-ready");
            upgradeCard.classList.add("is-activating");
            prepareRandomPuzzle();
            upgradeButton.querySelector(".dashboard-upgrade-action-label").textContent = "Cancelar";
            puzzleSlot?.classList.add("is-ready");
            if (upgradeHint) upgradeHint.textContent = puzzleIntroDuration ? "Preparando el rompecabezas…" : "Arrastra la ficha dorada al espacio vacío o pulsa Enter.";
            puzzlePiece.disabled = true;
            puzzleIntroTimer = window.setTimeout(() => {
                if (!upgradeCard.classList.contains("is-puzzle-ready") || upgradeCard.classList.contains("is-complete")) return;
                puzzlePiece.disabled = false;
                if (upgradeHint) upgradeHint.textContent = `Arrastra la pieza «${movingLetter?.textContent || "?"}» al hueco para completar COTIX360, o pulsa Enter.`;
                puzzlePiece.focus();
            }, puzzleIntroDuration);
        });

        puzzlePiece.addEventListener("pointerdown", event => {
            if (upgradeCard.classList.contains("is-complete")) return;
            if (!upgradeCard.classList.contains("is-puzzle-ready")) return;
            event.preventDefault();
            dragging = true;
            const rect = puzzlePiece.getBoundingClientRect();
            dragOffsetX = event.clientX - rect.left;
            dragOffsetY = event.clientY - rect.top;
            puzzlePiece.classList.add("is-dragging");
            puzzlePiece.style.opacity = ".28";
            dragGhost = puzzlePiece.cloneNode(true);
            dragGhost.removeAttribute("id");
            dragGhost.setAttribute("aria-hidden", "true");
            dragGhost.className = "dashboard-puzzle-moving is-dragging dashboard-puzzle-ghost";
            dragGhost.disabled = true;
            dragGhost.style.left = `${rect.left}px`;
            dragGhost.style.top = `${rect.top}px`;
            dragGhost.style.position = "fixed";
            dragGhost.style.zIndex = "1200";
            dragGhost.style.transform = "none";
            dragGhost.style.opacity = "1";
            dragGhost.style.pointerEvents = "none";
            document.body.appendChild(dragGhost);
            puzzlePiece.setPointerCapture?.(event.pointerId);
        });

        puzzlePiece.addEventListener("pointermove", event => {
            if (!dragging) return;
            event.preventDefault();
            if (dragGhost) {
                dragGhost.style.left = `${event.clientX - dragOffsetX}px`;
                dragGhost.style.top = `${event.clientY - dragOffsetY}px`;
            }

            const slotRect = puzzleSlot?.getBoundingClientRect();
            if (slotRect) {
                const ghostRect = dragGhost?.getBoundingClientRect();
                const pieceCenterX = ghostRect ? ghostRect.left + ghostRect.width / 2 : event.clientX;
                const pieceCenterY = ghostRect ? ghostRect.top + ghostRect.height / 2 : event.clientY;
                const nearSlot = pieceCenterX >= slotRect.left - 15
                    && pieceCenterX <= slotRect.right + 15
                    && pieceCenterY >= slotRect.top - 15
                    && pieceCenterY <= slotRect.bottom + 15;
                puzzleSlot.classList.toggle("is-ready", nearSlot);
            }
        });

        puzzlePiece.addEventListener("pointerup", event => {
            if (!dragging) return;
            puzzlePiece.releasePointerCapture?.(event.pointerId);
            dragging = false;
            const slotRect = puzzleSlot?.getBoundingClientRect();
            const ghostRect = dragGhost?.getBoundingClientRect();
            const pieceCenterX = ghostRect ? ghostRect.left + ghostRect.width / 2 : event.clientX;
            const pieceCenterY = ghostRect ? ghostRect.top + ghostRect.height / 2 : event.clientY;
            if (slotRect
                && pieceCenterX >= slotRect.left - 18
                && pieceCenterX <= slotRect.right + 18
                && pieceCenterY >= slotRect.top - 18
                && pieceCenterY <= slotRect.bottom + 18) {
                snapPieceIntoSlot();
            } else {
                resetPiece();
                if (upgradeHint) upgradeHint.textContent = "Casi. Prueba encajar la ficha en el espacio vacío.";
            }
        });

        puzzlePiece.addEventListener("pointercancel", () => {
            if (upgradeCard.classList.contains("is-completing")) return;
            dragging = false;
            resetPiece();
        });

        puzzlePiece.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            if (upgradeCard.classList.contains("is-puzzle-ready")) snapPieceIntoSlot();
        });

        puzzleSlot?.addEventListener("click", () => {
            if (!upgradeCard.classList.contains("is-puzzle-ready")) return;
            snapPieceIntoSlot();
        });
    }

    const cotizacionesContainer = document.getElementById("dashboard-cotizaciones");
    const recetasContainer      = document.getElementById("dashboard-recetas");
    const itemsContainer        = document.getElementById("dashboard-items");
    const contUser = document.getElementById("total_user");
    const contItem = document.getElementById("total_item");
    const contCoti = document.getElementById("total_cotizacion");
    const contCarga = document.getElementById("total_carga");
    const contItemReceta = document.getElementById("total_item_receta");
    const contReceta = document.getElementById("total_receta");
    const contRecetaProducto = document.getElementById("total_receta_producto");
    const contRecetaServicio = document.getElementById("total_receta_servicio");

    const dateInput = document.getElementById("filterDate");

    const today = new Date();
    const periodStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const formatFlatpickr = (d) =>
        d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const toApiDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const defaultRangeText =
        `${formatFlatpickr(periodStart)} to ${formatFlatpickr(today)}`;

    flatpickr(dateInput, {
        mode: "range",
        dateFormat: "d M",
        defaultDate: [periodStart, today],
        onChange: (selectedDates) => {
            if (selectedDates.length === 2) {
                loadVariations(selectedDates[0], selectedDates[1]);
            }
        }
    });

    dateInput.value = defaultRangeText;
    loadVariations(periodStart, today);

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
            contUser.textContent  = formatInt(contadores.usuarios ?? 0);
            contItem.textContent  = formatInt(contadores.items ?? 0);
            contCoti.textContent  = formatInt(contadores.cotizaciones ?? 0);
            contCarga.textContent = formatInt(contadores.carga ?? 0);
            contReceta.textContent = formatInt(contadores.recetas ?? 0);
            contItemReceta.textContent = formatInt(contadores.receta_items ?? 0);
            contRecetaProducto.textContent = formatInt(contadores.receta_productos ?? 0);
            contRecetaServicio.textContent = formatInt(contadores.receta_servicios ?? 0);
        }

        /* =====================================================
           COTIZACIONES 
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

                const link = ES_ADMIN
                ? `form_cotizacion.php?id=${md5(String(coti.id))}`
                : "#";
                
                cotizacionesContainer.insertAdjacentHTML("beforeend", `
                    <div class="dashboard-recent-item d-flex align-items-start gap-2 position-relative mb-2">
                        <div class="avatar-md flex-shrink-0">
                            <img src="assets/images/brands/${logo}.svg" height="22">
                        </div>

                        <div class="dashboard-recent-content flex-grow-1">
                            <h5 class="fs-13 my-1">
                                <a href="${link}" class="stretched-link link-reset ${!ES_ADMIN ? 'disabled-link' : ''}"
                                    ${!ES_ADMIN ? 'onclick="return false;"' : ''}>
                                   Cotix #${coti.id} [${String(coti.usuario).toLowerCase()}]
                                </a>
                            </h5>
                            ${renderItemsString(coti.items)}
                        </div>

                        <div class="dashboard-recent-status ms-auto">
                            <span class="badge dashboard-status-badge ${badgeByEstado(coti.estado)} px-1 py-1" >
                                ${coti.estado}
                            </span>
                        </div>
                    </div>
                `);
            });
        }

        /* =====================================================
           RECETAS
        ===================================================== */
        if (recetasContainer && Array.isArray(json.data.recetas)) {

            const recetas = json.data.recetas
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

            recetasContainer.innerHTML = "";
            recetas.forEach((receta) => {
                const logo = logos[logoIndex % logos.length];
                logoIndex++;

                const link = ES_ADMIN
                    ? `receta_form.php?id=${md5(String(receta.id))}`
                    : "#";

                recetasContainer.insertAdjacentHTML("beforeend", `
                    <div class="dashboard-recent-item d-flex align-items-start gap-2 position-relative mb-2">
                        <div class="avatar-md flex-shrink-0">
                            <img src="assets/images/brands/${logo}.svg" height="22">
                        </div>

                        <div class="dashboard-recent-content flex-grow-1">
                            <h5 class="fs-13 my-1">
                                <a href="${link}" class="stretched-link link-reset ${!ES_ADMIN ? 'disabled-link' : ''}"
                                    ${!ES_ADMIN ? 'onclick="return false;"' : ''}>
                                   Receta #${receta.id} [${String(receta.usuario || '').toLowerCase()}]
                                </a>
                            </h5>
                            <span class="text-muted fs-11 d-block mb-1">${receta.nombre || 'Sin nombre'}</span>
                            ${renderItemsString(receta.items, 3)}
                        </div>

                        <div class="dashboard-recent-status ms-auto">
                            <span class="badge dashboard-status-badge ${badgeByEstado(receta.estado)} px-1 py-1">
                                ${receta.estado}
                            </span>
                        </div>
                    </div>
                `);
            });
        }

        /* =====================================================
           TIMELINE ITEMS 
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
                               ${item.modelo} - ${item.categoria_producto}
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

        // HEADER NOTIFICATIONS: moved to a small dedicated script (header-notifications.js)
        // This file keeps the dashboard rendering focused and safe to include on any view.

    } catch (err) {
        console.error("❌ Dashboard error:", err);
    }

    /* =====================================================
       Helpers
    ===================================================== */
    function renderItemsString(itemsString, limit = null) {
        if (!itemsString) return '';

        let items = itemsString
            .split('|')
            .map(i => i.trim())
            .filter(Boolean);

        const totalItems = items.length;

        if (limit && totalItems > limit) {
            items = items.slice(0, limit);
        }

        if (items.length >= 2) {
            return `
                <ul class="text-muted fs-10 ps-3 mb-0">
                    ${items.map(i => `<li>${i}</li>`).join("")}
                    ${limit && totalItems > limit ? `<li>+${totalItems - limit} más</li>` : ""}
                </ul>
            `;
        }

        return `<span class="text-muted fs-10">${items[0]}</span>`;
    }

    function renderCardVariation(key, currentValue, previousValue) {
        const element = document.querySelector(`[data-dashboard-variation="${key}"]`);
        if (!element) return;

        const current = Number(currentValue ?? 0);
        const previous = Number(previousValue ?? 0);
        element.classList.remove("text-success", "text-danger", "text-muted");

        if (previous === 0) {
            if (current === 0) {
                element.classList.add("text-muted");
                element.innerHTML = '<i class="ti ti-minus"></i><span>0.00%</span>';
                element.title = "Sin variación en los períodos comparados";
            } else {
                element.classList.add("text-success");
                element.innerHTML = '<i class="ti ti-sparkles"></i><span>Nuevo</span>';
                element.title = "Actividad nueva: no hubo registros en los 7 días anteriores";
            }
            return;
        }

        const variation = ((current - previous) / previous) * 100;
        const roundedVariation = Math.abs(variation).toFixed(2);
        const isIncrease = variation > 0;
        const isDecrease = variation < 0;

        element.classList.add(isIncrease ? "text-success" : isDecrease ? "text-danger" : "text-muted");
        element.innerHTML = `
            <i class="ti ${isIncrease ? "ti-caret-up-filled" : isDecrease ? "ti-caret-down-filled" : "ti-minus"}"></i>
            <span>${isIncrease ? "+" : isDecrease ? "-" : ""}${roundedVariation}%</span>
        `;
        element.title = `Variación de ${roundedVariation}% frente a los 7 días anteriores`;
    }

    async function loadVariations(startDate, endDate) {
        const query = new URLSearchParams({
            fecha_inicio: toApiDate(startDate),
            fecha_fin: toApiDate(endDate)
        });

        try {
            const response = await fetch(`controller/dashboard_variaciones.php?${query.toString()}`);
            const result = await response.json();
            if (result.error || !result.data) throw new Error(result.message || "No se pudieron cargar las variaciones");

            ["usuarios", "items", "cotizaciones", "carga", "recetas", "receta_items", "productos", "servicios"].forEach((key) => {
                renderCardVariation(key, result.data[key].actual, result.data[key].anterior);
            });

            const period = result.data.periodo;
            document.querySelectorAll("[data-dashboard-variation]").forEach((element) => {
                element.title = `${element.title.split(".")[0]}. Período: ${period.inicio} al ${period.fin}; comparación: ${period.anterior_inicio} al ${period.anterior_fin}.`;
            });
        } catch (error) {
            console.error("Dashboard variations:", error);
        }
    }

});
