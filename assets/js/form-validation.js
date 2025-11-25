document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(
    ".form-add-user, .form-upd-user"
  );
  const form = document.querySelector("form.form-upd-user");
  const params = new URLSearchParams(window.location.search);
  const hash = params.get("hash");


  if (hash && form.classList.contains("form-upd-user")) {
     cargarUsuario(hash);
     prepararFormularioEdicion(form, hash);
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("[type='submit']");
      const okCustom = typeof validateForm === "function" ? validateForm(form) : true;

      if (!okCustom) {
        form.reportValidity?.();
        return;
      }

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

      let actionUrl = "";
      let redirectUrl = "";

      if (["form-add-user", "form-upd-user"].some(c => form.classList.contains(c))) {
        const isUpdate = form.dataset.mode === "update";
        actionUrl = isUpdate
          ? "controller/upd_usuario.php"
          : "controller/add_usuario.php";
        redirectUrl = "usuarios.php";
      }

      try {
        const formData = new FormData(form);

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
        document.querySelector('#switch3').checked = parseInt(u.IDESTADO) === 1;

    } catch (err) {
        console.error("❌ Error al cargar usuario:", err);
    }
}

function prepararFormularioEdicion(form, hash) {
    if (!hash) return;

    let hidden = form.querySelector("input[name='hash']");
    if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "hash";
        hidden.value = hash;
        form.appendChild(hidden);
    }

    form.dataset.mode = "update";
}
