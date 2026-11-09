const THEME_STORAGE_KEY = "silva-os-theme";
const systemColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
let themePreference = readThemePreference();
let activeTheme = themePreference === "system"
  ? (systemColorScheme.matches ? "dark" : "light")
  : themePreference;

function readThemePreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return ["light", "dark", "system"].includes(stored) ? stored : "system";
  } catch (error) {
    console.error("Could not read the Silva OS theme preference.", error);
    return "system";
  }
}

function applyTheme(theme) {
  activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#0d0e12" : "#f9f9fb",
  );
  const toggle = document.querySelector("#theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("aria-label", `Переключить на ${theme === "dark" ? "светлую" : "тёмную"} тему`);
    toggle.title = `Переключить на ${theme === "dark" ? "светлую" : "тёмную"} тему`;
  }
}

function setThemePreference(preference) {
  if (!["light", "dark", "system"].includes(preference)) {
    showToast("Неизвестный режим темы. Используйте light, dark или system.");
    return;
  }
  themePreference = preference;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch (error) {
    console.error("Could not save the Silva OS theme preference.", error);
    showToast("Тема изменена, но сохранить её между запусками не удалось.");
  }
  applyTheme(preference === "system" ? (systemColorScheme.matches ? "dark" : "light") : preference);
}

applyTheme(activeTheme);
systemColorScheme.addEventListener("change", (event) => {
  if (themePreference === "system") applyTheme(event.matches ? "dark" : "light");
});

const apps = {
  atlas: {
    title: "Ботанический атлас",
    url: "https://silvaquieta.com/#catalog",
  },
  assistant: {
    title: "Silva AI",
    url: "https://ailab.silvaquieta.com/",
  },
  garden: {
    title: "Мой сад",
    url: "https://silvaquieta.com/#garden",
  },
  community: {
    title: "Silva Community",
    url: "https://community.silvaquieta.com/",
  },
  monitor: {
    title: "Монитор системы",
    kind: "monitor",
  },
  terminal: {
    title: "Терминал / Настройки",
    kind: "terminal",
  },
};

function getLocalizedAppUrl(appUrl) {
  const url = new URL(appUrl);
  if (["silvaquieta.com", "ailab.silvaquieta.com", "community.silvaquieta.com"].includes(url.hostname)) {
    url.searchParams.set("locale", window.silvaI18n.locale);
  }
  return url.href;
}

class FullscreenAppManager {
  constructor(desktop, layer) {
    this.desktop = desktop;
    this.shell = desktop.closest(".os-shell");
    this.layer = layer;
    this.template = document.querySelector("#window-template");
    this.monitorTemplate = document.querySelector("#monitor-template");
    this.terminalTemplate = document.querySelector("#terminal-template");
    this.windows = new Map();
    this.activeApp = null;
    this.bindEvents();
  }

  bindEvents() {
    this.bindBackgroundCanvas();
    this.layer.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      const element = event.target.closest(".os-window");
      if (!element) return;
      const appId = element.dataset.appId;
      this.focus(appId);

      const titlebar = event.target.closest(".window-titlebar");
      if (!titlebar || event.target.closest(".window-controls") || element.classList.contains("is-maximized")) return;
      const elementBounds = element.getBoundingClientRect();
      const layerBounds = this.layer.getBoundingClientRect();
      this.dragState = {
        element,
        pointerId: event.pointerId,
        left: elementBounds.left - layerBounds.left,
        top: elementBounds.top - layerBounds.top,
        width: elementBounds.width,
        height: elementBounds.height,
        startX: event.clientX,
        startY: event.clientY,
      };
      titlebar.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    this.layer.addEventListener("pointermove", (event) => {
      const drag = this.dragState;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const bounds = this.layer.getBoundingClientRect();
      const left = Math.max(0, Math.min(bounds.width - drag.width, drag.left + event.clientX - drag.startX));
      const top = Math.max(0, Math.min(bounds.height - 48, drag.top + event.clientY - drag.startY));
      drag.element.style.left = `${left}px`;
      drag.element.style.top = `${top}px`;
      drag.element.style.transform = "none";
    });
    const stopDragging = (event) => {
      if (this.dragState?.pointerId === event.pointerId) this.dragState = null;
    };
    this.layer.addEventListener("pointerup", stopDragging);
    this.layer.addEventListener("pointercancel", stopDragging);
    this.layer.addEventListener("click", (event) => {
      const control = event.target.closest("[data-window-action]");
      if (control) {
        const element = control.closest(".os-window");
        const appId = element?.dataset.appId;
        if (!appId) return;
        if (control.dataset.windowAction === "minimize") this.minimize(appId);
        if (control.dataset.windowAction === "maximize") this.toggleMaximize(appId);
        if (control.dataset.windowAction === "close") this.close(appId);
      }
    });
    this.layer.addEventListener("dblclick", (event) => {
      if (event.target.closest(".window-controls")) return;
      const element = event.target.closest(".os-window");
      if (element && event.target.closest(".window-titlebar")) {
        this.toggleMaximize(element.dataset.appId);
      }
    });
  }

