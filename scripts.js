document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');
  const estado = document.getElementById("estado");
  const camInput = document.getElementById("camAuto");

  if (!qrId || !sessionId) {
    alert("URL inválida: faltan parámetros.");
    return;
  }

  // Lanzar automáticamente la cámara trasera
  setTimeout(() => {
    camInput.click();
  }, 500); // pequeño delay para asegurar carga

  camInput.addEventListener("change", () => {
    if (camInput.files.length > 0) {
      estado.textContent = "Enviando foto...";
      const archivo = camInput.files[0];

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
        estado.textContent = "✅ Foto enviada correctamente.";
      })
      .catch(err => {
        estado.textContent = "❌ Error al enviar la foto.";
        console.error(err);
      });
    }
  });
});
