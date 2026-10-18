document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("permissionsManager");
    const rolesContainer = document.getElementById("permissionsRoles");
    const roleList = document.getElementById("permissionRoleList");
    const rolePanel = document.getElementById("permissionRolePanel");
    const roleCount = document.getElementById("permissionRoleCount");
    const loading = document.getElementById("permissionsLoading");
    const saveButton = document.getElementById("btnGuardarPermisos");
    const addButton = document.getElementById("btnAgregarRol");
    const newRoleId = document.getElementById("newRoleId");
    const newRoleName = document.getElementById("newRoleName");
    if (!root || !rolesContainer) return;

    const apiUrl = "controller/permisos_api.php";
    const csrfToken = root.dataset.csrf || "";
    let availablePages = [];
    let userCounts = {};
    let roleData = {};
    let selectedRoleId = null;

    fetch(apiUrl)
        .then(async response => {
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "No se pudieron cargar los permisos");
            availablePages = Array.isArray(data.paginas) ? data.paginas : [];
            userCounts = data.usuarios_por_cargo || {};
            renderRoles(data.roles || {});
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
        entries.forEach(([id, role]) => {
            const userCount = Number(userCounts[id] || 0);
            const button = document.createElement("button");
            button.type = "button";
            button.className = `permission-role-nav-item${String(id) === String(selectedRoleId) ? " active" : ""}`;
            button.setAttribute("role", "tab");
            button.setAttribute("aria-selected", String(id) === String(selectedRoleId) ? "true" : "false");
            button.innerHTML = `
                <span class="permission-role-nav-name">${escapeHtml(role.nombre || `Rol ${id}`)}</span>
                <span class="permission-role-nav-meta">${escapeHtml(id)} · ${userCount} usuario${userCount === 1 ? "" : "s"}</span>
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
            <label class="permission-page-option">
                <input class="form-check-input permission-page-check" type="checkbox" value="${escapeHtml(page)}" ${allowed.has(page) ? "checked" : ""} ${allAccess ? "disabled" : ""}>
                <span>${escapeHtml(page)}</span>
            </label>
        `).join("");

        card.innerHTML = `
            <div class="permission-role-header">
                <div class="permission-role-heading">
                    <span class="permission-role-id">Rol ${escapeHtml(id)}</span>
                    <input class="form-control permission-role-name" type="text" maxlength="80" value="${escapeHtml(role.nombre || "")}" aria-label="Nombre del rol ${escapeHtml(id)}" ${isAdmin ? "readonly" : ""}>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <label class="form-check permission-all-access mb-0">
                        <input class="form-check-input permission-all-check" type="checkbox" ${allAccess ? "checked" : ""} ${isAdmin ? "disabled" : ""}>
                        <span class="form-check-label">Acceso total</span>
                    </label>
                    ${isAdmin
                        ? '<span class="badge bg-primary-subtle text-primary">Protegido</span>'
                        : `<button type="button" class="btn btn-sm btn-outline-danger permission-delete-role" ${assignedUsers > 0 ? "disabled title=\"Reasigna primero los usuarios que tienen este cargo\"" : ""}>Eliminar rol</button>`}
                </div>
            </div>
            <div class="permission-role-pages ${allAccess ? "is-all-access" : ""}">
                <div class="permission-pages-heading">Páginas permitidas</div>
                <div class="permission-pages-grid">${pageChoices}</div>
            </div>
        `;

        const allAccessInput = card.querySelector(".permission-all-check");
        allAccessInput?.addEventListener("change", () => {
            card.querySelectorAll(".permission-page-check").forEach(input => {
                input.disabled = allAccessInput.checked;
            });
            card.querySelector(".permission-role-pages")?.classList.toggle("is-all-access", allAccessInput.checked);
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
                    renderRoles(roleData);
                },
                () => {}
            ).set({ title: "Eliminar rol" });
        });

        return card;
    }

    addButton?.addEventListener("click", () => {
        const id = String(newRoleId?.value || "").trim();
        const name = String(newRoleName?.value || "").trim();
        if (!/^\d{1,6}$/.test(id) || Number(id) < 1) {
            alertify.warning("Ingresa un ID numérico positivo para el rol");
            return;
        }
        if (!name || name.length > 80) {
            alertify.warning("Ingresa un nombre para el rol (máximo 80 caracteres)");
            return;
        }
        if (Object.prototype.hasOwnProperty.call(roleData, id)) {
            alertify.warning("Ya existe un rol con ese ID");
            return;
        }

        saveActiveRole();
        roleData[id] = { nombre: name, acceso: [] };
        userCounts[id] = Number(userCounts[id] || 0);
        selectedRoleId = id;
        renderRoles(roleData);
        newRoleId.value = "";
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
            alertify.success(data.message || "Permisos guardados correctamente");
        } catch (error) {
            alertify.error(error.message || "Error al guardar los permisos");
        } finally {
            saveButton.disabled = false;
        }
    });
});
