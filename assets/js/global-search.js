(() => {
    if (!document.querySelector('link[href*="global-search.css"]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = "./assets/css/global-search.css?v=1.0";
        document.head.appendChild(stylesheet);
    }

    let modal = document.getElementById("searchModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "searchModal";
        modal.className = "modal fade";
        modal.tabIndex = -1;
        modal.setAttribute("aria-labelledby", "globalSearchModalLabel");
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="card mb-0 shadow-none">
                        <div class="px-3 py-2 d-flex flex-row align-items-center" id="top-search">
                            <i class="ti ti-search fs-22" aria-hidden="true"></i>
                            <input type="search" class="form-control border-0" id="search-modal-input"
                                placeholder="Buscar en Cotix360..."
                                aria-label="Buscar páginas, usuarios y registros">
                            <button type="button" class="btn p-0" data-bs-dismiss="modal" aria-label="Cerrar búsqueda">Esc</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const input = document.getElementById("search-modal-input");
    if (!input || !modal) return;
    input.setAttribute("aria-label", "Buscar páginas, usuarios y registros");

    const card = modal.querySelector(".card");
    const topSearch = modal.querySelector("#top-search");
    if (!card || !topSearch) return;

    let results = modal.querySelector("#global-search-results");
    if (!results) {
        results = document.createElement("div");
        results.id = "global-search-results";
        results.className = "global-search-results";
        card.appendChild(results);
    }

    const sectionLabels = {
        paginas: "Páginas",
        usuarios: "Usuarios",
        cotizaciones: "Cotizaciones",
        recetas: "Recetas",
        items: "Items",
        compras: "Compras",
        ingenieria: "Ingeniería",
        tracking: "Trackings"
    };

    const normalize = value => String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function pageResults(query) {
        const normalized = normalize(query);
        if (!normalized) return [];
        return Array.from(document.querySelectorAll(".side-nav a.side-nav-link[href], .side-nav .sub-menu a[href]"))
            .map(link => ({
                title: link.querySelector(".menu-text")?.textContent?.trim() || link.textContent?.trim() || "",
                href: link.getAttribute("href"),
                icon: link.querySelector(".menu-icon i")?.className || "ti ti-file"
            }))
            .filter(item => item.href && item.title && normalize(item.title).includes(normalized))
            .filter((item, index, all) => all.findIndex(candidate => candidate.href === item.href) === index)
            .slice(0, 6);
    }

    function renderEmpty(message = "Escribe al menos 2 caracteres") {
        results.innerHTML = `<div class="global-search-empty"><i class="ti ti-search"></i><span>${escapeHtml(message)}</span></div>`;
    }

    function render(data, query) {
        const pages = pageResults(query);
        const groups = { paginas: pages, ...data };
        const hasResults = Object.values(groups).some(items => Array.isArray(items) && items.length);

        if (!hasResults) {
            renderEmpty("No se encontraron resultados");
            return;
        }

        results.innerHTML = Object.entries(groups).map(([key, items]) => {
            if (!Array.isArray(items) || !items.length) return "";
            return `
                <section class="global-search-section" aria-label="${escapeHtml(sectionLabels[key] || key)}">
                    <h6>${escapeHtml(sectionLabels[key] || key)}</h6>
                    ${items.map(item => `
                        <a class="global-search-result" href="${escapeHtml(item.href)}">
                            <span class="global-search-icon"><i class="${escapeHtml(item.icon || "ti ti-file")}"></i></span>
                            <span class="global-search-copy">
                                <strong>${escapeHtml(item.title)}</strong>
                                ${item.subtitle ? `<small>${escapeHtml(item.subtitle)}</small>` : ""}
                            </span>
                            <i class="ti ti-chevron-right global-search-arrow" aria-hidden="true"></i>
                        </a>
                    `).join("")}
                </section>
            `;
        }).join("");
    }

    let controller = null;
    let timer = null;
    let requestSequence = 0;

    async function search(query) {
        const value = query.trim();
        if (value.length < 2) {
            render(pageResults(value).length ? { paginas: pageResults(value) } : {}, value);
            if (value.length === 0) renderEmpty();
            return;
        }

        const sequence = ++requestSequence;
        controller?.abort();
        controller = new AbortController();
        results.innerHTML = '<div class="global-search-loading"><span class="spinner-border spinner-border-sm"></span><span>Buscando...</span></div>';

        try {
            const response = await fetch(`controller/global_search.php?q=${encodeURIComponent(value)}`, {
                credentials: "same-origin",
                signal: controller.signal
            });
            const json = await response.json();
            if (sequence !== requestSequence) return;
            if (!response.ok || !json.ok) throw new Error(json.message || "No se pudo buscar");
            render(json.data || {}, value);
        } catch (error) {
            if (error.name === "AbortError") return;
            renderEmpty(error.message || "No se pudo realizar la búsqueda");
        }
    }

    input.addEventListener("input", () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => search(input.value), 180);
    });

    modal.addEventListener("shown.bs.modal", () => {
        window.setTimeout(() => input.focus(), 30);
        renderEmpty();
    });

    modal.addEventListener("hidden.bs.modal", () => {
        input.value = "";
        renderEmpty();
    });

    document.addEventListener("keydown", event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            if (window.bootstrap?.Modal) {
                try {
                    bootstrap.Modal.getOrCreateInstance(modal).show();
                } catch (_) {
                    modal.classList.add("show");
                    modal.style.display = "block";
                }
            }
        }
        if (event.key === "Enter" && document.activeElement === input && modal.classList.contains("show")) {
            const first = results.querySelector(".global-search-result");
            if (first) {
                event.preventDefault();
                first.click();
            }
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (!modal.classList.contains("show")) return;
            event.preventDefault();
            const links = Array.from(results.querySelectorAll(".global-search-result"));
            if (!links.length) return;
            const index = links.indexOf(document.activeElement);
            const next = event.key === "ArrowDown"
                ? (index + 1) % links.length
                : (index <= 0 ? links.length - 1 : index - 1);
            links[next].focus();
        }
    });
})();
