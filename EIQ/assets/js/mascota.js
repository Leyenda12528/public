/**
 * Mascota interactiva: Ley-Bot
 * Totalmente arrastrable (Drag & Drop), animado con animación real de saludo (mueve el brazo).
 */
(function() {
  const MASCOTA_ID = "eiq-mascota-bot";
  const STORAGE_KEY = "eiq_leybot_pos";

  const frases = [
    "¡Hola! Soy Ley-Bot, tu asistente 🤖",
    "¡Listo para aprender hoy! 🚀",
    "¡Cualquier duda, pregúntale al Ing. Jorge! 💡",
    "¡Puedes moverme arrastrándome con el mouse! 🖱️",
    "¡Mucho éxito en tu taller de tecnología! ✨",
    "Tip: ¡Las clases más recientes están arriba! 🔝",
    "¡Descarga los materiales antes de empezar! 📁"
  ];

  function getFraseAleatoria() {
    return frases[Math.floor(Math.random() * frases.length)];
  }

  function initLeyBot() {
    if (document.getElementById(MASCOTA_ID)) return;

    // Rutas de imágenes (idle y fotogramas de saludo)
    const isInsideAssets = window.location.pathname.includes('/assets/');
    const basePath = isInsideAssets ? '../assets/img/' : 'assets/img/';
    const imgIdle = basePath + 'mascota.png';
    const imgSaludo1 = basePath + 'mascota-saludo-1.png';
    const imgSaludo2 = basePath + 'mascota-saludo-2.png';

    // Precargar imágenes para que el saludo no tenga parpadeo
    const pre1 = new Image(); pre1.src = imgSaludo1;
    const pre2 = new Image(); pre2.src = imgSaludo2;

    // Inyectar estilos mejorados
    if (!document.getElementById("eiq-mascota-styles")) {
      const style = document.createElement("style");
      style.id = "eiq-mascota-styles";
      style.textContent = `
        .eiq-mascota-container {
          position: fixed;
          bottom: 30px;
          right: 35px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
        }
        .eiq-mascota-container:active,
        .eiq-mascota-container.is-dragging {
          cursor: grabbing !important;
        }

        .eiq-float-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: leyFloat 2.8s ease-in-out infinite;
          will-change: transform;
        }

        .eiq-bot-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .eiq-mascota-img {
          width: 140px;
          height: auto;
          display: block;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 15px rgba(255, 59, 48, 0.35));
          pointer-events: none;
          -webkit-user-drag: none;
          user-drag: none;
          transition: filter 0.25s ease;
        }

        .eiq-mascota-shadow {
          width: 85px;
          height: 14px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          filter: blur(3px);
          animation: leyShadow 2.8s ease-in-out infinite;
          margin-top: -8px;
        }

        @keyframes leyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }

        @keyframes leyShadow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.65); opacity: 0.2; }
        }

        /* Cuando está saludando (hover o click): brilla y se eleva */
        .eiq-mascota-container.is-waving .eiq-bot-wrapper {
          transform: translateY(-8px) scale(1.08);
        }

        .eiq-mascota-container.is-waving .eiq-mascota-img {
          filter: drop-shadow(0 12px 25px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 25px rgba(0, 229, 255, 0.7));
          animation: botBounce 0.4s ease-in-out infinite alternate;
        }

        @keyframes botBounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }

        /* Bocadillo de Diálogo / Speech Bubble */
        .eiq-mascota-bubble {
          position: absolute;
          bottom: calc(100% + 14px);
          right: 10px;
          min-width: 190px;
          max-width: 260px;
          background: rgba(13, 17, 38, 0.96);
          color: #ffffff;
          border: 1.5px solid rgba(0, 229, 255, 0.5);
          padding: 10px 14px;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
          font-size: 0.85rem;
          line-height: 1.35;
          text-align: center;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 20px rgba(0, 229, 255, 0.2);
          backdrop-filter: blur(10px);
          pointer-events: none;
          opacity: 0;
          transform: translateY(8px) scale(0.9);
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1000000;
        }
        .eiq-mascota-bubble::after {
          content: '';
          position: absolute;
          top: 100%;
          right: 45px;
          border-width: 7px;
          border-style: solid;
          border-color: rgba(13, 17, 38, 0.96) transparent transparent transparent;
        }

        .eiq-mascota-container:hover .eiq-mascota-bubble,
        .eiq-mascota-container.show-bubble .eiq-mascota-bubble {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .eiq-mascota-tag {
          font-size: 0.72rem;
          letter-spacing: 0.8px;
          color: #00e5ff;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: block;
        }

        .eiq-drag-hint {
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.45);
          margin-top: 4px;
          letter-spacing: 0.3px;
          transition: opacity 0.2s ease;
        }
        .eiq-mascota-container:hover .eiq-drag-hint {
          color: var(--primary, #00e5ff);
        }
      `;
      document.head.appendChild(style);
    }

    const container = document.createElement("div");
    container.id = MASCOTA_ID;
    container.className = "eiq-mascota-container";
    container.setAttribute("title", "¡Haz clic para saludar o arrástrame para moverme!");

    container.innerHTML = `
      <div class="eiq-mascota-bubble" id="eiq-bubble">
        <span class="eiq-mascota-tag">🤖 Ley-Bot</span>
        <span id="eiq-bubble-text">${getFraseAleatoria()}</span>
      </div>
      <div class="eiq-float-wrapper">
        <div class="eiq-bot-wrapper">
          <img class="eiq-mascota-img" id="eiq-img" src="${imgIdle}" alt="Ley-Bot" draggable="false">
          <div class="eiq-mascota-shadow"></div>
        </div>
      </div>
      <span class="eiq-drag-hint">Ley-Bot • Mover ✥</span>
    `;

    document.body.appendChild(container);

    const imgEl = container.querySelector("#eiq-img");
    const bubbleText = container.querySelector("#eiq-bubble-text");

    // ANIMACIÓN DE SALUDO (Mover el brazo alternando fotogramas)
    let waveInterval = null;
    let waveTimeout = null;
    let currentWaveFrame = 0;

    function startWaving() {
      container.classList.add("is-waving");
      if (waveInterval) return;
      currentWaveFrame = 0;
      imgEl.src = imgSaludo1;
      waveInterval = setInterval(() => {
        currentWaveFrame = (currentWaveFrame === 0) ? 1 : 0;
        imgEl.src = (currentWaveFrame === 0) ? imgSaludo1 : imgSaludo2;
      }, 200);
    }

    function stopWaving() {
      if (waveInterval) {
        clearInterval(waveInterval);
        waveInterval = null;
      }
      container.classList.remove("is-waving");
      imgEl.src = imgIdle;
    }

    // Hover: Iniciar saludo con el brazo y cambiar frase
    container.addEventListener("mouseenter", () => {
      bubbleText.textContent = getFraseAleatoria();
      startWaving();
    });

    container.addEventListener("mouseleave", () => {
      if (!container.classList.contains("show-bubble")) {
        stopWaving();
      }
    });

    // Restaurar posición previamente guardada en localStorage
    try {
      const savedPos = localStorage.getItem(STORAGE_KEY);
      if (savedPos) {
        const { left, top } = JSON.parse(savedPos);
        const maxLeft = window.innerWidth - 150;
        const maxTop = window.innerHeight - 170;
        const safeLeft = Math.max(10, Math.min(left, maxLeft));
        const safeTop = Math.max(10, Math.min(top, maxTop));
        container.style.left = safeLeft + "px";
        container.style.top = safeTop + "px";
        container.style.right = "auto";
        container.style.bottom = "auto";
      }
    } catch(e) {}

    // SISTEMA DE ARRASTRE ROBUSTO (Mouse & Touch)
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let movedDistance = 0;

    function startDrag(clientX, clientY) {
      isDragging = true;
      movedDistance = 0;
      startX = clientX;
      startY = clientY;

      const rect = container.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      container.classList.add("is-dragging");
    }

    function doDrag(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      movedDistance += Math.abs(dx) + Math.abs(dy);

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const maxLeft = window.innerWidth - container.offsetWidth - 10;
      const maxTop = window.innerHeight - container.offsetHeight - 10;

      newLeft = Math.max(10, Math.min(newLeft, maxLeft));
      newTop = Math.max(10, Math.min(newTop, maxTop));

      container.style.left = newLeft + "px";
      container.style.top = newTop + "px";
      container.style.right = "auto";
      container.style.bottom = "auto";
    }

    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");

      if (movedDistance > 8) {
        // Guardar posición en localStorage si se arrastró
        const rect = container.getBoundingClientRect();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
        } catch(e) {}
      } else {
        // Fue un clic! Saludar con el brazo y mostrar bocadillo durante 3.5 segundos
        bubbleText.textContent = getFraseAleatoria();
        container.classList.add("show-bubble");
        startWaving();

        clearTimeout(waveTimeout);
        waveTimeout = setTimeout(() => {
          container.classList.remove("show-bubble");
          stopWaving();
        }, 3500);
      }
    }

    // Eventos Mouse
    container.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      startDrag(e.clientX, e.clientY);

      function onMouseMove(moveEvent) {
        doDrag(moveEvent.clientX, moveEvent.clientY);
      }

      function onMouseUp() {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        stopDrag();
      }

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });

    // Eventos Touch (móviles/tablets)
    container.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);

      function onTouchMove(moveEvent) {
        if (moveEvent.touches.length === 1) {
          const t = moveEvent.touches[0];
          doDrag(t.clientX, t.clientY);
        }
      }

      function onTouchEnd() {
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
        stopDrag();
      }

      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("touchcancel", onTouchEnd);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLeyBot);
  } else {
    initLeyBot();
  }
})();
