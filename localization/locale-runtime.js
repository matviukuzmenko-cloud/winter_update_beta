(() => {
  const locale = window.FLORA_LOCALE;
  for (const [language, hostname] of [["ru", "silvaquieta.com"], ["uk", "uk.silvaquieta.com"], ["en", "en.silvaquieta.com"]]) {
    let alternate = document.querySelector(`link[rel="alternate"][hreflang="${language}"]`);
    if (!alternate) {
      alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = language;
      document.head.append(alternate);
    }
    alternate.href = `https://${hostname}/`;
  }
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
          data.description = translate(data.description);
          structuredData.textContent = JSON.stringify(data);
        }
      } catch (error) {
        console.error("Could not update localized structured data.", error);
      }
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://${location.host}/`;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = `https://${location.host}/`;
  };

  fetch(`./localization/ui-${locale}.json?v=4`)
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load ${locale} interface translations: HTTP ${response.status}`);
      return response.json();
    })
    .then(applyTranslations)
    .catch((error) => console.error("Site localization could not be initialized.", error));
})();
