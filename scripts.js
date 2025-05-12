document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("capture");
  const statusMsg = document.getElementById("status-msg");

  const params = new URLSearchParams(window.location.search);
  const qrId = params.get("qr_id");
  const sessionId = params.get("session_id");

  if (!qrId || !sessionId) {
    alert("Faltan parámetros en la URL.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Permiso de cámara denegado o no disponible.");
      console.error(err);
    });

  captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append("file", blob, "captura.png");

      fetch(`https://foto-api-production.up.railway.app/qr/guardar-imagen?qr_id=${qrId}&session_id=${sessionId}`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          statusMsg.textContent = "📤 Imagen enviada correctamente.";
        })
        .catch(err => {
          statusMsg.textContent = "❌ Error al enviar imagen.";
          console.error(err);
        });
    }, "image/png");
  });
});
