const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const preview = document.getElementById('preview');
const sendBtn = document.getElementById('send-btn');

// Extraer parámetros
const params = new URLSearchParams(window.location.search);
const qrId = params.get('qr_id');
const sessionId = params.get('session_id');

if (!qrId || !sessionId) {
  alert("Faltan parámetros");
}

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Error al acceder a la cámara: " + err.message);
  });

captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const base64Image = canvas.toDataURL('image/jpeg', 0.8); // 📌 Comprimir
  preview.src = base64Image;
  preview.style.display = 'block';
  sendBtn.style.display = 'block';
});

sendBtn.addEventListener('click', () => {
  const imageData = preview.src.split(',')[1]; // Quitar "data:image/jpeg;base64,"

  fetch("https://foto-api-production-XXXX.up.railway.app/qr/guardar-foto", {
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
    window.location.href = "https://tu-apex-url.com/"; // Si querés volver a APEX
  })
  .catch(err => {
    alert("Error al enviar imagen: " + err.message);
  });
});
