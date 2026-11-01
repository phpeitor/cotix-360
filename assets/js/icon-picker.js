document.addEventListener("DOMContentLoaded", () => {
    const modalElement = document.getElementById("subcatIconPickerModal");
    const searchInput = document.getElementById("subcatIconSearch");
    const categorySelect = document.getElementById("subcatIconCategory");
    const grid = document.getElementById("subcatIconPickerGrid");
    const status = document.getElementById("subcatIconPickerStatus");
    if (!modalElement || !searchInput || !categorySelect || !grid) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const defaultIcon = "ti ti-tools";
    const maxRenderedIcons = 300;
    let iconNames = [];
    let iconLoadPromise = null;
    let selectionCallback = null;
    let selectedIcon = defaultIcon;

    const groups = {
        tools: ["tool", "tools", "wrench", "hammer", "screwdriver", "settings", "gear", "engine", "repair", "maintenance", "adjustments"],
        electrical: ["bolt", "plug", "electric", "circuit", "battery", "bulb", "power", "antenna", "cpu", "voltage", "current", "cable"],
        logistics: ["truck", "delivery", "car", "plane", "ship", "train", "route", "road", "map", "forklift", "warehouse", "package"],
        documents: ["file", "clipboard", "list", "note", "book", "report", "contract", "certificate", "receipt", "text", "forms", "notebook", "document"],
        equipment: ["box", "package", "device", "component", "machine", "assembly", "building", "container", "database", "server", "robot", "tool"]
    };

    function iconCategory(iconName) {
        for (const [category, keywords] of Object.entries(groups)) {
            if (keywords.some(keyword => iconName.includes(keyword))) return category;
        }
        return "other";
    }

    function loadIcons() {
        if (iconNames.length) return Promise.resolve(iconNames);
        if (iconLoadPromise) return iconLoadPromise;

        iconLoadPromise = fetch("controller/receta_item_categoria.php?action=icon_list")
            .then(async response => {
                const data = await response.json();
                if (!response.ok || !data.success) throw new Error(data.message || "No se pudo cargar el paquete de iconos");
                iconNames = Array.from(new Set((data.iconos || []).filter(name => /^[a-z0-9-]+$/i.test(name))));
                return iconNames;
            })
            .catch(error => {
                iconLoadPromise = null;
                throw error;
            });

        return iconLoadPromise;
    }

    function renderIcons() {
        const query = String(searchInput.value || "").trim().toLowerCase();
        const category = categorySelect.value || "all";
        const filtered = iconNames.filter(name => {
            return (!query || name.includes(query))
                && (category === "all" || iconCategory(name) === category);
        });
        const visible = filtered.slice(0, maxRenderedIcons);

        if (status) {
            status.textContent = filtered.length > maxRenderedIcons
                ? `Se encontraron ${filtered.length} iconos; mostrando los primeros ${maxRenderedIcons}. Usa la búsqueda para acotar.`
                : `${filtered.length} iconos disponibles`;
        }

        grid.innerHTML = visible.length
            ? visible.map(name => {
                const className = `ti ti-${name}`;
                const active = className === selectedIcon ? " is-selected" : "";
                return `<button type="button" class="subcat-icon-option${active}" data-icon="${className}" title="${name}">
                    <i class="${className}" aria-hidden="true"></i>
                    <span>${name}</span>
                </button>`;
            }).join("")
            : '<div class="text-muted py-4 text-center">No se encontraron iconos con ese filtro.</div>';
    }

    searchInput.addEventListener("input", renderIcons);
    categorySelect.addEventListener("change", renderIcons);

    grid.addEventListener("click", event => {
        const button = event.target.closest(".subcat-icon-option");
        if (!button) return;
        const icon = button.dataset.icon || defaultIcon;
        if (typeof selectionCallback === "function") selectionCallback(icon);
        modal.hide();
    });

    window.CotixIconPicker = {
        open(currentIcon, onSelect) {
            selectedIcon = String(currentIcon || defaultIcon);
            selectionCallback = onSelect;
            searchInput.value = "";
            categorySelect.value = "all";
            grid.innerHTML = "";
            if (status) status.textContent = "Cargando iconos...";
            modal.show();
            loadIcons()
                .then(renderIcons)
                .catch(error => {
                    if (status) status.textContent = error.message || "Error al cargar los iconos";
                });
        }
    };
});
