document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');

  if (!qrId || !sessionId) {
    alert("Parámetros inválidos en la URL.");
    return;
  }

  const video = document.getElementById("camera");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("capture");
  const statusText = document.getElementById("status");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;

      captureBtn.addEventListener("click", () => {
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
            statusText.style.visibility = "visible";
            stream.getTracks().forEach(track => track.stop());
            captureBtn.disabled = true;
          })
          .catch(err => {
            statusText.textContent = "❌ Error al enviar la foto.";
            statusText.style.visibility = "visible";
            console.error(err);
          });
        }, "image/jpeg");
      });
    })
    .catch(err => {
      alert("Error accediendo a la cámara: " + err.message);
    });
});
