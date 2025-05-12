document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');
  const estado = document.getElementById("estado");

  if (!qrId || !sessionId) {
    alert("URL inválida: faltan parámetros.");
    return;
  }

  const inputCamara = document.getElementById("inputCamara");
  const abrirCamara = document.getElementById("abrirCamara");

  abrirCamara.addEventListener("click", () => {
    inputCamara.click(); // 🟢 Lanza la cámara trasera
  });

  inputCamara.addEventListener("change", () => {
    if (inputCamara.files.length > 0) {
      const archivo = inputCamara.files[0];
      estado.textContent = "📤 Enviando foto...";

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
