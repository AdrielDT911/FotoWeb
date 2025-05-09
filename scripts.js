const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture-btn");
const sendBtn = document.getElementById("send-btn");
const preview = document.getElementById("preview");

const params = new URLSearchParams(window.location.search);
const qrId = params.get("qr_id");
const sessionId = params.get("session_id");

if (!qrId || !sessionId) {
  alert("Faltan parámetros en la URL");
}

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => alert("Error al acceder a la cámara: " + err.message));

captureBtn.addEventListener("click", () => {
  // Captura frame
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const imgData = canvas.toDataURL("image/png");

  // Muestra imagen y botón de enviar
  preview.src = imgData;
  preview.style.display = "block";
  sendBtn.style.display = "inline-block";
  captureBtn.style.display = "none"; // opcional: ocultar botón capturar
});

sendBtn.addEventListener("click", () => {
  const imgBase64 = preview.src.split(",")[1];

  fetch("https://foto-api-production.up.railway.app/qr/guardar-imagen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: imgBase64,
      qr_id: parseInt(qrId),
      session_id: sessionId
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Imagen enviada correctamente.");

      // Reinicia la vista
      preview.style.display = "none";
      sendBtn.style.display = "none";
      captureBtn.style.display = "inline-block";
    })
    .catch(err => {
      alert("Error al enviar la imagen: " + err.message);
    });
});
