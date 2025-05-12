document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');

  const video = document.getElementById("camera");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("capture");
  const statusText = document.getElementById("status");

  if (!qrId || !sessionId) {
    alert("Parámetros inválidos en la URL.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;

      captureBtn.addEventListener("click", () => {
        // Flash blanco animación
        document.body.style.backgroundColor = '#fff';
        setTimeout(() => document.body.style.backgroundColor = '#000', 80);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
          const formData = new FormData();
          formData.append("imagen", blob, "foto.jpg");
          formData.append("qr_id", qrId);
          formData.append("session_id", sessionId);

          fetch("https://foto-api-production.up.railway.app/qr/guardar-foto", {
            method: "POST",
            body: formData
          })
          .then(res => res.json())
          .then(data => {
            statusText.textContent = "✅ Foto enviada correctamente.";
            stream.getTracks().forEach(track => track.stop());
            captureBtn.disabled = true;
          })
          .catch(err => {
            statusText.textContent = "❌ Error al enviar la foto.";
            console.error(err);
          });
        }, "image/jpeg");
      });
    })
    .catch(err => {
      alert("No se pudo acceder a la cámara. Permiso denegado o error.");
      console.error(err);
    });
});