  bindBackgroundCanvas() {
    initializeBackgroundCanvas();
  }

  open(appId) {
    const app = apps[appId];
    if (!app) return;

    const current = this.windows.get(appId);
    if (current) {
      window.clearTimeout(current.hideTimeout);
      current.element.hidden = false;
      current.element.inert = false;
      current.element.classList.remove("is-closing");
      current.element.classList.remove("is-minimizing");
      current.minimized = false;
    } else {
      const element = this.template.content.firstElementChild.cloneNode(true);
      element.setAttribute("aria-label", app.title);
      element.dataset.appId = appId;
      element.classList.add(`app-${appId}`);
      element.querySelector(".window-title-text").textContent = app.title;

      const content = element.querySelector(".window-content");
      const externalLink = element.querySelector("[data-open-app]");
      const appUrl = app.url ? getLocalizedAppUrl(app.url) : null;
      let frame = null;
      let cleanup = null;
      if (app.kind === "monitor") {
        content.append(this.monitorTemplate.content.cloneNode(true));
        cleanup = mountSystemMonitor(content);
        element.querySelector(".app-loading").hidden = true;
        externalLink.hidden = true;
        element.classList.add("is-loaded", "is-internal-app");
      } else if (app.kind === "terminal") {
        content.append(this.terminalTemplate.content.cloneNode(true));
        mountTerminal(content);
        element.querySelector(".app-loading").hidden = true;
        externalLink.hidden = true;
        element.classList.add("is-loaded", "is-internal-app");
      } else {
        frame = document.createElement("iframe");
        frame.className = "app-frame";
        frame.src = appUrl;
        frame.title = `${app.title} — Silva OS`;
        frame.loading = "lazy";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allow = "clipboard-read; clipboard-write";
        frame.addEventListener("load", () => {
          const state = this.windows.get(appId);
          if (state?.loadingTimeout) window.clearTimeout(state.loadingTimeout);
          element.classList.add("is-loaded");
          element.querySelector(".app-loading-fallback").hidden = true;
          element.querySelector(".app-loading").setAttribute("aria-hidden", "true");
        });
        content.append(frame);
        element.querySelectorAll("[data-open-app]").forEach((link) => {
          link.href = appUrl;
        });
      }

      this.layer.append(element);
      const state = { element, minimized: true, frame, appUrl, cleanup, hideTimeout: 0 };
      this.windows.set(appId, state);
      if (frame) this.startLoadingTimeout(state);
    }

    this.focus(appId);
  }

  syncShellState() {
    const active = this.activeApp ? this.windows.get(this.activeApp) : null;
    const hasActive = Boolean(active && !active.minimized);
    const hasMaximizedApp = Boolean(hasActive && active.element.classList.contains("is-maximized"));
    this.desktop.classList.toggle("has-active-app", hasActive);
    this.shell.classList.toggle("has-active-app", hasActive);
    this.desktop.classList.toggle("has-maximized-app", hasMaximizedApp);
    this.shell.classList.toggle("has-maximized-app", hasMaximizedApp);
  }

  hide(state) {
    window.clearTimeout(state.hideTimeout);
    state.minimized = true;
    state.element.inert = true;
    state.element.classList.remove("is-active");
    state.element.classList.add("is-closing");
    state.hideTimeout = window.setTimeout(() => {
      if (state.minimized) state.element.hidden = true;
      state.element.classList.remove("is-closing");
    }, 350);
  }

