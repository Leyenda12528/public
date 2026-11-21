document.addEventListener("DOMContentLoaded", () => {

  const isSingle = typeof dataCurso !== "undefined";
  const isMulti  = typeof dataCursos !== "undefined";

  // Inyectar config visual general
  const cfg = typeof appConfig !== "undefined" ? appConfig : {};
  const grupoNameEl = document.getElementById("grupo-name");
  const temaNameEl  = document.getElementById("tema-name");
  const profNameEl  = document.getElementById("prof-name");
  const instNameEl  = document.getElementById("inst-name");
  const instTagEl   = document.getElementById("institucion-tag");

  if (grupoNameEl) grupoNameEl.textContent = cfg.grupo       || "Grupo General";
  if (temaNameEl)  temaNameEl.textContent  = cfg.tema        || "Curso de Capacitación";
  if (profNameEl)  profNameEl.textContent  = cfg.instructor  || "Docente";
  if (instNameEl)  instNameEl.textContent  = cfg.institucion || "Universidad Don Bosco";
  if (instTagEl)   instTagEl.textContent   = cfg.institucion || "Universidad Don Bosco";

  const logoEl = document.getElementById("header-logo");
  if (logoEl && cfg.logoUrl) logoEl.src = cfg.logoUrl;
  const loginLogoEl = document.getElementById("login-logo");
  if (loginLogoEl && cfg.logoUrl) loginLogoEl.src = cfg.logoUrl;

  const main             = document.getElementById("main-content");
  const modulesTabsBar   = document.getElementById("modules-tabs-bar");
  const loginOverlay     = document.getElementById("login-overlay");
  const loginForm        = document.getElementById("login-form");
  const duiInput         = document.getElementById("dui-input");
  const loginError       = document.getElementById("login-error");
  const demoDuiBtn       = document.getElementById("demo-dui-btn");
  const headerUser       = document.getElementById("header-user");
  const userDuiBadge     = document.getElementById("user-dui-badge");
  const logoutBtn        = document.getElementById("logout-btn");
  const searchInput      = document.getElementById("search-input");
  const searchClear      = document.getElementById("search-clear");
  const orderToggleBtn   = document.getElementById("order-toggle-btn");
  const orderIcon        = document.getElementById("order-icon");
  const orderLabel       = document.getElementById("order-label");

  // Estado de navegación
  let state = {
    userDui: "",
    selectedModuleId: "active", // ID del módulo seleccionado o "all"
    orderRecentFirst: true,     // Por defecto: de más reciente a más actual
    searchQuery: ""
  };

  // ── Helpers de DUI ──────────────────────────────────────────
  function cleanDui(str) {
    if (!str) return "";
    return str.toString().replace(/[^0-9kK]/g, "").toUpperCase();
  }

  function formatDui(str) {
    const c = cleanDui(str);
    if (c.length === 9) {
      return c.substring(0, 8) + "-" + c.substring(8);
    }
    return str;
  }

  // Formato automático mientras escribe
  duiInput.addEventListener("input", (e) => {
    let val = cleanDui(e.target.value);
    if (val.length > 8) {
      val = val.substring(0, 8) + "-" + val.substring(8, 9);
    }
    e.target.value = val;
    loginError.textContent = "";
    duiInput.classList.remove("error");
  });

  // Botón demo DUI para pruebas inmediatas
  if (demoDuiBtn) {
    demoDuiBtn.addEventListener("click", () => {
      duiInput.value = "00000000-0";
      loginForm.dispatchEvent(new Event("submit", { cancelable: true }));
    });
  }

  // Obtener lista consolidada de DUIs autorizados en el grupo
  function getAllAuthorizedDuis() {
    if (isSingle) {
      return (dataCurso.duis || []).map(cleanDui);
    }
    if (isMulti) {
      const set = new Set();
      dataCursos.forEach(c => {
        (c.duis || []).forEach(d => set.add(cleanDui(d)));
      });
      return Array.from(set);
    }
    return [];
  }

  function checkDuiAccess(rawDui) {
    const cleaned = cleanDui(rawDui);
    if (!cleaned) return false;
    const allDuis = getAllAuthorizedDuis();
    if (allDuis.length === 0) return true;
    return allDuis.includes(cleaned);
  }

  // ── Control de Autenticación ─────────────────────────────────
  const storedDui = sessionStorage.getItem("auth_dui");
  if (storedDui && checkDuiAccess(storedDui)) {
    unlockPortal(storedDui);
  } else {
    sessionStorage.removeItem("auth_dui");
    loginOverlay.style.display = "flex";
    main.innerHTML = "";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = duiInput.value.trim();
    if (!cleanDui(val)) {
      showError("Por favor ingresa tu número de DUI.");
      return;
    }
    if (checkDuiAccess(val)) {
      const formatted = formatDui(val);
      sessionStorage.setItem("auth_dui", formatted);
      unlockPortal(formatted);
    } else {
      showError("El DUI ingresado no está registrado en este grupo o curso.");
    }
  });

  function showError(msg) {
    loginError.textContent = msg;
    duiInput.classList.add("error");
    duiInput.focus();
  }

  function unlockPortal(userDui) {
    state.userDui = userDui;
    loginOverlay.style.display = "none";
    headerUser.style.display   = "flex";
    userDuiBadge.textContent   = userDui;
    
    // Inicializar módulo activo seleccionado por defecto
    if (isMulti) {
      const activeCourse = dataCursos.find(c => c.estado === "activo") || dataCursos[dataCursos.length - 1];
      state.selectedModuleId = activeCourse ? activeCourse.id : dataCursos[0].id;
    }

    renderTabsNavigation();
    renderContent();
  }

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("auth_dui");
    location.reload();
  });

  // ── Controles de Barra Superior (Orden y Buscador) ───────────
  if (orderToggleBtn) {
    orderToggleBtn.addEventListener("click", () => {
      state.orderRecentFirst = !state.orderRecentFirst;
      if (state.orderRecentFirst) {
        orderIcon.textContent = "⬇️";
        orderLabel.textContent = "Más reciente primero";
      } else {
        orderIcon.textContent = "⬆️";
        orderLabel.textContent = "Cronológico (1-4)";
      }
      renderContent();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      searchClear.style.display = state.searchQuery ? "flex" : "none";
      renderContent();
    });
  }

  if (searchClear) {
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      state.searchQuery = "";
      searchClear.style.display = "none";
      renderContent();
    });
  }

  // ── Renderizado de las Pestañas Amigables (Tabs) ─────────────
  function renderTabsNavigation() {
    if (!modulesTabsBar || !isMulti) return;
    modulesTabsBar.innerHTML = "";

    const normUser = cleanDui(state.userDui);

    // Lista de cursos ordenada: activo primero, luego los demás en orden descendente
    const prioridad = { activo: 0, proximo: 1, finalizado: 2 };
    const ordenados = [...dataCursos].sort((a, b) => {
      const pa = prioridad[a.estado] ?? 3;
      const pb = prioridad[b.estado] ?? 3;
      if (pa !== pb) return pa - pb;
      return dataCursos.indexOf(b) - dataCursos.indexOf(a);
    });

    // 1. Pestañas para cada módulo
    ordenados.forEach(c => {
      const hasAccess = !c.duis || c.duis.length === 0 || c.duis.map(cleanDui).includes(normUser);
      const isSelected = (state.selectedModuleId === c.id);

      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = `friendly-tab-item ${isSelected ? 'active' : ''}`;
      
      const icon = c.estado === "activo" ? "⚡" : (c.estado === "finalizado" ? "✅" : "⏳");
      const lockIcon = hasAccess ? icon : "🔒";
      const statusLabel = c.estado === "activo" ? "En curso" : (c.estado === "finalizado" ? "Completado" : "Próximo");
      const sesCount = (c.sesiones && c.sesiones.length > 0) ? `${c.sesiones.length} sesiones` : "Módulo";

      tab.innerHTML = `
        <span class="tab-icon-box">${lockIcon}</span>
        <div class="tab-text-wrap">
          <span class="tab-title-line">${c.titulo}</span>
          <span class="tab-sub-line">${sesCount}</span>
        </div>
        <span class="tab-status-pill ${c.estado}">${statusLabel}</span>
      `;

      tab.addEventListener("click", () => {
        state.selectedModuleId = c.id;
        state.searchQuery = "";
        if (searchInput) {
          searchInput.value = "";
          searchClear.style.display = "none";
        }
        renderTabsNavigation();
        renderContent();
      });

      modulesTabsBar.appendChild(tab);
    });

    // 2. Pestaña especial: "Ver Todos los Módulos"
    const allTab = document.createElement("button");
    allTab.type = "button";
    const isAllSelected = (state.selectedModuleId === "all");
    allTab.className = `friendly-tab-item ${isAllSelected ? 'active' : ''}`;
    allTab.innerHTML = `
      <span class="tab-icon-box">📋</span>
      <div class="tab-text-wrap">
        <span class="tab-title-line">Ver Todos</span>
        <span class="tab-sub-line">Vista completa</span>
      </div>
      <span class="tab-status-pill all">Todos</span>
    `;

    allTab.addEventListener("click", () => {
      state.selectedModuleId = "all";
      renderTabsNavigation();
      renderContent();
    });

    modulesTabsBar.appendChild(allTab);
  }

  // ── Renderizado del Contenido Principal ──────────────────────
  function renderContent() {
    main.innerHTML = "";

    // Si hay búsqueda activa, mostrar resultados globales de búsqueda
    if (state.searchQuery) {
      renderSearchResults(state.searchQuery);
      return;
    }

    if (isSingle) {
      renderSingleModule(dataCurso);
      return;
    }

    if (!isMulti) {
      main.innerHTML = `<p class="empty-msg">No se encontró información del curso.</p>`;
      return;
    }

    if (state.selectedModuleId === "all") {
      renderAllModulesView();
    } else {
      const selectedCourse = dataCursos.find(c => c.id === state.selectedModuleId);
      if (selectedCourse) {
        renderSingleModule(selectedCourse);
      } else {
        renderAllModulesView();
      }
    }
  }

  // ── Vista de un Solo Módulo Seleccionado (Amigable y Limpio) ──
  function renderSingleModule(curso) {
    const normUser = cleanDui(state.userDui);
    const hasAccess = !curso.duis || curso.duis.length === 0 || curso.duis.map(cleanDui).includes(normUser);

    const container = document.createElement("div");

    // Hero Banner del Módulo
    const estadoLabels = { finalizado: "Finalizado", activo: "En curso", proximo: "Próximo" };
    const heroIcons = { activo: "⚡", finalizado: "🏆", proximo: "⏳" };
    const sesCount = (curso.sesiones && curso.sesiones.length > 0) 
      ? `${curso.sesiones.length} ${curso.sesiones.length === 1 ? 'clase disponible' : 'clases disponibles'}`
      : "Sin clases publicadas";

    const hero = document.createElement("div");
    hero.className = `module-hero-banner ${curso.estado}`;
    hero.innerHTML = `
      <div class="module-hero-left">
        <div class="module-hero-icon">
          ${heroIcons[curso.estado] || "📘"}
        </div>
        <div class="module-hero-info">
          <h2>${curso.titulo}</h2>
          <p>${curso.descripcion || "Materiales de clase, guías didácticas y archivos de ejercicios."}</p>
        </div>
      </div>
      <div class="module-hero-stats">
        <span class="hero-stat-badge">📚 ${sesCount}</span>
        <span class="hero-stat-badge status ${curso.estado}">${estadoLabels[curso.estado] || curso.estado}</span>
      </div>
    `;
    container.appendChild(hero);

    if (!hasAccess) {
      const noAccess = document.createElement("div");
      noAccess.className = "no-access-msg";
      noAccess.innerHTML = `
        <span style="font-size:1.4rem;">🔒</span>
        <div>
          <strong>Módulo no habilitado para tu número de DUI</strong>
          <p style="margin-top:0.2rem; font-size:0.85rem;">Si eres estudiante de este módulo y no puedes ver los materiales, consulta con tu instructor.</p>
        </div>
      `;
      container.appendChild(noAccess);
      main.appendChild(container);
      return;
    }

    if (!curso.sesiones || curso.sesiones.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-msg";
      empty.innerHTML = `No hay sesiones publicadas aún para <strong>${curso.titulo}</strong>.`;
      container.appendChild(empty);
      main.appendChild(container);
      return;
    }

    // Ordenar sesiones: de la más reciente a la más actual
    let sesiones = [...curso.sesiones];
    if (state.orderRecentFirst) {
      sesiones.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    } else {
      sesiones.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    }

    const maxId = Math.max(...curso.sesiones.map(s => s.id ?? 0));
    const sesContainer = document.createElement("div");
    sesContainer.className = "sesiones-container";

    sesiones.forEach((s) => {
      const isLatest = (s.id === maxId && curso.sesiones.length > 0);
      // La sesión más reciente viene abierta por defecto
      const isOpenByDefault = isLatest;
      sesContainer.appendChild(buildSesionItem(s, isLatest, isOpenByDefault));
    });

    container.appendChild(sesContainer);
    main.appendChild(container);
  }

  // ── Vista de Todos los Módulos ("Ver Todos" Acordeón) ─────────
  function renderAllModulesView() {
    const normUser = cleanDui(state.userDui);
    const wrap = document.createElement("div");
    wrap.className = "all-modules-container";

    // Ordenar módulos: activo primero, luego descendente
    const prioridad = { activo: 0, proximo: 1, finalizado: 2 };
    const ordenados = [...dataCursos].sort((a, b) => {
      const pa = prioridad[a.estado] ?? 3;
      const pb = prioridad[b.estado] ?? 3;
      if (pa !== pb) return pa - pb;
      return dataCursos.indexOf(b) - dataCursos.indexOf(a);
    });

    ordenados.forEach((c) => {
      const hasAccess = !c.duis || c.duis.length === 0 || c.duis.map(cleanDui).includes(normUser);
      const isDefaultOpen = (c.estado === "activo");

      const card = document.createElement("div");
      card.className = `accordion-module-card ${isDefaultOpen ? 'open' : ''}`;
      
      const count = (c.sesiones && c.sesiones.length > 0) ? `${c.sesiones.length} sesiones` : "Sin sesiones";
      const estadoBadge = `<span class="hero-stat-badge status ${c.estado}">${c.estado}</span>`;

      card.innerHTML = `
        <div class="accordion-module-header">
          <div style="display:flex; align-items:center; gap:0.9rem;">
            <span style="font-size:1.3rem;">${c.estado === 'activo' ? '⚡' : '📘'}</span>
            <div>
              <strong style="font-size:1.05rem; color:var(--udb-navy);">${c.titulo}</strong>
              <div style="font-size:0.8rem; color:var(--text-muted);">${c.descripcion || ''}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span style="font-size:0.78rem; color:var(--text-muted);">📚 ${count}</span>
            ${estadoBadge}
            <span class="sesion-toggle-btn">▼</span>
          </div>
        </div>
        <div class="accordion-module-content"></div>
      `;

      const header = card.querySelector(".accordion-module-header");
      const content = card.querySelector(".accordion-module-content");

      header.addEventListener("click", () => {
        card.classList.toggle("open");
      });

      if (!hasAccess) {
        content.innerHTML = `<div class="no-access-msg">🔒 No tienes acceso habilitado para este módulo.</div>`;
      } else if (!c.sesiones || c.sesiones.length === 0) {
        content.innerHTML = `<p class="empty-msg">No hay sesiones publicadas aún.</p>`;
      } else {
        let sesiones = [...c.sesiones];
        if (state.orderRecentFirst) {
          sesiones.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        } else {
          sesiones.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        }
        const maxId = Math.max(...c.sesiones.map(s => s.id ?? 0));

        sesiones.forEach(s => {
          const isLatest = (s.id === maxId);
          content.appendChild(buildSesionItem(s, isLatest, isLatest && c.estado === 'activo'));
        });
      }

      wrap.appendChild(card);
    });

    main.appendChild(wrap);
  }

  // ── Renderizado de Resultados de Búsqueda Global ─────────────
  function renderSearchResults(query) {
    const normUser = cleanDui(state.userDui);
    const wrap = document.createElement("div");
    wrap.className = "sesiones-container";

    const headerMsg = document.createElement("div");
    headerMsg.style.marginBottom = "1rem";
    headerMsg.innerHTML = `<p style="font-size:0.95rem; color:var(--udb-navy);">Resultados de búsqueda para: <strong>"${query}"</strong></p>`;
    wrap.appendChild(headerMsg);

    let foundCount = 0;

    dataCursos.forEach(c => {
      const hasAccess = !c.duis || c.duis.length === 0 || c.duis.map(cleanDui).includes(normUser);
      if (!hasAccess || !c.sesiones) return;

      c.sesiones.forEach(s => {
        const titleMatch = (s.titulo || "").toLowerCase().includes(query);
        const fechaMatch = (s.fecha || "").toLowerCase().includes(query);
        const excelMatch = (s.archivosExcel || []).some(a => (a.nombre || "").toLowerCase().includes(query));
        const guiasMatch = (s.guias || []).some(g => {
          const name = typeof g === "string" ? g : (g.nombre || "");
          return name.toLowerCase().includes(query);
        });

        if (titleMatch || fechaMatch || excelMatch || guiasMatch) {
          foundCount++;
          const item = buildSesionItem(s, false, true); // Abierta por defecto en búsqueda
          wrap.appendChild(item);
        }
      });
    });

    if (foundCount === 0) {
      wrap.innerHTML += `<p class="empty-msg">No se encontraron clases o archivos que coincidan con tu búsqueda.</p>`;
    }

    main.appendChild(wrap);
  }

  // ── CONSTRUIR ITEM DE SESIÓN (Limpio y Amigable) ────────────
  function buildSesionItem(sesion, isLatest, isOpenByDefault) {
    const item = document.createElement("div");
    item.className = `sesion-item ${isLatest ? 'is-latest' : ''} ${isOpenByDefault ? 'open' : ''}`;

    if (!sesion.disponible) {
      item.innerHTML = `
        <div class="sesion-header" style="cursor:default; opacity:0.75;">
          <div class="sesion-header-left">
            <div class="sesion-num-badge" style="background:#e2e8f0; color:#64748b; border-color:#cbd5e1;">S${sesion.id}</div>
            <div class="sesion-title-wrap">
              <h3>Sesión ${sesion.id} — ${sesion.titulo || 'Próximamente'}</h3>
            </div>
          </div>
          <div class="sesion-header-right">
            <span class="sesion-date-badge">Próximamente</span>
          </div>
        </div>`;
      return item;
    }

    const latestBadgeHtml = isLatest 
      ? `<span class="badge-latest-tag">✨ Última clase</span>` 
      : "";

    const header = document.createElement("div");
    header.className = "sesion-header";
    header.innerHTML = `
      <div class="sesion-header-left">
        <div class="sesion-num-badge">S${sesion.id}</div>
        <div class="sesion-title-wrap">
          <div class="sesion-title-row">
            <h3>Sesión ${sesion.id} — ${sesion.titulo}</h3>
            ${latestBadgeHtml}
          </div>
        </div>
      </div>
      <div class="sesion-header-right">
        <span class="sesion-date-badge">📅 ${sesion.fecha || 'Fecha programada'}</span>
        <span class="sesion-toggle-btn">▼</span>
      </div>
    `;

    const body = document.createElement("div");
    body.className = "sesion-body";

    if (sesion.suspendida) {
      body.innerHTML = `
        <div class="suspended-msg">
          ⚠️ <strong>Sesión Suspendida:</strong> Esta clase fue reprogramada por causas de fuerza mayor.
          ${sesion.motivo_suspension_img ? `<br><img src="${sesion.motivo_suspension_img}" alt="Comunicado de suspensión">` : ""}
        </div>`;
    } else {
      let html = '<div class="recursos-grid">';

      // 1. Presentación (PDF / Diapositivas)
      if (sesion.presentacion) {
        html += recursoBtn(
          "📊", 
          "presentacion",
          "PDF",
          "Presentación de Clase", 
          "Ver diapositivas en pestaña", 
          sesion.presentacion, 
          "_blank", 
          false
        );
      }

      // 2. Múltiples Guías o Guía única (PDFs)
      if (Array.isArray(sesion.guias) && sesion.guias.length > 0) {
        sesion.guias.forEach((g, idx) => {
          const nombre = typeof g === "string" ? `Guía ${idx + 1}` : (g.nombre || `Guía ${idx + 1}`);
          const ruta = typeof g === "string" ? g : g.ruta;
          if (ruta) {
            const isArchive = ruta.toLowerCase().endsWith(".rar") || ruta.toLowerCase().endsWith(".zip");
            const type = isArchive ? "rar" : "guia";
            const icon = isArchive ? "📦" : "📝";
            const tag = isArchive ? "PAQUETE" : "PDF";
            const action = isArchive ? "Descargar archivo" : "Ver guía en pestaña";
            
            html += recursoBtn(
              icon, 
              type, 
              tag, 
              nombre, 
              action, 
              ruta, 
              isArchive ? "_self" : "_blank", 
              isArchive
            );
          }
        });
      } else if (sesion.guia) {
        html += recursoBtn(
          "📝", 
          "guia", 
          "PDF", 
          "Guía de clase", 
          "Ver documento en pestaña", 
          sesion.guia, 
          "_blank", 
          false
        );
      }

      // 3. Archivos Excel (.xlsx / .xls)
      (sesion.archivosExcel || []).forEach(a => {
        html += recursoBtn(
          "📗", 
          "excel", 
          "EXCEL", 
          a.nombre || "Plantilla de Práctica", 
          "Descargar archivo .xlsx", 
          a.ruta, 
          "_self", 
          true
        );
      });

      // 4. Enlaces Web / Recursos externos
      (sesion.urls || []).forEach(u => {
        html += recursoBtn(
          "🔗", 
          "web", 
          "ENLACE", 
          u.nombre || "Recurso Web", 
          "Abrir enlace externo", 
          u.link, 
          "_blank", 
          false
        );
      });

      html += "</div>";

      if (html === '<div class="recursos-grid"></div>') {
        html = `<p class="empty-msg">No hay materiales cargados aún para esta sesión.</p>`;
      }

      body.innerHTML = html;
    }

    header.addEventListener("click", () => {
      item.classList.toggle("open");
    });

    item.appendChild(header);
    item.appendChild(body);
    return item;
  }

  // ── BOTÓN DE RECURSO CON ESTILO TÁCTIL Y LIMPIO ───────────────
  function recursoBtn(icon, typeClass, tagLabel, title, subtitle, href, target, isDownload) {
    const downloadAttr = isDownload ? 'download' : '';
    const actionIcon = isDownload 
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    return `
      <a href="${href}" target="${target}" class="recurso-card ${typeClass}" ${downloadAttr} title="${title} — ${subtitle}">
        <div class="recurso-icon-box">
          <span>${icon}</span>
        </div>
        <div class="recurso-info-box">
          <span class="recurso-type-badge">${tagLabel}</span>
          <strong>${title}</strong>
          <small>${subtitle}</small>
        </div>
        <div class="recurso-action-icon">
          ${actionIcon}
        </div>
      </a>
    `;
  }

});