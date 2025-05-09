document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const captureBtn = document.getElementById("capture-btn");
  const sendBtn = document.getElementById("send-btn");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Inicializa la cámara
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Error al acceder a la cámara", err);
    });

  // Captura la foto
  captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    captureBtn.style.display = "none";
    sendBtn.style.display = "inline-block";
  });

  // Enviar foto
  sendBtn.addEventListener("click", () => {
    const imageData = canvas.toDataURL("image/png");

    // Aquí debes obtener los valores de qr_id y session_id (pasados en la URL)
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get("qr_id");
    const sessionId = urlParams.get("session_id");

    if (!qrId || !sessionId) {
      alert("No se encontró un ID válido.");
      return;
    }

    fetch("https://qr-api-production-adac.up.railway.app/qr/guardar-foto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_data: imageData,
        qr_id: parseInt(qrId),
        session_id: sessionId
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("Foto enviada correctamente.");
    })
    .catch(err => {
      alert("Error al enviar la foto: " + err.message);
    });
  });
});
