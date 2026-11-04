(() => {
  const diagnosisFile = document.querySelector("#garden-diagnosis-file");
  const diagnosisPreview = document.querySelector("#garden-diagnosis-preview");
  const diagnosisStage = document.querySelector("#garden-photo-stage");
  const diagnosisMarkers = document.querySelector("#garden-photo-markers");
  const diagnosisMarkerNote = document.querySelector("#garden-marker-note");
  const diagnosisPlaceholder = document.querySelector("#garden-photo-placeholder");
  const diagnosisFileLabel = document.querySelector(".garden-file-label span");
  const diagnosisStatus = document.querySelector("#garden-diagnosis-status");
  const fieldRouteToggle = document.querySelector("#garden-field-route-toggle");
  const fieldRouteStatus = document.querySelector("#garden-field-route-status");
  const saveDiagnosisButton = document.querySelector("#garden-save-diagnosis");
  const photoChat = document.querySelector("#garden-photo-chat");
  const photoChatMessages = document.querySelector("#garden-photo-chat-messages");
  const photoChatForm = document.querySelector("#garden-photo-chat-form");
  const photoChatInput = document.querySelector("#garden-photo-chat-input");
  const photoChatSend = document.querySelector("#garden-photo-chat-send");
  const journalForm = document.querySelector("#garden-journal-form");
  const journalPlant = document.querySelector("#garden-journal-plant");
  const journalDate = document.querySelector("#garden-journal-date");
  const journalNote = document.querySelector("#garden-journal-note");
  const journalPhoto = document.querySelector("#garden-journal-photo");
  const journalStatus = document.querySelector("#garden-journal-status");
  const journalList = document.querySelector("#garden-journal-list");
  const accountHint = document.querySelector("#garden-account-hint");
  const careForm = document.querySelector("#garden-care-form");
  const carePlant = document.querySelector("#garden-care-plant");
  const careLocation = document.querySelector("#garden-care-location");
  const careNote = document.querySelector("#garden-care-note");
  const careInterval = document.querySelector("#garden-care-interval");
  const careStatus = document.querySelector("#garden-care-status");
  const careList = document.querySelector("#garden-care-list");
  const careCollectionPlant = document.querySelector("#garden-care-collection-plant");
  const careImportButton = document.querySelector("#garden-care-import");
  const careImportStatus = document.querySelector("#garden-care-import-status");
  const heatingSeasonToggle = document.querySelector("#heating-season-toggle");
  const winterCareConfirm = document.querySelector("#winter-care-confirm");
  const winterCareConfirmMessage = document.querySelector("#winter-care-confirm-message");
  const winterCareKeep = document.querySelector("#winter-care-keep");
  const winterCareReview = document.querySelector("#winter-care-review");
  const pushEnable = document.querySelector("#garden-push-enable");
  const pushDisable = document.querySelector("#garden-push-disable");
  const pushStatus = document.querySelector("#garden-push-status");
  if (!diagnosisFile || !journalForm || !careForm) return;

  const JOURNAL_KEY = "flora-garden-journal";
  const CARE_KEY = "flora-care-settings";
  const FIELD_OBSERVATIONS_KEY = "flora-citizen-science-observations";
  const HEATING_SEASON_KEY = "flora-heating-season";
  const HEATING_SEASON_STARTED_KEY = "flora-heating-season-started";
  const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  let selectedDiagnosisFile = null;
  let diagnosisObjectUrl = "";
  let latestDiagnosis = "";
  let diagnosisContext = "";
  let diagnosisHistory = [];
  let fieldRouteMode = false;
  let accountUser = window.floraGetCurrentUser?.() || null;
  let client = window.floraGetSupabaseClient?.() || null;

  const dateToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };
  const locale = ["ru", "uk", "en"].includes(window.FLORA_LOCALE) ? window.FLORA_LOCALE : "ru";
  const messages = {
    ru: {
      dateLocale: "ru-RU",
      checksDone: "дел выполнено сегодня",
      progress: (done, total) => `${done} из ${total} дел ухода выполнено`,
      noTasks: "На сегодня проверок нет. Добавьте растения в план — и Silva соберёт ваш список заботы.",
      dueMessage: "Сначала проверьте почву и условия. Напоминание не означает, что растение обязательно нужно поливать.",
      allDoneMessage: "Все проверки на сегодня выполнены. Следующие ориентиры появятся по вашему графику.",
      upcomingMessage: "Сегодня всё спокойно. Вот ближайшие проверки вашего сада.",
      noPlan: "Добавьте первое растение в план ухода — и важное будет под рукой.",
      addPlan: "Настроить план ухода",
      checkSoil: "Проверить почву",
      soilChecked: "Почва проверена сегодня",
      checkHumidity: "Проверить влажность воздуха",
      humidityChecked: "Влажность проверена сегодня",
      checkNote: "Поливайте только если грунт действительно просох.",
      relative: (days) => new Intl.RelativeTimeFormat("ru-RU", { numeric: "auto" }).format(days, "day"),
      progressLabel: "Прогресс ухода за сегодня",
      intervalUnset: "Интервал проверки не задан",
      overdue: (days) => `Пора проверить · просрочено на ${days}`,
      checkToday: "Пора проверить сегодня",
      nextCheck: (days, interval) => `Следующая проверка через ${days} · интервал ${interval}`,
      unknownLocation: "Место не указано",
      dryAir: "😟 Сухой воздух (стресс)",
      wateringStress: "😟 Стресс: проверьте полив",
      resting: "😊 Отдыхает",
      bothRisks: "Просрочена проверка грунта и давно не отмечалось увлажнение воздуха.",
      noWatering: "Полив пока не отмечен",
      lastWatering: (date) => `Последний полив: ${date}`,
      soilNotChecked: "Проверка почвы ещё не отмечена",
      lastSoilCheck: (date) => `Последняя проверка почвы: ${date}`,
      wateringMarks: (count) => `${count} ${count % 100 >= 11 && count % 100 <= 14 ? "отметок полива" : count % 10 === 1 ? "отметка полива" : count % 10 >= 2 && count % 10 <= 4 ? "отметки полива" : "отметок полива"}`,
      humidityNoted: (date) => `Увлажнение не отмечалось · отсчёт с ${date}`,
      humidityNotMarked: "Увлажнение ещё не отмечено",
      lastHumidity: (date) => `Последнее увлажнение: ${date}`,
      collectionEmpty: "В коллекции пока нет растений",
      collectionOption: "Выберите растение…",
      collectionDone: "Все растения из коллекции уже добавлены в план",
      collectionUnavailable: "Не удалось загрузить растения из коллекции.",
      importAdded: "Данные растения подставлены. Проверьте интервал и добавьте его в план.",
      importMissing: "Не удалось найти выбранное растение в атласе. Обновите страницу и попробуйте снова.",
      checkSaved: "Проверка почвы отмечена.",
      humiditySaved: (name) => `Проверка влажности для «${name}» отмечена.`,
      saveFailed: (error) => `Не удалось сохранить отметку: ${error.message}`,
      catalogGuidance: "Подсказки атласа",
    },
    uk: {
      dateLocale: "uk-UA",
      checksDone: "справ виконано сьогодні",
      progress: (done, total) => `Виконано ${done} із ${total} справ догляду`,
      noTasks: "На сьогодні перевірок немає. Додайте рослини до плану — і Silva збере ваш список турбот.",
      dueMessage: "Спершу перевірте ґрунт та умови. Нагадування не означає, що рослину обов’язково потрібно поливати.",
      allDoneMessage: "Усі перевірки на сьогодні виконано. Наступні орієнтири з’являться за вашим графіком.",
      upcomingMessage: "Сьогодні все спокійно. Ось найближчі перевірки вашого саду.",
      noPlan: "Додайте першу рослину до плану догляду — і важливе буде під рукою.",
      addPlan: "Налаштувати план догляду",
      checkSoil: "Перевірити ґрунт",
      soilChecked: "Ґрунт перевірено сьогодні",
      checkHumidity: "Перевірити вологість повітря",
      humidityChecked: "Вологість перевірено сьогодні",
      checkNote: "Поливайте, лише якщо ґрунт справді просох.",
      relative: (days) => new Intl.RelativeTimeFormat("uk-UA", { numeric: "auto" }).format(days, "day"),
      progressLabel: "Прогрес догляду за сьогодні",
      intervalUnset: "Інтервал перевірки не задано",
      overdue: (days) => `Час перевірити · прострочено на ${days}`,
      checkToday: "Час перевірити сьогодні",
      nextCheck: (days, interval) => `Наступна перевірка через ${days} · інтервал ${interval}`,
      unknownLocation: "Місце не вказано",
      dryAir: "😟 Сухе повітря (стрес)",
      wateringStress: "😟 Стрес: перевірте полив",
      resting: "😊 Відпочиває",
      bothRisks: "Прострочено перевірку ґрунту, а зволоження давно не позначали.",
      noWatering: "Полив ще не позначено",
      lastWatering: (date) => `Останній полив: ${date}`,
      soilNotChecked: "Перевірку ґрунту ще не позначено",
      lastSoilCheck: (date) => `Остання перевірка ґрунту: ${date}`,
      wateringMarks: (count) => `${count} ${count % 10 === 1 && count % 100 !== 11 ? "позначка поливу" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? "позначки поливу" : "позначок поливу"}`,
      humidityNoted: (date) => `Вологість не позначали · відлік від ${date}`,
      humidityNotMarked: "Вологість ще не позначено",
      lastHumidity: (date) => `Останню перевірку вологості позначено: ${date}`,
      collectionEmpty: "У колекції поки немає рослин",
      collectionOption: "Виберіть рослину…",
      collectionDone: "Усі рослини з колекції вже додано до плану",
      collectionUnavailable: "Не вдалося завантажити рослини з колекції.",
      importAdded: "Дані рослини підставлено. Перевірте інтервал і додайте її до плану.",
      importMissing: "Не вдалося знайти вибрану рослину в атласі. Оновіть сторінку й спробуйте ще раз.",
      checkSaved: "Перевірку ґрунту позначено.",
      humiditySaved: (name) => `Перевірку вологості для «${name}» позначено.`,
      saveFailed: (error) => `Не вдалося зберегти позначку: ${error.message}`,
      catalogGuidance: "Поради атласу",
    },
    en: {
      dateLocale: "en",
      checksDone: "care tasks done today",
      progress: (done, total) => `${done} of ${total} care tasks complete`,
      noTasks: "No checks are due today. Add plants to your plan and Silva will build your care list.",
      dueMessage: "Check the soil and conditions first. A reminder is not an instruction to water.",
      allDoneMessage: "All checks for today are complete. Your next reminders will follow your schedule.",
      upcomingMessage: "Everything is calm today. Here are the next checks for your garden.",
      noPlan: "Add your first plant to the care plan to keep important tasks close at hand.",
      addPlan: "Set up a care plan",
      checkSoil: "Check the soil",
      soilChecked: "Soil checked today",
      checkHumidity: "Check air humidity",
      humidityChecked: "Humidity checked today",
      checkNote: "Water only if the soil has actually dried out.",
      relative: (days) => new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(days, "day"),
      progressLabel: "Today's care progress",
      intervalUnset: "Check interval not set",
      overdue: (days) => `Check overdue by ${days}`,
      checkToday: "Check due today",
      nextCheck: (days, interval) => `Next check in ${days} · every ${interval}`,
      unknownLocation: "Location not specified",
      dryAir: "😟 Dry air (stress)",
      wateringStress: "😟 Stress: check the soil",
      resting: "😊 Resting",
      bothRisks: "The soil check is overdue, and humidity has not been checked recently.",
      noWatering: "Watering has not been recorded",
      lastWatering: (date) => `Last watered: ${date}`,
      soilNotChecked: "Soil check not recorded yet",
      lastSoilCheck: (date) => `Last soil check: ${date}`,
      wateringMarks: (count) => `${count} ${count === 1 ? "watering mark" : "watering marks"}`,
      humidityNoted: (date) => `Humidity not checked · counting from ${date}`,
      humidityNotMarked: "Humidity has not been checked",
      lastHumidity: (date) => `Last humidity check: ${date}`,
      collectionEmpty: "No plants in your collection yet",
      collectionOption: "Choose a plant…",
      collectionDone: "All plants in your collection are already in the plan",
      collectionUnavailable: "Could not load plants from your collection.",
      importAdded: "Plant details filled in. Review the interval and add it to your plan.",
      importMissing: "Could not find that plant in the atlas. Refresh the page and try again.",
      checkSaved: "Soil check recorded.",
      humiditySaved: (name) => `Humidity check for “${name}” recorded.`,
      saveFailed: (error) => `Could not save this check: ${error.message}`,
      catalogGuidance: "Atlas guidance",
    },
  }[locale];
  const heatingSeasonDefault = () => [9, 10, 11, 0, 1, 2].includes(new Date().getMonth());
  const isHeatingSeasonEnabled = () => {
    try {
      const saved = localStorage.getItem(HEATING_SEASON_KEY);
      return saved === null ? heatingSeasonDefault() : saved === "true";
    } catch (error) {
      console.error("Не удалось прочитать настройку отопительного сезона.", error);
      return heatingSeasonDefault();
    }
  };
  const readHeatingSeasonStarted = () => {
    try {
      const stored = localStorage.getItem(HEATING_SEASON_STARTED_KEY);
      return typeof stored === "string" && parseDate(stored) ? stored : "";
    } catch (error) {
      console.error("Не удалось прочитать дату начала отопительного сезона.", error);
      return "";
    }
  };
  const dayDifference = (from, to = dateToday()) => {
    const start = parseDate(from);
    const end = parseDate(to);
    return start && end ? Math.round((end - start) / 86400000) : null;
  };
  const setStatus = (element, message, isError = false) => {
    element.textContent = message;
    element.dataset.state = isError ? "error" : "info";
  };
  const formatDayCount = (days) => {
    if (locale === "en") return `${days} ${days === 1 ? "day" : "days"}`;
    const remainder = days % 100;
    const lastDigit = days % 10;
    const unit = locale === "uk"
      ? remainder >= 11 && remainder <= 14 ? "днів"
        : lastDigit === 1 ? "день"
          : lastDigit >= 2 && lastDigit <= 4 ? "дні" : "днів"
      : remainder >= 11 && remainder <= 14 ? "дней"
        : lastDigit === 1 ? "день"
          : lastDigit >= 2 && lastDigit <= 4 ? "дня" : "дней";
    return `${days} ${unit}`;
  };
  const appendPhotoChatMessage = (role, content, { pending = false, error = false } = {}) => {
    const message = document.createElement("article");
    message.className = `garden-chat-message garden-chat-${role}${pending ? " is-pending" : ""}${error ? " is-error" : ""}`;
    const author = document.createElement("span");
    author.className = "garden-chat-author";
    author.textContent = role === "user" ? "Вы" : "Silva";
    message.append(author);
    if (role === "user" && diagnosisObjectUrl && diagnosisHistory.length === 0) {
      const photo = document.createElement("img");
      photo.className = "garden-chat-photo";
      photo.src = diagnosisObjectUrl;
      photo.alt = "Фото растения, приложенное к вопросу";
      message.append(photo);
    }
    const text = document.createElement("p");
    text.className = "garden-chat-text";
    text.textContent = content;
    message.append(text);
    photoChatMessages.append(message);
    photoChatMessages.scrollTop = photoChatMessages.scrollHeight;
    return text;
  };
  const renderFieldIdentification = (identification, serviceOutdated = false) => {
    photoChatMessages.querySelector(".garden-field-identification")?.remove();
    const card = document.createElement("article");
    card.className = "garden-field-identification";
    const heading = document.createElement("strong");
    heading.textContent = "Полевое определение Silva";
    card.append(heading);
    const eligible = identification && ["conifer", "evergreen"].includes(identification.category) &&
      typeof identification.name === "string" && identification.name.trim();
    if (!eligible) {
      const message = document.createElement("p");
      message.textContent = serviceOutdated
        ? "Сервис распознавания полевого маршрута ещё не обновлён. Повторите попытку после обновления Silva."
        : identification?.category === "not-eligible"
          ? "На фото не распознано хвойное или вечнозелёное растение. Для маршрута эта находка не засчитывается."
          : "Silva не смогла надёжно определить подходящее растение по этому снимку. Попробуйте снять крупно хвою или листья, ветви, кору и шишки.";
      card.append(message);
      photoChatMessages.append(card);
      return;
    }

    const plant = document.createElement("p");
    plant.textContent = `${identification.name}${identification.scientificName ? ` · ${identification.scientificName}` : ""} — возможное определение по фото.`;
    const evidence = document.createElement("p");
    evidence.textContent = Array.isArray(identification.evidence) && identification.evidence.length
      ? `Видимые признаки: ${identification.evidence.join("; ")}`
      : "Silva не смогла выделить конкретные морфологические признаки на этом фото.";
    const confirmation = document.createElement("label");
    confirmation.className = "garden-field-confirm";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const confirmationText = document.createElement("span");
    confirmationText.textContent = "Подтверждаю, что это моя фотография растения, снятого в настоящем парке или лесу. Определение Silva — предположение по фото, а не экспертное подтверждение.";
    confirmation.append(checkbox, confirmationText);
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "button secondary small";
    saveButton.textContent = "Подтвердить и добавить с геопозицией";
    saveButton.disabled = true;
    checkbox.addEventListener("change", () => { saveButton.disabled = !checkbox.checked; });
    saveButton.addEventListener("click", async () => {
      if (!checkbox.checked || saveButton.disabled) return;
      saveButton.disabled = true;
      setStatus(fieldRouteStatus, "Запрашиваем геопозицию… Разрешите браузеру доступ, чтобы сохранить полевую заметку.");
      try {
        const location = await requestFieldLocation();
        const observations = readArray(FIELD_OBSERVATIONS_KEY);
        if (observations.length >= 100) {
          throw new RangeError("Достигнут лимит в 100 полевых наблюдений на устройстве.");
        }
        const observation = {
          id: crypto.randomUUID(),
          name: identification.name.trim().slice(0, 100),
          scientificName: typeof identification.scientificName === "string"
            ? identification.scientificName.trim().slice(0, 120)
            : "",
          category: identification.category,
          evidence: Array.isArray(identification.evidence)
            ? identification.evidence.filter((item) => typeof item === "string").slice(0, 3).map((item) => item.slice(0, 140))
            : [],
          note: latestDiagnosis.slice(0, 1800),
          confirmed: true,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracyMeters: location.accuracyMeters,
          observedAt: new Date().toISOString(),
          date: dateToday(),
        };
        writeArray(FIELD_OBSERVATIONS_KEY, [...observations, observation]);
        renderCitizenObservations();
        const savedCount = observations.length + 1;
        setStatus(fieldRouteStatus, savedCount >= 3
          ? `Наблюдение «${observation.name}» сохранено. Маршрут завершён: внесены три полевых наблюдения.`
          : `Наблюдение «${observation.name}» сохранено с координатами: ${savedCount} из 3. Запись появилась в сезонном трекере.`);
        saveButton.textContent = "Наблюдение сохранено";
        card.classList.add("is-saved");
        window.dispatchEvent(new CustomEvent("flora:toast", {
          detail: { message: `Полевое наблюдение «${observation.name}» добавлено в сезонный трекер.`, type: "success", duration: 5200 },
        }));
      } catch (error) {
        console.error("Не удалось сохранить полевое наблюдение.", error);
        setStatus(fieldRouteStatus, error.message || "Не удалось сохранить полевое наблюдение.", true);
        saveButton.disabled = false;
      }
    });
    card.append(plant, evidence, confirmation, saveButton);
    photoChatMessages.append(card);
    photoChatMessages.scrollTop = photoChatMessages.scrollHeight;
  };
  const resetPhotoChat = () => {
    diagnosisHistory = [];
    photoChatMessages?.replaceChildren();
    if (saveDiagnosisButton) saveDiagnosisButton.hidden = true;
    if (photoChat) photoChat.hidden = true;
  };
  const renderDiagnosisMarkers = (markers) => {
    if (!diagnosisMarkers) return;
    diagnosisMarkers.replaceChildren();
    if (!Array.isArray(markers)) {
      if (diagnosisMarkerNote) diagnosisMarkerNote.hidden = true;
      return;
    }
    markers.slice(0, 2).forEach((marker, index) => {
      if (!Number.isFinite(marker?.x) || marker.x < 0 || marker.x > 1000 ||
          !Number.isFinite(marker?.y) || marker.y < 0 || marker.y > 1000 ||
          typeof marker.label !== "string" || !marker.label.trim()) return;
      const point = document.createElement("span");
      point.className = "garden-photo-marker";
      point.style.left = `${marker.x / 10}%`;
      point.style.top = `${marker.y / 10}%`;
      point.setAttribute("role", "img");
      point.setAttribute("aria-label", `Примерная зона ${index + 1}: ${marker.label}`);
      const label = document.createElement("span");
      label.className = "garden-photo-marker-label";
      label.textContent = marker.label;
      point.append(label);
      diagnosisMarkers.append(point);
    });
    if (diagnosisMarkerNote) diagnosisMarkerNote.hidden = diagnosisMarkers.childElementCount === 0;
  };
  const readArray = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(value)) return value;
      if (!value || typeof value !== "object") return [];
      const deleted = new Set(Object.keys(value)
        .filter((id) => id.startsWith("__deleted:") && value[id] === true)
        .map((id) => id.slice("__deleted:".length)));
      return Object.entries(value)
        .filter(([id, entry]) => !id.startsWith("__deleted:") && !deleted.has(id) && entry && typeof entry === "object")
        .map(([, entry]) => entry);
    } catch (error) {
      console.error(`Не удалось прочитать данные ${key}.`, error);
      return [];
    }
  };
  const writeArray = (key, value) => {
    let previous = {};
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "{}");
      if (parsed && !Array.isArray(parsed) && typeof parsed === "object") previous = parsed;
    } catch (error) {
      console.error(`Не удалось объединить данные ${key}.`, error);
    }
    const records = Object.fromEntries(value
      .filter((entry) => entry && typeof entry.id === "string")
      .map((entry) => [entry.id, entry]));
    const next = Object.fromEntries(Object.entries(previous)
      .filter(([id]) => id.startsWith("__deleted:"))
      .slice(-500));
    Object.keys(previous).forEach((id) => {
      if (!id.startsWith("__deleted:") && !Object.hasOwn(records, id)) {
        next[`__deleted:${id}`] = true;
      }
    });
    Object.assign(next, records);
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("flora:local-data-change", {
      detail: { key, value: localStorage.getItem(key) },
    }));
  };
  const collectionIds = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("flora-collection") || "[]");
      if (!Array.isArray(saved)) throw new TypeError("Ожидался массив идентификаторов растений.");
      return [...new Set(saved.filter((id) => typeof id === "string"))];
    } catch (error) {
      console.error("Не удалось прочитать коллекцию растений.", error);
      return [];
    }
  };
  const latestCareDate = (plan) => [plan.lastChecked, plan.lastWatered]
    .filter((value) => typeof value === "string" && parseDate(value))
    .sort()
    .at(-1) || "";
  const displayPlantName = (plan) => {
    const catalogPlant = typeof plan.catalogId === "string" ? window.floraGetPlantById?.(plan.catalogId) : null;
    return typeof catalogPlant?.name === "string" ? catalogPlant.name : plan.name;
  };
  const markCareChecked = (planId, action = "soil") => {
    const plans = readArray(CARE_KEY);
    try {
      writeArray(CARE_KEY, plans.map((plan) => plan.id === planId
        ? { ...plan, ...(action === "humidity" ? { lastHumidityCheck: dateToday() } : { lastChecked: dateToday() }) }
        : plan));
      const selectedPlan = plans.find((plan) => plan.id === planId);
      const name = selectedPlan ? displayPlantName(selectedPlan) : "";
      setStatus(careStatus, action === "humidity" ? messages.humiditySaved(name) : messages.checkSaved);
    } catch (error) {
      console.error("Не удалось сохранить отметку ухода.", error);
      setStatus(careStatus, messages.saveFailed(error), true);
    }
  };
  const refreshCareCollectionOptions = () => {
    if (!careCollectionPlant) return;
    const savedValue = careCollectionPlant.value;
    const plans = readArray(CARE_KEY);
    const plannedPlantIds = new Set(plans.map((plan) => plan.catalogId).filter((id) => typeof id === "string"));
    const available = collectionIds()
      .map((id) => window.floraGetPlantById?.(id))
      .filter((plant) => plant && typeof plant.name === "string" && !plannedPlantIds.has(plant.id));
    const options = [new Option(messages.collectionOption, "")];
    available.forEach((plant) => options.push(new Option(plant.name, plant.id)));
    if (!available.length) {
      const emptyMessage = collectionIds().length ? messages.collectionDone : messages.collectionEmpty;
      options.push(new Option(emptyMessage, "", true, true));
    }
    careCollectionPlant.replaceChildren(...options);
    careCollectionPlant.disabled = available.length === 0;
    if (careImportButton) careImportButton.disabled = available.length === 0;
    if (available.some((plant) => plant.id === savedValue)) careCollectionPlant.value = savedValue;
  };
  const renderCitizenObservations = () => {
    const list = document.querySelector("#citizen-observation-list");
    const count = document.querySelector("#citizen-observations-count");
    if (!list || !count) return;
    const observations = readArray(FIELD_OBSERVATIONS_KEY)
      .filter((entry) => entry?.confirmed === true &&
        typeof entry.name === "string" &&
        Number.isFinite(entry.latitude) && Number.isFinite(entry.longitude))
      .sort((left, right) => String(right.observedAt).localeCompare(String(left.observedAt)));
    count.textContent = `${observations.length} ${observations.length === 1 ? "наблюдение" : observations.length >= 2 && observations.length <= 4 ? "наблюдения" : "наблюдений"}`;
    list.replaceChildren();
    if (!observations.length) {
      const empty = document.createElement("p");
      empty.className = "season-empty";
      empty.textContent = "Полевые находки появятся здесь после подтверждения растения и сохранения геопозиции.";
      list.append(empty);
      return;
    }
    observations.forEach((observation) => {
      const card = document.createElement("article");
      card.className = "citizen-observation";
      const title = document.createElement("h3");
      title.textContent = observation.name;
      const scientificName = typeof observation.scientificName === "string" && observation.scientificName
        ? ` · ${observation.scientificName}`
        : "";
      const date = typeof observation.observedAt === "string" && !Number.isNaN(Date.parse(observation.observedAt))
        ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(observation.observedAt))
        : observation.date || "Дата не указана";
      const details = document.createElement("p");
      details.textContent = `${date}${scientificName} · ${observation.category === "conifer" ? "хвойное" : "вечнозелёное"}`;
      const evidence = document.createElement("p");
      evidence.textContent = Array.isArray(observation.evidence) && observation.evidence.length
        ? `Признаки: ${observation.evidence.join("; ")}`
        : "Морфологические признаки не записаны.";
      const note = document.createElement("p");
      note.textContent = typeof observation.note === "string" && observation.note.trim()
        ? `Заметка Silva: ${observation.note}`
        : "Ответ Silva не сохранён.";
      const coordinates = document.createElement("p");
      coordinates.textContent = `Координаты: ${Number(observation.latitude).toFixed(5)}, ${Number(observation.longitude).toFixed(5)} · точность GPS около ${Math.round(Number(observation.accuracyMeters) || 0)} м`;
      const mapLink = document.createElement("a");
      mapLink.href = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(observation.latitude)}&mlon=${encodeURIComponent(observation.longitude)}#map=17/${encodeURIComponent(observation.latitude)}/${encodeURIComponent(observation.longitude)}`;
      mapLink.target = "_blank";
      mapLink.rel = "noopener noreferrer";
      mapLink.textContent = "Посмотреть на карте";
      card.append(title, details, evidence, note, coordinates, mapLink);
      list.append(card);
    });
  };
  const requestFieldLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Этот браузер не поддерживает геопозицию. Откройте сайт в актуальном браузере и разрешите доступ к местоположению."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
          reject(new Error("Браузер не вернул корректные координаты."));
          return;
        }
        resolve({
          latitude: Number(coords.latitude.toFixed(5)),
          longitude: Number(coords.longitude.toFixed(5)),
          accuracyMeters: Number.isFinite(coords.accuracy) ? Math.round(coords.accuracy) : null,
        });
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? "Доступ к геопозиции запрещён. Разрешите местоположение в настройках браузера и повторите сохранение."
          : error.code === error.POSITION_UNAVAILABLE
            ? "Браузер не смог определить местоположение. Проверьте GPS и попробуйте ещё раз."
            : "Не удалось получить геопозицию вовремя. Повторите попытку.";
        reject(new Error(message));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  });
  const escapeText = (value) => String(value ?? "");
  const parseDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : null;
  const formatDate = (value) => {
    const date = parseDate(value);
    return date ? new Intl.DateTimeFormat(messages.dateLocale, { dateStyle: "long" }).format(date)
      : locale === "en" ? "No date" : locale === "uk" ? "Без дати" : "Без даты";
  };
  const renderToday = (plans, loading = false) => {
    const dateLabel = document.querySelector("#garden-today-date");
    const message = document.querySelector("#garden-today-message");
    const count = document.querySelector("#garden-today-count");
    const countLabel = document.querySelector("#garden-today-count-label");
    const progress = document.querySelector(".garden-today-progress");
    const progressFill = document.querySelector("#garden-today-progress-fill");
    const progressLabel = document.querySelector("#garden-today-progress-label");
    const items = document.querySelector("#garden-today-items");
    if (!dateLabel || !message || !count || !countLabel || !progress || !progressFill || !progressLabel || !items) return;

    dateLabel.textContent = new Intl.DateTimeFormat(messages.dateLocale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
    items.replaceChildren();
    if (loading) {
      message.textContent = locale === "en" ? "Loading your care plan…" : locale === "uk" ? "Завантажуємо ваш план догляду…" : "Загружаем ваш план ухода…";
      count.textContent = "—";
      countLabel.textContent = messages.checksDone;
      progress.setAttribute("aria-valuemax", "0");
      progress.setAttribute("aria-valuenow", "0");
      progressFill.style.width = "0%";
      progressLabel.textContent = "";
      return;
    }

    const today = dateToday();
    const heatingActive = isHeatingSeasonEnabled();
    const tasks = [];
    plans.forEach((plan) => {
      const intervalDays = Number(plan.intervalDays);
      if (Number.isInteger(intervalDays) && intervalDays >= 1 && intervalDays <= 90) {
        const baseline = parseDate(latestCareDate(plan));
        const dueDate = new Date(baseline || parseDate(today));
        if (baseline) dueDate.setDate(dueDate.getDate() + intervalDays);
        const daysUntilDue = Math.round((dueDate - parseDate(today)) / 86400000);
        if (daysUntilDue <= 0 || plan.lastChecked === today) {
          tasks.push({
            plan,
            action: "soil",
            daysUntilDue,
            completed: plan.lastChecked === today,
          });
        }
      }

      if (heatingActive) {
        const lastHumidityCheck = typeof plan.lastHumidityCheck === "string" && parseDate(plan.lastHumidityCheck)
          ? plan.lastHumidityCheck
          : "";
        const createdAt = typeof plan.createdAt === "string" && parseDate(plan.createdAt)
          ? plan.createdAt
          : "";
        const heatingStarted = readHeatingSeasonStarted() || today;
        const humidityBaseline = lastHumidityCheck || (createdAt > heatingStarted ? createdAt : heatingStarted) || createdAt;
        const humidityDays = humidityBaseline ? dayDifference(humidityBaseline) : null;
        if (lastHumidityCheck === today || humidityDays !== null && humidityDays > 5) {
          tasks.push({
            plan,
            action: "humidity",
            daysUntilDue: 0,
            completed: lastHumidityCheck === today,
          });
        }
      }
    });
    tasks.sort((left, right) => left.daysUntilDue - right.daysUntilDue || left.plan.name.localeCompare(right.plan.name));
    const completedCount = tasks.filter((task) => task.completed).length;
    const pendingCount = tasks.length - completedCount;
    count.textContent = tasks.length ? `${completedCount}/${tasks.length}` : "0";
    countLabel.textContent = messages.checksDone;
    progress.setAttribute("aria-valuemax", String(tasks.length));
    progress.setAttribute("aria-valuenow", String(completedCount));
    progressFill.style.width = `${tasks.length ? Math.round((completedCount / tasks.length) * 100) : 100}%`;
    progressLabel.textContent = messages.progress(completedCount, tasks.length);

    if (!plans.length) {
      message.textContent = messages.noPlan;
      const addPlan = document.createElement("button");
      addPlan.type = "button";
      addPlan.className = "garden-today-link";
      addPlan.dataset.gardenScroll = "garden-care";
      addPlan.textContent = messages.addPlan;
      items.append(addPlan);
      return;
    }

    message.textContent = pendingCount
      ? messages.dueMessage
      : tasks.length ? messages.allDoneMessage : messages.upcomingMessage;
    const renderTask = (task) => {
      const item = document.createElement("article");
      item.className = `garden-today-item${task.completed ? " is-complete" : ""}`;
      const details = document.createElement("div");
      details.className = "garden-today-task-copy";
      const plant = document.createElement("strong");
      plant.className = "garden-today-plant";
      plant.textContent = displayPlantName(task.plan);
      const taskLabel = document.createElement("span");
      taskLabel.className = "garden-today-task-label";
      taskLabel.textContent = task.action === "humidity" ? messages.checkHumidity : messages.checkSoil;
      const timing = document.createElement("small");
      timing.className = `garden-today-timing${task.daysUntilDue < 0 ? " is-due" : ""}`;
      timing.textContent = task.action === "humidity"
        ? messages.checkNote
        : task.daysUntilDue < 0
          ? `${locale === "en" ? "Overdue" : locale === "uk" ? "Прострочено" : "Просрочено"} · ${messages.relative(task.daysUntilDue)}`
          : messages.relative(task.daysUntilDue);
      details.append(plant, taskLabel, timing);
      const action = document.createElement("button");
      action.type = "button";
      action.className = "button secondary small garden-today-action";
      action.disabled = task.completed;
      action.textContent = task.completed
        ? task.action === "humidity" ? messages.humidityChecked : messages.soilChecked
        : task.action === "humidity" ? messages.checkHumidity : messages.checkSoil;
      action.setAttribute("aria-label", `${action.textContent}: ${displayPlantName(task.plan)}`);
      action.addEventListener("click", () => markCareChecked(task.plan.id, task.action));
      item.append(details, action);
      items.append(item);
    };

    if (tasks.length) {
      tasks.slice(0, 6).forEach(renderTask);
      if (tasks.length > 6) {
        const more = document.createElement("button");
        more.type = "button";
        more.className = "garden-today-link";
        more.dataset.gardenScroll = "garden-care";
        more.textContent = locale === "en" ? "Open the full care plan" : locale === "uk" ? "Відкрити повний план догляду" : "Открыть полный план ухода";
        items.append(more);
      }
      return;
    }

    const todayDate = parseDate(today);
    const upcoming = plans
      .map((plan) => {
        const intervalDays = Number(plan.intervalDays);
        if (!Number.isInteger(intervalDays) || intervalDays < 1 || intervalDays > 90) return null;
        const dueDate = new Date(parseDate(latestCareDate(plan)) || todayDate);
        dueDate.setDate(dueDate.getDate() + intervalDays);
        return { plan, daysUntilDue: Math.max(0, Math.round((dueDate - todayDate) / 86400000)) };
      })
      .filter(Boolean)
      .sort((left, right) => left.daysUntilDue - right.daysUntilDue)
      .slice(0, 3);
    if (!upcoming.length) {
      message.textContent = messages.noTasks;
      return;
    }
    upcoming.forEach(({ plan, daysUntilDue }) => {
      const item = document.createElement("div");
      item.className = "garden-today-item is-upcoming";
      const plant = document.createElement("strong");
      plant.className = "garden-today-plant";
      plant.textContent = displayPlantName(plan);
      const timing = document.createElement("small");
      timing.className = "garden-today-timing";
      timing.textContent = messages.relative(daysUntilDue);
      item.append(plant, timing);
      items.append(item);
    });
  };
  const requestAccount = () => {
    document.querySelector("#account-open")?.click();
  };
  const fileToCompressedImage = async (file) => {
    if (!allowedTypes.has(file.type)) throw new TypeError("Поддерживаются только JPEG, PNG и WebP.");
    if (file.size > 12 * 1024 * 1024) throw new RangeError("Исходное фото должно быть меньше 12 МБ.");
    const bitmap = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("Браузер не смог подготовить изображение.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (!result) reject(new Error("Не удалось обработать фото."));
          else resolve(result);
        }, "image/jpeg", 0.82);
      });
      if (blob.size > MAX_PHOTO_BYTES) throw new RangeError("После сжатия фото всё ещё больше 2 МБ.");
      return blob;
    } finally {
      bitmap.close();
    }
  };
  const blobToBase64 = async (blob) => {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + 0x8000, bytes.length)));
    }
    return btoa(binary);
  };
  const readSignedPhoto = async (path) => {
    if (!client || !path) return "";
    const { data, error } = await client.storage.from("flora-journal").createSignedUrl(path, 3600);
    if (error) throw error;
    if (!data?.signedUrl) throw new Error("Ссылка на фото не получена.");
    return data.signedUrl;
  };
  let journalRenderSequence = 0;
  const renderJournal = async () => {
    const renderSequence = ++journalRenderSequence;
    journalList.replaceChildren();
    const dataOwner = localStorage.getItem("flora-data-owner");
    if (accountUser && dataOwner && dataOwner !== accountUser.id) {
      const loading = document.createElement("p");
      loading.className = "garden-empty";
      loading.textContent = "Загружаем дневник этого аккаунта…";
      journalList.append(loading);
      return;
    }
    const entries = readArray(JOURNAL_KEY)
      .filter((entry) => entry && typeof entry.id === "string")
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "garden-empty";
      empty.textContent = "Пока нет записей. Сохраните первое наблюдение за растением.";
      journalList.append(empty);
      return;
    }
    const photoEntries = [];
    for (const entry of entries.slice(0, 100)) {
      const card = document.createElement("article");
      card.className = "garden-journal-entry";
      const heading = document.createElement("div");
      heading.className = "garden-entry-heading";
      const title = document.createElement("h3");
      title.textContent = escapeText(entry.plant);
      const date = document.createElement("time");
      date.dateTime = escapeText(entry.date);
      date.textContent = formatDate(entry.date);
      heading.append(title, date);
      card.append(heading);
      const note = document.createElement("p");
      note.textContent = escapeText(entry.note);
      card.append(note);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "button ghost small";
      remove.textContent = "Удалить запись";
      remove.addEventListener("click", () => { void deleteJournalEntry(entry); });
      card.append(remove);
      journalList.append(card);
      if (typeof entry.photoPath === "string" && entry.photoPath) {
        photoEntries.push({ entry, card, note });
      }
    }
    for (let index = 0; index < photoEntries.length; index += 6) {
      if (renderSequence !== journalRenderSequence) return;
      await Promise.all(photoEntries.slice(index, index + 6).map(async ({ entry, card, note }) => {
        try {
          const image = document.createElement("img");
          const signedUrl = await readSignedPhoto(entry.photoPath);
          if (!signedUrl) throw new Error("Ссылка на фото не получена.");
          image.src = signedUrl;
          if (renderSequence !== journalRenderSequence || !card.isConnected) return;
          image.alt = `Фото растения: ${escapeText(entry.plant)}`;
          image.loading = "lazy";
          image.decoding = "async";
          image.className = "garden-entry-photo";
          note.after(image);
        } catch (error) {
          console.error("Не удалось загрузить фото записи дневника.", error);
          if (renderSequence !== journalRenderSequence || !card.isConnected) return;
          const photoError = document.createElement("p");
          photoError.className = "garden-status";
          photoError.textContent = "Фото записи временно недоступно.";
          note.after(photoError);
        }
      }));
    }
  };
  const renderCare = () => {
    careList.replaceChildren();
    const dataOwner = localStorage.getItem("flora-data-owner");
    if (accountUser && dataOwner && dataOwner !== accountUser.id) {
      renderToday([], true);
      if (careCollectionPlant) careCollectionPlant.disabled = true;
      const loading = document.createElement("p");
      loading.className = "garden-empty";
      loading.textContent = "Загружаем график ухода этого аккаунта…";
      careList.append(loading);
      return;
    }
    const plans = readArray(CARE_KEY)
      .filter((plan) => plan && typeof plan.id === "string" && typeof plan.name === "string");
    refreshCareCollectionOptions();
    renderToday(plans);
    const heatingActive = isHeatingSeasonEnabled();
    let heatingStarted = readHeatingSeasonStarted();
    if (heatingActive && !heatingStarted) {
      heatingStarted = dateToday();
      try {
        localStorage.setItem(HEATING_SEASON_STARTED_KEY, heatingStarted);
      } catch (error) {
        console.error("Не удалось сохранить дату начала отопительного сезона.", error);
        heatingStarted = "";
      }
    }
    if (!plans.length) {
      const empty = document.createElement("p");
      empty.className = "garden-empty";
      empty.textContent = "Добавьте растение, чтобы настроить личные интервалы ухода.";
      careList.append(empty);
      return;
    }
    plans.forEach((plan) => {
      const card = document.createElement("article");
      card.className = "garden-care-item";
      const catalogPlant = typeof plan.catalogId === "string" ? window.floraGetPlantById?.(plan.catalogId) : null;
      const title = document.createElement("strong");
      title.textContent = escapeText(displayPlantName(plan));
      const location = document.createElement("span");
      location.className = "garden-care-location";
      location.textContent = typeof plan.location === "string" && plan.location.trim()
        ? plan.location.trim()
        : messages.unknownLocation;
      const intervalDays = Number(plan.intervalDays);
      const lastChecked = parseDate(latestCareDate(plan));
      const nextCheck = new Date(lastChecked || parseDate(dateToday()));
      const hasValidInterval = Number.isInteger(intervalDays) && intervalDays >= 1 && intervalDays <= 90;
      if (lastChecked && hasValidInterval) {
        nextCheck.setDate(nextCheck.getDate() + intervalDays);
      }
      const daysUntilCheck = hasValidInterval
        ? Math.round((nextCheck - parseDate(dateToday())) / 86400000)
        : null;
      const interval = document.createElement("span");
      interval.className = `garden-care-schedule${daysUntilCheck < 0 ? " is-overdue" : daysUntilCheck === 0 ? " is-due" : ""}`;
      interval.textContent = daysUntilCheck === null
        ? messages.intervalUnset
        : daysUntilCheck < 0
          ? messages.overdue(formatDayCount(Math.abs(daysUntilCheck)))
          : daysUntilCheck === 0
            ? messages.checkToday
            : messages.nextCheck(formatDayCount(daysUntilCheck), formatDayCount(intervalDays));
      const lastHumidityCheck = typeof plan.lastHumidityCheck === "string" && parseDate(plan.lastHumidityCheck)
        ? plan.lastHumidityCheck
        : "";
      const createdAt = typeof plan.createdAt === "string" && parseDate(plan.createdAt)
        ? plan.createdAt
        : "";
      const humidityBaseline = lastHumidityCheck || (createdAt > heatingStarted ? createdAt : heatingStarted);
      const humidityDays = humidityBaseline ? dayDifference(humidityBaseline) : null;
      const humidityNeedsAttention = heatingActive && humidityDays !== null && humidityDays > 5;
      const wateringOverdue = daysUntilCheck !== null && daysUntilCheck < 0;
      const stressLevel = Number(wateringOverdue) + Number(humidityNeedsAttention);
      const health = document.createElement("div");
      health.className = `garden-care-health${stressLevel ? " is-stressed" : ""}${humidityNeedsAttention ? " is-dry-air" : ""}`;
      const healthLabel = document.createElement("strong");
      healthLabel.textContent = humidityNeedsAttention
        ? messages.dryAir
        : wateringOverdue
          ? messages.wateringStress
          : messages.resting;
      const stressMeter = document.createElement("span");
      stressMeter.className = "garden-care-stress-meter";
      stressMeter.setAttribute("role", "progressbar");
      stressMeter.setAttribute("aria-label", "Уровень стресса растения");
      stressMeter.setAttribute("aria-valuemin", "0");
      stressMeter.setAttribute("aria-valuemax", "2");
      stressMeter.setAttribute("aria-valuenow", String(stressLevel));
      const stressMeterFill = document.createElement("span");
      stressMeterFill.style.width = `${stressLevel * 50}%`;
      stressMeter.append(stressMeterFill);
      health.append(healthLabel, stressMeter);
      if (wateringOverdue && humidityNeedsAttention) {
        const healthDetail = document.createElement("small");
        healthDetail.textContent = messages.bothRisks;
        health.append(healthDetail);
      }
      const history = Array.isArray(plan.wateringHistory)
        ? plan.wateringHistory.filter((date) => typeof date === "string" && parseDate(date)).slice(-30)
        : [];
      const wateringCount = Number.isSafeInteger(plan.wateringCount) && plan.wateringCount >= 0
        ? plan.wateringCount
        : history.length || (plan.lastWatered ? 1 : 0);
      const lastWatered = document.createElement("small");
      lastWatered.textContent = wateringCount > 0 && plan.lastWatered
        ? messages.lastWatering(formatDate(plan.lastWatered))
        : messages.noWatering;
      const checkedToday = plan.lastChecked === dateToday();
      const lastCareCheck = document.createElement("small");
      lastCareCheck.className = "garden-care-check-history";
      lastCareCheck.textContent = plan.lastChecked
        ? messages.lastSoilCheck(formatDate(plan.lastChecked))
        : messages.soilNotChecked;
      const historyLabel = document.createElement("small");
      historyLabel.className = "garden-care-history-label";
      historyLabel.textContent = messages.wateringMarks(wateringCount);
      const historyList = document.createElement("div");
      historyList.className = "garden-care-history";
      history.slice(-3).reverse().forEach((date) => {
        const historyItem = document.createElement("span");
        historyItem.textContent = formatDate(date);
        historyList.append(historyItem);
      });
      if (typeof plan.note === "string" && plan.note.trim()) {
        const note = document.createElement("p");
        note.className = "garden-care-note";
        note.textContent = plan.note.trim();
        card.append(note);
      }
      const catalogWatering = catalogPlant?.care?.watering;
      if (typeof catalogWatering === "string" && catalogWatering.trim()) {
        const guidance = document.createElement("p");
        guidance.className = "garden-care-guidance";
        const guidanceLabel = document.createElement("strong");
        guidanceLabel.textContent = `${messages.catalogGuidance}: `;
        guidance.append(guidanceLabel, document.createTextNode(catalogWatering));
        card.append(guidance);
      }
      const actions = document.createElement("div");
      actions.className = "garden-care-actions";
      const checked = document.createElement("button");
      checked.type = "button";
      checked.className = "button secondary small";
      checked.textContent = checkedToday
        ? locale === "en" ? "Soil checked today" : locale === "uk" ? "Ґрунт перевірено сьогодні" : "Почва проверена сегодня"
        : locale === "en" ? "Check soil" : locale === "uk" ? "Перевірити ґрунт" : "Проверить почву";
      checked.disabled = checkedToday;
      checked.addEventListener("click", () => markCareChecked(plan.id));
      const watered = document.createElement("button");
      watered.type = "button";
      watered.className = "button secondary small";
      const wateredToday = wateringCount > 0 && plan.lastWatered === dateToday();
      watered.textContent = wateredToday
        ? locale === "en" ? "Watered today" : locale === "uk" ? "Полито сьогодні" : "Полив отмечен сегодня"
        : locale === "en" ? "Mark as watered" : locale === "uk" ? "Позначити полив" : "Отметить полив";
      watered.disabled = wateredToday;
      watered.addEventListener("click", () => {
        if (wateringCount > 0 && plan.lastWatered === dateToday()) return;
        const updatedHistory = [...history, dateToday()].slice(-30);
        const previousCount = Number.isSafeInteger(plan.wateringCount) && plan.wateringCount >= 0
          ? plan.wateringCount
          : history.length || (plan.lastWatered ? 1 : 0);
        try {
          writeArray(CARE_KEY, plans.map((item) => item.id === plan.id
            ? { ...item, lastWatered: dateToday(), lastChecked: dateToday(), wateringHistory: updatedHistory, wateringCount: previousCount + 1 }
            : item));
          window.dispatchEvent(new CustomEvent("flora:care-action", { detail: { plantId: plan.id, action: "water" } }));
        } catch (error) {
          console.error("Не удалось сохранить отметку полива.", error);
          setStatus(careStatus, `Не удалось сохранить полив: ${error.message}`, true);
        }
      });
      if (heatingActive) {
        const humidity = document.createElement("button");
        humidity.type = "button";
        humidity.className = "button ghost small";
        const humidityCheckedToday = plan.lastHumidityCheck === dateToday();
        humidity.textContent = humidityCheckedToday
          ? locale === "en" ? "Humidity checked today" : locale === "uk" ? "Вологість перевірено сьогодні" : "Влажность проверена сегодня"
          : locale === "en" ? "Check air humidity" : locale === "uk" ? "Перевірити вологість повітря" : "Проверить влажность воздуха";
        humidity.disabled = humidityCheckedToday;
        humidity.title = locale === "en"
          ? "Check humidity near the plant. Do not mist species that should not be misted."
          : locale === "uk"
            ? "Перевірте вологість біля рослини. Не обприскуйте види, яким це шкодить."
            : "Проверьте влажность рядом с растением. Не опрыскивайте виды, которым это вредно.";
        humidity.addEventListener("click", () => {
          markCareChecked(plan.id, "humidity");
        });
        actions.append(humidity);
        const humidityHistory = document.createElement("small");
        humidityHistory.className = "garden-care-humidity-history";
        humidityHistory.textContent = lastHumidityCheck
          ? messages.lastHumidity(formatDate(lastHumidityCheck))
          : humidityBaseline
            ? messages.humidityNoted(formatDate(humidityBaseline))
            : messages.humidityNotMarked;
        card.append(humidityHistory);
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "button ghost small";
      remove.textContent = "Убрать";
      remove.addEventListener("click", () => {
        try {
          writeArray(CARE_KEY, plans.filter((item) => item.id !== plan.id));
          setStatus(careStatus, `Профиль «${plan.name}» удалён.`);
        } catch (error) {
          console.error("Не удалось удалить профиль ухода.", error);
          setStatus(careStatus, `Не удалось удалить профиль: ${error.message}`, true);
        }
      });
      actions.append(checked, watered, remove);
      card.prepend(title, location, interval, health, lastCareCheck, lastWatered, historyLabel);
      if (historyList.childElementCount) card.append(historyList);
      card.append(actions);
      careList.append(card);
    });
  };
  const updateAccountAccess = () => {
    accountHint.textContent = accountUser
      ? "Дневник и график ухода синхронизируются с аккаунтом. Фото хранятся в приватном облачном хранилище."
      : "План ухода сохраняется на этом устройстве без входа. Дневник и фото можно синхронизировать через аккаунт Silva Quieta.";
    if (!accountUser) {
      pushEnable.disabled = true;
      pushDisable.hidden = true;
    } else {
      pushEnable.disabled = false;
    }
    void renderJournal();
    renderCare();
  };
  document.querySelector("#garden-today-items")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-scroll]");
    if (button) {
      document.getElementById(button.dataset.gardenScroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  const deleteJournalEntry = async (entry) => {
    if (!accountUser || !client) return;
    try {
      if (entry.photoPath) {
        const { error } = await client.storage.from("flora-journal").remove([entry.photoPath]);
        if (error) throw error;
      }
      writeArray(JOURNAL_KEY, readArray(JOURNAL_KEY).filter((item) => item.id !== entry.id));
      setStatus(journalStatus, "Запись удалена.");
      await renderJournal();
    } catch (error) {
      console.error("Не удалось удалить запись дневника.", error);
      setStatus(journalStatus, `Не удалось удалить запись: ${error.message}`, true);
    }
  };

  document.querySelector("#winter-gift-print")?.addEventListener("click", () => {
    let printWindow;
    try {
      printWindow = window.open("", "_blank");
    } catch (error) {
      console.error("Не удалось открыть окно памятки зимнего набора.", error);
      setStatus(careStatus, "Не удалось открыть памятку для печати. Проверьте настройки всплывающих окон.", true);
      return;
    }
    if (!printWindow) {
      setStatus(careStatus, "Браузер заблокировал окно памятки. Разрешите всплывающие окна и попробуйте снова.", true);
      return;
    }
    const printDocument = printWindow.document;
    printDocument.title = "Зимний набор садовода Silva";
    const style = printDocument.createElement("style");
    style.textContent = "body{max-width:680px;margin:40px auto;padding:0 24px;color:#24372c;font:16px/1.6 Arial,sans-serif}h1{color:#426d88}li{margin:12px 0}.note{margin-top:24px;padding:14px;border-radius:10px;background:#edf4ee;color:#526357;font-size:13px}@media print{body{margin:0 auto;padding:12mm}}";
    const heading = printDocument.createElement("h1");
    heading.textContent = "Зимний набор садовода";
    const intro = printDocument.createElement("p");
    intro.textContent = "Памятка от Silva Quieta — спокойный уход за растениями в отопительный сезон.";
    const checklist = printDocument.createElement("ul");
    [
      "Проверьте грунт пальцем перед поливом: календарь — только напоминание, а не команда поливать.",
      "Отодвиньте листья от холодного стекла и горячей батареи.",
      "Раз в неделю осмотрите обе стороны листьев и аккуратно уберите пыль.",
      "Проверьте, достаточно ли растению света и нет ли холодного сквозняка.",
    ].forEach((task) => {
      const item = printDocument.createElement("li");
      item.textContent = `□ ${task}`;
      checklist.append(item);
    });
    const note = printDocument.createElement("p");
    note.className = "note";
    note.textContent = "У растений разные потребности: сверяйте уход с видом и условиями дома. Не поливайте только потому, что пришло напоминание.";
    printDocument.head.append(style);
    printDocument.body.replaceChildren(heading, intro, checklist, note);
    printDocument.close();
    window.setTimeout(() => {
      if (printWindow.closed) return;
      printWindow.focus();
      printWindow.print();
    }, 350);
  });

  document.querySelector("#garden-checklist-export")?.addEventListener("click", () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setStatus(careStatus, "Браузер заблокировал окно печати. Разрешите всплывающие окна и попробуйте снова.", true);
      return;
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthTitle = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(now);
    const plans = readArray(CARE_KEY).filter((plan) =>
      plan && typeof plan.name === "string" && Number.isInteger(Number(plan.intervalDays)) &&
      Number(plan.intervalDays) >= 1 && Number(plan.intervalDays) <= 90
    );
    const documentNode = printWindow.document;
    documentNode.title = `Мой план ухода на ${monthTitle}`;
    const style = documentNode.createElement("style");
    style.textContent = `
      *{box-sizing:border-box}body{max-width:780px;margin:32px auto;padding:0 24px;color:#24372c;font:14px/1.5 Arial,sans-serif}
      h1{margin:0 0 6px;font-size:28px}p{margin:0 0 18px;color:#526357}.month{color:#527d68}
      table{width:100%;border-collapse:collapse}th,td{padding:9px 10px;border-bottom:1px solid #dce5dc;text-align:left;vertical-align:top}
      th{background:#edf4ee;font-size:11px;text-transform:uppercase;letter-spacing:.06em}.date{width:100px;white-space:nowrap;font-weight:700}
      .check{width:26px;height:26px;border:1.5px solid #748b78;border-radius:4px;display:inline-block}
      .footer{margin-top:18px;padding:12px;border-radius:10px;background:#f1f5f0;color:#526357;font-size:11px}
      @media print{body{margin:0 auto;padding:0 12mm}h1{font-size:22px}th,td{padding:6px 8px}tr{break-inside:avoid}.footer{break-inside:avoid}}
    `;
    documentNode.head.append(style);
    const heading = documentNode.createElement("h1");
    heading.textContent = "Мой план ухода";
    const monthLabel = documentNode.createElement("p");
    monthLabel.className = "month";
    monthLabel.textContent = monthTitle.charAt(0).toLocaleUpperCase("ru-RU") + monthTitle.slice(1);
    const intro = documentNode.createElement("p");
    intro.textContent = "Мягкий план наблюдений. Проверяйте условия и грунт; отметка в чек-листе не означает, что растение обязательно нужно поливать.";
    const table = documentNode.createElement("table");
    const header = documentNode.createElement("tr");
    ["Готово", "Дата", "План на день"].forEach((label) => {
      const cell = documentNode.createElement("th");
      cell.textContent = label;
      header.append(cell);
    });
    const head = documentNode.createElement("thead");
    head.append(header);
    const body = documentNode.createElement("tbody");
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dateFormatter = new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric" });
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const tasks = ["Осмотреть листья и проверить, нет ли холодного сквозняка"];
      if (day === 1 || day % 7 === 0) tasks.push("Проверить грунт у растений и протереть пыль с листьев");
      plans.forEach((plan) => {
        const baseline = latestCareDate(plan) || (parseDate(plan.createdAt) ? plan.createdAt : "");
        const elapsed = baseline ? dayDifference(baseline, dateKey) : null;
        if (elapsed === null || elapsed >= 0 && elapsed % Number(plan.intervalDays) === 0) {
          tasks.push(`Проверить грунт: ${plan.name} (поливать, только если грунт просох)`);
        }
      });
      const row = documentNode.createElement("tr");
      const checkboxCell = documentNode.createElement("td");
      checkboxCell.className = "date";
      const checkbox = documentNode.createElement("span");
      checkbox.className = "check";
      checkboxCell.append(checkbox);
      const dateCell = documentNode.createElement("td");
      dateCell.className = "date";
      dateCell.textContent = dateFormatter.format(date);
      const taskCell = documentNode.createElement("td");
      taskCell.textContent = tasks.join(" · ");
      row.append(checkboxCell, dateCell, taskCell);
      body.append(row);
    }
    table.append(head, body);
    const footer = documentNode.createElement("p");
    footer.className = "footer";
    footer.textContent = plans.length
      ? `Индивидуальные проверки добавлены по вашим планам: ${plans.map((plan) => plan.name).join(", ")}. Сверяйте интервалы с реальными условиями и особенностями вида.`
      : "Добавьте растения в «Ритм ухода», чтобы включить индивидуальные проверки в следующий чек-лист.";
    documentNode.body.replaceChildren(heading, monthLabel, intro, table, footer);
    documentNode.close();
    setStatus(careStatus, "Месячный чек-лист готов. В окне печати выберите «Сохранить как PDF».");
    window.setTimeout(() => {
      if (printWindow.closed) return;
      printWindow.focus();
      printWindow.print();
    }, 500);
  });

  if (heatingSeasonToggle) {
    heatingSeasonToggle.checked = isHeatingSeasonEnabled();
    heatingSeasonToggle.addEventListener("change", () => {
      const wasEnabled = isHeatingSeasonEnabled();
      try {
        localStorage.setItem(HEATING_SEASON_KEY, String(heatingSeasonToggle.checked));
        if (heatingSeasonToggle.checked) {
          if (!wasEnabled || !readHeatingSeasonStarted()) {
            localStorage.setItem(HEATING_SEASON_STARTED_KEY, dateToday());
          }
        } else {
          localStorage.removeItem(HEATING_SEASON_STARTED_KEY);
        }
        setStatus(careStatus, heatingSeasonToggle.checked
          ? "Отопительный сезон включён. Следите за сухостью воздуха и отмечайте увлажнение."
          : "Отопительный сезон выключен. Напоминания о сухом воздухе приостановлены.");
        renderCare();
      } catch (error) {
        heatingSeasonToggle.checked = wasEnabled;
        console.error("Не удалось сохранить настройку отопительного сезона.", error);
        setStatus(careStatus, `Не удалось сохранить настройку: ${error.message}`, true);
      }
    });
  }
  journalDate.value = dateToday();
  renderCitizenObservations();
  updateAccountAccess();
  window.addEventListener("flora:account-state", (event) => {
    accountUser = event.detail?.user || null;
    client = event.detail?.client || window.floraGetSupabaseClient?.() || null;
    updateAccountAccess();
    refreshCareCollectionOptions();
    void refreshPushState();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === JOURNAL_KEY) void renderJournal();
    if (event.key === CARE_KEY) renderCare();
    if (event.key === "flora-collection") refreshCareCollectionOptions();
    if (event.key === FIELD_OBSERVATIONS_KEY) renderCitizenObservations();
  });
  window.addEventListener("flora:local-data-change", (event) => {
    if (event.detail?.key === CARE_KEY) renderCare();
    if (event.detail?.key === "flora-collection") refreshCareCollectionOptions();
    if (event.detail?.key === FIELD_OBSERVATIONS_KEY) renderCitizenObservations();
  });
  window.addEventListener("flora:plant-saved", refreshCareCollectionOptions);
  window.addEventListener("flora:page-change", (event) => {
    if (event.detail?.page === "garden") {
      void renderJournal();
      renderCare();
      void refreshPushState();
      if (fieldRouteMode) {
        window.setTimeout(() => document.querySelector("#garden-diagnosis")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    }
    if (event.detail?.page === "season") {
      renderCitizenObservations();
    }
  });

  const setFieldRouteMode = (enabled, message = "") => {
    fieldRouteMode = enabled;
    fieldRouteToggle?.setAttribute("aria-pressed", String(enabled));
    if (fieldRouteToggle) {
      fieldRouteToggle.textContent = enabled
        ? "Выключить режим полевого маршрута"
        : "Определить растение для полевого маршрута";
    }
    if (fieldRouteStatus) {
      fieldRouteStatus.hidden = !enabled;
      fieldRouteStatus.textContent = enabled
        ? message || "Режим маршрута включён. Загрузите фото растения из парка или леса, чтобы Silva рассмотрела хвойные и вечнозелёные признаки."
        : "";
    }
  };
  fieldRouteToggle?.addEventListener("click", () => {
    setFieldRouteMode(!fieldRouteMode);
  });
  window.addEventListener("flora:winter-field-route-start", () => {
    setFieldRouteMode(true, "Режим маршрута включён. Выберите фото реального растения в парке или лесу.");
  });
  diagnosisFile.addEventListener("change", () => {
    selectedDiagnosisFile = diagnosisFile.files?.[0] || null;
    saveDiagnosisButton.hidden = true;
    latestDiagnosis = "";
    diagnosisContext = "";
    resetPhotoChat();
    if (diagnosisObjectUrl) URL.revokeObjectURL(diagnosisObjectUrl);
    diagnosisObjectUrl = "";
    if (selectedDiagnosisFile) {
      if (!allowedTypes.has(selectedDiagnosisFile.type)) {
        if (photoChat) photoChat.hidden = true;
        if (diagnosisPlaceholder) diagnosisPlaceholder.hidden = false;
        diagnosisPreview.removeAttribute("src");
        if (diagnosisStage) diagnosisStage.hidden = true;
        renderDiagnosisMarkers([]);
        if (diagnosisFileLabel) diagnosisFileLabel.textContent = "Выбрать фото растения";
        setStatus(diagnosisStatus, "Поддерживаются только JPEG, PNG и WebP.", true);
        return;
      }
      diagnosisObjectUrl = URL.createObjectURL(selectedDiagnosisFile);
      diagnosisPreview.src = diagnosisObjectUrl;
      if (diagnosisStage) diagnosisStage.hidden = false;
      renderDiagnosisMarkers([]);
      if (photoChat) photoChat.hidden = false;
      if (diagnosisPlaceholder) diagnosisPlaceholder.hidden = true;
      if (diagnosisFileLabel) diagnosisFileLabel.textContent = selectedDiagnosisFile.name;
      setStatus(diagnosisStatus, "Фото выбрано. Оно будет отправлено на анализ, но не сохранится автоматически.");
    } else {
      diagnosisPreview.removeAttribute("src");
      if (diagnosisStage) diagnosisStage.hidden = true;
      renderDiagnosisMarkers([]);
      if (diagnosisPlaceholder) diagnosisPlaceholder.hidden = false;
      if (diagnosisFileLabel) diagnosisFileLabel.textContent = "Выбрать фото растения";
      setStatus(diagnosisStatus, "");
    }
  });
  photoChatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = photoChatInput.value.trim();
    if (!selectedDiagnosisFile) {
      setStatus(diagnosisStatus, "Сначала выберите фото растения.", true);
      return;
    }
    if (!window.FLORA_AI_ENDPOINT) {
      setStatus(diagnosisStatus, "Сервис фото-помощника пока не настроен.", true);
      return;
    }
    const locale = window.FLORA_LOCALE || "ru";
    const isInitialRequest = diagnosisHistory.length === 0;
    const message = question || (isInitialRequest
      ? fieldRouteMode
        ? locale === "uk"
          ? "Визнач хвойну або вічнозелену рослину за видимими морфологічними ознаками. Зверни увагу на форму й розташування хвої або листя, гілки, кору та шишки. Назви ймовірний вид лише тоді, коли це можна визначити за фото."
          : locale === "en"
            ? "Identify the conifer or evergreen plant from visible features. Consider the shape and arrangement of its needles or leaves, branches, bark, and cones. Name a likely species only if the photo supports it."
            : "Определи хвойное или вечнозелёное растение по видимым морфологическим признакам. Рассмотри форму и расположение хвои или листьев, ветви, кору и шишки. Назови вероятный вид только если это видно на фото."
        : locale === "uk"
          ? "Будь ласка, подивись на цю рослину."
          : locale === "en"
            ? "Please take a look at this plant."
            : "Посмотри, пожалуйста, это растение."
      : "");
    if (!message) return;
    photoChatInput.disabled = true;
    photoChatSend.disabled = true;
    diagnosisFile.disabled = true;
    let responseMessage;
    try {
      const image = await fileToCompressedImage(selectedDiagnosisFile);
      appendPhotoChatMessage("user", message);
      responseMessage = appendPhotoChatMessage("assistant", "Смотрю на фото и готовлю ответ…", { pending: true });
      const response = await fetch(`${window.FLORA_AI_ENDPOINT}/api/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          image: { mimeType: image.type, data: await blobToBase64(image) },
          question: message,
          analysis: diagnosisContext,
          history: diagnosisHistory.slice(-8),
          fieldIdentification: fieldRouteMode,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Сервис вернул ошибку ${response.status}.`);
      if (result.stored !== false || typeof result.reply !== "string" || !result.reply.trim()) {
        throw new Error("Сервис вернул некорректный ответ.");
      }
      responseMessage.textContent = result.reply.trim();
      responseMessage.parentElement.classList.remove("is-pending");
      if (Array.isArray(result.markers) && (isInitialRequest || result.markers.length)) {
        renderDiagnosisMarkers(result.markers);
      }
      diagnosisHistory.push({ role: "user", content: message }, { role: "assistant", content: result.reply.trim() });
      diagnosisHistory = diagnosisHistory.slice(-8);
      latestDiagnosis = result.reply.trim();
      saveDiagnosisButton.hidden = !accountUser;
      if (fieldRouteMode) {
        renderFieldIdentification(result.identification, !Object.hasOwn(result, "identification"));
      }
      if (isInitialRequest) {
        diagnosisContext = latestDiagnosis;
      }
    } catch (error) {
      console.error("Не удалось отправить вопрос по фото.", error);
      if (responseMessage) {
        responseMessage.textContent = error.message || "Не удалось получить ответ. Попробуйте ещё раз.";
        responseMessage.parentElement.classList.remove("is-pending");
        responseMessage.parentElement.classList.add("is-error");
      } else {
        setStatus(diagnosisStatus, error.message || "Не удалось подготовить фото.", true);
      }
    } finally {
      photoChatInput.disabled = false;
      photoChatSend.disabled = false;
      diagnosisFile.disabled = false;
      photoChatInput.value = "";
      photoChatInput.focus();
    }
  });
  saveDiagnosisButton.addEventListener("click", () => {
    if (!accountUser || !latestDiagnosis) {
      requestAccount();
      return;
    }
    journalPlant.value = journalPlant.value || "Растение по фото";
    journalNote.value = latestDiagnosis;
    journalDate.value = dateToday();
    journalForm.scrollIntoView({ behavior: "smooth", block: "center" });
    journalPlant.focus();
  });
  journalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!accountUser) {
      setStatus(journalStatus, "Войдите в аккаунт Silva Quieta, чтобы сохранить запись. Заполненные поля останутся на месте.");
      requestAccount();
      return;
    }
    if (!client) {
      setStatus(journalStatus, "Не удалось подключиться к облаку. Обновите страницу и попробуйте снова.", true);
      requestAccount();
      return;
    }
    const plant = journalPlant.value.trim();
    const note = journalNote.value.trim();
    const date = journalDate.value;
    const photo = journalPhoto.files?.[0];
    if (!plant || !note || !parseDate(date)) {
      setStatus(journalStatus, "Укажите растение, дату и описание наблюдения.", true);
      return;
    }
    const submit = document.querySelector("#garden-journal-submit");
    submit.disabled = true;
    setStatus(journalStatus, "Сохраняем запись…");
    let uploadedPath = "";
    try {
      const entryId = crypto.randomUUID();
      if (photo) {
        const compressed = await fileToCompressedImage(photo);
        uploadedPath = `${accountUser.id}/${entryId}.jpg`;
        const { error } = await client.storage.from("flora-journal").upload(uploadedPath, compressed, {
          contentType: compressed.type,
          upsert: false,
        });
        if (error) throw error;
      }
      const entries = readArray(JOURNAL_KEY);
      entries.push({ id: entryId, plant, date, note, photoPath: uploadedPath || undefined });
      const expired = entries.slice(0, Math.max(0, entries.length - 100));
      const expiredPhotos = expired.map((entry) => entry.photoPath).filter((path) => typeof path === "string" && path);
      writeArray(JOURNAL_KEY, entries.slice(-100));
      if (expiredPhotos.length) {
        const { error } = await client.storage.from("flora-journal").remove(expiredPhotos);
        if (error) {
          console.error("Не удалось удалить фотографии старых записей дневника.", error);
          setStatus(journalStatus, "Запись сохранена, но не удалось очистить фото старых записей.", true);
        }
      }
      journalForm.reset();
      journalDate.value = dateToday();
      if (!expiredPhotos.length) setStatus(journalStatus, "Запись сохранена в дневнике аккаунта.");
      await renderJournal();
    } catch (error) {
      if (uploadedPath) {
        const { error: cleanupError } = await client.storage.from("flora-journal").remove([uploadedPath]);
        if (cleanupError) console.error("Не удалось очистить фото после ошибки записи дневника.", cleanupError);
      }
      console.error("Не удалось сохранить запись дневника.", error);
      setStatus(journalStatus, `Не удалось сохранить запись: ${error.message}`, true);
    } finally {
      submit.disabled = false;
    }
  });
  const addCarePlan = () => {
    const name = carePlant.value.trim();
    const location = careLocation.value.trim();
    const note = careNote.value.trim();
    const intervalDays = Number(careInterval.value);
    const catalogId = carePlant.dataset.catalogName === name ? carePlant.dataset.catalogId : "";
    if (!name || !Number.isInteger(intervalDays) || intervalDays < 1 || intervalDays > 90) {
      setStatus(careStatus, "Введите название растения и интервал от 1 до 90 дней.", true);
      return;
    }
    const plans = readArray(CARE_KEY);
    if (catalogId && plans.some((plan) => plan.catalogId === catalogId)) {
      careImportStatus.textContent = messages.collectionDone;
      return;
    }
    plans.push({
      id: catalogId ? `catalog-${catalogId}` : crypto.randomUUID(),
      ...(catalogId ? { catalogId } : {}),
      name,
      location,
      note,
      intervalDays,
      createdAt: dateToday(),
      lastWatered: dateToday(),
      wateringHistory: [],
      wateringCount: 0,
    });
    try {
      writeArray(CARE_KEY, plans.slice(-100));
      careForm.reset();
      delete carePlant.dataset.catalogId;
      delete carePlant.dataset.catalogName;
      careInterval.value = "7";
      setStatus(careStatus, accountUser
        ? "Профиль растения добавлен и синхронизируется с аккаунтом."
        : "Профиль сохранён на этом устройстве. Войдите в аккаунт, чтобы синхронизировать его.");
    } catch (error) {
      console.error("Не удалось сохранить профиль ухода.", error);
      setStatus(careStatus, `Не удалось сохранить профиль: ${error.message}`, true);
    }
  };
  careImportButton?.addEventListener("click", () => {
    const plant = window.floraGetPlantById?.(careCollectionPlant.value);
    if (!plant) {
      careImportStatus.textContent = messages.importMissing;
      return;
    }
    carePlant.value = plant.name;
    carePlant.dataset.catalogId = plant.id;
    carePlant.dataset.catalogName = plant.name;
    careInterval.value = "7";
    careImportStatus.textContent = messages.importAdded;
    carePlant.focus();
  });
  careCollectionPlant?.addEventListener("change", () => {
    careImportStatus.textContent = locale === "en"
      ? "The atlas guidance will appear in the plant's care card."
      : locale === "uk"
        ? "Поради атласу з’являться в картці догляду рослини."
        : "Подсказки атласа появятся в карточке ухода за растением.";
  });
  let pendingWinterCarePlan = null;
  careForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isHeatingSeason = [10, 11, 0, 1, 2].includes(new Date().getMonth());
    const isDormantPlant = /кактус|cact|суккулент|succulent|aloe|алоэ|эхевер|echeveria|каланхоэ|kalanchoe|крассул|crassula|хаворт|haworth|опунц|opuntia|маммил|mammillaria|эхинопс|echinopsis|гимнокалиц|gymnocalycium|астрофит|astrophytum|седум|sedum|семпервив|sempervivum|эониум|aeonium|гастер|gasteria|сенец|senecio/iu.test(carePlant.value);
    const plan = {
      name: carePlant.value.trim(),
      location: careLocation.value.trim(),
      note: careNote.value.trim(),
      intervalDays: Number(careInterval.value),
    };
    if (!plan.name || !Number.isInteger(plan.intervalDays) || plan.intervalDays < 1 || plan.intervalDays > 90) {
      setStatus(careStatus, "Введите название растения и интервал от 1 до 90 дней.", true);
      return;
    }
    if (isHeatingSeason && isDormantPlant) {
      pendingWinterCarePlan = plan;
      winterCareConfirmMessage.textContent = `Для «${plan.name}» зимой может наступать период покоя: некоторым видам нужно меньше воды, но это зависит от вида, температуры и освещения. Вы уверены, что хотите сохранить интервал ${plan.intervalDays} дней?`;
      winterCareConfirm.hidden = false;
      return;
    }
    pendingWinterCarePlan = null;
    winterCareConfirm.hidden = true;
    addCarePlan();
  });
  winterCareKeep?.addEventListener("click", () => {
    if (!pendingWinterCarePlan) return;
    const currentPlan = {
      name: carePlant.value.trim(),
      location: careLocation.value.trim(),
      note: careNote.value.trim(),
      intervalDays: Number(careInterval.value),
    };
    if (Object.keys(currentPlan).some((key) => currentPlan[key] !== pendingWinterCarePlan[key])) {
      pendingWinterCarePlan = null;
      winterCareConfirm.hidden = true;
      setStatus(careStatus, "Данные изменились. Проверьте растение и интервал, затем сохраните план ещё раз.", true);
      return;
    }
    pendingWinterCarePlan = null;
    winterCareConfirm.hidden = true;
    addCarePlan();
  });
  winterCareReview?.addEventListener("click", () => {
    pendingWinterCarePlan = null;
    winterCareConfirm.hidden = true;
    careInterval.focus();
  });

  const decodeBase64Url = (value) => {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  };
  const refreshPushState = async () => {
    if (!accountUser || !client || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      let linked = false;
      if (subscription) {
        const { data, error } = await client.from("push_subscriptions")
          .select("endpoint")
          .eq("user_id", accountUser.id)
          .eq("endpoint", subscription.endpoint)
          .maybeSingle();
        if (error) throw error;
        linked = Boolean(data);
      }
      pushDisable.hidden = !linked;
      pushEnable.hidden = linked;
      pushStatus.textContent = linked
        ? "Push-уведомления включены для этого аккаунта на устройстве."
        : "Push-уведомления для этого аккаунта выключены.";
    } catch (error) {
      console.error("Не удалось проверить настройки push-уведомлений.", error);
      setStatus(pushStatus, `Не удалось проверить уведомления: ${error.message}`, true);
    }
  };
  pushEnable.addEventListener("click", async () => {
    if (!accountUser || !client) {
      requestAccount();
      return;
    }
    const vapidPublicKey = window.FLORA_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      setStatus(pushStatus, "Push пока не настроены владельцем сайта: отсутствует публичный VAPID-ключ.", true);
      return;
    }
    pushEnable.disabled = true;
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        throw new Error("Этот браузер не поддерживает push-уведомления.");
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Разрешите уведомления в настройках браузера.");
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeBase64Url(vapidPublicKey),
      });
      const json = subscription.toJSON();
      const keys = json.keys;
      if (!subscription.endpoint || !keys?.p256dh || !keys.auth) {
        await subscription.unsubscribe();
        throw new Error("Браузер не вернул данные push-подписки.");
      }
      const { error } = await client.from("push_subscriptions").upsert({
        endpoint: subscription.endpoint,
        user_id: accountUser.id,
        p256dh: keys.p256dh,
        auth: keys.auth,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,endpoint" });
      if (error) throw error;
      setStatus(pushStatus, "Уведомления включены. Напоминания будут приходить для записанных растений.");
      await refreshPushState();
    } catch (error) {
      console.error("Не удалось включить push-уведомления.", error);
      setStatus(pushStatus, error.message || "Не удалось включить уведомления.", true);
    } finally {
      pushEnable.disabled = false;
    }
  });
  pushDisable.addEventListener("click", async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription && client) {
        const { error } = await client.from("push_subscriptions").delete()
          .eq("user_id", accountUser.id)
          .eq("endpoint", subscription.endpoint);
        if (error) throw error;
      }
      setStatus(pushStatus, "Напоминания отключены для этого аккаунта.");
      await refreshPushState();
    } catch (error) {
      console.error("Не удалось отключить push-уведомления.", error);
      setStatus(pushStatus, `Не удалось отключить уведомления: ${error.message}`, true);
    }
  });
})();
