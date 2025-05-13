document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');
  const estado = document.getElementById("estado");
  const inputCamara = document.getElementById("inputCamara");

  if (!qrId || !sessionId) {
    alert("Faltan parámetros en la URL: qr_id o session_id.");
    estado.textContent = "Error: parámetros no válidos.";
    return;
  }

  inputCamara.addEventListener("change", () => {
    if (inputCamara.files.length > 0) {
      const archivo = inputCamara.files[0];
      estado.textContent = "📤 Enviando imagen...";

      const formData = new FormData();
      formData.append("imagen", archivo);
      formData.append("qr_id", qrId);
      formData.append("session_id", sessionId);

      fetch("https://foto-api-production.up.railway.app/qr/guardar-foto", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          estado.textContent = "✅ Imagen enviada correctamente.";
        })
        .catch(err => {
          estado.textContent = "❌ Error al enviar la imagen.";
          console.error(err);
        });
    }
  });
});
