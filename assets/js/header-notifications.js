(() => {
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

    function parseMeta(meta) {
        if (!meta) return {};
        if (typeof meta === 'object') return meta;

        try {
            return JSON.parse(meta);
        } catch (_) {
            return {};
        }
    }

    function notificationUrl(item) {
        const meta = parseMeta(item.meta_json || item.meta);
        const tipo = String(item.tipo || '').trim();

        if (tipo !== 'item_receta') {
            return '';
        }

        if (meta.item_hash) {
            return `upd_item_receta.php?hash=${encodeURIComponent(String(meta.item_hash))}`;
        }

        if (meta.item_id && typeof md5 === 'function') {
            return `upd_item_receta.php?hash=${md5(String(meta.item_id))}`;
        }

        return '';
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

    function notificationHtml(item) {
        const id = escapeHtml(item.id || item.domId || `notification-${Date.now()}`);
        const usuario = escapeHtml(item.usuario || 'Sistema');
        const titulo = escapeHtml(item.titulo || 'Nuevo item registrado');
        const detalle = escapeHtml(item.detalle || 'Se registró un item de receta');
        const fecha = escapeHtml(item.fecha || item.created_at || '');
        const icon = escapeHtml(item.icon || 'ti-plus');
        const tone = escapeHtml(item.tone || 'secondary');
        const url = notificationUrl(item);
        const attrs = url ? ` role="button" data-href="${escapeHtml(url)}" style="cursor:pointer;"` : '';

        return `
            <div class="dropdown-item notification-item py-2 text-wrap active" id="${id}"${attrs}>
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

    function createNotificationEntry(item, prefix) {
        const rawId = String(item.id || '');
        const finalId = rawId.startsWith('notification-') ? rawId : `${prefix}-${rawId}`;
        const key = String(item.key || rawId || finalId);

        return {
            id: finalId,
            key,
            usuario: item.usuario,
            titulo: item.titulo,
            detalle: item.detalle,
            fecha: item.fecha || item.created_at,
            icon: item.icon,
            tone: item.tone,
            tipo: item.tipo,
            meta_json: item.meta_json
        };
    }

    function renderNotifications(headerContainer, badgeEl, items) {
        const seen = new Set();
        headerContainer.innerHTML = '';

        (Array.isArray(items) ? items : []).forEach(item => {
            const key = String(item.key || item.id || '');
            if (!key || seen.has(key)) {
                return;
            }

            seen.add(key);
            headerContainer.insertAdjacentHTML('beforeend', notificationHtml(item));
        });

        const count = seen.size;
        if (count > 0) {
            ensureBadgeVisible(badgeEl, count);
        } else {
            hideBadge(badgeEl);
        }

        return seen;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const headerContainer = document.getElementById('dashboard-header-notifications');
            const badgeEl = document.querySelector('.noti-icon-badge');
            if (!headerContainer) return;

            headerContainer.innerHTML = '';

            const [dashboardRes, notificationsRes] = await Promise.all([
                fetch('controller/dashboard.php'),
                fetch('controller/header_notifications.php')
            ]);

            const dashboardJson = await dashboardRes.json();
            const notificationsJson = await notificationsRes.json();

            const dashboardItems = Array.isArray(dashboardJson?.data?.header) ? dashboardJson.data.header.map((item, index) => createNotificationEntry({
                id: `dashboard-${index + 1}`,
                key: `dashboard-${index + 1}`,
                usuario: String(item.usuario || '').toLowerCase(),
                titulo: String(item.tipo || 'Actividad').toLowerCase(),
                detalle: item.doc && String(item.doc).length >= 32
                    ? `inició sesión ${String(item.doc).substring(0, 12)}*******`
                    : String(item.doc || ''),
                fecha: item.ultima_fecha,
                icon: item.doc && String(item.doc).length >= 32 ? 'ti-message-circle' : 'ti-plus',
                tone: item.doc && String(item.doc).length >= 32 ? 'danger' : 'secondary'
            }, 'notification-dashboard')) : [];

            const persistedItems = Array.isArray(notificationsJson?.notifications) ? notificationsJson.notifications.map(item => createNotificationEntry({
                id: `db-${item.id}`,
                key: `db-${item.id}`,
                usuario: item.usuario,
                titulo: item.titulo,
                detalle: item.detalle,
                fecha: item.created_at,
                icon: item.icon,
                tone: item.tone,
                tipo: item.tipo,
                meta_json: item.meta_json
            }, 'notification-db')) : [];

            const allItems = [...persistedItems, ...dashboardItems];

            const seenIds = renderNotifications(headerContainer, badgeEl, allItems);

            if (typeof window.EventSource !== 'undefined') {
                const stream = new EventSource('controller/stream_header_notifications.php');

                stream.addEventListener('header_notifications', event => {
                    try {
                        const payload = JSON.parse(event.data || '{}');
                        const items = Array.isArray(payload.notifications) ? payload.notifications : [];

                        items.forEach(item => {
                            const rendered = createNotificationEntry({
                                id: `db-${item.id}`,
                                key: `db-${item.id}`,
                                usuario: item.usuario,
                                titulo: item.titulo,
                                detalle: item.detalle,
                                fecha: item.created_at,
                                icon: item.icon,
                                tone: item.tone,
                                tipo: item.tipo,
                                meta_json: item.meta_json
                            }, 'notification-live');

                            if (!rendered.key || seenIds.has(rendered.key)) {
                                return;
                            }

                            seenIds.add(rendered.key);
                            headerContainer.insertAdjacentHTML('afterbegin', notificationHtml(rendered));
                            ensureBadgeVisible(badgeEl, seenIds.size);
                        });
                    } catch (err) {
                        console.error('header-notifications stream parse error:', err);
                    }
                });

                stream.addEventListener('error', () => {
                    // SSE reconecta solo.
                });
            }

            document.addEventListener('click', event => {
                if (event.target.closest('.notification-item-close')) {
                    return;
                }

                const item = event.target.closest('.notification-item[data-href]');
                if (!item) return;

                window.location.href = item.dataset.href;
            });
        } catch (err) {
            console.error('header-notifications error:', err);
        }
    });
})();
