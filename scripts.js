const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const captureBtn = document.getElementById("capture-btn");
const sendBtn = document.getElementById("send-btn");
const cancelBtn = document.getElementById("cancel-btn");

const params = new URLSearchParams(window.location.search);
const qrId = params.get("qr_id");
const sessionId = params.get("session_id");

if (!qrId || !sessionId) {
  alert("Faltan parámetros en la URL.");
}

// Iniciar cámara
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("No se pudo acceder a la cámara: " + err.message);
  });

// Capturar imagen
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/png");
  preview.src = imageData;
  preview.style.display = "block";

  // Mostrar botones adecuados
  sendBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
  captureBtn.style.display = "none";
});

// Enviar imagen
sendBtn.addEventListener("click", () => {
  const base64Image = preview.src.split(',')[1];

  fetch("https://foto-api-production.up.railway.app/qr/guardar-imagen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: base64Image,
      qr_id: parseInt(qrId),
      session_id: sessionId
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Imagen enviada correctamente.");
      resetUI();
    })
    .catch(err => {
      alert("Error al enviar imagen: " + err.message);
    });
});

// Cancelar envío
cancelBtn.addEventListener("click", () => {
  resetUI();
});

// Limpiar vista previa y restaurar
function resetUI() {
  preview.style.display = "none";
  sendBtn.style.display = "none";
  cancelBtn.style.display = "none";
  captureBtn.style.display = "inline-block";
  preview.src = "";
}
