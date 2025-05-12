document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');
  const estado = document.getElementById("estado");

  if (!qrId || !sessionId) {
    alert("URL inválida: faltan parámetros.");
    return;
  }

  function enviarFoto(archivo) {
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

  const camTrasera = document.getElementById("camTrasera");
  const camFrontal = document.getElementById("camFrontal");

  [camTrasera, camFrontal].forEach(input => {
    input.addEventListener("change", () => {
      if (input.files.length > 0) {
        estado.textContent = "Enviando foto...";
        enviarFoto(input.files[0]);
      }
    });
  });
});