  focus(appId) {
    const selected = this.windows.get(appId);
    if (!selected) return;
    if (this.activeApp && this.activeApp !== appId) {
      const previous = this.windows.get(this.activeApp);
      if (previous) this.hide(previous);
    }
    window.clearTimeout(selected.hideTimeout);
    selected.minimized = false;
    selected.element.hidden = false;
    selected.element.inert = false;
    selected.element.classList.remove("is-closing");
    this.windows.forEach(({ element }, id) => {
      const focused = id === appId;
      element.classList.toggle("is-active", focused);
    });
    this.activeApp = appId;
    this.syncShellState();
    this.updateDock();
    updateSystemContext();
  }

  minimize(appId) {
    const state = this.windows.get(appId);
    if (!state) return;
    if (this.activeApp === appId) this.returnHome();
    else this.hide(state);
  }

  toggleMaximize(appId) {
    const state = this.windows.get(appId);
    if (!state) return;
    const maximized = !state.element.classList.contains("is-maximized");
    if (maximized) {
      state.restoreGeometry = {
        left: state.element.style.left,
        top: state.element.style.top,
        transform: state.element.style.transform,
      };
      state.element.style.left = "";
      state.element.style.top = "";
      state.element.style.transform = "";
      state.element.classList.add("is-maximized");
    } else {
      state.element.classList.remove("is-maximized");
      state.element.style.left = state.restoreGeometry?.left || "";
      state.element.style.top = state.restoreGeometry?.top || "";
      state.element.style.transform = state.restoreGeometry?.transform || "";
      state.restoreGeometry = null;
    }
    const button = state.element.querySelector('[data-window-action="maximize"]');
    button.setAttribute("aria-label", maximized ? "Восстановить размер окна" : "Развернуть окно");
    button.title = maximized ? "Восстановить" : "Развернуть";
    this.syncShellState();
  }

  close(appId) {
    const state = this.windows.get(appId);
    if (!state) return;
    const wasActive = this.activeApp === appId;
    window.clearTimeout(state.loadingTimeout);
    window.clearTimeout(state.hideTimeout);
    state.cleanup?.();
    state.element.remove();
    this.windows.delete(appId);
    if (wasActive) {
      this.activeApp = null;
    }
    this.syncShellState();
    updateSystemContext();
    this.updateDock();
  }

  returnHome() {
    const active = this.activeApp ? this.windows.get(this.activeApp) : null;
    if (active) this.hide(active);
    this.activeApp = null;
    this.syncShellState();
    this.updateDock();
    updateSystemContext();
  }

  closeActiveApp() {
    const appId = this.activeApp;
    if (appId) this.close(appId);
  }

  activeAppId() {
    return this.activeApp || null;
  }

  updateLocale(locale) {
    this.windows.forEach((state, appId) => {
      if (!state.frame) return;
      const appUrl = new URL(apps[appId].url);
      appUrl.searchParams.set("locale", locale);
      const nextUrl = appUrl.href;
      if (state.appUrl === nextUrl) return;
      state.appUrl = nextUrl;
      state.frame.src = nextUrl;
      state.element.classList.remove("is-loaded");
      state.element.querySelector(".app-loading").setAttribute("aria-hidden", "false");
      state.element.querySelector(".app-loading-label").textContent = "Открываем приложение…";
      state.element.querySelector(".app-loading-fallback").hidden = true;
      this.startLoadingTimeout(state);
      state.element.querySelectorAll("[data-open-app]").forEach((link) => {
        link.href = nextUrl;
      });
    });
  }

  reload(appId) {
    const state = this.windows.get(appId);
    if (!state) return;
    if (!state.frame) {
      showToast("Встроенное приложение уже обновлено.");
      this.focus(appId);
      return;
    }
    state.element.classList.remove("is-loaded");
    state.element.querySelector(".app-loading").setAttribute("aria-hidden", "false");
    state.element.querySelector(".app-loading-label").textContent = "Обновляем приложение…";
    state.element.querySelector(".app-loading-fallback").hidden = true;
    this.startLoadingTimeout(state);
    state.frame.src = state.frame.src;
    this.focus(appId);
  }

  startLoadingTimeout(state) {
    window.clearTimeout(state.loadingTimeout);
    state.loadingTimeout = window.setTimeout(() => {
      if (state.element.classList.contains("is-loaded")) return;
      state.element.querySelector(".app-loading-label").textContent = "Сайт загружается дольше обычного";
      state.element.querySelector(".app-loading-fallback").hidden = false;
    }, 12000);
  }

