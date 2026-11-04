(() => {
  const locale = window.FLORA_LOCALE;
  const localeUrls = {
    ru: "https://silvaquieta.com/",
    uk: "https://silvaquieta.com/?locale=uk",
    en: "https://silvaquieta.com/?locale=en",
  };
  for (const language of ["ru", "uk", "en"]) {
    let alternate = document.querySelector(`link[rel="alternate"][hreflang="${language}"]`);
    if (!alternate) {
      alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = language;
      document.head.append(alternate);
    }
    alternate.href = localeUrls[language];
  }
  let defaultAlternate = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
  if (!defaultAlternate) {
    defaultAlternate = document.createElement("link");
    defaultAlternate.rel = "alternate";
    defaultAlternate.hreflang = "x-default";
    document.head.append(defaultAlternate);
  }
  defaultAlternate.href = localeUrls.ru;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = localeUrls[locale];
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = localeUrls[locale];

  const localeSelect = document.querySelector("#locale-select");
  if (localeSelect) {
    localeSelect.value = locale;
    const labels = { ru: "Сменить язык", uk: "Змінити мову", en: "Change language" };
    localeSelect.setAttribute("aria-label", labels[locale]);
    localeSelect.title = labels[locale];
    localeSelect.addEventListener("change", () => {
      const selectedLocale = localeSelect.value;
      if (!["ru", "uk", "en"].includes(selectedLocale) || selectedLocale === locale) return;
      try {
        localStorage.setItem("silva-locale-preference", selectedLocale);
      } catch (error) {
        console.error("Could not save the selected language.", error);
      }
      const target = new URL(location.href);
      target.searchParams.set("locale", selectedLocale);
      location.assign(target.href);
    });
  }

  const visitorLabels = {
    ru: { yesterday: "вчера", online: "сейчас", note: "Случайный ID; IP-адреса не сохраняются", label: "Анонимная статистика посетителей" },
    uk: { yesterday: "учора", online: "зараз", note: "Випадковий ID; IP-адреси не зберігаються", label: "Анонімна статистика відвідувачів" },
    en: { yesterday: "yesterday", online: "online now", note: "Random ID; IP addresses are not stored", label: "Anonymous visitor statistics" },
  }[locale];
  const yesterdayLabel = document.querySelector("#visitor-yesterday-label");
  const onlineLabel = document.querySelector("#visitor-online-label");
  const visitorsNote = document.querySelector("#visitors-note");
  if (yesterdayLabel) yesterdayLabel.textContent = visitorLabels.yesterday;
  if (onlineLabel) onlineLabel.textContent = visitorLabels.online;
  if (visitorsNote) visitorsNote.textContent = visitorLabels.note;
  document.querySelector(".visitor-fact")?.setAttribute("aria-label", visitorLabels.label);

  if (locale === "ru") {
    return;
  }

  const applyTranslations = (translations) => {
    const overrides = locale === "en"
      ? {
          "Расти": "Grow",
          "в своём": "at your own",
          "ритме": "pace",
          "Найти тайную шишку": "Find the hidden pinecone",
          "Найти тайную шишку в приветствии Silva": "Find the hidden pinecone in Silva's greeting",
          "Найти тайную шишку в зимнем лесу": "Find the hidden pinecone in the winter forest",
          "Найти тайную шишку в атласе": "Find the hidden pinecone in the atlas",
          "Создать аккаунт или войти": "Create an account or sign in",
          "Включить светлое оформление": "Switch to light theme",
          "Подробнее": "Details",
          "Атлас растений": "Plant Atlas",
          "Прогресс ухода за сегодня": "Today's care progress",
          "Добавить растение из моей коллекции": "Add a plant from my collection",
          "Выберите растение…": "Choose a plant…",
          "Подставить данные": "Use plant details",
          "Подсказки по уходу берутся из карточки вида. Интервал — частота проверки почвы, а не график полива.": "Care guidance comes from the plant profile. The interval is for checking soil, not a watering schedule.",
          "Выберите, как часто проверять почву, и отдельно отмечайте полив. Напоминание — повод проверить грунт, а не призыв поливать вслепую.": "Choose how often to check the soil, and record watering separately. A reminder is a reason to check the soil, not an instruction to water blindly.",
          "Когда сад засыпает,": "When the garden falls asleep,",
          "открытия продолжаются": "discoveries continue.",
          "Светолюбивое": "Sun-loving",
          "Полутень": "Partial shade",
          "Теневыносливое": "Shade-tolerant",
          "Влаголюбивое": "Moisture-loving",
          "Умеренный полив": "Moderate watering",
          "Редкий полив": "Infrequent watering",
          "Частый полив": "Frequent watering",
          "Семейство": "Family",
          "Условия ухода": "Care guide",
          "О растении": "About the plant",
          "Где растёт": "Where it grows",
          "Твоё тихое пространство среди зелёного леса. Исследуй мир растений в своём ритме — находи новые виды, собирай любимые и создавай свой сад.": "A quiet place among the greenery. Explore the world of plants at your own pace — discover new species, collect your favorites, and create your own garden.",
          "Средняя": "Central",
          "Азия": "Asia",
          "Африка": "Africa",
          "Дальний Восток России": "Russian Far East",
          "Океания": "Oceania",
          "Острова Атлантики": "Atlantic Islands",
          "Папуасия": "Papuasia",
          "Северная Африка": "North Africa",
          "Субантарктические острова": "Subantarctic Islands",
          "Центральная Африка": "Central Africa",
          "Фотография растения:": "Plant photo:",
          "Фотография растений:": "Plant photo:",
          "Фото растения:": "Plant photo:",
          "Фото:": "Photo:",
          "Скачать карточку ухода (PDF)": "Download care guide (PDF)",
          "Заметки": "Notes",
          "Заметки · мои наблюдения": "Notes · my observations",
          "Мои наблюдения": "My observations",
          "Запишите наблюдения об этом растении…": "Record observations about this plant…",
          "Заметка сохранена на этом устройстве.": "Note saved on this device.",
          "Заметка останется только в этом браузере.": "This note stays in this browser only.",
          "Сохранить заметку": "Save note",
          "Закрыть": "Close",
          "Таксономия и источники": "Taxonomy and sources",
          "Класс:": "Class:",
          "Отряд:": "Order:",
          "Проверить вид в GBIF ↗": "Check species on GBIF ↗",
          "Похожие растения": "Similar plants",
          "В коллекцию": "Add to collection",
          "В коллекции": "In collection",
          "Ваше случайное растение": "Your random plant",
          "Случайное растение": "Random plant",
          "Открыть ботаническую карточку": "Open plant profile",
        }
      : {
          "Расти": "Рости",
          "в своём": "у своєму",
          "ритме": "ритмі",
          "Найти тайную шишку": "Знайти заховану шишку",
          "Найти тайную шишку в приветствии Silva": "Знайти заховану шишку у привітанні Silva",
          "Найти тайную шишку в зимнем лесу": "Знайти заховану шишку в зимовому лісі",
          "Найти тайную шишку в атласе": "Знайти заховану шишку в атласі",
          "Создать аккаунт или войти": "Створити обліковий запис або увійти",
          "Включить светлое оформление": "Увімкнути світлу тему",
          "Подробнее": "Детальніше",
          "Атлас растений": "Атлас рослин",
          "Прогресс ухода за сегодня": "Прогрес догляду за сьогодні",
          "Добавить растение из моей коллекции": "Додати рослину з моєї колекції",
          "Выберите растение…": "Виберіть рослину…",
          "Подставить данные": "Підставити дані рослини",
          "Подсказки по уходу берутся из карточки вида. Интервал — частота проверки почвы, а не график полива.": "Поради щодо догляду беруться з картки виду. Інтервал — це частота перевірки ґрунту, а не графік поливу.",
          "Выберите, как часто проверять почву, и отдельно отмечайте полив. Напоминание — повод проверить грунт, а не призыв поливать вслепую.": "Оберіть, як часто перевіряти ґрунт, а полив позначайте окремо. Нагадування — це привід перевірити ґрунт, а не заклик поливати навмання.",
          "Когда сад засыпает,": "Коли сад засинає,",
          "открытия продолжаются": "відкриття тривають.",
          "Светолюбивое": "Світлолюбне",
          "Полутень": "Напівтінь",
          "Теневыносливое": "Тіньовитривале",
          "Влаголюбивое": "Вологолюбне",
          "Умеренный полив": "Помірний полив",
          "Редкий полив": "Рідкий полив",
          "Частый полив": "Частий полив",
          "Семейство": "Родина",
          "Условия ухода": "Умови догляду",
          "О растении": "Про рослину",
          "Где растёт": "Де росте",
          "Твоё тихое пространство среди зелёного леса. Исследуй мир растений в своём ритме — находи новые виды, собирай любимые и создавай свой сад.": "Твій затишний простір серед зеленого лісу. Досліджуй світ рослин у власному темпі — знаходь нові види, збирай улюблені й створюй власний сад.",
          "Средняя": "Середня",
          "Азия": "Азія",
          "Африка": "Африка",
          "Дальний Восток России": "Далекий Схід Росії",
          "Океания": "Океанія",
          "Острова Атлантики": "Острови Атлантики",
          "Папуасия": "Папуасія",
          "Северная Африка": "Північна Африка",
          "Субантарктические острова": "Субантарктичні острови",
          "Центральная Африка": "Центральна Африка",
          "Фотография растения:": "Фото рослини:",
          "Фотография растений:": "Фото рослин:",
          "Фото растения:": "Фото рослини:",
          "Фото:": "Фото:",
          "Скачать карточку ухода (PDF)": "Завантажити пам’ятку з догляду (PDF)",
          "Заметки": "Нотатки",
          "Заметки · мои наблюдения": "Нотатки · мої спостереження",
          "Мои наблюдения": "Мої спостереження",
          "Запишите наблюдения об этом растении…": "Запишіть спостереження про цю рослину…",
          "Заметка сохранена на этом устройстве.": "Нотатку збережено на цьому пристрої.",
          "Заметка останется только в этом браузере.": "Ця нотатка залишиться лише в цьому браузері.",
          "Сохранить заметку": "Зберегти нотатку",
          "Закрыть": "Закрити",
          "Таксономия и источники": "Таксономія та джерела",
          "Класс:": "Клас:",
          "Отряд:": "Порядок:",
          "Проверить вид в GBIF ↗": "Перевірити вид на GBIF ↗",
          "Похожие растения": "Схожі рослини",
          "В коллекцию": "До колекції",
          "В коллекции": "У колекції",
          "Ваше случайное растение": "Випадкова рослина для вас",
          "Случайное растение": "Випадкова рослина",
          "Открыть ботаническую карточку": "Відкрити картку рослини",
        };
    Object.assign(translations, overrides);
    const entries = Object.entries(translations).sort((left, right) => right[0].length - left[0].length);
    const phraseTranslations = new Map();
    const phrases = [];
    for (const [phrase, translation] of entries) {
      const normalizedPhrase = phrase.toLocaleLowerCase("ru");
      if (phraseTranslations.has(normalizedPhrase)) continue;
      phraseTranslations.set(normalizedPhrase, translation);
      if (phrase.length < 3) continue;
      phrases.push(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    }
    const phrasePattern = new RegExp(
      `(?<![\\p{L}\\p{N}])(?:${phrases.join("|")})(?![\\p{L}\\p{N}])`,
      "giu"
    );
    const translatedTextNodes = new WeakMap();
    const translate = (value) => {
      const source = value.trim().replace(/\s+/g, " ");
      const relicNames = {
        "Лесной фонарик": { uk: "Лісовий ліхтарик", en: "Forest lantern" },
        "Снежинка-гербарий": { uk: "Сніжинка-гербарій", en: "Herbarium snowflake" },
        "Звезда календаря": { uk: "Зірка календаря", en: "Calendar star" },
        "Звёздное семечко": { uk: "Зоряне зернятко", en: "Starry seed" },
        "Ледяной колокольчик": { uk: "Крижаний дзвіночок", en: "Icy bell" },
        "Праздничный жетон": { uk: "Святковий жетон", en: "Festive token" },
        "Секрет снеговика": { uk: "Секрет сніговика", en: "Snowman secret" },
        "зимняя находка": { uk: "зимова знахідка", en: "winter find" },
      };
      const translateRelic = (name) => relicNames[name]?.[locale] || name;
      const secretCountWord = (count, singular, paucal, plural) => {
        if (locale === "en") return count === 1 ? singular : plural;
        const lastTwoDigits = count % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return plural;
        const lastDigit = count % 10;
        if (lastDigit === 1) return singular;
        return lastDigit >= 2 && lastDigit <= 4 ? paucal : plural;
      };
      if (locale !== "ru") {
        const winterFind = source.match(/^Найдено: (.+)\. Осталось (\d+) секретов\.$/);
        if (winterFind) {
          const [, name, rawCount] = winterFind;
          const count = Number(rawCount);
          return locale === "en"
            ? `Found: ${translateRelic(name)}. ${count} ${secretCountWord(count, "secret", "secrets", "secrets")} left.`
            : `Знайдено: ${translateRelic(name)}. Залишилося ${count} ${secretCountWord(count, "секрет", "секрети", "секретів")}.`;
        }
        const pineconeFind = source.match(/^Тайная шишка найдена! Осталось найти (\d+)\.$/);
        if (pineconeFind) {
          const count = Number(pineconeFind[1]);
          return locale === "en"
            ? `Secret pinecone found! ${count} ${secretCountWord(count, "pinecone", "pinecones", "pinecones")} left.`
            : `Таємну шишку знайдено! Залишилося знайти ${count} ${secretCountWord(count, "шишку", "шишки", "шишок")}.`;
        }
        if (source === "Все семь шишек найдены! В саду вас ждёт зимний набор садовода.") {
          return locale === "en"
            ? "All seven secret pinecones found! A winter gardening kit is waiting for you in My Garden."
            : "Усі сім таємних шишок знайдено! У саду на вас чекає зимовий набір садівника.";
        }
        if (source === "Все семь секретов найдены! Открыта тайная открытка Silva и получено 100 очков.") {
          return locale === "en"
            ? "All seven secrets found! Silva’s secret postcard is unlocked, and you earned 100 points."
            : "Усі сім секретів знайдено! Таємну листівку Silva відкрито, ви отримали 100 балів.";
        }
        if (source === "Сюрприз! Открылась карта тайных троп — осталось найти два секрета.") {
          return locale === "en"
            ? "Surprise! The secret trail map is unlocked — two secrets left."
            : "Сюрприз! Відкрито мапу таємних стежок — залишилося знайти два секрети.";
        }
        if (source === "Ты нашёл искру леса! Первый секретный подарок открыт.") {
          return locale === "en"
            ? "You found a spark in the forest! Your first secret gift is unlocked."
            : "Ти знайшов іскру лісу! Перший таємний подарунок відкрито.";
        }
        const completedTask = source.match(/^Задание «(.+)» выполнено! Вы получили (\d+) очков\.$/);
        if (completedTask) {
          const [, name, points] = completedTask;
          const taskNames = {
            "Знакомство с растениями": { uk: "Знайомство з рослинами", en: "Getting to know plants" },
            "Личная коллекция": { uk: "Особиста колекція", en: "Personal collection" },
            "Забота о саде": { uk: "Турбота про сад", en: "Garden care" },
            "Наблюдатель природы": { uk: "Спостерігач природи", en: "Nature observer" },
            "Растительный знаток": { uk: "Знавець рослин", en: "Plant expert" },
          };
          return locale === "en"
            ? `Task “${taskNames[name]?.en || name}” completed! You earned ${points} points.`
            : `Завдання «${taskNames[name]?.uk || name}» виконано! Ви отримали ${points} балів.`;
        }
        if (source === "Маршрут завершён! Три полевых наблюдения сохранены. Вы получили 250 очков и звание «Хранитель полевого маршрута».") {
          return locale === "en"
            ? "Route complete! Three field observations have been saved. You earned 250 points and the Field Route Keeper title."
            : "Маршрут завершено! Три польові спостереження збережено. Ви отримали 250 балів і звання «Охоронець польового маршруту».";
        }
        if (source === "Квест обновился: прежний прогресс сохранён в архиве, а шишки теперь спрятаны по всему сайту. Начинайте новую охоту!") {
          return locale === "en"
            ? "The quest has been updated: your previous progress is archived, and pinecones are now hidden throughout the site. Start a new hunt!"
            : "Квест оновлено: попередній прогрес збережено в архіві, а шишки тепер заховані по всьому сайту. Починайте нове полювання!";
        }
        const wateringMarked = source.match(/^Полив (.+) отмечен на сегодня\.$/);
        if (wateringMarked) {
          return locale === "en"
            ? `Watering for ${wateringMarked[1]} marked for today.`
            : `Полив ${wateringMarked[1]} позначено на сьогодні.`;
        }
        const observationChanged = source.match(/^(.+) (добавлено|убрано) за выбранный месяц\.$/);
        if (observationChanged) {
          return locale === "en"
            ? `${observationChanged[1]} ${observationChanged[2] === "добавлено" ? "added" : "removed"} for the selected month.`
            : `${observationChanged[1]} ${observationChanged[2] === "добавлено" ? "додано" : "прибрано"} за вибраний місяць.`;
        }
        const savedPlant = source.match(/^«(.+)» (добавлено в коллекцию|убрано из коллекции)\.$/);
        if (savedPlant) {
          return locale === "en"
            ? `“${savedPlant[1]}” ${savedPlant[2] === "добавлено в коллекцию" ? "added to" : "removed from"} your collection.`
            : `«${savedPlant[1]}» ${savedPlant[2] === "добавлено в коллекцию" ? "додано до" : "прибрано з"} вашої колекції.`;
        }
      }
      const distributionNote = source.match(/^Данные указаны для группы (.+); ареал конкретного вида может отличаться\.$/);
      if (distributionNote) {
        const group = distributionNote[1].replace(/^рода /, locale === "en" ? "genus " : "роду ").replace(/^семейства /, locale === "en" ? "family " : "родини ");
        return locale === "en"
          ? `Range shown for the ${group}; the range may differ by species.`
          : `Ареал наведено для групи ${group}; він може відрізнятися залежно від виду.`;
      }
      const careHint = source.match(/^(.+?)\. Ориентир: (.+?); (.+)\.$/);
      if (careHint) {
        const prefix = (translations[careHint[1]] || careHint[1]).replace(/[.!?…]+$/, "");
        const groupBasis = careHint[2].match(/^групп[ауы]\s*[«"“](.+?)[»"”]$/i);
        const familyBasis = careHint[2].match(/^семейств[ао]\s+(.+)$/i);
        const genusBasis = careHint[2].match(/^род\s+(.+)$/i);
        const note = /проверяйте влажность грунта/i.test(careHint[3])
          ? locale === "en" ? "Check soil moisture and the plant's specific needs." : "Перевіряйте вологість ґрунту та потреби рослини."
          : locale === "en" ? "Exact conditions depend on the species and growing location." : "Точні умови залежать від виду та місця вирощування.";
        if (groupBasis) {
          const group = translate(groupBasis[1]);
          return locale === "en"
            ? `${prefix}. Guideline for the ${group} group. ${note}`
            : `${prefix}. Орієнтир для групи «${group}». ${note}`;
        }
        if (familyBasis) {
          return locale === "en"
            ? `${prefix}. Guideline for the ${familyBasis[1]} family. ${note}`
            : `${prefix}. Орієнтир для родини ${familyBasis[1]}. ${note}`;
        }
        if (genusBasis) {
          return locale === "en"
            ? `${prefix}. Guideline for the genus ${genusBasis[1]}. ${note}`
            : `${prefix}. Орієнтир для роду ${genusBasis[1]}. ${note}`;
        }
        const basis = careHint[2].replace(/^род /, locale === "en" ? "genus " : "роду ").replace(/^семейство /, locale === "en" ? "family " : "родини ");
        return locale === "en"
          ? `${prefix}. Guideline for the ${basis}. ${note}`
          : `${prefix}. Орієнтир для групи ${basis}. ${note}`;
      }
      const restoredConnection = source.match(/^Связь восстановлена\.\s*(.+?)\s+загружены\.$/i);
      if (restoredConnection) {
        const label = translate(restoredConnection[1]);
        return locale === "en"
          ? `Connection restored. ${label} loaded.`
          : `Зв’язок відновлено. Завантажено: ${label}.`;
      }
      const personalNote = source.match(/^Личная заметка о растении (.+)$/);
      if (personalNote) {
        return locale === "en"
          ? `Personal note about ${personalNote[1]}`
          : `Особиста нотатка про рослину ${personalNote[1]}`;
      }
      const target = translations[source] || phraseTranslations.get(source.toLocaleLowerCase("ru"));
      if (target) {
        const leading = value.match(/^\s*/)?.[0] || "";
        const trailing = value.match(/\s*$/)?.[0] || "";
        return `${leading}${target}${trailing}`;
      }
      const count = value.match(/^Показано\s+(\d+)[–-](\d+)\s+из\s+([\d\s,]+)\s+растений(.*)$/i);
      if (count) {
        const [rangeStart, rangeEnd, total] = count.slice(1, 4).map((part) => part.trim());
        const filtered = /фильтр ухода/i.test(count[4]);
        return locale === "en"
          ? `Showing ${rangeStart}–${rangeEnd} of ${total} plants${filtered ? " · care filter" : ""}`
          : `Показано ${rangeStart}–${rangeEnd} із ${total} рослин${filtered ? " · фільтр догляду" : ""}`;
      }
      return value.replace(phrasePattern, (match) => {
        const translation = phraseTranslations.get(match.toLocaleLowerCase("ru"));
        if (!translation) return match;
        if (match === match.toLocaleLowerCase("ru")) return translation.toLocaleLowerCase(locale);
        if (match === match.toLocaleUpperCase("ru")) return translation.toLocaleUpperCase(locale);
        if (match[0] === match[0].toLocaleUpperCase("ru")) {
          return translation[0].toLocaleUpperCase(locale) + translation.slice(1);
        }
        return translation;
      });
    };
    window.floraTranslateText = translate;
    const applyToElement = (element) => {
      if (element.closest("script, style, noscript, code, .latin-name, [data-no-translate]")) return;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        if (node.nodeValue.trim() && translatedTextNodes.get(node) !== node.nodeValue) {
          const translated = translate(node.nodeValue);
          if (translated !== node.nodeValue) {
            translatedTextNodes.set(node, translated);
            node.nodeValue = translated;
          }
        }
        node = walker.nextNode();
      }
      const elements = [element, ...element.querySelectorAll("*")];
      for (const child of elements) {
        for (const attribute of ["aria-label", "aria-description", "title", "placeholder", "alt"]) {
          const value = child.getAttribute(attribute);
          if (value) {
            const translated = translate(value);
            if (translated !== value) child.setAttribute(attribute, translated);
          }
        }
      }
    };

    applyToElement(document.body);
    if (locale === "en") {
      const catalogTitle = document.querySelector("#page-catalog .page-title-row h1");
      const gradientText = catalogTitle?.querySelector(".gradient-text");
      if (catalogTitle && gradientText) {
        catalogTitle.firstChild.nodeValue = "Plant ";
        gradientText.textContent = "Atlas";
      }
    }
    const randomTitle = document.querySelector("#page-luck .page-title-row h1");
    const randomGradientText = randomTitle?.querySelector(".gradient-text");
    if (randomTitle && randomGradientText) {
      randomTitle.firstChild.nodeValue = locale === "en" ? "Random " : "Випадкова ";
      randomGradientText.textContent = locale === "en" ? "plant" : "рослина";
    }
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const parent = mutation.target.parentElement;
          if (parent) applyToElement(parent);
        } else if (mutation.type === "attributes" && mutation.target instanceof Element) {
          applyToElement(mutation.target);
        }
        for (const addedNode of mutation.addedNodes) {
          if (addedNode instanceof Element) applyToElement(addedNode);
          else if (addedNode instanceof Text && addedNode.parentElement) applyToElement(addedNode.parentElement);
        }
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "aria-description", "title", "placeholder", "alt"],
    });

    document.documentElement.lang = locale;
    document.title = translate(document.title);
    new MutationObserver(() => {
      const translated = translate(document.title);
      if (translated !== document.title) document.title = translated;
    }).observe(document.querySelector("title"), { childList: true, characterData: true, subtree: true });
    for (const meta of document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]')) {
      meta.content = translate(meta.content);
    }
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.content = locale === "uk" ? "uk_UA" : "en_US";
    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) manifest.href = `./manifest-${locale}.webmanifest.json?v=95`;
    for (const structuredData of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const data = JSON.parse(structuredData.textContent);
        if (data["@type"] === "WebSite") {
          data.inLanguage = locale;
          data.url = localeUrls[locale];
          data.description = translate(data.description);
          structuredData.textContent = JSON.stringify(data);
        }
      } catch (error) {
        console.error("Could not update localized structured data.", error);
      }
    }

  };

  fetch(`./localization/ui-${locale}.json?v=4`)
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load ${locale} interface translations: HTTP ${response.status}`);
      return response.json();
    })
    .then(applyTranslations)
    .catch((error) => console.error("Site localization could not be initialized.", error));
})();
