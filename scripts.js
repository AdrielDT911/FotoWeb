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
  const sendBtn = document.getElementById("send");
  const statusText = document.getElementById("status");

  let imageBlob = null;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;

      captureBtn.addEventListener("click", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
          imageBlob = blob;
          sendBtn.classList.remove("hidden");
          statusText.textContent = "📸 Foto capturada. Listo para enviar.";
        }, "image/jpeg");
      });

      sendBtn.addEventListener("click", () => {
        if (!imageBlob) return;

        const formData = new FormData();
        formData.append("imagen", imageBlob, "foto.jpg");
        formData.append("qr_id", qrId);
        formData.append("session_id", sessionId);

        fetch("https://foto-api-production.up.railway.app/qr/guardar-foto", {
          method: "POST",
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          statusText.textContent = "✅ Foto enviada correctamente.";
          sendBtn.disabled = true;
          captureBtn.disabled = true;
          video.srcObject.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          statusText.textContent = "❌ Error al enviar la foto.";
          console.error(err);
        });
      });
    })
    .catch(err => {
      alert("Permiso de cámara denegado o error: " + err.message);
    });
});
