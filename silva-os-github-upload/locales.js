(() => {
  const LANGUAGE_STORAGE_KEY = "silva-os-language";
  const messages = {
    "Установленная оболочка для веб-приложений Silva.": {
      en: "An installed shell for Silva web apps.",
      uk: "Встановлена оболонка для вебзастосунків Silva.",
    },
    "Silva OS Terminal · локальная оболочка": {
      en: "Silva OS Terminal · local shell",
      uk: "Термінал Silva OS · локальна оболонка",
    },
    "Silva OS — спокойная цифровая среда для изучения растений и заботы о саде.": {
      en: "Silva OS — a calm digital space to explore plants and care for your garden.",
      uk: "Silva OS — спокійний цифровий простір для вивчення рослин і догляду за садом.",
    },
    "Silva OS — botanical workspace": {
      en: "Silva OS — botanical workspace",
      uk: "Silva OS — ботанічний простір",
    },
    "Вернуться на рабочий стол": { en: "Return to desktop", uk: "Повернутися на робочий стіл" },
    "На рабочий стол": { en: "Desktop", uk: "Робочий стіл" },
    "Рабочий стол": { en: "Desktop", uk: "Робочий стіл" },
    "Системное меню": { en: "System menu", uk: "Системне меню" },
    "Файл": { en: "File", uk: "Файл" },
    "Правка": { en: "Edit", uk: "Редагування" },
    "Окно": { en: "Window", uk: "Вікно" },
    "Приложения": { en: "Apps", uk: "Застосунки" },
    "Установить отдельно": { en: "Install app", uk: "Встановити окремо" },
    "Язык интерфейса": { en: "Interface language", uk: "Мова інтерфейсу" },
    "Текущее время": { en: "Current time", uk: "Поточний час" },
    "Переключить тему": { en: "Toggle theme", uk: "Змінити тему" },
    "Рабочий стол Silva OS": { en: "Silva OS desktop", uk: "Робочий стіл Silva OS" },
    "Приложения Silva": { en: "Silva apps", uk: "Застосунки Silva" },
    "Работайте в окнах или разверните приложение на весь экран.": {
      en: "Work in windows or expand an app to fill the screen.",
      uk: "Працюйте у вікнах або розгорніть застосунок на весь екран.",
    },
    "Атлас": { en: "Atlas", uk: "Атлас" },
    "Мой сад": { en: "My Garden", uk: "Мій сад" },
    "Сообщество": { en: "Community", uk: "Спільнота" },
    "Монитор системы": { en: "System Monitor", uk: "Монітор системи" },
    "Демо-метрики Silva OS": { en: "Silva OS demo metrics", uk: "Демо-метрики Silva OS" },
    "Терминал": { en: "Terminal", uk: "Термінал" },
    "Терминал / Настройки": { en: "Terminal / Settings", uk: "Термінал / Налаштування" },
    "Терминал Silva OS": { en: "Silva OS Terminal", uk: "Термінал Silva OS" },
    "Команды и настройки": { en: "Commands and settings", uk: "Команди й налаштування" },
    "Панель приложений": { en: "App dock", uk: "Панель застосунків" },
    "Открыть ботанический атлас": { en: "Open botanical atlas", uk: "Відкрити ботанічний атлас" },
    "Ботанический атлас": { en: "Botanical Atlas", uk: "Ботанічний атлас" },
    "Открыть Silva AI": { en: "Open Silva AI", uk: "Відкрити Silva AI" },
    "Открыть мой сад": { en: "Open My Garden", uk: "Відкрити Мій сад" },
    "Открыть Silva Community": { en: "Open Silva Community", uk: "Відкрити Silva Community" },
    "Открыть монитор системы": { en: "Open system monitor", uk: "Відкрити монітор системи" },
    "Открыть терминал": { en: "Open terminal", uk: "Відкрити термінал" },
    "Показать рабочий стол": { en: "Show desktop", uk: "Показати робочий стіл" },
    "Закрыть список приложений": { en: "Close app launcher", uk: "Закрити список застосунків" },
    "Все пространства бренда — в одном месте": {
      en: "All Silva spaces in one place",
      uk: "Усі простори Silva в одному місці",
    },
    "Найти приложение…": { en: "Find an app…", uk: "Знайти застосунок…" },
    "Коллекция растений и садовые инструменты": {
      en: "A collection of plants and garden tools",
      uk: "Колекція рослин і садові інструменти",
    },
    "Ботанический AI-помощник Gemini": {
      en: "Gemini-powered botanical AI assistant",
      uk: "Ботанічний AI-помічник на базі Gemini",
    },
    "Профиль сада и каталог ухода на сайте": {
      en: "Your garden profile and care guide on the website",
      uk: "Профіль саду та каталог догляду на сайті",
    },
    "Сообщество любителей растений": {
      en: "A community for plant lovers",
      uk: "Спільнота любителів рослин",
    },
    "Демо-метрики Silva OS в реальном времени": {
      en: "Live Silva OS demo metrics",
      uk: "Демо-метрики Silva OS у реальному часі",
    },
    "Команды оболочки и настройки кэша": {
      en: "Shell commands and cache settings",
      uk: "Команди оболонки та налаштування кешу",
    },
    "Открыть приложение": { en: "Open app", uk: "Відкрити застосунок" },
    "ДЕМО-МЕТРИКИ": { en: "DEMO METRICS", uk: "ДЕМО-МЕТРИКИ" },
    "Показатели ниже сгенерированы для демонстрации интерфейса и не являются измерениями устройства или Silva Core.": {
      en: "The metrics below are generated to demonstrate the interface; they are not measurements of this device or Silva Core.",
      uk: "Наведені нижче показники згенеровані для демонстрації інтерфейсу й не є вимірюваннями пристрою або Silva Core.",
    },
    "Симулированная нагрузка": { en: "Simulated load", uk: "Імітоване навантаження" },
    "ПАМЯТЬ": { en: "MEMORY", uk: "ПАМʼЯТЬ" },
    "Демо-использование": { en: "Demo usage", uk: "Демо-використання" },
    "Синтетическая задержка": { en: "Synthetic latency", uk: "Синтетична затримка" },
    "Активность": { en: "Activity", uk: "Активність" },
    "Демонстрационная нагрузка · последние 60 секунд": {
      en: "Demo load · last 60 seconds",
      uk: "Демо-навантаження · останні 60 секунд",
    },
    "обновляется": { en: "updating", uk: "оновлюється" },
    "График демонстрационной нагрузки": { en: "Demo load chart", uk: "Графік демо-навантаження" },
    "Память": { en: "Memory", uk: "Памʼять" },
    "Терминал ": { en: "Terminal ", uk: "Термінал " },
    "управления": { en: "Controls", uk: "керування" },
    "локальная оболочка": { en: "local shell", uk: "локальна оболонка" },
    "Команда": { en: "Command", uk: "Команда" },
    "Введите help и нажмите Enter": { en: "Type help and press Enter", uk: "Введіть help і натисніть Enter" },
    "Выполнить команду": { en: "Run command", uk: "Виконати команду" },
    "Команды выполняются только в этой оболочке. Содержимое окон сайтов не изменяется.": {
      en: "Commands run only in this shell. The contents of website windows are not changed.",
      uk: "Команди виконуються лише в цій оболонці. Вміст вікон сайтів не змінюється.",
    },
    "Управление окном": { en: "Window controls", uk: "Керування вікном" },
    "Свернуть окно": { en: "Minimize window", uk: "Згорнути вікно" },
    "Свернуть": { en: "Minimize", uk: "Згорнути" },
    "Развернуть окно": { en: "Maximize window", uk: "Розгорнути вікно" },
    "Развернуть": { en: "Maximize", uk: "Розгорнути" },
    "Восстановить размер окна": { en: "Restore window size", uk: "Відновити розмір вікна" },
    "Восстановить": { en: "Restore", uk: "Відновити" },
    "Закрыть окно": { en: "Close window", uk: "Закрити вікно" },
    "Закрыть": { en: "Close", uk: "Закрити" },
    "Открываем приложение…": { en: "Opening app…", uk: "Відкриваємо застосунок…" },
    "Открыть сайт отдельно": { en: "Open website separately", uk: "Відкрити сайт окремо" },
    "Переключить на светлую тему": { en: "Switch to light theme", uk: "Перемкнути на світлу тему" },
    "Переключить на тёмную тему": { en: "Switch to dark theme", uk: "Перемкнути на темну тему" },
    "Неизвестный режим темы. Используйте light, dark или system.": {
      en: "Unknown theme mode. Use light, dark, or system.",
      uk: "Невідомий режим теми. Використовуйте light, dark або system.",
    },
    "Тема изменена, но сохранить её между запусками не удалось.": {
      en: "Theme changed, but it could not be saved for future sessions.",
      uk: "Тему змінено, але не вдалося зберегти її для наступних запусків.",
    },
    "Переключить на ": { en: "Switch to ", uk: "Перемкнути на " },
    "светлую": { en: "light", uk: "світлу" },
    "тёмную": { en: "dark", uk: "темну" },
    "Встроенное приложение уже обновлено.": {
      en: "The built-in app is already up to date.",
      uk: "Вбудований застосунок уже оновлено.",
    },
    "Обновляем приложение…": { en: "Refreshing app…", uk: "Оновлюємо застосунок…" },
    "Сайт загружается дольше обычного": {
      en: "This website is taking longer than usual to load",
      uk: "Сайт завантажується довше, ніж зазвичай",
    },
    "Не удалось запустить график монитора системы.": {
      en: "Could not start the system monitor chart.",
      uk: "Не вдалося запустити графік монітора системи.",
    },
    "Доступные команды:": { en: "Available commands:", uk: "Доступні команди:" },
    "  help                         показать эту справку": { en: "  help                         show this help", uk: "  help                         показати цю довідку" },
    "  theme light|dark|system      выбрать тему интерфейса": { en: "  theme light|dark|system      choose the interface theme", uk: "  theme light|dark|system      вибрати тему інтерфейсу" },
    "  clear                        очистить вывод терминала": { en: "  clear                        clear terminal output", uk: "  clear                        очистити вивід термінала" },
    "  about silva                  сведения об оболочке": { en: "  about silva                  about this shell", uk: "  about silva                  відомості про оболонку" },
    "  cache supabase status        найти кэши CacheStorage с именем Supabase": { en: "  cache supabase status        find Supabase CacheStorage entries", uk: "  cache supabase status        знайти кеші CacheStorage з назвою Supabase" },
    "  cache supabase clear         удалить только найденные кэши Supabase": { en: "  cache supabase clear         delete only the matching Supabase caches", uk: "  cache supabase clear         видалити лише знайдені кеші Supabase" },
    "Вывод очищен.": { en: "Output cleared.", uk: "Вивід очищено." },
    "Silva OS — веб-оболочка для сайтов Silva и локальных системных инструментов.": {
      en: "Silva OS — a web shell for Silva websites and local system tools.",
      uk: "Silva OS — вебоболонка для сайтів Silva та локальних системних інструментів.",
    },
    "Системный монитор показывает демонстрационные, а не аппаратные метрики.": {
      en: "The system monitor shows demo metrics, not hardware measurements.",
      uk: "Монітор системи показує демо-, а не апаратні показники.",
    },
    "CacheStorage недоступен в этом браузере.": {
      en: "CacheStorage is not available in this browser.",
      uk: "CacheStorage недоступний у цьому браузері.",
    },
    "Кэши CacheStorage с именем Supabase не найдены.": {
      en: "No CacheStorage entries named Supabase were found.",
      uk: "Кешів CacheStorage з назвою Supabase не знайдено.",
    },
    "Проверяется только CacheStorage текущего сайта; данные авторизации не затрагиваются.": {
      en: "Only this website's CacheStorage is checked; sign-in data is not affected.",
      uk: "Перевіряється лише CacheStorage цього сайту; дані авторизації не зачіпаються.",
    },
    "Не удалось получить доступ к CacheStorage.": {
      en: "Could not access CacheStorage.",
      uk: "Не вдалося отримати доступ до CacheStorage.",
    },
    "Введите help для списка поддерживаемых команд.": {
      en: "Type help to see the supported commands.",
      uk: "Введіть help, щоб переглянути список доступних команд.",
    },
    "Открыть список приложений": { en: "Open app launcher", uk: "Відкрити список застосунків" },
    "Скопировать адрес активного сайта": { en: "Copy active website address", uk: "Скопіювати адресу активного сайту" },
    "Светлая тема": { en: "Light theme", uk: "Світла тема" },
    "Тёмная тема": { en: "Dark theme", uk: "Темна тема" },
    "Системная тема": { en: "System theme", uk: "Системна тема" },
    "Обновить приложение": { en: "Refresh app", uk: "Оновити застосунок" },
    "Закрыть приложение": { en: "Close app", uk: "Закрити застосунок" },
    "Адрес активного сайта скопирован.": {
      en: "Active website address copied.",
      uk: "Адресу активного сайту скопійовано.",
    },
    "Не удалось скопировать адрес активного сайта.": {
      en: "Could not copy the active website address.",
      uk: "Не вдалося скопіювати адресу активного сайту.",
    },
    "У активного окна нет внешнего адреса для копирования.": {
      en: "The active window has no external address to copy.",
      uk: "Активне вікно не має зовнішньої адреси для копіювання.",
    },
    "Чтобы открыть отдельным окном на iPhone/iPad: откройте сайт в Safari → «Поделиться» → «На экран Домой».": {
      en: "To open in a separate window on iPhone/iPad: open the site in Safari → Share → Add to Home Screen.",
      uk: "Щоб відкрити в окремому вікні на iPhone/iPad: відкрийте сайт у Safari → «Поділитися» → «На початковий екран».",
    },
    "Для отдельного окна в Safari выберите «Файл» → «Добавить в Dock». В Chrome или Edge используйте меню браузера → «Установить Silva OS».": {
      en: "For a separate window in Safari, choose File → Add to Dock. In Chrome or Edge, use the browser menu → Install Silva OS.",
      uk: "Щоб відкрити окреме вікно в Safari, виберіть «Файл» → «Додати до Dock». У Chrome або Edge скористайтеся меню браузера → «Встановити Silva OS».",
    },
    "Для отдельного окна откройте меню Chrome или Edge и выберите «Установить Silva OS» или «Установить как приложение».": {
      en: "For a separate window, open the Chrome or Edge menu and choose Install Silva OS or Install as app.",
      uk: "Щоб відкрити окреме вікно, відкрийте меню Chrome або Edge і виберіть «Встановити Silva OS» або «Встановити як застосунок».",
    },
    "Не удалось включить офлайн-оболочку Silva OS.": {
      en: "Could not enable the Silva OS offline shell.",
      uk: "Не вдалося ввімкнути офлайн-оболонку Silva OS.",
    },
    "Не удалось запустить установку Silva OS.": {
      en: "Could not start the Silva OS installation.",
      uk: "Не вдалося запустити встановлення Silva OS.",
    },
  };

  const localeNames = { ru: "ru-RU", en: "en-US", uk: "uk-UA" };
  const supportedLocales = Object.keys(localeNames);
  const reverseMessages = Object.fromEntries(
    supportedLocales.map((locale) => [
      locale,
      Object.fromEntries(Object.entries(messages).map(([source, translations]) => [
        translations[locale] || source,
        source,
      ])),
    ]),
  );

  function detectLocale() {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (supportedLocales.includes(saved)) return saved;
    } catch (error) {
      console.error("Could not read the Silva OS language preference.", error);
    }

    const preferred = navigator.languages?.[0] || navigator.language || "ru";
    if (/^uk\b/i.test(preferred)) return "uk";
    if (/^en\b/i.test(preferred)) return "en";
    return "ru";
  }

  let currentLocale = detectLocale();

  function translate(value, locale = currentLocale) {
    if (typeof value !== "string") return value;
    const source = supportedLocales
      .map((language) => reverseMessages[language][value])
      .find(Boolean) || value;
    if (locale === "ru") return source;
    const exact = messages[source]?.[locale];
    if (exact) return exact;

    let match = source.match(/^Удалено кэшей: (\d+)\. Данные авторизации и другие хранилища не затронуты\.$/);
    if (match) {
      if (locale === "en") return `Caches deleted: ${match[1]}. Sign-in data and other storage were not affected.`;
      return `Видалено кешів: ${match[1]}. Дані авторизації та інші сховища не зачеплено.`;
    }
    match = source.match(/^Найдены кэши CacheStorage: (.+)\.$/);
    if (match) {
      if (locale === "en") return `CacheStorage entries found: ${match[1]}.`;
      return `Знайдено кеші CacheStorage: ${match[1]}.`;
    }
    match = source.match(/^Неизвестная команда: (.+)\. Введите help\.$/);
    if (match) {
      if (locale === "en") return `Unknown command: ${match[1]}. Type help.`;
      return `Невідома команда: ${match[1]}. Введіть help.`;
    }
    match = source.match(/^Режим темы: (.+)\.$/);
    if (match) {
      if (locale === "en") return `Theme mode: ${match[1]}.`;
      return `Режим теми: ${match[1]}.`;
    }
    return value;
  }

  function translateTextNode(node) {
    const value = node.nodeValue;
    if (!value?.trim()) return;
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const content = value.slice(leading.length, value.length - trailing.length || undefined);
    const translated = translate(content);
    if (translated !== content) node.nodeValue = `${leading}${translated}${trailing}`;
  }

  function translateElement(element) {
    for (const attribute of ["aria-label", "title", "placeholder", "content"]) {
      if (element.hasAttribute(attribute)) {
        const value = element.getAttribute(attribute);
        const translated = translate(value);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    }
  }

  function translateRoot(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateElement(node);
      if (node instanceof HTMLTemplateElement) translateRoot(node.content);
    }
  }

  function applyLocale(locale) {
    if (!supportedLocales.includes(locale)) return;
    currentLocale = locale;
    document.documentElement.lang = locale;
    const selector = document.querySelector("#language-select");
    if (selector) selector.value = locale;
    document.title = translate("Silva OS — botanical workspace", locale);
    translateRoot(document);
    updateClock();
  }

  document.addEventListener("change", (event) => {
    if (event.target.id !== "language-select") return;
    const locale = event.target.value;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch (error) {
      console.error("Could not save the Silva OS language preference.", error);
    }
    applyLocale(locale);
    window.dispatchEvent(new CustomEvent("silva-os-locale-change", { detail: { locale } }));
  });

  function updateClock() {
    const clock = document.querySelector("#system-clock");
    if (!clock) return;
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = formatDate(now);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat(localeNames[currentLocale], {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  applyLocale(currentLocale);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") translateTextNode(mutation.target);
      if (mutation.type === "attributes") translateElement(mutation.target);
      for (const node of mutation.addedNodes || []) translateRoot(node);
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "title", "placeholder", "content"],
  });

  window.silvaI18n = {
    get locale() { return currentLocale; },
    formatDate,
    translate,
    updateClock,
  };
})();
