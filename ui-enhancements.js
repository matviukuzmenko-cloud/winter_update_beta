(() => {
  const toastRegion = document.querySelector("#flora-toast-region");
  const soundToggle = document.querySelector("#sound-toggle");
  const forestSoundToggle = document.querySelector("#forest-sound-toggle");
  const soundKey = "flora-sounds-enabled";
  let audioContext = null;
  let forestSound = null;
  let toastTimer = 0;
  const clickHistory = new WeakMap();
  const interactiveSelector = "button, a, [role='button']";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const readSoundSetting = () => {
    try {
      return localStorage.getItem(soundKey) === "true";
    } catch (error) {
      console.warn("Не удалось прочитать настройку звуков Silva Quieta.", error);
      return false;
    }
  };
  let soundEnabled = readSoundSetting();

  const updateSoundButton = () => {
    if (!soundToggle) return;
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.setAttribute("aria-label", soundEnabled ? "Выключить звуки интерфейса" : "Включить звуки интерфейса");
    soundToggle.title = soundEnabled ? "Звуки интерфейса включены" : "Включить звуки интерфейса";
    soundToggle.innerHTML = soundEnabled
      ? '<svg class="ui-icon" aria-hidden="true"><use href="#icon-volume"></use></svg>'
      : '<svg class="ui-icon" aria-hidden="true"><use href="#icon-volume-off"></use></svg>';
  };

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      audioContext ||= new AudioContext();
      if (audioContext.state === "suspended") void audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, start);
      oscillator.frequency.exponentialRampToValueAtTime(440, start + 0.045);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.065);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.07);
    } catch (error) {
      console.warn("Не удалось воспроизвести звук интерфейса.", error);
    }
  };

  const stopForestSound = () => {
    if (!forestSound || !audioContext) return;
    const sound = forestSound;
    forestSound = null;
    const now = audioContext.currentTime;
    sound.gain.gain.cancelScheduledValues(now);
    sound.gain.gain.setTargetAtTime(0.0001, now, .35);
    window.setTimeout(() => {
      sound.source.stop();
      sound.oscillator.stop();
      sound.source.disconnect();
      sound.filter.disconnect();
      sound.gain.disconnect();
      sound.oscillator.disconnect();
      sound.modulation.disconnect();
    }, 1400);
  };
  const startForestSound = async () => {
    audioContext ||= new AudioContext();
    if (audioContext.state === "suspended") await audioContext.resume();
    const length = audioContext.sampleRate * 8;
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    let brown = 0;
    for (let index = 0; index < length; index += 1) {
      brown = (brown + .018 * (Math.random() * 2 - 1)) / 1.018;
      samples[index] = brown * 3.2;
    }
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    const modulation = audioContext.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 360;
    filter.Q.value = .45;
    gain.gain.value = .0001;
    oscillator.type = "sine";
    oscillator.frequency.value = .065;
    modulation.gain.value = .004;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.connect(modulation);
    modulation.connect(gain.gain);
    source.start();
    oscillator.start();
    gain.gain.setTargetAtTime(.016, audioContext.currentTime, 2.2);
    forestSound = { source, filter, gain, oscillator, modulation };
    forestSoundToggle?.classList.add("forest-sound-active");
    forestSoundToggle?.setAttribute("aria-pressed", "true");
    forestSoundToggle?.setAttribute("aria-label", "Выключить звук зимнего леса");
    forestSoundToggle.title = "Звук зимнего леса включён";
  };
  forestSoundToggle?.addEventListener("click", async () => {
    if (forestSound) {
      stopForestSound();
      forestSoundToggle.classList.remove("forest-sound-active");
      forestSoundToggle.setAttribute("aria-pressed", "false");
      forestSoundToggle.setAttribute("aria-label", "Включить звук зимнего леса");
      forestSoundToggle.title = "Включить тихий ветер в хвойном лесу";
      return;
    }
    try {
      await startForestSound();
    } catch (error) {
      stopForestSound();
      forestSoundToggle.classList.remove("forest-sound-active");
      forestSoundToggle.setAttribute("aria-pressed", "false");
      forestSoundToggle.setAttribute("aria-label", "Включить звук зимнего леса");
      forestSoundToggle.title = "Включить тихий ветер в хвойном лесу";
      console.error("Не удалось включить звук зимнего леса.", error);
      showToast({ message: "Браузер не смог включить фоновый звук.", type: "error", duration: 4200 });
    }
  });
  window.addEventListener("pagehide", stopForestSound);

  soundToggle?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    try {
      localStorage.setItem(soundKey, String(soundEnabled));
    } catch (error) {
      console.warn("Не удалось сохранить настройку звуков Silva Quieta.", error);
    }
    updateSoundButton();
    if (soundEnabled) playClickSound();
  });
  updateSoundButton();

  const showToast = ({ message, type = "info", duration = 4200, actionLabel = "", onAction = null } = {}) => {
    if (!toastRegion || typeof message !== "string" || !message.trim()) return;
    window.clearTimeout(toastTimer);
    const toast = document.createElement("div");
    toast.className = `flora-toast flora-toast-${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    const text = document.createElement("p");
    text.textContent = message;
    toast.append(text);
    if (actionLabel && typeof onAction === "function") {
      const action = document.createElement("button");
      action.className = "flora-toast-action";
      action.type = "button";
      action.textContent = actionLabel;
      action.addEventListener("click", () => {
        onAction();
        toast.remove();
      }, { once: true });
      toast.append(action);
    }
    toastRegion.replaceChildren(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    if (duration > 0) {
      toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => toast.remove(), prefersReducedMotion.matches ? 0 : 220);
      }, duration);
    }
  };
  window.addEventListener("flora:toast", (event) => showToast(event.detail));
  window.addEventListener("offline", () => showToast({
    message: "Связь с садом временно прервана. Проверяю подключение…",
    type: "warning",
    duration: 0,
  }));
  window.addEventListener("online", () => showToast({
    message: "Связь восстановлена.",
    type: "success",
    duration: 2600,
  }));

  window.floraWithRetry = async (operation, { label = "Данные", attempts = 4 } = {}) => {
    let lastError;
    let didRetry = false;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        if (navigator.onLine === false) throw new TypeError("Нет подключения к интернету.");
        const result = await operation();
        if (result?.error) throw result.error;
        if (didRetry) showToast({
          message: `Связь восстановлена. ${label} загружены.`,
          type: "success",
          duration: 2600,
        });
        return result;
      } catch (error) {
        lastError = error;
        const retryable = error instanceof TypeError || error?.status >= 500 ||
          ["500", "502", "503", "504", "PGRST000"].includes(String(error?.code || ""));
        if (!retryable || attempt === attempts) break;
        didRetry = true;
        showToast({
          message: `Связь с садом временно прервана. Повторяю запрос (${attempt}/${attempts - 1})…`,
          type: "warning",
          duration: 0,
        });
        await new Promise((resolve) => window.setTimeout(resolve, 450 * (2 ** (attempt - 1))));
      }
    }
    if (didRetry) showToast({
      message: `${label} пока недоступны. Проверьте соединение и попробуйте снова.`,
      type: "error",
      duration: 6500,
    });
    throw lastError;
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest(interactiveSelector);
    if (!target || target.disabled || target === soundToggle) return;
    if (target.matches("[data-go], [data-favorite], [data-modal-favorite], .flora-ai-toggle, .flora-ai-send, .account-cta")) {
      playClickSound();
    }

    const rageTarget = target.closest("[data-go], [data-favorite], [data-details], [data-collection], [data-open], [data-season-toggle]") || target;
    if (rageTarget.matches("button:disabled, [aria-disabled='true']")) return;
    const now = performance.now();
    const history = clickHistory.get(rageTarget) || { times: [], lastNotifiedAt: 0 };
    history.times = history.times.filter((time) => now - time <= 1500);
    history.times.push(now);
    clickHistory.set(rageTarget, history);
    if (history.times.length >= 4 && now - history.lastNotifiedAt > 15000) {
      history.lastNotifiedAt = now;
      const actionAttribute = ["data-go", "data-favorite", "data-modal-favorite", "data-details", "data-collection", "data-open", "data-season-toggle"]
        .find((attribute) => rageTarget.hasAttribute(attribute));
      const activePage = document.querySelector(".page:not([hidden])[data-page]");
      window.dispatchEvent(new CustomEvent("flora:rage-click", {
        detail: {
          label: (rageTarget.getAttribute("aria-label") || rageTarget.textContent || "элемент").trim().slice(0, 100),
          page: rageTarget.closest(".page[data-page]")?.dataset.page || activePage?.dataset.page || "home",
          kind: actionAttribute?.slice(5) || "",
          value: actionAttribute ? String(rageTarget.getAttribute(actionAttribute) || "").slice(0, 100) : "",
        },
      }));
    }
  }, true);
})();
