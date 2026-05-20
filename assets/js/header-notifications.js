document.addEventListener('DOMContentLoaded', async () => {
    try {
        const headerContainer = document.getElementById('dashboard-header-notifications');
        if (!headerContainer) return;

        const res = await fetch('controller/dashboard.php');
        const json = await res.json();

        if (json.error || !json.data || !Array.isArray(json.data.header)) return;

        headerContainer.innerHTML = '';

        json.data.header.forEach((h, index) => {
            const avatar = Math.floor(Math.random() * 10) + 1;
            const notifId = `notification-${index + 1}`;
            const usuario = String(h.usuario).toLowerCase();
            const doc = h.doc;
            const fecha = h.ultima_fecha;
            const tipo = String(h.tipo || '').toUpperCase();
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
                                   <span class="fw-medium text-body"> ${String(doc).substring(0, 12)+'*******'}</span>`
                                          : `<span class="fw-medium text-body">${usuario}</span> - <span class="fw-medium text-body">${tipo} </span>
                                              <span class="fw-medium text-body text-truncate">[${doc}]</span>`
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

    } catch (err) {
        console.error('header-notifications error:', err);
    }
});
