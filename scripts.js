document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const preview = document.getElementById("preview");
  const captureBtn = document.getElementById("capture-btn");
  const sendBtn = document.getElementById("send-btn");

  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');

  if (!qrId || !sessionId) {
    alert("QR_ID o SESSION_ID no encontrados.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Error accediendo a la cámara: " + err.message);
    });

  captureBtn.addEventListener("click", () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    preview.src = imageData;
    preview.style.display = "block";
    video.style.display = "none";
    captureBtn.style.display = "none";
    sendBtn.style.display = "inline-block";
  });

  sendBtn.addEventListener("click", () => {
    const imageData = preview.src;

    fetch("https://foto-api.up.railway.app/qr/guardar-foto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qr_id: parseInt(qrId),
        session_id: sessionId,
        imagen: imageData
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("Imagen enviada correctamente.");
    })
    .catch(err => {
      alert("Error al enviar la imagen: " + err.message);
    });
  });
});
