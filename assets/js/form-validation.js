document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(
    ".form-add-user"
  );
  const form = document.querySelector("form.form-upd-user");
  const params = new URLSearchParams(window.location.search);
  const hash = params.get("hash");


  if (hash && form.classList.contains("form-upd-user")) {
    cargarUsuario(hash);
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector("[type='submit']");

      // --- Validación personalizada ---
      const okCustom = typeof validateForm === "function" ? validateForm(form) : true;
      if (!okCustom) {
        form.reportValidity?.();
        return;
      }

      // --- Validación nativa HTML5 ---
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity?.();
        return;
      }

      // --- Desactivar botón ---
      if (submitBtn) {
        if (submitBtn.disabled) return;
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-50", "cursor-not-allowed");
      }

      // --- Definir URLs según tipo de formulario ---
      let actionUrl = "";
      let redirectUrl = "";

      if (form.classList.contains("ti-custom-validation")) {
        const isUpdate = form.dataset.mode === "update";
        actionUrl = isUpdate
          ? "controller/upd_cliente.php"
          : "controller/add_cliente.php";
        redirectUrl = "clientes.php";

      } else if (form.classList.contains("form-add-user")) {
        const isUpdate = form.dataset.mode === "update";
        actionUrl = isUpdate
          ? "controller/upd_usuario.php"
          : "controller/add_usuario.php";
        redirectUrl = "usuarios.php";

      } else if (form.classList.contains("ti-custom-validation-item")) {
        const isUpdate = form.dataset.mode === "update";
        actionUrl = isUpdate
          ? "controller/upd_item.php"
          : "controller/add_item.php";
        redirectUrl = "items.php";

      } else if (form.classList.contains("ti-custom-validation-ticket")) {
        const isUpdate = form.dataset.mode === "update";
        actionUrl = isUpdate
          ? "controller/venta/upd_ticket.php"
          : "controller/venta/add_ticket.php";
        redirectUrl = "tickets.php";
      }

      try {
        const formData = new FormData(form);

        // --- Ticket: agregar items del carrito ---
        if (form.classList.contains("ti-custom-validation-ticket")) {
          let items = [];
          try {
            items = typeof window.obtenerItemsCarrito === "function"
              ? window.obtenerItemsCarrito()
              : [];
          } catch (err) {
            console.error("Error al obtener items:", err);
            items = [];
          }

          if (!items.length) {
            alertify.error("Debe agregar al menos un ítem 🛒");
            submitBtn.disabled = false;
            submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            return;
          }

          formData.append("items", JSON.stringify(items));
        }

        // --- Enviar vía fetch ---
        const res = await fetch(actionUrl, {
          method: "POST",
          body: formData,
        });

        const ct = res.headers.get("content-type") || "";
        const json = ct.includes("application/json")
          ? await res.json()
          : { ok: false, message: await res.text() };

        if (json.ok) {
          form.reset();
          window.location.href = redirectUrl;
        } else {
          alertify.error("Error: " + (json.message || "No se pudo guardar."));
        }

      } catch (err) {
        console.error(err);
        alertify.error("Fallo de red o excepción, revisa consola");

      } finally {
        // --- Rehabilitar botón ---
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
      }
    });
  });
});

async function cargarUsuario(hash) {
    try {
        const res = await fetch(`controller/get_usuario.php?hash=${hash}`);
        const json = await res.json();

        if (!json.ok) {
            alertify.error(json.message || "Usuario no encontrado");
            return;
        }

        const u = json.data;
        document.querySelector('#nombres').value = u.NOMBRES || '';
        document.querySelector('#apellidos').value = u.APELLIDOS || '';
        document.querySelector('#documento').value = u.DOC || '';
        document.querySelector('#email').value = u.EMAIL || '';
        document.querySelector('#telefono').value = u.TLF || '';
        document.querySelectorAll('input[name="sexo"]').forEach(r => {
            r.checked = parseInt(r.value) === parseInt(u.SEXO);
        });

        /*const toggle = document.querySelector('#estadoToggle');
        const estadoInput = document.querySelector('#estadoInput');

        if (toggle && estadoInput) {
            if (parseInt(u.IDESTADO) === 1) {
                toggle.classList.add('on');
                estadoInput.value = '1';
            } else {
                toggle.classList.remove('on');
                estadoInput.value = '0';
            }
        }

        inicializarToggle();*/

    } catch (err) {
        console.error("❌ Error al cargar usuario:", err);
    }
}