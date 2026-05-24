(function () {
    const storageCountKey = 'cotix.headerNotifications.count';
    const storageItemsKey = 'cotix.headerNotifications.items';

    function readStoredCount() {
        const parsed = Number(sessionStorage.getItem(storageCountKey) || 0);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

    function writeStoredCount(value) {
        sessionStorage.setItem(storageCountKey, String(Math.max(0, Number(value) || 0)));
    }

    function readStoredItems() {
        try {
            const raw = sessionStorage.getItem(storageItemsKey);
            const items = raw ? JSON.parse(raw) : [];
            return Array.isArray(items) ? items : [];
        } catch (err) {
            console.error('header-notifications storage error:', err);
            return [];
        }
    }

    function writeStoredItems(items) {
        sessionStorage.setItem(storageItemsKey, JSON.stringify(Array.isArray(items) ? items : []));
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatBadgeCount(count) {
        return count > 99 ? '99+' : String(count);
    }

    function ensureBadgeVisible(badgeEl, count) {
        if (!badgeEl) return;

        const badgeButton = badgeEl.closest('button');
        if (badgeButton) {
            badgeButton.classList.add('position-relative');
        }

        badgeEl.classList.remove('d-none');
        badgeEl.classList.add('position-absolute', 'top-0', 'start-100', 'translate-middle', 'badge', 'rounded-pill', 'bg-danger');
        badgeEl.textContent = formatBadgeCount(count);
    }

    function hideBadge(badgeEl) {
        if (!badgeEl) return;
        badgeEl.textContent = '';
        badgeEl.className = 'noti-icon-badge d-none';
    }

    function renderBadgeFromStorage(badgeEl) {
        const count = readStoredCount();
        if (count > 0) {
            ensureBadgeVisible(badgeEl, count);
        } else {
            hideBadge(badgeEl);
        }
    }

    function notificationHtml(item) {
        const id = escapeHtml(item.id || `notification-${Date.now()}`);
        const usuario = escapeHtml(item.usuario || 'Sistema');
        const titulo = escapeHtml(item.titulo || 'Nuevo item registrado');
        const detalle = escapeHtml(item.detalle || 'Se registró un item de receta');
        const fecha = escapeHtml(item.fecha || '');
        const icon = escapeHtml(item.icon || 'ti-plus');
        const tone = escapeHtml(item.tone || 'secondary');

        return `
            <div class="dropdown-item notification-item py-2 text-wrap active" id="${id}">
                <span class="d-flex align-items-center">
                    <span class="me-3 position-relative flex-shrink-0">
                        <img src="./assets/images/users/avatar-1.jpg" class="avatar-md rounded-circle" alt="" />
                        <span class="position-absolute rounded-pill bg-${tone} notification-badge">
                            <i class="ti ${icon}"></i>
                        </span>
                    </span>

                    <span class="flex-grow-1 text-muted">
                        <span class="fw-medium text-body">${usuario}</span> - ${titulo}
                        <br />
                        <span class="fs-12">${detalle}</span>
                        <br />
                        <span class="fs-12">${fecha}</span>
                    </span>

                    <span class="notification-item-close">
                        <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#${id}">
                            <i class="ti ti-x fs-16"></i>
                        </button>
                    </span>
                </span>
            </div>
        `;
    }

    function prependQueuedNotifications(headerContainer, items) {
        if (!headerContainer || !Array.isArray(items) || !items.length) return;

        const html = items.map(notificationHtml).join('');
        headerContainer.insertAdjacentHTML('afterbegin', html);
    }

    function queueNotification(detail) {
        const currentItems = readStoredItems();
        const nextCount = readStoredCount() + 1;
        const item = {
            id: `notification-item-${Date.now()}`,
            usuario: detail?.usuario || String(window.PERMISOS_STATE?.nombre || '').trim() || 'Sistema',
            titulo: detail?.titulo || 'Nuevo item registrado',
            detalle: detail?.detalle || 'Se registró un item de receta',
            fecha: detail?.fecha || new Date().toLocaleString('es-PE'),
            icon: detail?.icon || 'ti-package',
            tone: detail?.tone || 'success'
        };

        currentItems.unshift(item);
        writeStoredItems(currentItems.slice(0, 10));
        writeStoredCount(nextCount);

        const headerContainer = document.getElementById('dashboard-header-notifications');
        const badgeEl = document.querySelector('.noti-icon-badge');

        if (headerContainer) {
            headerContainer.insertAdjacentHTML('afterbegin', notificationHtml(item));
        }

        ensureBadgeVisible(badgeEl, nextCount);
    }

    window.cotixQueueHeaderNotification = window.cotixQueueHeaderNotification || queueNotification;

    window.addEventListener('cotix:header-notification', (event) => {
        queueNotification(event?.detail || {});
    });

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const headerContainer = document.getElementById('dashboard-header-notifications');
            const badgeEl = document.querySelector('.noti-icon-badge');

            renderBadgeFromStorage(badgeEl);

            if (!headerContainer) return;

            try {
                const flashRes = await fetch('controller/header_notifications.php');
                const flashJson = await flashRes.json();

                if (flashJson.ok && Array.isArray(flashJson.notifications) && flashJson.notifications.length) {
                    const storedItems = readStoredItems();
                    const merged = [...flashJson.notifications, ...storedItems];
                    writeStoredItems(merged.slice(0, 10));
                    writeStoredCount(readStoredCount() + flashJson.notifications.length);

                    prependQueuedNotifications(headerContainer, flashJson.notifications);
                    renderBadgeFromStorage(badgeEl);
                }
            } catch (flashErr) {
                console.error('header-notifications flash error:', flashErr);
            }

            const res = await fetch('controller/dashboard.php');
            const json = await res.json();

            if (json.error || !json.data || !Array.isArray(json.data.header)) return;

            headerContainer.innerHTML = '';

            const badgeClass = (estado) => {
                if (!estado) return 'badge-soft-secondary';
                switch (String(estado).toLowerCase()) {
                    case 'aprobada': return 'badge-soft-success';
                    case 'anulada': return 'badge-soft-danger';
                    case 'enviada': return 'badge-soft-info';
                    default: return 'badge-soft-secondary';
                }
            };

            json.data.header.forEach((h, index) => {
                const avatar = Math.floor(Math.random() * 10) + 1;
                const notifId = `notification-${index + 1}`;
                const usuario = String(h.usuario).toLowerCase();
                const doc = h.doc;
                const fecha = h.ultima_fecha;
                const tipo = String(h.tipo || '').toLowerCase();
                const isLogin = doc && String(doc).length >= 32;

                headerContainer.insertAdjacentHTML('beforeend', `
                    <div class="dropdown-item notification-item py-2 text-wrap ${isLogin ? 'active' : ''}" id="${notifId}">
                        <span class="d-flex align-items-center">
                            <span class="me-3 position-relative flex-shrink-0">
                                <img src="./assets/images/users/avatar-${avatar}.jpg" class="avatar-md rounded-circle" alt="" />
                                <span class="position-absolute rounded-pill bg-${isLogin ? 'danger' : 'secondary'} notification-badge">
                                    <i class="ti ${isLogin ? 'ti-message-circle' : 'ti-plus'}"></i>
                                </span>
                            </span>

                            <span class="flex-grow-1 text-muted">
                                ${
                                    isLogin
                                    ? `<span class="fw-medium text-body">${usuario}</span> inició sesión
                                       <span class="fw-medium text-body"> ${String(doc).substring(0, 12) + '*******'}</span>`
                                    : `<span class="fw-medium text-body">${usuario}</span> - <span class="fw-medium text-body">${tipo}</span>
                                        <span class="badge ${badgeClass(doc)} px-1 py-1 ms-0">${doc}</span>`
                                }
                                <br />
                                <span class="fs-12">${fecha}</span>
                            </span>

                            <span class="notification-item-close">
                                <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#${notifId}">
                                    <i class="ti ti-x fs-16"></i>
                                </button>
                            </span>
                        </span>
                    </div>
                `);
            });

            prependQueuedNotifications(headerContainer, readStoredItems());
        } catch (err) {
            console.error('header-notifications error:', err);
        }
    });
})();
