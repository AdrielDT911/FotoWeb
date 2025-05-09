document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const preview = document.getElementById("preview");
  const captureBtn = document.getElementById("capture-btn");
  const sendBtn = document.getElementById("send-btn");
  const imageContainer = document.getElementById("image-container"); // Contenedor donde mostraremos la imagen

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
      iniciarPolling();
    })
    .catch(err => {
      alert("Error al enviar la imagen: " + err.message);
    });
  });

  // Función de polling para verificar la imagen
  function iniciarPolling() {
    const pollingInterval = setInterval(() => {
      fetch(`https://foto-api.up.railway.app/qr/verificar-foto?qr_id=${qrId}&session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.imagen) {
            clearInterval(pollingInterval);
            mostrarImagen(data.imagen);  // Llamar a la función para mostrar la imagen
            alert("Imagen capturada y enviada correctamente.");
          } else {
            console.log("Esperando imagen...");
          }
        })
        .catch(err => console.error("Error en polling:", err));
    }, 3000);  // Polling cada 3 segundos
  }

  // Mostrar imagen en el contenedor
  function mostrarImagen(imagenBase64) {
    const imgElement = document.createElement("img");
    imgElement.src = imagenBase64;
    imgElement.style.width = "100%";
    imgElement.style.borderRadius = "8px";
    imageContainer.innerHTML = "";  // Limpiar cualquier imagen previa
    imageContainer.appendChild(imgElement);
  }
});
