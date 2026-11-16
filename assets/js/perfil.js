document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("profile-form");
  if (!form) return;

  const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.value = value ?? "";
  };

  try {
    const response = await fetch("controller/get_perfil.php", { headers: { Accept: "application/json" } });
    const result = await response.json();
    if (!result.ok) throw new Error(result.message || "No se pudo cargar el perfil");
    const profile = result.data;
    setValue("profile-nombres", profile.NOMBRES);
    setValue("profile-apellidos", profile.APELLIDOS);
    setValue("profile-documento", profile.DOC);
    setValue("profile-usuario", profile.USUARIO);
    setValue("profile-email", profile.EMAIL);
    setValue("profile-telefono", profile.TLF);
    setValue("profile-sexo", profile.SEXO);
  } catch (error) {
    alertify.error(error.message || "No se pudo cargar el perfil");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    if (button) button.disabled = true;
    try {
      const response = await fetch("controller/upd_perfil.php", { method: "POST", body: new FormData(form) });
      const result = await response.json();
      if (!result.ok) throw new Error(result.message || "No se pudo guardar el perfil");
      alertify.success(result.message);
      form.querySelectorAll("input[type='password']").forEach((input) => { input.value = ""; });
      const name = document.querySelector(".topbar-link .d-lg-flex");
      if (name) name.textContent = document.getElementById("profile-nombres").value;
    } catch (error) {
      alertify.error(error.message || "No se pudo guardar el perfil");
    } finally {
      if (button) button.disabled = false;
    }
  });
});
