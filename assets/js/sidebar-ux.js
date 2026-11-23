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
        let submenuFlyout = null;
        let submenuFlyoutControl = null;

        const closeSubmenuFlyout = () => {
            submenuFlyout?.remove();
            submenuFlyout = null;
            submenuFlyoutControl?.setAttribute("aria-expanded", "false");
            submenuFlyoutControl = null;
        };

        const openSubmenuFlyout = (control, panel) => {
            if (submenuFlyoutControl === control) {
                closeSubmenuFlyout();
                return true;
            }

            const childLinks = Array.from(panel.querySelectorAll(".side-nav-link"))
                .filter(link => !link.matches('[data-bs-toggle="collapse"]') && link.getAttribute("href"));
            if (!childLinks.length) return false;

            closeSubmenuFlyout();
            const flyout = document.createElement("div");
            flyout.className = "cotix-sidebar-flyout";
            flyout.dataset.cotixSidebarFlyout = "true";
            flyout.setAttribute("role", "menu");

            const heading = document.createElement("div");
            heading.className = "cotix-sidebar-flyout-title";
            heading.textContent = control.querySelector(".menu-text")?.textContent?.trim() || "Menú";
            flyout.appendChild(heading);

            const list = document.createElement("div");
            list.className = "cotix-sidebar-flyout-links";
            childLinks.forEach(source => {
                const link = document.createElement("a");
                link.className = "cotix-sidebar-flyout-link";
                link.href = source.getAttribute("href");
                link.setAttribute("role", "menuitem");
                const label = source.querySelector(".menu-text")?.textContent?.trim() || source.textContent.trim();
                link.textContent = label;
                link.addEventListener("click", closeSubmenuFlyout, { once: true });
                list.appendChild(link);
            });
            flyout.appendChild(list);
            document.body.appendChild(flyout);

            const icon = control.querySelector(":scope > .menu-icon") || control;
            const iconRect = icon.getBoundingClientRect();
            const flyoutRect = flyout.getBoundingClientRect();
            const left = iconRect.right + 9 + flyoutRect.width <= window.innerWidth - 8
                ? iconRect.right + 9
                : Math.max(8, iconRect.left - flyoutRect.width - 9);
            const top = Math.max(8, Math.min(iconRect.top - 8, window.innerHeight - flyoutRect.height - 8));
            flyout.style.left = `${Math.round(left)}px`;
            flyout.style.top = `${Math.round(top)}px`;
            submenuFlyout = flyout;
            submenuFlyoutControl = control;
            control.setAttribute("aria-expanded", "true");
            window.bootstrap?.Tooltip?.getInstance(control)?.hide();
            return true;
        };

        document.addEventListener("pointerdown", event => {
            if (!submenuFlyout) return;
            if (submenuFlyout.contains(event.target) || submenuFlyoutControl?.contains(event.target)) return;
            closeSubmenuFlyout();
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && submenuFlyout) {
                const control = submenuFlyoutControl;
                closeSubmenuFlyout();
                control?.focus();
            }
        });
        window.addEventListener("resize", closeSubmenuFlyout);

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
            if (!compact) closeSubmenuFlyout();
            menuItems.forEach(item => {
                const link = item.querySelector(":scope > .side-nav-link");
                const label = item.querySelector(":scope > .side-nav-link .menu-text")?.textContent?.trim();
                if (!link || !label) return;
                if (compact) {
                    link.removeAttribute("title");
                    link.setAttribute("data-bs-placement", "right");
                    link.setAttribute("data-bs-custom-class", "cotix-sidebar-tooltip");
                    link.setAttribute("data-bs-title", label);
                    if (window.bootstrap?.Tooltip) {
                        if (link._cotixPositionHandler) {
                            link.removeEventListener("shown.bs.tooltip", link._cotixPositionHandler);
                        }
                        // Dispose any theme-created instance first: getOrCreateInstance
                        // does not apply new placement options to an existing tooltip.
                        window.bootstrap.Tooltip.getInstance(link)?.dispose();
                        const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(link, {
                            trigger: "hover focus",
                            container: "body",
                            placement: "right",
                            offset: ({ placement }) => {
                                const icon = link.querySelector(":scope > .menu-icon");
                                if (!icon || !String(placement).startsWith("right")) return [0, 8];
                                const linkRect = link.getBoundingClientRect();
                                const iconRect = icon.getBoundingClientRect();
                                const verticalAlign = iconRect.top + iconRect.height / 2 - (linkRect.top + linkRect.height / 2);
                                const horizontalGap = 8 + iconRect.right - linkRect.right;
                                return [verticalAlign, horizontalGap];
                            },
                            fallbackPlacements: ["right"],
                            boundary: "viewport"
                        });
                        const positionTooltip = () => {
                            const describedBy = link.getAttribute("aria-describedby");
                            const tooltipElement = tooltipInstance.getTipElement?.()
                                || tooltipInstance._getTipElement?.()
                                || (describedBy ? document.getElementById(describedBy) : null);
                            if (!tooltipElement || !tooltipElement.classList.contains("show")) return;
                            // In condensed mode the anchor can retain the expanded
                            // sidebar width while being visually clipped. Position from
                            // the visible icon, not the full-width anchor box.
                            const anchor = link.querySelector(":scope > .menu-icon") || link;
                            const rect = anchor.getBoundingClientRect();
                            const tooltipRect = tooltipElement.getBoundingClientRect();
                            const left = Math.max(8, Math.min(rect.right + 8, window.innerWidth - tooltipRect.width - 8));
                            const top = Math.max(8, Math.min(rect.top + (rect.height - tooltipRect.height) / 2, window.innerHeight - tooltipRect.height - 8));
                            tooltipElement.style.setProperty("position", "fixed", "important");
                            tooltipElement.style.setProperty("inset", "auto", "important");
                            tooltipElement.style.setProperty("transform", "none", "important");
                            tooltipElement.style.left = `${Math.round(left)}px`;
                            tooltipElement.style.top = `${Math.round(top)}px`;
                        };
                        link._cotixPositionHandler = () => requestAnimationFrame(() => requestAnimationFrame(positionTooltip));
                        link.addEventListener("shown.bs.tooltip", link._cotixPositionHandler);
                    }
                } else {
                    window.bootstrap?.Tooltip?.getInstance(link)?.dispose();
                    link.removeAttribute("title");
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

        nav.addEventListener("click", event => {
            const control = event.target.closest('.side-nav-link[data-bs-toggle="collapse"]');
            if (!control || !nav.contains(control)) return;

            const selector = control.getAttribute("data-bs-target") || control.getAttribute("href");
            if (!selector?.startsWith("#")) return;
            const panel = document.querySelector(selector);
            if (!panel) return;

            event.preventDefault();
            event.stopPropagation();
            const compact = ["condensed", "sm-hover", "sm-hover-active"].includes(root.getAttribute("data-sidenav-size"));
            if (compact && openSubmenuFlyout(control, panel)) return;
            closeSubmenuFlyout();
            const shouldOpen = compact || !panel.classList.contains("show");
            if (compact) {
                root.setAttribute("data-sidenav-size", "default");
                if (window.config?.sidenav) window.config.sidenav.size = "default";
                if (desktop.matches) root.classList.add("cotix-sidebar-resizable");
            }
            if (window.bootstrap?.Collapse) {
                const collapse = bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false });
                shouldOpen ? collapse.show() : collapse.hide();
            } else {
                panel.classList.toggle("show", shouldOpen);
            }
            control.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
            if (window.location.hash === selector) {
                history.replaceState(null, "", `${location.pathname}${location.search}`);
            }
        }, true);

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
