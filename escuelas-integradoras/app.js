document.addEventListener("DOMContentLoaded", () => {
  const profesorNameEl = document.getElementById("profesor-name");
  const institucionNameEl = document.getElementById("institucion-name");
  const daySelector = document.getElementById("day-selector");
  const mesSelect = document.getElementById("mes-select");
  const talleresContainer = document.getElementById("talleres-container");

  // Configurar nombres
  if(typeof appConfig !== 'undefined') {
    if(profesorNameEl) profesorNameEl.textContent = appConfig.profesor;
    if(institucionNameEl) institucionNameEl.textContent = appConfig.institucion;
  }

  let currentDia = "sabado";
  
  // Detección de día actual
  const hoy = new Date();
  if (hoy.getDay() === 0) { // 0 es Domingo
    currentDia = "domingo";
  } else {
    currentDia = "sabado"; // Lunes a Sábado mostramos sabado por defecto
  }

  updateDayButtons();

  // Llenar selector de meses
  const mesesDisponibles = Object.keys(dataClases);
  mesesDisponibles.forEach(mes => {
    const option = document.createElement("option");
    option.value = mes;
    // Formatear texto (ej. "septiembre-2026" -> "Septiembre 2026")
    option.textContent = mes.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
    mesSelect.appendChild(option);
  });

  let currentMes = mesesDisponibles[0]; 

  // Event Listeners
  daySelector.addEventListener("click", (e) => {
    if(e.target.classList.contains("btn-day")) {
      currentDia = e.target.getAttribute("data-dia");
      updateDayButtons();
      renderTalleres();
    }
  });

  mesSelect.addEventListener("change", (e) => {
    currentMes = e.target.value;
    renderTalleres();
  });

  function updateDayButtons() {
    document.querySelectorAll(".btn-day").forEach(btn => {
      if(btn.getAttribute("data-dia") === currentDia) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function renderTalleres() {
    talleresContainer.innerHTML = "";
    
    if(!dataClases[currentMes] || !dataClases[currentMes][currentDia]) {
      talleresContainer.innerHTML = "<p>No hay talleres configurados para este día/mes.</p>";
      return;
    }

    const talleres = dataClases[currentMes][currentDia];
    
    for (const [key, taller] of Object.entries(talleres)) {
      const tallerCard = document.createElement("div");
      tallerCard.className = "taller-card";

      const header = document.createElement("div");
      header.className = "taller-header";
      header.innerHTML = `
        <h2>${taller.nombre}</h2>
        <p>🕒 ${taller.horario}</p>
      `;
      tallerCard.appendChild(header);

      const sesionesList = document.createElement("div");
      sesionesList.className = "sesiones-list";

      if(taller.sesiones && taller.sesiones.length > 0) {
        taller.sesiones.forEach(sesion => {
          const sesionItem = document.createElement("div");
          sesionItem.className = "sesion-item";
          
          if(!sesion.disponible) {
            sesionItem.innerHTML = `
              <div class="sesion-title" style="cursor:default; color:#999;">
                <span>Sesión ${sesion.sesion}</span>
                <span class="badge-no-disponible">Próximamente</span>
              </div>
            `;
            sesionesList.appendChild(sesionItem);
            return;
          }

          const title = document.createElement("div");
          title.className = "sesion-title";
          title.innerHTML = `
            <span>Sesión ${sesion.sesion}</span>
            <span class="sesion-date">${sesion.fecha}</span>
          `;
          
          const content = document.createElement("div");
          content.className = "sesion-content";
          
          if(sesion.suspendida) {
            content.innerHTML = `
              <div class="suspendida-msg">
                <p>Clase suspendida</p>
                ${sesion.motivo_suspension_img ? `<img src="${sesion.motivo_suspension_img}" alt="Motivo">` : ''}
              </div>
            `;
          } else {
            // Construir recursos
            let recursosHTML = '<div class="recursos-grid">';
            
            if(sesion.presentacion) {
              recursosHTML += `<a href="${sesion.presentacion}" target="_blank" class="recurso-card"><span class="recurso-icon">📊</span> Presentación</a>`;
            }
            if(sesion.guia) {
              recursosHTML += `<a href="${sesion.guia}" target="_blank" class="recurso-card"><span class="recurso-icon">📝</span> Guía de clase</a>`;
            }
            
            if(sesion.urls && sesion.urls.length > 0) {
              sesion.urls.forEach(url => {
                recursosHTML += `<a href="${url.link}" target="_blank" class="recurso-card"><span class="recurso-icon">🔗</span> ${url.nombre}</a>`;
              });
            }

            if(sesion.imagenes && sesion.imagenes.length > 0) {
              sesion.imagenes.forEach((img, index) => {
                recursosHTML += `<a href="${img}" target="_blank" class="recurso-card"><span class="recurso-icon">🖼️</span> Imagen ${index + 1}</a>`;
              });
            }

            if(sesion.extras && sesion.extras.length > 0) {
              sesion.extras.forEach((ext, index) => {
                recursosHTML += `<a href="${ext}" target="_blank" class="recurso-card"><span class="recurso-icon">📁</span> Archivo extra ${index + 1}</a>`;
              });
            }

            recursosHTML += '</div>';
            
            if(recursosHTML === '<div class="recursos-grid"></div>') {
              recursosHTML = '<p style="color:#666; font-size:0.9rem; padding: 1rem;">No hay recursos subidos aún.</p>';
            }
            
            content.innerHTML = recursosHTML;
          }

          title.addEventListener("click", () => {
            content.classList.toggle("active");
          });

          sesionItem.appendChild(title);
          sesionItem.appendChild(content);
          sesionesList.appendChild(sesionItem);
        });
      } else {
        sesionesList.innerHTML = "<p style='color:#666;'>No hay sesiones programadas aún.</p>";
      }

      tallerCard.appendChild(sesionesList);
      talleresContainer.appendChild(tallerCard);
    }
  }

  // Render inicial
  renderTalleres();
});
