(() => {
  const locale = window.SILVA_LOCALE;
  const copy = {
    ru: {
      eyebrow: "БОТАНИЧЕСКИЙ ИИ · SILVA QUIETA", title: "О чём поговорим<br><em>сегодня?</em>",
      intro: "Спроси Silva об уходе, выборе растения или о том, что происходит с его листьями. Спокойно, по делу и без осуждения.",
      privacy: "Не отправляй личные данные. Ответы ИИ могут быть неточными.", connecting: "Подключаем Silva…",
      ready: "Silva на связи", offline: "Silva временно недоступна", assistant: "Ботаническая помощница",
      thinking: "Silva формулирует ответ",
      clear: "Новый диалог", inputLabel: "Сообщение для Silva", placeholder: "Напиши свой вопрос…", send: "Отправить",
      footnote: "История хранится в этом браузере. Не отправляй личные данные.", back: "На сайт Silva Quieta",
      greeting: "Привет! Я Silva, ботаническая помощница. Спрашивай про уход, выбор растений или их особенности.",
      suggestions: ["Как понять, что монстеру пора поливать?", "Почему желтеют листья?", "Какое растение подойдёт для тени?"],
      connectionError: "Не удалось проверить соединение с Silva.",
      requestError: "Не удалось получить ответ. Попробуй ещё раз позже.",
    },
    uk: {
      eyebrow: "БОТАНІЧНИЙ ШІ · SILVA QUIETA", title: "Про що поговоримо<br><em>сьогодні?</em>",
      intro: "Запитай Silva про догляд, вибір рослини чи зміни на її листі. Спокійно, по суті й без осуду.",
      privacy: "Не надсилай особисті дані. Відповіді ШІ можуть бути неточними.", connecting: "Підключаємо Silva…",
      ready: "Silva на зв’язку", offline: "Silva тимчасово недоступна", assistant: "Ботанічна помічниця",
      thinking: "Silva готує відповідь",
      clear: "Нова розмова", inputLabel: "Повідомлення для Silva", placeholder: "Напиши своє запитання…", send: "Надіслати",
      footnote: "Історія зберігається у цьому браузері. Не надсилай особисті дані.", back: "На сайт Silva Quieta",
      greeting: "Привіт! Я Silva, ботанічна помічниця. Запитуй про догляд, вибір рослин чи їхні особливості.",
      suggestions: ["Як зрозуміти, що монстеру час поливати?", "Чому жовтіє листя?", "Яка рослина підійде для затінку?"],
      connectionError: "Не вдалося перевірити зв’язок із Silva.",
      requestError: "Не вдалося отримати відповідь. Спробуй пізніше.",
    },
    en: {
      eyebrow: "BOTANICAL AI · SILVA QUIETA", title: "What shall we<br><em>grow today?</em>",
      intro: "Ask Silva about plant care, choosing a plant, or changes in its leaves. Thoughtful, practical, and without judgment.",
      privacy: "Please don’t share personal information. AI answers may be inaccurate.", connecting: "Connecting to Silva…",
      ready: "Silva is here", offline: "Silva is temporarily unavailable", assistant: "Botanical assistant",
      thinking: "Silva is thinking",
      clear: "New conversation", inputLabel: "Message for Silva", placeholder: "Ask your question…", send: "Send",
      footnote: "Your conversation is stored in this browser. Don’t share personal information.", back: "Back to Silva Quieta",
      greeting: "Hello! I’m Silva, your botanical assistant. Ask me about plant care, choosing plants, or their needs.",
      suggestions: ["How do I know when to water a monstera?", "Why are the leaves turning yellow?", "Which plants do well in shade?"],
      connectionError: "Could not check the connection to Silva.",
      requestError: "Could not get a reply. Please try again later.",
    },
  }[locale];
  const apiBase = "https://flora-anotomy-ai.ukrainman21012.workers.dev/api";
  const historyKey = `silva-ai-lab-history:${locale}`;
  const messagesElement = document.querySelector("#messages");
  const form = document.querySelector("#chat-form");
  const input = document.querySelector("#chat-input");
  const sendButton = document.querySelector("#send-button");
  const suggestions = document.querySelector("#suggestions");
  const presence = document.querySelector("#connection-status");
  const connectionDot = document.querySelector("#connection-dot");
  let conversation = [];
  let busy = false;

  const setLocale = (next) => {
    localStorage.setItem("silva-ai-locale", next);
    const url = new URL(location.href);
    url.searchParams.set("locale", next);
    location.assign(url.href);
  };
  const localeSelect = document.querySelector("#locale-select");
  localeSelect.value = locale;
  localeSelect.addEventListener("change", () => setLocale(localeSelect.value));

  const renderCopy = () => {
    document.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (key === "title") element.innerHTML = copy[key];
      else element.textContent = copy[key];
    });
    document.querySelectorAll("[data-placeholder]").forEach((element) => {
      element.placeholder = copy[element.dataset.placeholder];
    });
    sendButton.setAttribute("aria-label", copy.send);
    document.querySelector("#chat-input").setAttribute("aria-label", copy.inputLabel);
  };
  const appendMessage = (role, text, isError = false, isWelcome = false) => {
    const article = document.createElement("article");
    article.className = `message ${role}${isError ? " error" : ""}${isWelcome ? " welcome-message" : ""}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    article.append(paragraph);
    messagesElement.append(article);
    messagesElement.scrollTop = messagesElement.scrollHeight;
  };
  const createTypingIndicator = () => {
    const indicator = document.createElement("article");
    indicator.className = "message assistant typing-message";
    indicator.setAttribute("role", "status");
    indicator.setAttribute("aria-label", copy.thinking);
    indicator.innerHTML = '<p aria-hidden="true"><span></span><span></span><span></span></p>';
    return indicator;
  };
  const saveConversation = () => {
    conversation = conversation.slice(-12);
    try {
      localStorage.setItem(historyKey, JSON.stringify(conversation));
    } catch (error) {
      console.error("Could not save Silva AI Lab conversation.", error);
    }
  };
  const setConnection = (state, label) => {
    connectionDot.className = `status-dot ${state}`;
    presence.textContent = label;
  };
  const renderConversation = () => {
    messagesElement.replaceChildren();
    if (conversation.length === 0) appendMessage("assistant", copy.greeting, false, true);
    conversation.forEach((message) => appendMessage(message.role, message.content));
    suggestions.hidden = conversation.length > 0;
  };
  const setSuggestions = () => {
    suggestions.replaceChildren();
    copy.suggestions.forEach((text) => {
      const button = document.createElement("button");
      button.className = "suggestion";
      button.type = "button";
      button.textContent = text;
      button.addEventListener("click", () => void sendMessage(text));
      suggestions.append(button);
    });
  };
  const sendMessage = async (value) => {
    const content = value.trim().slice(0, 1200);
    if (!content || busy) return;
    busy = true;
    sendButton.disabled = true;
    input.disabled = true;
    messagesElement.querySelector(".welcome-message")?.remove();
    conversation.push({ role: "user", content });
    const userMessage = document.createElement("article");
    userMessage.className = "message user";
    const userBubble = document.createElement("p");
    userBubble.textContent = content;
    userMessage.append(userBubble);
    messagesElement.append(userMessage);
    const typingIndicator = createTypingIndicator();
    messagesElement.append(typingIndicator);
    messagesElement.scrollTop = messagesElement.scrollHeight;
    suggestions.hidden = true;
    input.value = "";
    try {
      const response = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ locale, messages: conversation.slice(-8) }),
      });
      const result = await response.json().catch(() => ({}));
      typingIndicator.remove();
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : copy.requestError);
      if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error(copy.requestError);
      conversation.push({ role: "assistant", content: result.reply.trim() });
      appendMessage("assistant", result.reply.trim());
      saveConversation();
    } catch (error) {
      typingIndicator.remove();
      const message = error instanceof Error ? error.message : copy.requestError;
      userMessage.remove();
      input.value = content;
      appendMessage("assistant", message, true);
      conversation.pop();
      suggestions.hidden = conversation.length > 0;
      console.error("Silva AI Lab request failed.", error);
    } finally {
      busy = false;
      sendButton.disabled = false;
      input.disabled = false;
      input.focus();
    }
  };

  renderCopy();
  setSuggestions();
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) || "[]");
    if (!Array.isArray(saved)) throw new TypeError("Saved conversation should be an array.");
    conversation = saved.filter((message) =>
      message && ["user", "assistant"].includes(message.role) &&
      typeof message.content === "string" && message.content.trim()
    ).slice(-12);
  } catch (error) {
    console.error("Could not restore Silva AI Lab conversation.", error);
  }
  renderConversation();
  suggestions.hidden = conversation.length > 0;
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-ready")));
  document.querySelector("#clear-chat").addEventListener("click", () => {
    conversation = [];
    localStorage.removeItem(historyKey);
    renderConversation();
    setSuggestions();
    input.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void sendMessage(input.value);
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  fetch(`${apiBase}/health`, { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error(`Health check failed: HTTP ${response.status}`);
      return response.json();
    })
    .then((result) => {
      if (!result.configured) throw new Error("Silva AI is not configured.");
      setConnection("ready", copy.ready);
    })
    .catch((error) => {
      setConnection("offline", copy.offline);
      console.error(copy.connectionError, error);
    });
})();
