document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form.form-add-tracking");
    if (!form) return;

    const rucInput = form.querySelector("#ruc");
    const codInput = form.querySelector("#cod_tracking");
    const razonSocialInput = form.querySelector("#razon_social_empresa");

    let lastRucConsulted = null;

    if (rucInput) {
        rucInput.addEventListener("input", async () => {
            const ruc = String(rucInput.value || "").replace(/\D/g, "").slice(0, 11);
            if (rucInput.value !== ruc) {
                rucInput.value = ruc;
            }

            if (ruc.length < 11) {
                lastRucConsulted = null;
                if (razonSocialInput && !razonSocialInput.value.trim()) {
                    razonSocialInput.removeAttribute("readonly");
                }
                return;
            }

            if (ruc === lastRucConsulted) return;
            lastRucConsulted = ruc;

            try {
                const res = await fetch(`./config/api-ruc.php?ruc=${encodeURIComponent(ruc)}`);
                const data = await res.json();

                if (!res.ok || !data.ok) {
                    throw new Error(data.message || "No se pudo consultar el RUC");
                }

                if (razonSocialInput) {
                    if (data.nombre) {
                        razonSocialInput.value = data.nombre || "";
                        razonSocialInput.removeAttribute("readonly");
                    }
                }
            } catch (error) {
                console.error("Error RUC:", error);
                lastRucConsulted = null;
                alertify.error(error.message || "Error al consultar RUC");
            }
        });
    }

    if (codInput) {
        codInput.addEventListener("input", () => {
            codInput.classList.remove("is-invalid", "border-danger");
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector("[type='submit']");

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            form.reportValidity?.();
            return;
        }

        if (submitBtn) {
            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-50", "cursor-not-allowed");
        }

        try {
            const formData = new FormData(form);
            const res = await fetch("controller/tracking/save_tracking.php", {
                method: "POST",
                body: formData,
            });

            const ct = res.headers.get("content-type") || "";
            const json = ct.includes("application/json")
                ? await res.json()
                : { ok: false, message: await res.text() };

            if (json.success) {
                alertify.success("Tracking registrado correctamente");
                form.reset();
                window.location.href = "tracking.php";
            } else {
                const mensaje = String(json.message || "No se pudo guardar.");
                if (mensaje.toLowerCase().includes("ya se encuentra registrado") && codInput) {
                    codInput.classList.add("is-invalid", "border-danger");
                } else {
                    alertify.error("Alerta: " + mensaje);
                }
            }
        } catch (err) {
            console.error(err);
            alertify.error("Fallo de red o excepción, revisa consola");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
        }
    });
});