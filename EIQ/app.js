document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const currentTallerTitleEl = document.getElementById("current-taller-title");
  const currentDiaBadgeEl = document.getElementById("current-dia-badge");
  const currentHorarioEl = document.getElementById("current-horario");
  const profesorNameEl = document.getElementById("profesor-name");
  const footerProfesorEl = document.getElementById("footer-profesor-name");
  const monthsNavEl = document.getElementById("months-nav");
  const tallerDropdownEl = document.getElementById("taller-select-dropdown");
  const contentAreaEl = document.getElementById("taller-content-area");

  // Configuración de profesor
  if (typeof appConfig !== 'undefined') {
    if (profesorNameEl && appConfig.profesor) profesorNameEl.textContent = appConfig.profesor;
    if (footerProfesorEl && appConfig.profesor) footerProfesorEl.textContent = appConfig.profesor;
  }

  // Obtener parámetros de la URL (?dia=sabado&taller=taller1)
  const urlParams = new URLSearchParams(window.location.search);
  let currentDia = urlParams.get("dia") || "domingo";
  let currentTaller = urlParams.get("taller") || "taller1";

  // Validar día
  if (currentDia !== "sabado" && currentDia !== "domingo") {
    currentDia = "domingo";
  }
  // Validar taller
  if (currentTaller !== "taller1" && currentTaller !== "taller2") {
    currentTaller = "taller1";
  }

  // Sincronizar dropdown
  if (tallerDropdownEl) {
    tallerDropdownEl.value = `${currentDia}:${currentTaller}`;
    tallerDropdownEl.addEventListener("change", (e) => {
      const [dia, taller] = e.target.value.split(":");
      currentDia = dia;
      currentTaller = taller;
      
      // Actualizar URL sin recargar
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("dia", currentDia);
      newUrl.searchParams.set("taller", currentTaller);
      window.history.replaceState({}, "", newUrl);

      renderTaller();
    });
  }

  // Configuración de Meses desde appConfig
  let currentMes = "";
  if (typeof appConfig !== 'undefined' && appConfig.mesActivo && dataClases[appConfig.mesActivo]) {
    currentMes = appConfig.mesActivo;
  } else {
    // Si no está definido, tomar el último mes disponible
    const keys = Object.keys(dataClases);
    currentMes = keys[keys.length - 1] || "";
  }

  // Generar Nav Tabs de Meses
  function renderMonthsNav() {
    if (!monthsNavEl) return;
    monthsNavEl.innerHTML = "";

    let listaMeses = [];
    if (typeof appConfig !== 'undefined' && Array.isArray(appConfig.meses) && appConfig.meses.length > 0) {
      listaMeses = appConfig.meses.filter(m => dataClases[m.id]);
    } else {
      listaMeses = Object.keys(dataClases).map(id => ({
        id: id,
        label: id.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()),
        short: id.slice(0, 3).toUpperCase()
      }));
    }

    listaMeses.forEach(m => {
      const tabBtn = document.createElement("button");
      tabBtn.className = `month-tab-btn ${m.id === currentMes ? 'active' : ''}`;
      tabBtn.setAttribute("data-mes", m.id);
      tabBtn.setAttribute("role", "tab");
      tabBtn.setAttribute("aria-selected", m.id === currentMes ? "true" : "false");

      tabBtn.innerHTML = `
        <span class="month-short">${m.short || m.label.slice(0, 3)}</span>
        <span class="month-label">${m.label || m.id}</span>
      `;

      tabBtn.addEventListener("click", () => {
        if (currentMes === m.id) return;
        currentMes = m.id;
        document.querySelectorAll(".month-tab-btn").forEach(btn => {
          const isActive = btn.getAttribute("data-mes") === currentMes;
          btn.classList.toggle("active", isActive);
          btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        renderTaller();
      });

      monthsNavEl.appendChild(tabBtn);
    });
  }

  // Helper para formatear nombres de archivos limpios
  function formatFriendlyName(filePath, fallbackPrefix = "Archivo") {
    if (!filePath) return fallbackPrefix;
    const cleanPath = filePath.replace(/\\/g, "/");
    const filename = cleanPath.split("/").pop();
    if (!filename) return fallbackPrefix;
    // Quitar extension
    const baseName = filename.replace(/\.[^/.]+$/, "");
    // Reemplazar guiones bajos y separadores
    return baseName.replace(/[-_]+/g, " ").trim();
  }

  // Helper para normalizar recurso (soporta tanto objeto {nombre, link} como string)
  function parseResource(item, defaultPrefix = "Archivo") {
    if (!item) return null;
    if (typeof item === 'object') {
      return {
        nombre: item.nombre || formatFriendlyName(item.link, defaultPrefix),
        link: (item.link || "").replace(/\\/g, "/")
      };
    }
    if (typeof item === 'string') {
      return {
        nombre: formatFriendlyName(item, defaultPrefix),
        link: item.replace(/\\/g, "/")
      };
    }
    return null;
  }

  // Renderizar contenido del taller activo
  function renderTaller() {
    if (!contentAreaEl) return;
    contentAreaEl.innerHTML = "";

    // Obtener datos del taller
    const mesData = dataClases[currentMes];
    if (!mesData || !mesData[currentDia] || !mesData[currentDia][currentTaller]) {
      contentAreaEl.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">📂</div>
          <h3>No hay información registrada</h3>
          <p>No se encontraron datos para este taller en el mes seleccionado.</p>
        </div>
      `;
      return;
    }

    const taller = mesData[currentDia][currentTaller];

    // Actualizar encabezado del portal
    if (currentTallerTitleEl) currentTallerTitleEl.textContent = taller.nombre;
    if (currentHorarioEl) currentHorarioEl.textContent = `🕒 ${taller.horario}`;
    if (currentDiaBadgeEl) {
      currentDiaBadgeEl.textContent = currentDia === "sabado" ? "Sábado" : "Domingo";
      currentDiaBadgeEl.className = `dia-pill ${currentDia === "sabado" ? "pill-sabado" : "pill-domingo"}`;
    }

    // Encabezado del taller
    const tallerBanner = document.createElement("div");
    tallerBanner.className = "taller-banner-card";
    tallerBanner.innerHTML = `
      <div class="banner-content">
        <span class="banner-tag">Taller Actual</span>
        <h2 class="banner-title">${taller.nombre}</h2>
        <div class="banner-badges">
          <span class="banner-pill pill-day">${currentDia === "sabado" ? "🗓️ Sábado" : "🗓️ Domingo"}</span>
          <span class="banner-pill pill-time">🕒 ${taller.horario}</span>
        </div>
      </div>
    `;
    contentAreaEl.appendChild(tallerBanner);

    // Contenedor de sesiones
    const sesionesList = document.createElement("div");
    sesionesList.className = "sesiones-container";

    if (!taller.sesiones || taller.sesiones.length === 0) {
      sesionesList.innerHTML = `
        <div class="empty-sessions-card">
          <div class="empty-icon">⏳</div>
          <h3>Próximamente</h3>
          <p>Aún no hay sesiones programadas para este mes. ¡Vuelve pronto!</p>
        </div>
      `;
      contentAreaEl.appendChild(sesionesList);
      return;
    }

    // ORDEN DESCENDENTE: Las sesiones más recientes arriba
    const sesionesOrdenadas = [...taller.sesiones].sort((a, b) => {
      return (b.sesion || 0) - (a.sesion || 0);
    });

    sesionesOrdenadas.forEach((sesion, index) => {
      const sesionCard = document.createElement("div");
      sesionCard.className = `sesion-card ${!sesion.disponible ? 'is-disabled' : ''}`;

      // Si no está disponible
      if (!sesion.disponible) {
        sesionCard.innerHTML = `
          <div class="sesion-header-locked">
            <div class="sesion-num-badge">Sesión ${sesion.sesion}</div>
            <div class="sesion-locked-info">
              <span class="locked-title">${sesion.titulo || "Tema por confirmar"}</span>
              <span class="locked-date">📅 ${sesion.fecha || "Fecha por definir"}</span>
            </div>
            <span class="badge-status badge-upcoming">🔒 Próximamente</span>
          </div>
        `;
        sesionesList.appendChild(sesionCard);
        return;
      }

      // Título y fecha
      const numSesion = sesion.sesion;
      const tituloSesion = sesion.titulo ? sesion.titulo : `Contenidos y Prácticas`;
      const fechaSesion = sesion.fecha || "Fecha no especificada";

      // Por defecto la primera sesión (la más reciente) aparece desplegada
      const isFirst = index === 0;

      const header = document.createElement("div");
      header.className = `sesion-header ${isFirst ? 'is-open' : ''}`;
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.innerHTML = `
        <div class="sesion-header-left">
          <span class="sesion-badge">Sesión ${numSesion}</span>
          <div class="sesion-title-wrap">
            <h3 class="sesion-title">${tituloSesion}</h3>
            <span class="sesion-date-text">📅 ${fechaSesion}</span>
          </div>
        </div>
        <div class="sesion-header-right">
          ${sesion.suspendida ? '<span class="badge-status badge-suspended">⚠️ Suspendida</span>' : '<span class="badge-status badge-available">✅ Disponible</span>'}
          <span class="accordion-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </span>
        </div>
      `;

      const content = document.createElement("div");
      content.className = `sesion-body ${isFirst ? 'is-expanded' : ''}`;

      if (sesion.suspendida) {
        content.innerHTML = `
          <div class="suspendida-card">
            <div class="suspendida-alert">
              <span class="alert-icon">⚠️</span>
              <div>
                <strong>Clase Suspendida</strong>
                <p>Esta sesión ha sido suspendida. Revisa el aviso para más información.</p>
              </div>
            </div>
            ${sesion.motivo_suspension_img ? `<div class="motivo-img-wrap"><img src="${sesion.motivo_suspension_img}" alt="Aviso de suspensión" class="motivo-img"></div>` : ''}
          </div>
        `;
      } else {
        // Construir cuadrícula de recursos
        let recursosHTML = '<div class="resources-grid">';
        let hasResources = false;

        // 1. Presentación
        const pres = parseResource(sesion.presentacion, "Presentación de Clase");
        if (pres && pres.link) {
          hasResources = true;
          recursosHTML += `
            <a href="${pres.link}" target="_blank" rel="noopener noreferrer" class="resource-card resource-pres">
              <div class="res-icon-box">📊</div>
              <div class="res-info">
                <span class="res-type">Presentación</span>
                <span class="res-name">${pres.nombre}</span>
              </div>
              <span class="res-action">Ver PDF ↗</span>
            </a>
          `;
        }

        // 2. Guía de clase
        const guia = parseResource(sesion.guia, "Guía de Clase");
        if (guia && guia.link) {
          hasResources = true;
          recursosHTML += `
            <a href="${guia.link}" target="_blank" rel="noopener noreferrer" class="resource-card resource-guia">
              <div class="res-icon-box">📝</div>
              <div class="res-info">
                <span class="res-type">Guía de Clase</span>
                <span class="res-name">${guia.nombre}</span>
              </div>
              <span class="res-action">Abrir Guía ↗</span>
            </a>
          `;
        }

        // 3. URLs / Enlaces
        if (Array.isArray(sesion.urls) && sesion.urls.length > 0) {
          sesion.urls.forEach(u => {
            const parsed = parseResource(u, "Sitio Web");
            if (parsed && parsed.link) {
              hasResources = true;
              recursosHTML += `
                <a href="${parsed.link}" target="_blank" rel="noopener noreferrer" class="resource-card resource-link">
                  <div class="res-icon-box">🔗</div>
                  <div class="res-info">
                    <span class="res-type">Herramienta Web</span>
                    <span class="res-name">${parsed.nombre}</span>
                  </div>
                  <span class="res-action">Visitar ↗</span>
                </a>
              `;
            }
          });
        }

        // 4. Extras / Archivos
        if (Array.isArray(sesion.extras) && sesion.extras.length > 0) {
          sesion.extras.forEach(ext => {
            const parsed = parseResource(ext, "Material Extra");
            if (parsed && parsed.link) {
              hasResources = true;
              recursosHTML += `
                <a href="${parsed.link}" target="_blank" rel="noopener noreferrer" class="resource-card resource-extra">
                  <div class="res-icon-box">📁</div>
                  <div class="res-info">
                    <span class="res-type">Archivo de Práctica</span>
                    <span class="res-name">${parsed.nombre}</span>
                  </div>
                  <span class="res-action">Descargar ↗</span>
                </a>
              `;
            }
          });
        }

        // 5. Imágenes
        if (Array.isArray(sesion.imagenes) && sesion.imagenes.length > 0) {
          sesion.imagenes.forEach(img => {
            const parsed = parseResource(img, "Imagen de Apoyo");
            if (parsed && parsed.link) {
              hasResources = true;
              recursosHTML += `
                <a href="${parsed.link}" target="_blank" rel="noopener noreferrer" class="resource-card resource-img">
                  <div class="res-icon-box">🖼️</div>
                  <div class="res-info">
                    <span class="res-type">Imagen</span>
                    <span class="res-name">${parsed.nombre}</span>
                  </div>
                  <span class="res-action">Ver Imagen ↗</span>
                </a>
              `;
            }
          });
        }

        recursosHTML += '</div>';

        if (!hasResources) {
          recursosHTML = `
            <div class="no-resources-note">
              <span>📂</span> Los recursos y materiales para esta sesión se publicarán antes del inicio de la clase.
            </div>
          `;
        }

        content.innerHTML = recursosHTML;
      }

      // Evento de acordeón
      header.addEventListener("click", () => {
        const isOpen = content.classList.contains("is-expanded");
        content.classList.toggle("is-expanded", !isOpen);
        header.classList.toggle("is-open", !isOpen);
      });

      // Accesibilidad con teclado (Enter o Espacio)
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          header.click();
        }
      });

      sesionCard.appendChild(header);
      sesionCard.appendChild(content);
      sesionesList.appendChild(sesionCard);
    });

    contentAreaEl.appendChild(sesionesList);
  }

  // Inicializar
  renderMonthsNav();
  renderTaller();
});
