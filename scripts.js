const input = document.getElementById("fotoInput");
const preview = document.getElementById("preview");
const enviarBtn = document.getElementById("enviarBtn");

const params = new URLSearchParams(window.location.search);
const qrId = params.get("qr_id");
const sessionId = params.get("session_id");

let imagenes = [];

input.addEventListener("change", (e) => {
  preview.innerHTML = "";
  imagenes = [];

  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = document.createElement("img");
      img.src = ev.target.result;
      preview.appendChild(img);
      imagenes.push(ev.target.result.split(",")[1]); // base64 sin el encabezado
    };
    reader.readAsDataURL(file);
  });
});

enviarBtn.addEventListener("click", () => {
  if (!qrId || !sessionId) {
    alert("Faltan parámetros.");
    return;
  }

  if (imagenes.length === 0) {
    alert("Primero selecciona imágenes.");
    return;
  }

  Promise.all(imagenes.map(base64 =>
    fetch("https://foto-api-production.up.railway.app/qr/subir-foto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_id: parseInt(qrId), session_id: sessionId, foto_base64: base64 })
    })
  )).then(() => {
    alert("Fotos enviadas correctamente.");
  }).catch(err => {
    console.error("Error al enviar fotos:", err);
    alert("Error al enviar una o más fotos.");
  });
});
