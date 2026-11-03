(() => {
  const progressKey = "flora-expedition-progress";
  const grid = document.querySelector("#expedition-grid");
  const status = document.querySelector("#expedition-status");
  if (!grid) throw new Error("Не удалось инициализировать ботанические экспедиции.");
  const winterFindKeys = new Set(
    [...document.querySelectorAll("[data-winter-easter]")].map((button) => button.dataset.winterEaster)
  );
  const pineconeHideouts = [
    { key: "hero-art", icon: "🌰", name: "Лесная заря", place: "в иллюстрации главной страницы", hint: "Присмотритесь к зимнему лесу на главной." },
    { key: "atlas-note", icon: "❄️", name: "Снежинка атласа", place: "в фильтрах атласа", hint: "Откройте фильтры атласа и прочитайте примечание внизу." },
    { key: "season-note", icon: "🌟", name: "Звезда наблюдателя", place: "в заметке сезонного трекера", hint: "В сезонном трекере дочитайте пояснение под календарём." },
    { key: "collection-note", icon: "🌱", name: "Семечко гербария", place: "в описании коллекции", hint: "Загляните в описание личного гербария." },
    { key: "garden-winter-tip", icon: "🔔", name: "Колокольчик заботы", place: "в зимнем совете для сада", hint: "В «Моём саду» найдите зимнюю памятку перед планом ухода." },
    { key: "quiz-photo", icon: "⭐", name: "Звезда викторины", place: "на фотографии в разделе игр", hint: "Запустите викторину и внимательно посмотрите на фото." },
    { key: "silva-intro", icon: "🎁", name: "Секрет Silva", place: "в приветствии помощника Silva", hint: "Откройте чат Silva и осмотрите приветствие." },
  ];
  const pineconeHideoutKeys = new Set(pineconeHideouts.map((hideout) => hideout.key));
  const winterRelics = [
    { key: "home", icon: "✨", name: "Лесной фонарик", place: "главной странице" },
    { key: "catalog", icon: "❄️", name: "Снежинка-гербарий", place: "в атласе растений" },
    { key: "season", icon: "🌟", name: "Звезда календаря", place: "в сезонном трекере" },
    { key: "collection", icon: "🌱", name: "Звёздное семечко", place: "в личной коллекции" },
    { key: "care", icon: "🔔", name: "Ледяной колокольчик", place: "в ритме ухода" },
    { key: "games", icon: "🎟️", name: "Праздничный жетон", place: "в разделе игр" },
    { key: "snowman", icon: "☃️", name: "Секрет снеговика", place: "у снеговика на главной" },
  ];
  const routes = [
    {
      id: "discover",
      title: "Знакомство с растениями",
      subtitle: "Откройте карточки пяти разных растений.",
      goal: 5,
      reward: 50,
      icon: "book",
      action: "catalog",
      actionLabel: "Открыть атлас",
      metric: "visitedIds",
    },
    {
      id: "herbarium",
      title: "Личная коллекция",
      subtitle: "Сохраните три растения, которые вам понравились.",
      goal: 3,
      reward: 60,
      icon: "flower",
      action: "catalog",
      actionLabel: "Выбрать растения",
      metric: "collectedIds",
    },
    {
      id: "garden",
      title: "Забота о саде",
      subtitle: "Трижды отметьте уход за растениями. Сначала проверьте почву.",
      goal: 3,
      reward: 70,
      icon: "water",
      action: "garden",
      actionLabel: "Открыть мой сад",
      metric: "careActions",
    },
    {
      id: "seasons",
      title: "Наблюдатель природы",
      subtitle: "Запишите два наблюдения за цветением.",
      goal: 2,
      reward: 60,
      icon: "calendar",
      action: "season",
      actionLabel: "Добавить наблюдение",
      metric: "seasonKeys",
    },
    {
      id: "botanist",
      title: "Растительный знаток",
      subtitle: "Правильно ответьте на пять вопросов викторины.",
      goal: 5,
      reward: 80,
      icon: "spark",
      action: "botanist",
      actionLabel: "Начать викторину",
      metric: "quizCorrect",
    },
    {
      id: "winter-finds",
      title: "Зимние сюрпризы",
      subtitle: "Найдите все семь зимних сюрпризов в разных разделах сайта.",
      goal: 7,
      reward: 100,
      icon: "spark",
      action: "botanist",
      actionLabel: "Искать сюрпризы",
      metric: "winterFinds",
    },
    {
      id: "pinecone-quest",
      title: "Тайный след леса",
      subtitle: "Найдите семь шишек в неприметных деталях разных разделов и получите зимний набор садовода.",
      goal: 7,
      reward: 120,
      icon: "spark",
      action: "home",
      actionLabel: "Начать поиск",
      metric: "pineconeFinds",
    },
    {
      id: "winter-field-route",
      title: "Зимний полевой маршрут",
      subtitle: "Найдите в парке или лесу три хвойных или вечнозелёных растения. Попросите Silva изучить признаки и сохраните каждую находку с GPS в сезонном трекере.",
      goal: 3,
      reward: 250,
      icon: "search",
      action: "field-route",
      actionLabel: "Начать маршрут",
      metric: "fieldObservations",
    },
  ];

  const emptyProgress = () => ({
    visitedIds: [],
    collectedIds: [],
    careActions: 0,
    seasonKeys: [],
    quizCorrect: 0,
    winterFinds: [],
    pineconeFinds: [],
    pineconeArchive: [],
    pineconeQuestVersion: 2,
    completed: [],
  });
  const validIds = (value) => Array.isArray(value)
    ? [...new Set(value.filter((id) => typeof id === "string" && id.length <= 160))].slice(-1500)
    : [];
  let migrationChecked = false;
  let pineconeMigrationPending = false;
  const loadProgress = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
        throw new TypeError("Ожидался объект прогресса экспедиций.");
      }
      const completed = validIds(saved.completed).filter((id) => routes.some((route) => route.id === id));
      const legacyPinecones = validIds(saved.pineconeFinds).filter((page) => /^[1-7]$/.test(page));
      const legacyQuestCompleted = completed.includes("pinecone-quest") || legacyPinecones.length === 7;
      if (!migrationChecked) {
        pineconeMigrationPending = saved.pineconeQuestVersion !== 2;
        migrationChecked = true;
      }
      return {
        visitedIds: validIds(saved.visitedIds),
        collectedIds: validIds(saved.collectedIds),
        careActions: Number.isSafeInteger(saved.careActions) && saved.careActions >= 0 ? saved.careActions : 0,
        seasonKeys: validIds(saved.seasonKeys),
        quizCorrect: Number.isSafeInteger(saved.quizCorrect) && saved.quizCorrect >= 0 ? saved.quizCorrect : 0,
        winterFinds: validIds(saved.winterFinds),
        pineconeFinds: saved.pineconeQuestVersion === 2
          ? validIds(saved.pineconeFinds).filter((key) => pineconeHideoutKeys.has(key))
          : legacyQuestCompleted ? pineconeHideouts.map((hideout) => hideout.key) : [],
        pineconeArchive: saved.pineconeQuestVersion === 2 ? validIds(saved.pineconeArchive) : legacyPinecones,
        pineconeQuestVersion: 2,
        completed,
      };
    } catch (error) {
      console.error("Не удалось прочитать прогресс ботанических экспедиций.", error);
      return emptyProgress();
    }
  };
  let progress = loadProgress();
  const syncWinterCharmStates = () => {
    document.querySelectorAll("[data-winter-easter]").forEach((button) => {
      const found = progress.winterFinds.includes(button.dataset.winterEaster);
      button.classList.toggle("is-found", found);
      button.setAttribute("aria-pressed", String(found));
      button.title = found ? "Зимний сюрприз найден!" : "Нажмите, чтобы открыть зимний сюрприз";
    });
  };
  const syncPineconeHideoutStates = () => {
    document.querySelectorAll("[data-pinecone-hideout]").forEach((button) => {
      const found = progress.pineconeFinds.includes(button.dataset.pineconeHideout);
      button.classList.toggle("is-found", found);
      button.disabled = found;
      button.setAttribute("aria-label", found ? "Тайная шишка найдена" : "Найти тайную шишку");
      button.title = found ? "Тайная шишка найдена" : "Похоже, здесь что-то спрятано";
    });
  };

  const parseArray = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(value)) return value;
      if (!value || typeof value !== "object") throw new TypeError(`Ожидался список в хранилище «${key}».`);
      const deleted = new Set(Object.keys(value)
        .filter((id) => id.startsWith("__deleted:") && value[id] === true)
        .map((id) => id.slice("__deleted:".length)));
      return Object.entries(value)
        .filter(([id, entry]) => !id.startsWith("__deleted:") && !deleted.has(id) && entry && typeof entry === "object")
        .map(([, entry]) => entry);
    } catch (error) {
      console.error(`Не удалось прочитать список «${key}».`, error);
      return [];
    }
  };
  const parseObject = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`Ожидался объект в хранилище «${key}».`);
      }
      return value;
    } catch (error) {
      console.error(`Не удалось прочитать данные «${key}».`, error);
      return {};
    }
  };
  const collectExistingProgress = () => {
    progress.collectedIds = [...new Set([
      ...progress.collectedIds,
      ...parseArray("flora-collection").filter((id) => typeof id === "string"),
    ])].slice(-1500);
    const storedPlans = parseArray("flora-care-settings");
    const recordedCare = storedPlans.reduce((total, plan) => {
      if (!plan || typeof plan !== "object") return total;
      const count = Number.isSafeInteger(plan.wateringCount) && plan.wateringCount >= 0
        ? plan.wateringCount
        : Array.isArray(plan.wateringHistory) ? plan.wateringHistory.length : plan.lastWatered ? 1 : 0;
      return total + count;
    }, 0);
    progress.careActions = Math.max(progress.careActions, recordedCare);
    const observations = parseObject("flora-season-observations");
    const observedPeriods = Object.entries(observations).flatMap(([plantId, periods]) =>
      Array.isArray(periods)
        ? periods.filter((period) => typeof period === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(period))
          .map((period) => `${plantId}:${period}`)
        : []
    );
    progress.seasonKeys = [...new Set([...progress.seasonKeys, ...observedPeriods])].slice(-1500);
  };
  const saveProgress = () => {
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
      window.dispatchEvent(new CustomEvent("flora:local-data-change", {
        detail: { key: progressKey, value: localStorage.getItem(progressKey) },
      }));
      status.textContent = "";
      return true;
    } catch (error) {
      console.error("Не удалось сохранить прогресс ботанических экспедиций.", error);
      status.textContent = "Не удалось сохранить прогресс. Проверьте свободное место в хранилище браузера.";
      return false;
    }
  };
  const metricValue = (route) => {
    if (route.id === "winter-field-route") {
      return parseArray("flora-citizen-science-observations").filter((observation) =>
        observation?.confirmed === true &&
        ["conifer", "evergreen"].includes(observation.category) &&
        typeof observation.name === "string" &&
        Number.isFinite(observation.latitude) && Number.isFinite(observation.longitude)
      ).length;
    }
    const value = progress[route.metric];
    return Array.isArray(value) ? value.length : value;
  };
  const routeGoalReached = (route) => metricValue(route) >= route.goal;
  const showReward = (route) => {
    window.dispatchEvent(new CustomEvent("flora:toast", {
      detail: {
        message: `Задание «${route.title}» выполнено! Вы получили ${route.reward} очков.`,
        type: "success",
        duration: 5200,
      },
    }));
  };
  const rankForXp = (xp) => {
    if (xp >= 320) return "Герой Silva";
    if (xp >= 240) return "Ботаник-мастер";
    if (xp >= 150) return "Хранитель сада";
    if (xp >= 60) return "Знаток растений";
    return "Начинающий исследователь";
  };
  const icon = (name) => `<svg class="ui-icon" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
  const winterCollectionMarkup = (route) => {
    if (route.id === "winter-finds") {
      const next = winterRelics.find((relic) => !progress.winterFinds.includes(relic.key));
      const items = winterRelics.map((relic) => {
        const found = progress.winterFinds.includes(relic.key);
        return `<span class="winter-relic${found ? " is-found" : ""}"${found ? ` title="${relic.name}" aria-label="Найдено: ${relic.name}"` : ' title="Сюрприз ещё скрыт" aria-label="Сюрприз ещё скрыт"'}>${found ? relic.icon : "?"}</span>`;
      }).join("");
      const stages = [
        { count: 3, label: "Искра леса", unlocked: "✨" },
        { count: 5, label: "Карта тайных троп", unlocked: "🗺️" },
        { count: 7, label: "Открытка Silva", unlocked: "💌" },
      ].map((stage) => `<span class="winter-relic-stage${progress.winterFinds.length >= stage.count ? " is-unlocked" : ""}">${progress.winterFinds.length >= stage.count ? stage.unlocked : "🔒"} ${stage.label}</span>`).join("");
      return `<div class="winter-quest-collection"><div class="winter-relic-row" aria-label="Найдено секретов: ${progress.winterFinds.length} из 7">${items}</div><div class="winter-relic-stages">${stages}</div>${next ? `<p class="winter-quest-hint">Подсказка: ищите следующий сюрприз ${next.place}.</p>` : '<div class="winter-postcard" role="status"><span aria-hidden="true">❄️ ✨ 🌲</span><strong>Тайная открытка Silva</strong><p>Ты собрал все зимние огоньки. Пусть в твоём лесу всегда будет место для маленьких чудес!</p></div>'}</div>`;
    }
    if (route.id === "pinecone-quest") {
      const items = pineconeHideouts.map((hideout) => {
        const found = progress.pineconeFinds.includes(hideout.key);
        return `<span class="winter-relic${found ? " is-found" : ""}" title="${found ? `Найдена: ${hideout.name}` : "Тайник ещё не найден"}" aria-label="${found ? `Найдена: ${hideout.name}` : "Тайная шишка ещё скрыта"}">${found ? hideout.icon : "?"}</span>`;
      }).join("");
      const nextHideout = pineconeHideouts.find((hideout) => !progress.pineconeFinds.includes(hideout.key));
      return `<div class="winter-quest-collection"><div class="winter-relic-row" aria-label="Найдено шишек: ${progress.pineconeFinds.length} из 7">${items}</div><p class="winter-quest-hint">${nextHideout ? `Подсказка: ${nextHideout.hint}` : "Все находки собраны — зимний набор садовода уже ваш!"}</p>${progress.pineconeArchive.length ? '<small class="winter-quest-archive-note">Прогресс прежней версии квеста сохранён в архиве.</small>' : ""}</div>`;
    }
    return "";
  };
  const renderFieldRoute = () => {
    const observations = parseArray("flora-citizen-science-observations")
      .filter((observation) => observation?.confirmed === true &&
        ["conifer", "evergreen"].includes(observation.category) &&
        typeof observation.name === "string" &&
        Number.isFinite(observation.latitude) && Number.isFinite(observation.longitude))
      .slice(-3);
    const statusLabel = document.querySelector("#winter-field-route-status");
    const sightings = document.querySelector("#winter-field-route-sightings");
    if (!statusLabel || !sightings) return;
    statusLabel.textContent = observations.length >= 3
      ? "Маршрут завершён: три полевых наблюдения сохранены"
      : `Сохранено в маршрут: ${observations.length} из 3 наблюдений`;
    sightings.innerHTML = observations.map((observation) =>
      `<span class="field-route-sighting">${observation.name.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      })[character])}</span>`
    ).join("");
  };

  const render = (forceSave = false) => {
    const previousProgress = JSON.stringify(progress);
    collectExistingProgress();
    const newlyCompleted = [];
    routes.forEach((route) => {
      if (routeGoalReached(route) && !progress.completed.includes(route.id)) {
        progress.completed.push(route.id);
        newlyCompleted.push(route);
      }
    });
    const xp = routes.reduce((total, route) => total + (progress.completed.includes(route.id) ? route.reward : 0), 0);
    const rank = rankForXp(xp);
    const completedRoutes = progress.completed.length;
    const progressWithinRank = routes.length ? Math.round((completedRoutes / routes.length) * 100) : 0;
    document.querySelector("#expedition-rank").textContent = rank;
    document.querySelector("#expedition-xp-bar").style.width = `${progressWithinRank}%`;
    const track = document.querySelector(".expedition-xp-track");
    track.setAttribute("aria-valuenow", String(completedRoutes));
    document.querySelector("#expedition-xp-label").textContent = `Выполнено заданий: ${completedRoutes} из ${routes.length} · ${xp} очков`;
    document.querySelector("#expedition-toggle-count").textContent = `${completedRoutes} из ${routes.length}`;
    document.querySelector("#expedition-discovered-count").textContent = String(progress.visitedIds.length);
    document.querySelector("#expedition-badge-count").textContent = String(progress.completed.length);
    document.querySelector("#expedition-care-count").textContent = String(progress.careActions);
    const winterGift = document.querySelector("#winter-gardener-gift");
    if (winterGift) winterGift.hidden = !progress.completed.includes("pinecone-quest");
    renderFieldRoute();
    grid.innerHTML = routes.map((route, index) => {
      const current = Math.min(route.goal, metricValue(route));
      const complete = progress.completed.includes(route.id);
      const percent = Math.round((current / route.goal) * 100);
      return `<article class="expedition-card${complete ? " is-complete" : ""}">
        <div class="expedition-card-top"><span class="expedition-card-icon">${icon(route.icon)}</span><span class="expedition-step">${complete ? "ВЫПОЛНЕНО" : `ЗАДАНИЕ ${index + 1}`}</span></div>
        <h3>${route.title}</h3>
        <p>${route.subtitle}</p>
        ${winterCollectionMarkup(route)}
        <div class="expedition-progress-copy"><span>${complete ? "Готово!" : `${current} из ${route.goal}`}</span><strong>+${route.reward} очков</strong></div>
        <div class="expedition-progress-track" role="progressbar" aria-label="Прогресс маршрута «${route.title}»" aria-valuemin="0" aria-valuemax="${route.goal}" aria-valuenow="${current}"><span style="width:${percent}%"></span></div>
        <button class="button ${complete ? "ghost" : "secondary"} expedition-action" type="button" data-expedition-action="${route.action}"${complete ? " disabled" : ""}>${complete ? "Задание выполнено" : route.actionLabel}</button>
      </article>`;
    }).join("");
    const progressChanged = JSON.stringify(progress) !== previousProgress;
    syncPineconeHideoutStates();
    const saved = !(forceSave || progressChanged) || saveProgress();
    if (saved) newlyCompleted.forEach((route) => {
      if (!["winter-finds", "pinecone-quest", "winter-field-route"].includes(route.id)) showReward(route);
      if (route.id === "pinecone-quest") {
        window.dispatchEvent(new CustomEvent("flora:polar-forest-badge", { detail: { earned: true } }));
      }
      if (route.id === "winter-field-route") {
        window.dispatchEvent(new CustomEvent("flora:winter-field-route-badge", { detail: { earned: true } }));
        window.dispatchEvent(new CustomEvent("flora:toast", {
          detail: {
            message: "Маршрут завершён! Три полевых наблюдения сохранены. Вы получили 250 очков и звание «Хранитель полевого маршрута».",
            type: "success",
            duration: 6200,
          },
        }));
      }
    });
    return saved;
  };

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-expedition-action]");
    if (!button || button.disabled) return;
    if (button.dataset.expeditionAction === "field-route") {
      window.dispatchEvent(new CustomEvent("flora:winter-field-route-start"));
      window.floraNavigateTo?.("garden");
      return;
    }
    window.floraNavigateTo?.(button.dataset.expeditionAction);
  });
  document.addEventListener("click", (event) => {
    const startButton = event.target.closest("[data-field-route-start]");
    if (startButton) {
      window.dispatchEvent(new CustomEvent("flora:winter-field-route-start"));
      window.floraNavigateTo?.("garden");
      return;
    }
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pinecone-hideout]");
    if (!button || button.disabled) return;
    window.dispatchEvent(new CustomEvent("flora:pinecone-find", {
      detail: { hideout: button.dataset.pineconeHideout },
    }));
  });
  window.addEventListener("flora:plant-opened", (event) => {
    const plantId = event.detail?.plantId;
    if (typeof plantId !== "string") return;
    if (progress.visitedIds.includes(plantId)) {
      render(true);
      return;
    }
    progress.visitedIds.push(plantId);
    render(true);
  });
  window.addEventListener("flora:plant-saved", (event) => {
    const { plantId, saved } = event.detail || {};
    if (saved !== true || typeof plantId !== "string") return;
    if (progress.collectedIds.includes(plantId)) {
      render(true);
      return;
    }
    progress.collectedIds.push(plantId);
    render(true);
  });
  window.addEventListener("flora:care-action", () => {
    const plans = parseArray("flora-care-settings");
    const total = plans.reduce((sum, plan) => sum + (
      Number.isSafeInteger(plan?.wateringCount) ? plan.wateringCount : 0
    ), 0);
    progress.careActions = Math.max(progress.careActions, total);
    render(true);
  });
  window.addEventListener("flora:season-observation", (event) => {
    const { plantId, period } = event.detail || {};
    if (typeof plantId !== "string" || typeof period !== "string") return;
    const key = `${plantId}:${period}`;
    if (progress.seasonKeys.includes(key)) return;
    progress.seasonKeys.push(key);
    render(true);
  });
  window.addEventListener("flora:quiz-correct", () => {
    progress.quizCorrect += 1;
    render(true);
  });
  window.addEventListener("flora:winter-find", (event) => {
    const key = event.detail?.key;
    if (typeof key !== "string" || !winterFindKeys.has(key) || progress.winterFinds.includes(key)) return;
    progress.winterFinds.push(key);
    render(true);
    const foundRelic = winterRelics.find((relic) => relic.key === key);
    const count = progress.winterFinds.length;
    const message = count === 7
      ? "Все семь секретов найдены! Открыта тайная открытка Silva и получено 100 очков."
      : count === 5
        ? "Сюрприз! Открылась карта тайных троп — осталось найти два секрета."
        : count === 3
          ? "Ты нашёл искру леса! Первый секретный подарок открыт."
          : `Найдено: ${foundRelic?.name || "зимняя находка"}. Осталось ${7 - count} секретов.`;
    window.dispatchEvent(new CustomEvent("flora:toast", {
      detail: { message, type: "success", duration: 5400 },
    }));
  });
  window.addEventListener("flora:pinecone-find", (event) => {
    const hideout = event.detail?.hideout;
    if (typeof hideout !== "string" || !pineconeHideoutKeys.has(hideout) || progress.pineconeFinds.includes(hideout)) return;
    progress.pineconeFinds.push(hideout);
    render(true);
    const count = progress.pineconeFinds.length;
    window.dispatchEvent(new CustomEvent("flora:toast", {
      detail: {
        message: count === 7
          ? "Все семь шишек найдены! В саду вас ждёт зимний набор садовода."
          : `Тайная шишка найдена! Осталось найти ${7 - count}.`,
        type: "success",
        duration: 5400,
      },
    }));
  });
  window.addEventListener("flora:account-state", () => {
    progress = loadProgress();
    syncWinterCharmStates();
    render();
  });
  window.addEventListener("flora:local-data-change", (event) => {
    if (event.detail?.key === progressKey) return;
    if (["flora-collection", "flora-care-settings", "flora-season-observations", "flora-citizen-science-observations"].includes(event.detail?.key)) render();
  });
  window.addEventListener("storage", (event) => {
    if (!event.key || [progressKey, "flora-collection", "flora-care-settings", "flora-season-observations", "flora-citizen-science-observations"].includes(event.key)) {
      progress = loadProgress();
      syncWinterCharmStates();
      render();
    }
  });
  window.addEventListener("flora:page-change", (event) => {
    if (event.detail?.page === "botanist") render();
  });

  syncWinterCharmStates();
  syncPineconeHideoutStates();
  render();
  if (pineconeMigrationPending) {
    const saved = saveProgress();
    if (saved && progress.pineconeArchive.length && !progress.completed.includes("pinecone-quest")) {
      window.dispatchEvent(new CustomEvent("flora:toast", {
        detail: {
          message: "Квест обновился: прежний прогресс сохранён в архиве, а шишки теперь спрятаны по всему сайту. Начинайте новую охоту!",
          type: "info",
          duration: 7000,
        },
      }));
    }
    pineconeMigrationPending = false;
  }
})();
