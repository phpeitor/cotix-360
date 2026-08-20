document.addEventListener("DOMContentLoaded", () => {
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
        if (codEl) codEl.textContent = cod;

        resetForm();
        cargarActividades(trackingId);
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

    async function cargarActividades(id) {
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
                if (fecha) { fecha.value = saved.fecha || ""; fecha.disabled = false; }
                if (obs) { obs.value = saved.observacion || ""; obs.disabled = false; }
            });

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
});