document.addEventListener("DOMContentLoaded", () => {
  const captureButton = document.getElementById("capture");
  const cameraElement = document.getElementById("camera");
  const canvasElement = document.getElementById("canvas");
  const imagePreview = document.getElementById("imagePreview");

  const qrId = new URLSearchParams(window.location.search).get('qr_id');
  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  if (!qrId || !sessionId) {
    alert("QR_ID o SESSION_ID no encontrado en la URL.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      cameraElement.srcObject = stream;
    })
    .catch(err => {
      alert("Error al acceder a la cámara: " + err.message);
    });

  captureButton.addEventListener("click", () => {
    const context = canvasElement.getContext("2d");
    canvasElement.width = cameraElement.videoWidth;
    canvasElement.height = cameraElement.videoHeight;
    context.drawImage(cameraElement, 0, 0, canvasElement.width, canvasElement.height);

    const imageData = canvasElement.toDataURL('image/png');
    sendImageToAPI(imageData);
  });

  function sendImageToAPI(imageData) {
    fetch("https://foto-api-production.up.railway.app/qr/guardar-imagen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qr_id: parseInt(qrId),
        session_id: sessionId
      }),
      body: JSON.stringify({ file: imageData }) // Asegúrate de enviar la imagen como un archivo adecuado
    })
    .then(res => res.json())
    .then(data => {
      imagePreview.innerHTML = `<img src="${imageData}" alt="Captured Image" />`;
    })
    .catch(err => console.error("Error al enviar la imagen:", err));
  }
});
