document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("permissionsManager");
    const rolesContainer = document.getElementById("permissionsRoles");
    const roleList = document.getElementById("permissionRoleList");
    const rolePanel = document.getElementById("permissionRolePanel");
    const roleCount = document.getElementById("permissionRoleCount");
    const loading = document.getElementById("permissionsLoading");
    const saveButton = document.getElementById("btnGuardarPermisos");
    const dirtyState = document.getElementById("permissionsDirtyState");
    const roleSearch = document.getElementById("permissionRoleSearch");
    const addButton = document.getElementById("btnAgregarRol");
    const newRoleName = document.getElementById("newRoleName");
    if (!root || !rolesContainer) return;

    const apiUrl = "controller/permisos_api.php";
    const csrfToken = root.dataset.csrf || "";
    let availablePages = [];
    let userCounts = {};
    let roleData = {};
    let selectedRoleId = null;
    let isDirty = false;

    function setDirty(dirty) {
        isDirty = Boolean(dirty);
        if (!dirtyState) return;
        dirtyState.dataset.state = isDirty ? "dirty" : "clean";
        dirtyState.innerHTML = isDirty
            ? '<i class="ti ti-point-filled"></i><span>Cambios pendientes</span>'
            : '<i class="ti ti-circle-check"></i><span>Sin cambios pendientes</span>';
        if (saveButton) saveButton.classList.toggle("is-pending", isDirty);
    }

    roleSearch?.addEventListener("input", () => {
        saveActiveRole();
        renderRoleNavigation(Object.entries(roleData).sort(([idA], [idB]) => Number(idA) - Number(idB)));
    });

    fetch(apiUrl)
        .then(async response => {
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "No se pudieron cargar los permisos");
            availablePages = Array.isArray(data.paginas) ? data.paginas : [];
            userCounts = data.usuarios_por_cargo || {};
            renderRoles(data.roles || {});
            setDirty(false);
            loading?.classList.add("d-none");
            rolesContainer.classList.remove("d-none");
        })
        .catch(error => {
            if (loading) loading.innerHTML = `<div class="alert alert-danger mb-0">${escapeHtml(error.message)}</div>`;
        });

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderRoles(roles) {
        roleData = roles;
        const entries = Object.entries(roleData).sort(([idA], [idB]) => Number(idA) - Number(idB));
        if (!entries.length) {
            selectedRoleId = null;
            renderRoleNavigation(entries);
            if (rolePanel) rolePanel.innerHTML = '<div class="alert alert-warning">No hay cargos configurados.</div>';
            return;
        }
        if (!selectedRoleId || !Object.prototype.hasOwnProperty.call(roleData, selectedRoleId)) {
            selectedRoleId = entries[0][0];
        }
        renderRoleNavigation(entries);
        renderSelectedRole();
    }

    function renderRoleNavigation(entries) {
        if (!roleList) return;
        roleList.innerHTML = "";
        if (roleCount) roleCount.textContent = String(entries.length);
        const query = String(roleSearch?.value || "").trim().toLowerCase();
        const visibleEntries = query
            ? entries.filter(([id, role]) => String(role.nombre || "").toLowerCase().includes(query))
            : entries;
        if (!visibleEntries.length) {
            roleList.innerHTML = '<div class="permission-role-empty"><i class="ti ti-search-off"></i><span>Sin coincidencias</span></div>';
            return;
        }
        visibleEntries.forEach(([id, role]) => {
            const userCount = Number(userCounts[id] || 0);
            const button = document.createElement("button");
            button.type = "button";
            button.className = `permission-role-nav-item${String(id) === String(selectedRoleId) ? " active" : ""}`;
            button.setAttribute("role", "tab");
            button.setAttribute("aria-selected", String(id) === String(selectedRoleId) ? "true" : "false");
            button.innerHTML = `
                <span class="permission-role-nav-name">${escapeHtml(role.nombre || `Rol ${id}`)}</span>
                <span class="permission-role-nav-meta" aria-label="${userCount} usuario${userCount === 1 ? "" : "s"}">
                    <i class="ti ti-users" aria-hidden="true"></i>
                    <strong>${userCount}</strong>
                </span>
            `;
            button.addEventListener("click", () => {
                if (String(id) === String(selectedRoleId)) return;
                saveActiveRole();
                selectedRoleId = String(id);
                renderRoleNavigation(Object.entries(roleData).sort(([idA], [idB]) => Number(idA) - Number(idB)));
                renderSelectedRole();
            });
            roleList.appendChild(button);
        });
    }

    function renderSelectedRole() {
        if (!rolePanel || !selectedRoleId) return;
        rolePanel.replaceChildren(createRoleCard(selectedRoleId, roleData[selectedRoleId] || {}));
    }

    function saveActiveRole() {
        if (!selectedRoleId || !rolePanel) return;
        const card = rolePanel.querySelector(".permission-role-card");
        if (!card) return;

        const nombre = String(card.querySelector(".permission-role-name")?.value || "").trim();
        const all = Boolean(card.querySelector(".permission-all-check")?.checked);
        const acceso = all
            ? "*"
            : Array.from(card.querySelectorAll(".permission-page-check:checked"), input => input.value);
        roleData[selectedRoleId] = { nombre, acceso };
    }

    function createRoleCard(id, role = {}) {
        const isAdmin = String(id) === "1";
        const assignedUsers = Number(userCounts[id] || 0);
        const allAccess = role.acceso === "*";
        const allowed = new Set(Array.isArray(role.acceso) ? role.acceso : []);
        const card = document.createElement("section");
        card.className = "card permission-role-card";
        card.dataset.roleId = String(id);

        const pageChoices = availablePages.map(page => `
            <label class="permission-page-option form-check form-switch">
                <input class="form-check-input permission-page-check" type="checkbox" role="switch" value="${escapeHtml(page)}" ${allowed.has(page) ? "checked" : ""} ${allAccess ? "disabled" : ""}>
                <span class="permission-page-label">${escapeHtml(page)}</span>
            </label>
        `).join("");

        card.innerHTML = `
            <div class="permission-role-header">
                <div class="permission-role-heading">
                    <span class="permission-role-avatar ${isAdmin ? "is-admin" : ""}" aria-hidden="true">
                        <i class="ti ${isAdmin ? "ti-shield-check" : "ti-user-shield"}"></i>
                    </span>
                    <div class="permission-role-heading-copy">
                        <span class="permission-role-kicker">${isAdmin ? "Rol protegido" : "Rol seleccionado"}</span>
                        <input class="form-control permission-role-name" type="text" maxlength="80" value="${escapeHtml(role.nombre || "")}" aria-label="Nombre del rol ${escapeHtml(id)}" ${isAdmin ? "readonly" : ""}>
                        <span class="permission-role-user-count"><i class="ti ti-users"></i>${assignedUsers} usuario${assignedUsers === 1 ? "" : "s"} asignado${assignedUsers === 1 ? "" : "s"}</span>
                    </div>
                </div>
                <div class="permission-role-actions">
                    <label class="form-check form-switch permission-all-access mb-0">
                        <input class="form-check-input permission-all-check" type="checkbox" role="switch" ${allAccess ? "checked" : ""} ${isAdmin ? "disabled" : ""}>
                        <span class="form-check-label">Acceso total</span>
                    </label>
                    ${isAdmin
                        ? '<span class="badge bg-primary-subtle text-primary">Protegido</span>'
                        : `<button type="button" class="btn btn-sm btn-outline-danger permission-delete-role" ${assignedUsers > 0 ? 'disabled aria-label="Reasigna primero los usuarios de este cargo"' : ""}><i class="ti ti-trash me-1"></i>Eliminar</button>`}
                </div>
            </div>
            <div class="permission-role-pages ${allAccess ? "is-all-access" : ""}">
                <div class="permission-pages-toolbar">
                    <div>
                        <div class="permission-pages-heading">Páginas permitidas</div>
                        <span class="permission-pages-summary">${allowed.size} de ${availablePages.length} seleccionadas</span>
                    </div>
                    <div class="permission-page-tools">
                        <label class="permission-page-search" for="permissionPageSearch-${escapeHtml(id)}">
                            <i class="ti ti-search"></i>
                            <input id="permissionPageSearch-${escapeHtml(id)}" type="search" placeholder="Buscar página" autocomplete="off">
                        </label>
                        ${isAdmin ? "" : '<button type="button" class="btn btn-sm btn-light permission-select-all">Todas</button><button type="button" class="btn btn-sm btn-light permission-select-none">Ninguna</button>'}
                    </div>
                </div>
                <div class="permission-pages-grid">${pageChoices}</div>
            </div>
        `;

        const allAccessInput = card.querySelector(".permission-all-check");
        allAccessInput?.addEventListener("change", () => {
            card.querySelectorAll(".permission-page-check").forEach(input => {
                input.disabled = allAccessInput.checked;
            });
            card.querySelector(".permission-role-pages")?.classList.toggle("is-all-access", allAccessInput.checked);
            setDirty(true);
            updatePageSummary();
        });

        const updatePageSummary = () => {
            if (allAccessInput?.checked) {
                const summary = card.querySelector(".permission-pages-summary");
                if (summary) summary.textContent = `${availablePages.length} de ${availablePages.length} seleccionadas`;
                return;
            }
            const checked = card.querySelectorAll(".permission-page-check:checked").length;
            const summary = card.querySelector(".permission-pages-summary");
            if (summary) summary.textContent = `${checked} de ${availablePages.length} seleccionadas`;
        };

        card.querySelector(".permission-role-name")?.addEventListener("input", () => setDirty(true));
        card.querySelectorAll(".permission-page-check").forEach(input => {
            input.addEventListener("change", () => {
                updatePageSummary();
                setDirty(true);
            });
        });

        const pageSearch = card.querySelector(".permission-page-search input");
        pageSearch?.addEventListener("input", () => {
            const query = String(pageSearch.value || "").trim().toLowerCase();
            card.querySelectorAll(".permission-page-option").forEach(option => {
                option.hidden = query !== "" && !String(option.textContent || "").toLowerCase().includes(query);
            });
        });

        card.querySelector(".permission-select-all")?.addEventListener("click", () => {
            card.querySelectorAll(".permission-page-check:not(:disabled)").forEach(input => { input.checked = true; });
            updatePageSummary();
            setDirty(true);
        });
        card.querySelector(".permission-select-none")?.addEventListener("click", () => {
            card.querySelectorAll(".permission-page-check:not(:disabled)").forEach(input => { input.checked = false; });
            updatePageSummary();
            setDirty(true);
        });

        card.querySelector(".permission-delete-role")?.addEventListener("click", () => {
            if (assignedUsers > 0) {
                alertify.warning("Reasigna los usuarios de este cargo antes de eliminar el rol");
                return;
            }
            alertify.confirm(
                "Eliminar rol",
                `¿Eliminar el rol ${id} (${role.nombre || "sin nombre"})?`,
                () => {
                    saveActiveRole();
                    delete roleData[id];
                    selectedRoleId = Object.keys(roleData).sort((a, b) => Number(a) - Number(b))[0] || null;
                    setDirty(true);
                    renderRoles(roleData);
                },
                () => {}
            ).set({ title: "Eliminar rol" });
        });

        return card;
    }

    addButton?.addEventListener("click", () => {
        const name = String(newRoleName?.value || "").trim();
        if (!name || name.length > 80) {
            alertify.warning("Ingresa un nombre para el rol (máximo 80 caracteres)");
            return;
        }

        const existingIds = Object.keys(roleData).map(Number).filter(Number.isInteger);
        let id = 1;
        while (existingIds.includes(id)) {
            id++;
        }

        id = String(id);
        saveActiveRole();
        roleData[id] = { nombre: name, acceso: [] };
        userCounts[id] = Number(userCounts[id] || 0);
        selectedRoleId = id;
        setDirty(true);
        renderRoles(roleData);
        newRoleName.value = "";
        rolePanel?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    saveButton?.addEventListener("click", async () => {
        saveActiveRole();

        saveButton.disabled = true;
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify({ roles: roleData })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "No se pudieron guardar los permisos");
            renderRoleNavigation(Object.entries(roleData).sort(([idA], [idB]) => Number(idA) - Number(idB)));
            setDirty(false);
            alertify.success(data.message || "Permisos guardados correctamente");
        } catch (error) {
            alertify.error(error.message || "Error al guardar los permisos");
        } finally {
            saveButton.disabled = false;
        }
    });
});