  updateDock() {
    document.querySelectorAll(".dock-app[data-launch]").forEach((button) => {
      const state = this.windows.get(button.dataset.launch);
      button.classList.toggle("is-running", Boolean(state));
      button.classList.toggle("is-active", Boolean(state && !state.minimized));
    });
  }

}

function updateSystemContext() {
  const context = document.querySelector("#active-window-context");
  const activeId = windowManager?.activeAppId();
  context.textContent = activeId ? apps[activeId].title : "Рабочий стол";
}

function mountSystemMonitor(container) {
  const canvas = container.querySelector(".monitor-chart");
  const context = canvas.getContext("2d");
  if (!context) {
    showToast("Не удалось запустить график монитора системы.");
    return () => {};
  }
  const history = Array.from({ length: 60 }, () => ({
    cpu: 22 + Math.random() * 38,
    memory: 44 + Math.random() * 18,
  }));
  let values = { cpu: 0, memory: 0, core: 0 };

  const drawChart = () => {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const width = bounds.width;
    const height = bounds.height;
    const styles = getComputedStyle(document.documentElement);
    const gridColor = styles.getPropertyValue("--monitor-grid").trim();
    const cpuColor = styles.getPropertyValue("--monitor-cpu").trim();
    const memoryColor = styles.getPropertyValue("--monitor-memory").trim();
    context.clearRect(0, 0, width, height);
    context.strokeStyle = gridColor;
    context.lineWidth = 1;
    for (let row = 1; row < 4; row += 1) {
      const y = Math.round((height * row) / 4) + 0.5;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    [
      ["cpu", cpuColor],
      ["memory", memoryColor],
    ].forEach(([key, color]) => {
      context.beginPath();
      history.forEach((point, index) => {
        const x = (index / (history.length - 1)) * width;
        const y = height - (point[key] / 100) * (height - 8) - 4;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();
    });
  };

  const updateMetrics = () => {
    values = {
      cpu: Math.round(24 + Math.random() * 52),
      memory: Math.round(46 + Math.random() * 32),
      core: Math.round(34 + Math.random() * 72),
    };
    for (const [key, value] of Object.entries(values)) {
      const label = container.querySelector(`[data-metric-value="${key}"]`);
      const bar = container.querySelector(`[data-metric-bar="${key}"]`);
      label.textContent = String(value);
      bar.style.width = `${key === "core" ? 100 - value / 1.5 : value}%`;
    }
    history.push({ cpu: values.cpu, memory: values.memory });
    if (history.length > 60) history.shift();
    drawChart();
  };

  updateMetrics();
  const interval = window.setInterval(updateMetrics, 1_000);
  let observer = null;
  const redraw = () => drawChart();
  if ("ResizeObserver" in window) {
    observer = new ResizeObserver(drawChart);
    observer.observe(canvas);
  } else {
    window.addEventListener("resize", redraw);
  }
  return () => {
    window.clearInterval(interval);
    observer?.disconnect();
    if (!observer) window.removeEventListener("resize", redraw);
  };
}

function mountTerminal(container) {
  const screen = container.querySelector(".terminal-screen");
  const form = container.querySelector(".terminal-form");
  const input = form.elements.command;
  const commandHistory = [];
  let historyIndex = 0;

  const writeLine = (text, kind = "output") => {
    const line = document.createElement("p");
    line.className = `terminal-line terminal-line-${kind}`;
    line.textContent = text;
    screen.append(line);
    while (screen.childElementCount > 150) screen.firstElementChild.remove();
    screen.scrollTop = screen.scrollHeight;
  };

  const help = () => [
    "Доступные команды:",
    "  help                         показать эту справку",
    "  theme light|dark|system      выбрать тему интерфейса",
    "  clear                        очистить вывод терминала",
    "  about silva                  сведения об оболочке",
    "  cache supabase status        найти кэши CacheStorage с именем Supabase",
    "  cache supabase clear         удалить только найденные кэши Supabase",
  ].forEach((line) => writeLine(line));

  const runCommand = async (rawCommand) => {
    const command = rawCommand.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!command.length) return;
    const [root, arg, third] = command;
    if (root === "help" && command.length === 1) {
      help();
    } else if (root === "clear" && command.length === 1) {
      screen.replaceChildren();
      writeLine("Вывод очищен.");
    } else if (root === "about" && arg === "silva" && command.length === 2) {
      writeLine("Silva OS — веб-оболочка для сайтов Silva и локальных системных инструментов.");
      writeLine("Системный монитор показывает демонстрационные, а не аппаратные метрики.");
    } else if (root === "theme" && ["light", "dark", "system"].includes(arg) && command.length === 2) {
      setThemePreference(arg);
      writeLine(`Режим темы: ${arg}.`);
    } else if (root === "cache" && arg === "supabase" && ["status", "clear", undefined].includes(third) && command.length <= 3) {
      if (!("caches" in window)) {
        writeLine("CacheStorage недоступен в этом браузере.", "error");
        return;
      }
      try {
        const matchingCaches = (await caches.keys()).filter((name) => name.toLowerCase().includes("supabase"));
        if (third === "clear") {
          const results = await Promise.all(matchingCaches.map((name) => caches.delete(name)));
          const deletedCount = results.filter(Boolean).length;
          writeLine(`Удалено кэшей: ${deletedCount}. Данные авторизации и другие хранилища не затронуты.`);
        } else {
          writeLine(matchingCaches.length
            ? `Найдены кэши CacheStorage: ${matchingCaches.join(", ")}.`
            : "Кэши CacheStorage с именем Supabase не найдены.");
          writeLine("Проверяется только CacheStorage текущего сайта; данные авторизации не затрагиваются.");
        }
      } catch (error) {
        console.error("Could not inspect Supabase CacheStorage entries.", error);
        writeLine("Не удалось получить доступ к CacheStorage.", "error");
      }
    } else if (root === "settings" && arg === "supabase" && third === "cache" && ["status", "clear"].includes(command[3]) && command.length === 4) {
      await runCommand(`cache supabase ${command[3]}`);
    } else {
      writeLine(`Неизвестная команда: ${rawCommand}. Введите help.`, "error");
    }
  };

  writeLine("Silva OS Terminal · локальная оболочка");
  writeLine("Введите help для списка поддерживаемых команд.");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value;
    if (!command.trim()) return;
    writeLine(`silva › ${command}`, "command");
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    input.value = "";
    void runCommand(command);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = commandHistory[historyIndex] || "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input.value = commandHistory[historyIndex] || "";
    }
  });
}

