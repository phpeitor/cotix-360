document.addEventListener("DOMContentLoaded", () => {
    function escHtml(s) { const d = document.createElement("div"); d.appendChild(document.createTextNode(String(s ?? ""))); return d.innerHTML; }

    const modal = document.getElementById("modalActividadesTracking");
    const body = document.getElementById("actividadesModalBody");
    if (!modal || !body) return;

    const btnGuardar = document.getElementById("btnGuardarActividades");
    const codEl = document.getElementById("actTrackingCod");
    const countInfo = document.getElementById("actividades-count-info");
    const modalInstance = modal ? (bootstrap.Modal.getOrCreateInstance(modal)) : null;

    let trackingId = 0;

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-tracking-actividades]");
        if (!btn) return;

        trackingId = Number(btn.dataset.trackingId || 0);
        if (!trackingId) return;

        const cod = String(btn.dataset.trackingCod || "-");
        const estado = String(btn.dataset.trackingEstado || "abierto").trim();
        if (codEl) codEl.textContent = cod;

        resetForm();
        cargarActividades(trackingId, estado);
        modalInstance?.show();
    });

    body.addEventListener("change", (e) => {
        const check = e.target.closest("input.act-check");
        if (check) {
            const row = check.closest("tr");
            if (!row) return;
            const fecha = row.querySelector("input.act-fecha");
            const obs = row.querySelector("input.act-obs");
            [fecha, obs].forEach((input) => {
                if (input) input.disabled = !check.checked;
            });
            actualizarInfo();
        }
    });

    btnGuardar?.addEventListener("click", async () => {
        const registradas = recogerActividades();
        const fasesRegistradas = new Set(registradas.map((a) => a.fase));

        if (!fasesRegistradas.has("Inicio")) {
            alertify.warning("Debe registrar al menos una actividad de la fase Inicio");
            return;
        }

        btnGuardar.disabled = true;
        try {
            const fd = new FormData();
            fd.append("tracking_id", String(trackingId));
            registradas.forEach((act, index) => {
                fd.append(`actividades[${index}][fase]`, act.fase);
                fd.append(`actividades[${index}][actividad]`, act.actividad);
                fd.append(`actividades[${index}][fecha]`, act.fecha);
                fd.append(`actividades[${index}][observacion]`, act.observacion);
            });

            const res = await fetch("controller/tracking/save_actividades_tracking.php", {
                method: "POST",
                body: fd,
            });

            const ct = res.headers.get("content-type") || "";
            const json = ct.includes("application/json")
                ? await res.json()
                : { success: false, message: await res.text() };

            if (json.success) {
                alertify.success("Actividades guardadas correctamente");
                modalInstance?.hide();
                document.getElementById("btn_buscar")?.click();
            } else {
                alertify.error("Alerta: " + String(json.message || "No se pudo guardar."));
            }
        } catch (err) {
            console.error(err);
            alertify.error("Fallo de red o excepción, revisa consola");
        } finally {
            btnGuardar.disabled = false;
        }
    });

    function resetForm() {
        body.querySelectorAll("input.act-check").forEach((check) => {
            check.checked = false;
            const row = check.closest("tr");
            if (!row) return;
            const fecha = row.querySelector("input.act-fecha");
            const obs = row.querySelector("input.act-obs");
            if (fecha) { fecha.value = ""; fecha.disabled = true; }
            if (obs) { obs.value = ""; obs.disabled = true; }
        });
        actualizarInfo();
    }

    async function cargarActividades(id, estado) {
        const cerrado = estado === "cerrado";

        try {
            const res = await fetch(`controller/tracking/table_actividades_tracking.php?tracking_id=${id}`);
            const json = await res.json();

            if (!json.success) {
                alertify.error("Alerta: " + String(json.message || "No se pudieron cargar las actividades."));
                return;
            }

            const registradas = json.actividades || [];
            const popup = new Map(registradas.map((a) => [
                `${a.fase}|${a.actividad}`,
                a
            ]));

            body.querySelectorAll("input.act-check").forEach((check) => {
                const key = `${check.dataset.fase}|${check.dataset.actividad}`;
                const saved = popup.get(key);
                if (!saved) return;

                const row = check.closest("tr");
                if (!row) return;

                check.checked = true;
                const fecha = row.querySelector("input.act-fecha");
                const obs = row.querySelector("input.act-obs");
                if (fecha) { fecha.value = saved.fecha || ""; fecha.disabled = cerrado || false; }
                if (obs) { obs.value = saved.observacion || ""; obs.disabled = cerrado || false; }
                if (cerrado) check.disabled = true;
            });

            if (cerrado) {
                body.querySelectorAll("input.act-check:not(:checked)").forEach((check) => {
                    check.disabled = true;
                });
                if (btnGuardar) btnGuardar.disabled = true;
            } else {
                if (btnGuardar) btnGuardar.disabled = false;
            }

            actualizarInfo();
        } catch (err) {
            console.error(err);
            alertify.error("Fallo de red al cargar actividades");
        }
    }

    function recogerActividades() {
        const result = [];

        body.querySelectorAll("input.act-check:checked").forEach((check) => {
            const row = check.closest("tr");
            if (!row) return;

            const fecha = row.querySelector("input.act-fecha")?.value || "";
            const obs = row.querySelector("input.act-obs")?.value || "";

            result.push({
                fase: check.dataset.fase || "",
                actividad: check.dataset.actividad || "",
                fecha,
                observacion: obs
            });
        });

        return result;
    }

    function actualizarInfo() {
        const count = body.querySelectorAll("input.act-check:checked").length;
        if (countInfo) countInfo.textContent = `${count} actividad(es) registrada(s)`;
    }

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-cerrar-tracking]");
        if (!btn) return;

        const idTracking = String(btn.dataset.trackingId || "").trim();
        const codTracking = String(btn.dataset.trackingCod || "").trim();

        if (!idTracking) return;

        alertify.confirm(
            "Cerrar tracking",
            `¿Está seguro de cerrar el tracking ${codTracking}?`,
            async () => {
                try {
                    const fd = new FormData();
                    fd.append("tracking_id", idTracking);

                    const res = await fetch("controller/tracking/cerrar_tracking.php", {
                        method: "POST",
                        body: fd,
                    });

                    const ct = res.headers.get("content-type") || "";
                    const json = ct.includes("application/json")
                        ? await res.json()
                        : { ok: false, message: await res.text() };

                    if (json.ok) {
                        alertify.success("Tracking cerrado correctamente");
                        document.getElementById("btn_buscar")?.click();
                    } else {
                        alertify.error("Alerta: " + String(json.message || "No se pudo cerrar."));
                    }
                } catch (err) {
                    console.error(err);
                    alertify.error("Fallo de red o excepción, revisa consola");
                }
            },
            () => {}
        ).set({ title: "Cerrar tracking" });
    });

    const PHASES = [
        { name: 'Inicio', icon: 'ti ti-home' },
        { name: 'Planificación', icon: 'ti ti-clipboard' },
        { name: 'Fabricación', icon: 'ti ti-settings' },
        { name: 'Instalación / Entrega', icon: 'ti ti-truck' },
        { name: 'Cierre', icon: 'ti ti-flag' }
    ];

    function normalizeFase(fase) {
        return String(fase || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
    }

    function faseIcon(fase) {
        const key = normalizeFase(fase);
        for (let i = 0; i < PHASES.length; i++) {
            if (normalizeFase(PHASES[i].name) === key) return PHASES[i].icon;
        }
        return 'ti ti-check';
    }

    function formatTimelineDate(str) {
        if (!str) return '-';
        const d = new Date(str.replace(' ', 'T'));
        if (isNaN(d)) return str;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function renderTimelineModal(actividades) {
        const container = document.getElementById("trackingTimelineContainer");
        if (!container) return;
        container.innerHTML = '';

        if (!actividades || !actividades.length) {
            container.innerHTML = '<div class="alert alert-info">No hay actividades registradas.</div>';
            return;
        }

        const groups = new Map();
        actividades.forEach(a => {
            const key = normalizeFase(a.fase);
            if (!groups.has(key)) groups.set(key, { fase: a.fase, items: [] });
            groups.get(key).items.push(a);
        });

        let lastIdx = -1;
        PHASES.forEach((p, i) => {
            if (groups.has(normalizeFase(p.name))) lastIdx = i;
        });

        PHASES.forEach((p, i) => {
            const key = normalizeFase(p.name);
            const group = groups.get(key);
            if (!group) return;

            const cls = i < lastIdx ? 'completed' : (i === lastIdx ? 'active' : '');
            const fechas = group.items.map(a => a.fecha).filter(Boolean);
            const rango = fechas.length === 1
                ? formatTimelineDate(fechas[0])
                : formatTimelineDate(fechas[0]) + ' - ' + formatTimelineDate(fechas[fechas.length - 1]);

            const itemsHtml = group.items.map(a => {
                let obs = a.observacion ? '<span class="act-obs">' + escHtml(a.observacion) + '</span>' : '';
                return '<li><i class="ti ti-check"></i><div><span class="act-title">' + escHtml(a.actividad) + '</span>' + obs + '</div><span class="act-fecha">' + formatTimelineDate(a.fecha) + '</span></li>';
            }).join('');

            const html = `
                <div class="timeline-item ${cls}">
                    <div class="timeline-marker"><i class="${faseIcon(p.name)}"></i></div>
                    <div class="timeline-content">
                        <span class="date">${rango}</span>
                        <h3 class="title">${escHtml(group.fase)}</h3>
                        <ul class="fase-actividades">${itemsHtml}</ul>
                    </div>
                </div>`;

            container.insertAdjacentHTML('beforeend', html);
        });

        groups.forEach(group => {
            const key = normalizeFase(group.fase);
            if (PHASES.some(p => normalizeFase(p.name) === key)) return;

            const itemsHtml = group.items.map(a => {
                return '<li><i class="ti ti-check"></i><div><span class="act-title">' + escHtml(a.actividad) + '</span></div><span class="act-fecha">' + formatTimelineDate(a.fecha) + '</span></li>';
            }).join('');

            const html = `
                <div class="timeline-item completed">
                    <div class="timeline-marker"><i class="ti ti-check"></i></div>
                    <div class="timeline-content">
                        <span class="date">${escHtml(group.fase)}</span>
                        <h3 class="title">${escHtml(group.fase)}</h3>
                        <ul class="fase-actividades">${itemsHtml}</ul>
                    </div>
                </div>`;

            container.insertAdjacentHTML('beforeend', html);
        });
    }

    const timelineModalEl = document.getElementById("modalTimelineTracking");
    const timelineModal = timelineModalEl ? bootstrap.Modal.getOrCreateInstance(timelineModalEl) : null;

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-tracking-timeline]");
        if (!btn) return;

        const idTracking = String(btn.dataset.trackingId || "").trim();
        const codPublicoCompleto = String(btn.dataset.trackingCodPublico || btn.dataset.trackingCod || "").trim();
        if (!idTracking) return;

        const codEl = document.getElementById("timelineTrackingCod");
        if (codEl) codEl.textContent = codPublicoCompleto;

        const container = document.getElementById("trackingTimelineContainer");
        if (container) container.innerHTML = '<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>';

        timelineModal?.show();

        try {
            const res = await fetch("controller/tracking/table_actividades_tracking.php?tracking_id=" + idTracking);
            const json = await res.json();
            if (json.success) {
                renderTimelineModal(json.actividades || []);
            } else {
                if (container) container.innerHTML = '<div class="alert alert-danger">' + escHtml(json.message || 'Error al cargar') + '</div>';
            }
        } catch (err) {
            console.error(err);
            if (container) container.innerHTML = '<div class="alert alert-danger">Fallo de red al cargar timeline.</div>';
        }
    });
});