document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const qrId = params.get('qr_id');
  const sessionId = params.get('session_id');
  const inputCamara = document.getElementById("inputCamara");
  const preview = document.getElementById("preview");
  const enviarBtn = document.getElementById("enviarBtn");
  const estado = document.getElementById("estado");

  if (!qrId || !sessionId) {
    alert("Faltan parámetros en la URL: qr_id o session_id.");
    estado.textContent = "Error: parámetros no válidos.";
    return;
  }

  let imagenes = [];

  inputCamara.addEventListener("change", () => {
    const files = Array.from(inputCamara.files);
    files.forEach(file => {
      imagenes.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    estado.textContent = `${imagenes.length} foto(s) lista(s) para enviar.`;
  });

  enviarBtn.addEventListener("click", () => {
    if (imagenes.length === 0) {
      alert("No se han capturado imágenes.");
      return;
    }

    estado.textContent = "📤 Enviando imágenes...";

    const formData = new FormData();
    imagenes.forEach((img, idx) => {
      formData.append("imagenes", img);
    });
    formData.append("qr_id", qrId);
    formData.append("session_id", sessionId);

    fetch("https://foto-api-production.up.railway.app/qr/guardar-fotos", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        estado.textContent = "✅ Imágenes enviadas correctamente.";
        imagenes = [];
        preview.innerHTML = "";
      })
      .catch(err => {
        estado.textContent = "❌ Error al enviar imágenes.";
        console.error(err);
      });
  });
});