function showToast(message) {
  const region = document.querySelector("#toast-region");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function updateClock() {
  const clock = document.querySelector("#system-clock");
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = window.silvaI18n.formatDate(now);
}

function initializeBackgroundCanvas() {
  const canvas = document.querySelector("#bg-canvas");
  const context = canvas?.getContext("2d", { alpha: false });
  if (!canvas || !context) {
    console.error("Could not initialize the Silva OS background canvas.");
    return;
  }

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false, pressed: false, strength: 0 };
  const ripples = [];
  const orbs = [
    { x: window.innerWidth * 0.22, y: window.innerHeight * 0.3, phase: 0.2, radius: 0.62, color: "moss" },
    { x: window.innerWidth * 0.76, y: window.innerHeight * 0.34, phase: 2.4, radius: 0.68, color: "violet" },
    { x: window.innerWidth * 0.48, y: window.innerHeight * 0.8, phase: 4.1, radius: 0.54, color: "moss" },
  ];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let pixelRatio = 1;
  let frame = 0;
  let lastFrameTime = 0;
  let elapsed = 0;
  let inViewport = true;
  let isDark = document.documentElement.dataset.theme === "dark";
  let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--surface-base").trim() ||
    (isDark ? "#070b0e" : "#f9f9fb");

  const isActive = () => document.visibilityState === "visible" && inViewport;
  const requestFrame = () => {
    if (isActive() && !frame) frame = window.requestAnimationFrame(draw);
  };
  const resize = () => {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2,
      Math.sqrt(8_294_400 / (width * height)),
    );
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    requestFrame();
  };
  const draw = (timestamp) => {
    frame = 0;
    if (!isActive()) return;

    const delta = lastFrameTime ? Math.min(timestamp - lastFrameTime, 50) : 0;
    lastFrameTime = timestamp;
    if (!motionPreference.matches) elapsed += delta / 1000;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    const minDimension = Math.min(width, height);
    pointer.strength += ((pointer.active ? (pointer.pressed ? 0.38 : 0.24) : 0) - pointer.strength) * 0.035;
    orbs.forEach((orb, index) => {
      const baseX = width * ([0.23, 0.76, 0.5][index] + Math.sin(elapsed * 0.16 + orb.phase) * 0.085);
      const baseY = height * ([0.3, 0.35, 0.78][index] + Math.cos(elapsed * 0.13 + orb.phase) * 0.085);
      const targetX = baseX + (pointer.x - baseX) * pointer.strength;
      const targetY = baseY + (pointer.y - baseY) * pointer.strength;
      orb.x += (targetX - orb.x) * 0.025;
      orb.y += (targetY - orb.y) * 0.025;
      const radius = minDimension * orb.radius;
      const gradient = context.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, radius);
      if (orb.color === "violet") {
        gradient.addColorStop(0, isDark ? "rgba(151, 111, 233, 0.3)" : "rgba(137, 98, 210, 0.13)");
        gradient.addColorStop(0.42, isDark ? "rgba(135, 95, 220, 0.16)" : "rgba(137, 98, 210, 0.065)");
      } else {
        gradient.addColorStop(0, isDark ? "rgba(42, 139, 91, 0.32)" : "rgba(46, 135, 83, 0.14)");
        gradient.addColorStop(0.42, isDark ? "rgba(38, 128, 83, 0.17)" : "rgba(46, 135, 83, 0.07)");
      }
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(orb.x - radius, orb.y - radius, radius * 2, radius * 2);
    });

    if (pointer.strength > 0.01) {
      const radius = minDimension * 0.32;
      const gradient = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      gradient.addColorStop(0, isDark ? `rgba(147, 112, 225, ${pointer.strength * 0.22})` : `rgba(102, 133, 186, ${pointer.strength * 0.09})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(pointer.x - radius, pointer.y - radius, radius * 2, radius * 2);
    }

    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      const age = timestamp - ripple.startedAt;
      if (!ripple.reduced && age >= 850) {
        ripples.splice(index, 1);
        continue;
      }
      const progress = ripple.reduced ? 0.58 : age / 850;
      const radius = minDimension * (0.035 + progress * 0.4);
      context.beginPath();
      context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      context.lineWidth = Math.max(1, minDimension * 0.0016);
      context.strokeStyle = isDark
        ? `rgba(151, 196, 163, ${ripple.reduced ? 0.34 : (1 - progress) * 0.42})`
        : `rgba(83, 132, 103, ${ripple.reduced ? 0.24 : (1 - progress) * 0.3})`;
      context.shadowColor = isDark ? "rgba(123, 191, 145, 0.5)" : "rgba(93, 150, 112, 0.35)";
      context.shadowBlur = minDimension * 0.012 * (1 - progress);
      context.stroke();
      context.shadowBlur = 0;
    }

    if (!motionPreference.matches) frame = window.requestAnimationFrame(draw);
  };

  const trackPointer = (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    requestFrame();
  };
  window.addEventListener("pointermove", trackPointer, { passive: true });
  window.addEventListener("pointerdown", (event) => {
    trackPointer(event);
    pointer.pressed = true;
    ripples.push({
      x: event.clientX,
      y: event.clientY,
      startedAt: performance.now(),
      reduced: motionPreference.matches,
    });
    if (ripples.length > 4) ripples.shift();
    requestFrame();
  }, { passive: true });
  window.addEventListener("pointerup", () => { pointer.pressed = false; });
  window.addEventListener("pointercancel", () => { pointer.pressed = false; });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
    pointer.pressed = false;
    requestFrame();
  });
  window.addEventListener("resize", resize, { passive: true });
  window.visualViewport?.addEventListener("resize", resize, { passive: true });
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(document.documentElement);
  }
  document.addEventListener("visibilitychange", () => {
    if (isActive()) {
      lastFrameTime = 0;
      requestFrame();
    } else if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  motionPreference.addEventListener("change", () => {
    lastFrameTime = 0;
    requestFrame();
  });
  new MutationObserver(() => {
    isDark = document.documentElement.dataset.theme === "dark";
    backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--surface-base").trim() ||
      (isDark ? "#070b0e" : "#f9f9fb");
    requestFrame();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) {
        lastFrameTime = 0;
        requestFrame();
      } else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }).observe(document.querySelector("#os-shell"));
  }

  resize();
}

const desktop = document.querySelector("#desktop");
const windowManager = new FullscreenAppManager(desktop, document.querySelector("#window-layer"));
window.addEventListener("silva-os-locale-change", (event) => {
  windowManager.updateLocale(event.detail.locale);
});

document.addEventListener("click", (event) => {
  if (event.detail !== 0) return;
  handleShellActivation(event.target);
});

let pointerActivationTarget = null;
document.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  pointerActivationTarget = event.target.closest("[data-launch], [data-action], [data-menu], #theme-toggle");
});
document.addEventListener("pointerup", (event) => {
  if (!event.isPrimary || !pointerActivationTarget) return;
  const target = event.target.closest("[data-launch], [data-action], [data-menu], #theme-toggle");
  const pressedTarget = pointerActivationTarget;
  pointerActivationTarget = null;
  if (target === pressedTarget || pressedTarget.contains(target)) handleShellActivation(target);
});
document.addEventListener("pointercancel", () => { pointerActivationTarget = null; });

function handleShellActivation(target) {
  if (!target) return;
  if (target.id === "theme-toggle") {
    setThemePreference(activeTheme === "dark" ? "light" : "dark");
    return;
  }
  const launch = target.closest("[data-launch]");
  if (launch) {
    windowManager.open(launch.dataset.launch);
    closeMenu();
    closeLauncher();
    return;
  }

  const action = target.closest("[data-action]")?.dataset.action;
  if (action === "home") windowManager.returnHome();

  const menuButton = target.closest("[data-menu]");
  if (menuButton) {
    toggleMenu(menuButton);
    return;
  }
  if (!target.closest("#menu-popover")) closeMenu();
}

function toggleMenu(button) {
  const popover = document.querySelector("#menu-popover");
  const expanded = button.getAttribute("aria-expanded") === "true";
  closeMenu();
  if (expanded) return;

  const menu = button.dataset.menu;
  const menuItems = {
    applications: [
      ["Ботанический атлас", "launch:atlas"],
      ["Silva AI", "launch:assistant"],
      ["Мой сад", "launch:garden"],
      ["Silva Community", "launch:community"],
      ["Монитор системы", "launch:monitor"],
      ["Терминал / Настройки", "launch:terminal"],
    ],
    file: [
      ["Открыть список приложений", "open-launcher"],
      ["На рабочий стол", "home"],
      ["Закрыть приложение", "close"],
    ],
    edit: [
      ["Скопировать адрес активного сайта", "copy-url"],
      ["Светлая тема", "theme-light"],
      ["Тёмная тема", "theme-dark"],
      ["Системная тема", "theme-system"],
    ],
    window: [
      ["Обновить приложение", "reload"],
      ["Закрыть приложение", "close"],
      ["На рабочий стол", "home"],
    ],
  };
  const items = menuItems[menu] || [];
  popover.replaceChildren();
  items.forEach(([label, action], index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.setAttribute("role", "menuitem");
    item.textContent = label;
    if (action.startsWith("launch:")) item.dataset.launch = action.slice("launch:".length);
    else item.dataset.menuAction = action;
    if (menu === "applications") {
      const shortcut = document.createElement("kbd");
      shortcut.textContent = `${navigator.platform.includes("Mac") ? "⌘" : "Ctrl+"}${index + 1}`;
      item.append(shortcut);
    }
    popover.append(item);
  });
  popover.hidden = false;
  button.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  const popover = document.querySelector("#menu-popover");
  popover.hidden = true;
  document.querySelectorAll("[data-menu]").forEach((button) => button.setAttribute("aria-expanded", "false"));
}

document.querySelector("#menu-popover").addEventListener("click", (event) => {
  const action = event.target.closest("[data-menu-action]")?.dataset.menuAction;
  const activeAppId = windowManager.activeAppId();
  if (action === "home" || action === "minimize-all") windowManager.returnHome();
  if (action === "reload" && activeAppId) windowManager.reload(activeAppId);
  if (action === "close" && activeAppId) windowManager.closeActiveApp();
  if (action === "open-launcher") openLauncher();
  if (action === "theme-light") setThemePreference("light");
  if (action === "theme-dark") setThemePreference("dark");
  if (action === "theme-system") setThemePreference("system");
  if (action === "copy-url" && activeAppId) {
    const url = windowManager.windows.get(activeAppId)?.appUrl || apps[activeAppId].url;
    if (url && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showToast("Адрес активного сайта скопирован."),
        (error) => {
          console.error("Could not copy the active Silva site URL.", error);
          showToast("Не удалось скопировать адрес активного сайта.");
        },
      );
    } else {
      showToast("У активного окна нет внешнего адреса для копирования.");
    }
  }
  closeMenu();
});

const launcher = document.querySelector("#launcher");
const launcherSearch = document.querySelector("#launcher-search");
const launcherModifier = navigator.platform.includes("Mac") ? "⌘" : "Ctrl";
launcher.querySelectorAll(".launcher-app kbd").forEach((shortcut, index) => {
  shortcut.textContent = `${launcherModifier} ${index + 1}`;
});

function openLauncher() {
  desktop.inert = true;
  document.querySelector(".menubar").inert = true;
  launcher.hidden = false;
  launcherSearch.value = "";
  launcher.querySelectorAll("[data-launcher-item]").forEach((item) => { item.hidden = false; });
  launcherSearch.focus();
}

function closeLauncher() {
  desktop.inert = false;
  document.querySelector(".menubar").inert = false;
  launcher.hidden = true;
}

launcher.addEventListener("click", (event) => {
  if (event.target === launcher || event.target.closest("[data-launcher-close]")) closeLauncher();
});
launcherSearch.addEventListener("input", () => {
  const query = launcherSearch.value.trim().toLocaleLowerCase();
  launcher.querySelectorAll("[data-launcher-item]").forEach((item) => {
    item.hidden = !item.textContent.toLocaleLowerCase().includes(query);
  });
});
launcherSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const first = launcher.querySelector("[data-launcher-item]:not([hidden])");
    if (first) {
      first.click();
      event.preventDefault();
    }
  }
});

document.addEventListener("keydown", (event) => {
  const modifier = event.metaKey || event.ctrlKey;
  const activeAppId = windowManager.activeAppId();
  if (event.key === "F11" && activeAppId) {
    event.preventDefault();
    windowManager.toggleMaximize(activeAppId);
    return;
  }
  if (event.key === "Escape" && !launcher.hidden) {
    closeLauncher();
    return;
  }
  if (modifier && event.key.toLowerCase() === "k") {
    event.preventDefault();
    closeMenu();
    openLauncher();
    return;
  }
  if (modifier && /^[1-6]$/.test(event.key)) {
    event.preventDefault();
    windowManager.open(["atlas", "assistant", "garden", "community", "monitor", "terminal"][Number(event.key) - 1]);
  }
  if (modifier && event.key.toLowerCase() === "w" && activeAppId) {
    event.preventDefault();
    windowManager.close(activeAppId);
  }
  if (modifier && event.key.toLowerCase() === "m" && activeAppId) {
    event.preventDefault();
    windowManager.minimize(activeAppId);
  }
  if (event.key === "F5" && activeAppId) {
    event.preventDefault();
    windowManager.reload(activeAppId);
  }
  if (event.key === "Escape") {
    closeMenu();
    closeLauncher();
  }
});

updateClock();
window.setInterval(updateClock, 1_000);

const installButton = document.querySelector("[data-install-app]");
let installPrompt = null;
const isStandaloneApp = window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function showInstallInstructions() {
  const userAgent = navigator.userAgent;
  const isAppleMobile = /iPhone|iPad|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isMac = /Macintosh|Mac OS X/.test(userAgent);
  if (isAppleMobile) {
    showToast("Чтобы открыть отдельным окном на iPhone/iPad: откройте сайт в Safari → «Поделиться» → «На экран Домой».");
  } else if (isMac) {
    showToast("Для отдельного окна в Safari выберите «Файл» → «Добавить в Dock». В Chrome или Edge используйте меню браузера → «Установить Silva OS».");
  } else {
    showToast("Для отдельного окна откройте меню Chrome или Edge и выберите «Установить Silva OS» или «Установить как приложение».");
  }
}

if (!window.__TAURI__ && !isStandaloneApp) installButton.hidden = false;

if ("serviceWorker" in navigator && !window.__TAURI__) {
  navigator.serviceWorker.register("./sw.js").catch((error) => {
    console.error("Could not register the Silva OS service worker.", error);
    showToast("Не удалось включить офлайн-оболочку Silva OS.");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.textContent = "Установить отдельно";
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    showInstallInstructions();
    return;
  }
  try {
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") installButton.hidden = true;
  } catch (error) {
    console.error("Could not prompt to install Silva OS.", error);
    showToast("Не удалось запустить установку Silva OS.");
  } finally {
    installPrompt = null;
  }
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installButton.hidden = true;
});
