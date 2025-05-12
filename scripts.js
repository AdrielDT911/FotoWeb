// script.js
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("captureBtn");

  const params = new URLSearchParams(window.location.search);
  const qrId = params.get("qr_id");
  const sessionId = params.get("session_id");

  if (!qrId || !sessionId) {
    alert("Faltan parámetros en la URL.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Error al acceder a la cámara: " + err.message);
    });

  captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append("qr_id", qrId);
      formData.append("session_id", sessionId);
      formData.append("image", blob, "captura.png");

      fetch("https://foto-api-production.up.railway.app/qr/guardar-imagen", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        alert("Imagen enviada correctamente.");
        window.close(); // opcional
      })
      .catch(err => alert("Error al enviar la imagen: " + err.message));
    }, "image/png");
  });
});
