document.addEventListener("DOMContentLoaded", () => {

  const isSingle = typeof dataCurso !== "undefined";
  const isMulti  = typeof dataCursos !== "undefined";

  // Inyectar config visual general
  const cfg = typeof appConfig !== "undefined" ? appConfig : {};
  document.getElementById("grupo-name").textContent   = cfg.grupo        || "";
  document.getElementById("tema-name").textContent    = cfg.tema         || "";
  document.getElementById("prof-name").textContent    = cfg.instructor   || "";
  document.getElementById("inst-name").textContent    = cfg.institucion  || "";
  const logoEl = document.getElementById("header-logo");
  if (logoEl && cfg.logoUrl) logoEl.src = cfg.logoUrl;
  const loginLogoEl = document.getElementById("login-logo");
  if (loginLogoEl && cfg.logoUrl) loginLogoEl.src = cfg.logoUrl;

  const main = document.getElementById("main-content");
  const loginOverlay = document.getElementById("login-overlay");
  const loginForm    = document.getElementById("login-form");
  const duiInput     = document.getElementById("dui-input");
  const loginError   = document.getElementById("login-error");
  const headerUser   = document.getElementById("header-user");
  const userDuiBadge = document.getElementById("user-dui-badge");
  const logoutBtn    = document.getElementById("logout-btn");

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

  // Formato automático mientras escribe (ej. 12345678-9)
  duiInput.addEventListener("input", (e) => {
    let val = cleanDui(e.target.value);
    if (val.length > 8) {
      val = val.substring(0, 8) + "-" + val.substring(8, 9);
    }
    e.target.value = val;
    loginError.textContent = "";
    duiInput.classList.remove("error");
  });

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

  // Verificar si un DUI tiene acceso general
  function checkDuiAccess(rawDui) {
    const cleaned = cleanDui(rawDui);
    if (!cleaned) return false;
    const allDuis = getAllAuthorizedDuis();
    // Si no se ha configurado ningún DUI en todo el portal, permitir acceso para prueba
    if (allDuis.length === 0) return true;
    return allDuis.includes(cleaned);
  }

  // ── Control de Autenticación ─────────────────────────────────
  const storedDui = sessionStorage.getItem("auth_dui");
  if (storedDui && checkDuiAccess(storedDui)) {
    unlockPortal(storedDui);
  } else {
    // Si no hay DUI válido o cambió la lista, bloquear y mantener overlay
    sessionStorage.removeItem("auth_dui");
    loginOverlay.style.display = "flex";
    main.innerHTML = ""; // Garantiza que no se muestre nada en el DOM
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
    loginOverlay.style.display = "none";
    headerUser.style.display   = "flex";
    userDuiBadge.textContent   = `DUI: ${userDui}`;
    renderPortal(userDui);
  }

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("auth_dui");
    location.reload();
  });

  // ── Renderizado del Portal ──────────────────────────────────
  function renderPortal(userDui) {
    main.innerHTML = "";
    if (isSingle) {
      renderSingle(dataCurso, main, userDui);
    } else if (isMulti) {
      renderMulti(dataCursos, main, userDui);
    } else {
      main.innerHTML = `<p style="color:#e53e3e;padding:2rem;">Error: no se encontró configuración de cursos.</p>`;
    }
  }

  // ── RENDER SINGLE ──────────────────────────────────────────
  function renderSingle(curso, container, userDui) {
    const normUser = cleanDui(userDui);
    const hasAccess = !curso.duis || curso.duis.length === 0 || curso.duis.map(cleanDui).includes(normUser);
    const card = buildCursoCard(curso, null, hasAccess);
    container.appendChild(card);
  }

  // ── RENDER MULTI ───────────────────────────────────────────
  function renderMulti(cursos, container, userDui) {
    const normUser = cleanDui(userDui);

    // Barra de progresión (orden cronológico original)
    const track = document.createElement("div");
    track.className = "progress-track";
    cursos.forEach((c) => {
      const hasAccess = !c.duis || c.duis.length === 0 || c.duis.map(cleanDui).includes(normUser);
      const step = document.createElement("div");
      step.className = `progress-step ${c.estado}`;
      const icons = { finalizado: "✅", activo: "🔵", proximo: "⏳" };
      const lockIcon = hasAccess ? (icons[c.estado] || "") : "🔒";
      step.innerHTML = `<span class="dot"></span>${lockIcon} ${c.titulo}`;
      if (c.estado !== "proximo") {
        step.addEventListener("click", () => {
          const el = document.getElementById(`curso-${c.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      track.appendChild(step);
    });
    container.appendChild(track);

    // Ordenar tarjetas: activo primero → proximo → finalizado (más reciente primero)
    const prioridad = { activo: 0, proximo: 1, finalizado: 2 };
    const ordenado = [...cursos].sort((a, b) => {
      const pa = prioridad[a.estado] ?? 3;
      const pb = prioridad[b.estado] ?? 3;
      if (pa !== pb) return pa - pb;
      return cursos.indexOf(b) - cursos.indexOf(a);
    });

    // Tarjetas de curso en nuevo orden
    ordenado.forEach(c => {
      const hasAccess = !c.duis || c.duis.length === 0 || c.duis.map(cleanDui).includes(normUser);
      const card = buildCursoCard(c, c.estado, hasAccess);
      card.id = `curso-${c.id}`;
      container.appendChild(card);
    });
  }

  // ── CONSTRUIR TARJETA DE CURSO ──────────────────────────────
  function buildCursoCard(curso, estado, hasAccess) {
    const card = document.createElement("div");
    card.className = "curso-card";

    const estadoLabels = { finalizado: "Finalizado ✅", activo: "En curso 🔵", proximo: "Próximo ⏳" };
    const estadoBadge  = estado ? `<span class="estado-badge ${estado}">${estadoLabels[estado] || ""}</span>` : "";

    card.innerHTML = `
      <div class="curso-header">
        <div>
          <h2>${curso.titulo}</h2>
          <p>${curso.descripcion || ""}</p>
        </div>
        ${estadoBadge}
      </div>
      <div class="sesiones-list" id="sesiones-${curso.id || 'single'}"></div>
    `;

    const sesionesContainer = card.querySelector(".sesiones-list");

    if (!hasAccess) {
      sesionesContainer.innerHTML = `
        <div class="no-access-msg">
          🔒 No tienes acceso habilitado a este módulo. Si consideras que es un error, consulta con tu instructor.
        </div>`;
      return card;
    }

    if (!curso.sesiones || curso.sesiones.length === 0) {
      sesionesContainer.innerHTML = `<p class="empty-msg">No hay sesiones publicadas aún.</p>`;
    } else {
      curso.sesiones.forEach(s => {
        sesionesContainer.appendChild(buildSesionItem(s));
      });
    }

    return card;
  }

  // ── CONSTRUIR ITEM DE SESIÓN (Con ícono de contraste) ──────
  function buildSesionItem(sesion) {
    const item = document.createElement("div");
    item.className = "sesion-item";

    if (!sesion.disponible) {
      item.innerHTML = `
        <div class="sesion-header" style="cursor:default;">
          <div class="sesion-title-group">
            <span class="sesion-toggle-icon" style="background:#ccc; color:#666;">⏳</span>
            <h3>Sesión ${sesion.id}</h3>
          </div>
          <span class="badge-proximo">Próximamente</span>
        </div>`;
      return item;
    }

    const header = document.createElement("div");
    header.className = "sesion-header";
    header.innerHTML = `
      <div class="sesion-title-group">
        <span class="sesion-toggle-icon">▼</span>
        <h3>Sesión ${sesion.id} — ${sesion.titulo}</h3>
      </div>
      <div class="sesion-meta">
        <span class="sesion-date">📅 ${sesion.fecha}</span>
      </div>
    `;

    const body = document.createElement("div");
    body.className = "sesion-body";

    if (sesion.suspendida) {
      body.innerHTML = `
        <div class="suspended-msg">
          ⚠️ Esta sesión fue suspendida.
          ${sesion.motivo_suspension_img ? `<br><img src="${sesion.motivo_suspension_img}" alt="Motivo">` : ""}
        </div>`;
    } else {
      let html = '<div class="recursos-grid">';

      if (sesion.presentacion)
        html += recursoBtn("📊", "Presentación", "Ver en nueva pestaña", sesion.presentacion, "_blank", "");
      if (sesion.guia)
        html += recursoBtn("📝", "Guía de clase", "Ver en nueva pestaña", sesion.guia, "_blank", "");

      (sesion.archivosExcel || []).forEach(a =>
        html += recursoBtn("📗", a.nombre || "Archivo Excel", "Descargar .xlsx", a.ruta, "_self", "excel", true)
      );
      (sesion.urls || []).forEach(u =>
        html += recursoBtn("🔗", u.nombre, "Abrir enlace", u.link, "_blank", "")
      );

      html += "</div>";
      if (html === '<div class="recursos-grid"></div>')
        html = `<p class="empty-msg">No hay recursos disponibles aún.</p>`;
      body.innerHTML = html;
    }

    header.addEventListener("click", () => {
      item.classList.toggle("open");
      body.classList.toggle("open");
    });

    item.appendChild(header);
    item.appendChild(body);
    return item;
  }

  function recursoBtn(icon, title, subtitle, href, target, extraClass, download = false) {
    return `<a href="${href}" target="${target}" class="recurso-card ${extraClass}" ${download ? "download" : ""}>
      <span class="recurso-icon">${icon}</span>
      <div class="recurso-info"><span>${title}</span><small>${subtitle}</small></div>
    </a>`;
  }

});
