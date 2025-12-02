document.addEventListener("DOMContentLoaded", () => {
  
  const formCargar = document.querySelector(".form-cargar-item");
  const inputFile = document.querySelector("#fileItems");

  formCargar.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!inputFile.files.length) {
      alertify.error("Seleccione un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("fileItems", inputFile.files[0]);

    try {
      const res = await fetch("controller/cargar_items.php", {
        method: "POST",
        body: formData
      });

      const json = await res.json();

      if (json.ok) {
        alertify.success(json.message);
        formCargar.reset();
      } else {
        alertify.error("Error: " + json.message);
      }

    } catch (err) {
      console.error(err);
      alertify.error("Error en la carga masiva");
    }
  });

});
