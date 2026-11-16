(() => {
    const WIDTH_KEY = "cotix-sidebar-width";
    const MIN_WIDTH = 248;
    const MAX_WIDTH = 430;

    function normalize(text) {
        return String(text || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("es")
            .trim();
    }

    function initSidebar() {
        const root = document.documentElement;
        const sidebar = document.querySelector(".sidenav-menu");
        const nav = sidebar?.querySelector(".side-nav");
        const searchWrap = document.querySelector(".cotix-sidebar-search-wrap");
        const searchInput = document.getElementById("cotixSidebarSearch");
        const clearSearch = document.getElementById("cotixSidebarSearchClear");
        const noResults = document.getElementById("cotixSidebarSearchEmpty");
        const resizeHandle = document.getElementById("cotixSidebarResize");
        if (!sidebar || !nav) return;

        const menuItems = Array.from(nav.querySelectorAll(".side-nav-item"));

        const expandSidebarForSearch = () => {
            const size = root.getAttribute("data-sidenav-size");
            if (!desktop.matches || !["condensed", "sm-hover", "sm-hover-active"].includes(size)) return;
            root.setAttribute("data-sidenav-size", "default");
            if (window.config?.sidenav) window.config.sidenav.size = "default";
            root.classList.add("cotix-sidebar-resizable");
        };

        const savedWidth = Number(localStorage.getItem(WIDTH_KEY));
        const width = Number.isFinite(savedWidth) && savedWidth >= MIN_WIDTH && savedWidth <= MAX_WIDTH
            ? savedWidth
            : 320;
        root.style.setProperty("--cotix-sidebar-width", `${width}px`);

        const desktop = window.matchMedia("(min-width: 768px)");
        const customLayoutAllowed = () => desktop.matches
            && !["condensed", "fullscreen"].includes(root.getAttribute("data-sidenav-size"));
        const updateResponsiveMode = () => {
            const enabled = customLayoutAllowed();
            root.classList.toggle("cotix-sidebar-resizable", enabled);
            const compact = ["condensed", "sm-hover"].includes(root.getAttribute("data-sidenav-size"));
            menuItems.forEach(item => {
                const link = item.querySelector(":scope > .side-nav-link");
                const label = item.querySelector(":scope > .side-nav-link .menu-text")?.textContent?.trim();
                if (!link || !label) return;
                if (compact) {
                    link.removeAttribute("title");
                    link.setAttribute("data-bs-toggle", "tooltip");
                    link.setAttribute("data-bs-placement", "right");
                    link.setAttribute("data-bs-custom-class", "cotix-sidebar-tooltip");
                    link.setAttribute("data-bs-title", label);
                    if (window.bootstrap?.Tooltip) {
                        bootstrap.Tooltip.getOrCreateInstance(link, { trigger: "hover focus", container: "body" });
                    }
                } else {
                    window.bootstrap?.Tooltip?.getInstance(link)?.dispose();
                    link.removeAttribute("title");
                    link.removeAttribute("data-bs-toggle");
                    link.removeAttribute("data-bs-placement");
                    link.removeAttribute("data-bs-custom-class");
                    link.removeAttribute("data-bs-title");
                }
            });
        };
        updateResponsiveMode();
        desktop.addEventListener?.("change", updateResponsiveMode);
        new MutationObserver(updateResponsiveMode).observe(root, {
            attributes: true,
            attributeFilter: ["data-sidenav-size"]
        });

        let dragStartX = 0;
        let dragStartWidth = width;
        resizeHandle?.addEventListener("pointerdown", event => {
            if (!customLayoutAllowed()) return;
            dragStartX = event.clientX;
            dragStartWidth = parseInt(getComputedStyle(root).getPropertyValue("--cotix-sidebar-width"), 10) || width;
            root.classList.add("cotix-sidebar-resizing");
            resizeHandle.setPointerCapture?.(event.pointerId);
            event.preventDefault();
        });

        resizeHandle?.addEventListener("pointermove", event => {
            if (!root.classList.contains("cotix-sidebar-resizing")) return;
            const nextWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartWidth + event.clientX - dragStartX));
            root.style.setProperty("--cotix-sidebar-width", `${nextWidth}px`);
            localStorage.setItem(WIDTH_KEY, String(nextWidth));
        });

        const finishResize = () => root.classList.remove("cotix-sidebar-resizing");
        resizeHandle?.addEventListener("pointerup", finishResize);
        resizeHandle?.addEventListener("pointercancel", finishResize);
        resizeHandle?.addEventListener("keydown", event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const currentWidth = parseInt(getComputedStyle(root).getPropertyValue("--cotix-sidebar-width"), 10) || width;
            const nextWidth = event.key === "Home"
                ? MIN_WIDTH
                : event.key === "End"
                    ? MAX_WIDTH
                    : Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, currentWidth + (event.key === "ArrowRight" ? 16 : -16)));
            root.style.setProperty("--cotix-sidebar-width", `${nextWidth}px`);
            localStorage.setItem(WIDTH_KEY, String(nextWidth));
        });

        const allCollapses = Array.from(nav.querySelectorAll(".collapse"));
        const ownLabel = item => normalize(item.querySelector(":scope > .side-nav-link .menu-text")?.textContent);

        function setCollapse(collapse, open) {
            collapse.classList.toggle("show", open);
            const control = nav.querySelector(`[href="#${CSS.escape(collapse.id)}"]`);
            control?.setAttribute("aria-expanded", open ? "true" : "false");
        }

        function restoreSearchCollapses() {
            allCollapses.forEach(collapse => {
                if (!Object.prototype.hasOwnProperty.call(collapse.dataset, "cotixOriginalOpen")) return;
                setCollapse(collapse, collapse.dataset.cotixOriginalOpen === "1");
                delete collapse.dataset.cotixOriginalOpen;
            });
        }

        function applyMenuSearch() {
            const query = normalize(searchInput?.value || "");
            searchWrap?.classList.toggle("has-query", Boolean(query));
            menuItems.forEach(item => item.classList.remove("cotix-menu-search-hidden"));
            nav.querySelectorAll(".side-nav-title").forEach(title => title.classList.remove("cotix-menu-search-hidden"));

            if (!query) {
                restoreSearchCollapses();
                if (noResults) noResults.classList.add("d-none");
                return;
            }

            allCollapses.forEach(collapse => {
                if (!Object.prototype.hasOwnProperty.call(collapse.dataset, "cotixOriginalOpen")) {
                    collapse.dataset.cotixOriginalOpen = collapse.classList.contains("show") ? "1" : "0";
                }
            });

            const matches = new Set(menuItems.filter(item => ownLabel(item).includes(query)));
            const visible = new Set(matches);
            matches.forEach(item => {
                item.querySelectorAll(".side-nav-item").forEach(child => visible.add(child));
                let ancestor = item.parentElement?.closest(".side-nav-item");
                while (ancestor) {
                    visible.add(ancestor);
                    ancestor = ancestor.parentElement?.closest(".side-nav-item");
                }
            });

            menuItems.forEach(item => item.classList.toggle("cotix-menu-search-hidden", !visible.has(item)));
            allCollapses.forEach(collapse => {
                const containsVisibleItem = Array.from(collapse.querySelectorAll(":scope > .side-nav > .side-nav-item, :scope > .sub-menu > .side-nav-item"))
                    .some(item => visible.has(item));
                if (containsVisibleItem) setCollapse(collapse, true);
            });

            nav.querySelectorAll(":scope > .side-nav-title").forEach(title => {
                let sibling = title.nextElementSibling;
                let hasVisibleItem = false;
                while (sibling && !sibling.classList.contains("side-nav-title")) {
                    if (sibling.classList.contains("side-nav-item") && !sibling.classList.contains("cotix-menu-search-hidden")) {
                        hasVisibleItem = true;
                        break;
                    }
                    sibling = sibling.nextElementSibling;
                }
                title.classList.toggle("cotix-menu-search-hidden", !hasVisibleItem);
            });

            if (noResults) noResults.classList.toggle("d-none", visible.size > 0);
        }

        searchInput?.addEventListener("input", applyMenuSearch);
        clearSearch?.addEventListener("click", () => {
            if (!searchInput) return;
            searchInput.value = "";
            applyMenuSearch();
            searchInput.focus();
        });

        searchWrap?.addEventListener("click", event => {
            const compact = ["condensed", "sm-hover", "sm-hover-active"].includes(root.getAttribute("data-sidenav-size"));
            if (!compact) return;
            event.preventDefault();
            expandSidebarForSearch();
            window.setTimeout(() => searchInput?.focus(), 80);
        });

        document.addEventListener("keydown", event => {
            const target = event.target;
            const typing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
            if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && searchInput) {
                event.preventDefault();
                const compact = ["condensed", "sm-hover", "sm-hover-active"].includes(root.getAttribute("data-sidenav-size"));
                if (compact) expandSidebarForSearch();
                searchInput.focus();
            } else if (event.key === "Escape" && document.activeElement === searchInput && searchInput.value) {
                searchInput.value = "";
                applyMenuSearch();
            }
        });

        updateResponsiveMode();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSidebar, { once: true });
    } else {
        initSidebar();
    }
})();
