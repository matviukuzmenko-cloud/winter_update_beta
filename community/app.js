(() => {
  const copy = {
    ru: {
      eyebrow: "SILVA QUIETA · СООБЩЕСТВО", title: "Растения объединяют.",
      subtitle: "Делись открытиями, задавай вопросы и помогай другим растить своё.",
      signIn: "Войти", signUp: "Создать аккаунт", signOut: "Выйти", createPost: "Новая публикация",
      newest: "Новое", popular: "Популярное", refresh: "Обновить", loadMore: "Показать ещё",
      aboutTitle: "Один общий сад.", aboutText: "Место для вопросов, наблюдений и маленьких побед. Публикуй о растениях, будь добр к другим и не делись личной информацией.",
      ruleOne: "Только о растениях и садоводстве", ruleTwo: "Уважение к людям и их опыту",
      ruleThree: "Сообщай о спаме и вредном контенте", back: "Вернуться на сайт", publicNote: "Публикации видны всем.",
      accountEyebrow: "ВАШ АККАУНТ", signInTitle: "Рады видеть", accountDescription: "Войди или создай аккаунт Silva Quieta, чтобы участвовать в сообществе.",
      nickname: "Имя в сообществе", password: "Пароль",
      passwordHint: "Не менее 8 символов. Восстановление пароля по email недоступно.",
      composeEyebrow: "ПОДЕЛИСЬ СООБЩЕСТВОМ", composeTitle: "Что растёт у тебя?",
      postLabel: "Расскажи о растении, задай вопрос или поделись наблюдением",
      addPhoto: "Добавить фото", imageHint: "JPG, PNG или WebP · до 5 МБ. Фото станет общедоступным.",
      publish: "Опубликовать", loading: "Загружаем публикации…", failed: "Не удалось загрузить ленту. Попробуй обновить страницу.",
      empty: "Здесь пока тихо. Будь первым, кто поделится историей о растениях.",
      comment: "Ответить", comments: "Ответы", noComments: "Пока нет ответов.",
      commentPlaceholder: "Напиши ответ…", send: "Отправить", like: "Нравится",
      report: "Пожаловаться", reportComment: "Сообщить", reportPrompt: "Почему вы хотите пожаловаться? Например: спам, оскорбление или опасный совет.",
      reportSent: "Жалоба отправлена. Спасибо, что помогаешь поддерживать сообщество.",
      reportDuplicate: "Вы уже отправили жалобу на эту публикацию.",
      accountRequired: "Чтобы участвовать в сообществе, сначала войди или создай аккаунт.",
      loginFailed: "Не удалось войти. Проверь имя и пароль.",
      signupFailed: "Не удалось создать аккаунт. Возможно, это имя уже занято.",
      profileFailed: "Не удалось загрузить профиль сообщества.",
      publishFailed: "Не удалось опубликовать запись. Попробуй ещё раз.",
      commentFailed: "Не удалось отправить ответ. Попробуй ещё раз.",
      voteFailed: "Не удалось сохранить отметку «Нравится».",
      reportFailed: "Не удалось отправить жалобу. Попробуй ещё раз.",
      noSupabase: "Сообщество ещё не подключено к базе данных.",
      authWorking: "Подключаем аккаунт…", postWorking: "Публикуем…",
      recent: "только что", imageTooLarge: "Изображение должно быть не больше 5 МБ.",
      imageType: "Выбери изображение JPG, PNG или WebP.", removeImage: "Удалить фото",
      more: "Показать ещё", close: "Закрыть", sortNew: "Новые публикации", sortTop: "Популярные публикации",
      dateLocale: "ru-RU", noText: "Добавь текст публикации.", postNumber: (n) => `${n} ответов`,
      signupName: "Это имя будет видно в сообществе.", saved: "Сохранено.",
      signupAvatar: "Выбрать фото", avatarPickerHint: "Нажми или перетащи изображение сюда",
      signupAvatarHint: "Необязательно · JPG, PNG или WebP · до 2 МБ. Аватар будет общедоступным.",
      signupAvatarSaved: "Аккаунт создан, аватар добавлен.", signupAvatarFailed: "Аккаунт создан, но аватар загрузить не удалось. Его можно добавить в профиле.",
      myPosts: "Мои публикации", savedPosts: "Закладки", profileEyebrow: "ВАШ ПРОФИЛЬ",
      profileTitle: "Профиль сообщества", changeAvatar: "Выбрать фото", removeAvatar: "Удалить аватар",
      avatarHint: "JPG, PNG или WebP · до 2 МБ. Аватар будет общедоступным. Для входа используй прежний ник.",
      saveProfile: "Сохранить профиль",
      currentPhoto: "Текущее фото",
      edited: "изменено",
      saveChanges: "Сохранить изменения", editPost: "Редактировать", deletePost: "Удалить",
      savePost: "В закладки", unsavePost: "Убрать из закладок", editComment: "Редактировать ответ",
      confirmDeletePost: "Удалить эту публикацию и все ответы? Это действие нельзя отменить.",
      confirmDeleteComment: "Удалить этот ответ? Это действие нельзя отменить.",
      profileSaved: "Профиль обновлён.", profileSaveFailed: "Не удалось обновить профиль. Попробуй ещё раз.",
      deleteFailed: "Не удалось удалить запись. Попробуй ещё раз.", editFailed: "Не удалось сохранить изменения.",
      saveFailed: "Не удалось обновить закладки. Попробуй ещё раз.",
      invalidNickname: "Используй 3–24 буквы, цифры, точки, дефисы или подчёркивания.",
      avatarTooLarge: "Аватар должен быть не больше 2 МБ.", avatarType: "Выбери изображение JPG, PNG или WebP.",
      savedEmpty: "Здесь будут публикации, которые ты сохранишь.",
      myEmpty: "У тебя пока нет публикаций.",
    },
    uk: {
      eyebrow: "SILVA QUIETA · СПІЛЬНОТА", title: "Рослини єднають.",
      subtitle: "Ділися відкриттями, став запитання й допомагай іншим вирощувати своє.",
      signIn: "Увійти", signUp: "Створити обліковий запис", signOut: "Вийти", createPost: "Нова публікація",
      newest: "Нове", popular: "Популярне", refresh: "Оновити", loadMore: "Показати ще",
      aboutTitle: "Один спільний сад.", aboutText: "Місце для запитань, спостережень і маленьких перемог. Пиши про рослини, поважай інших і не ділися особистою інформацією.",
      ruleOne: "Лише про рослини й садівництво", ruleTwo: "Повага до людей та їхнього досвіду",
      ruleThree: "Повідомляй про спам і шкідливий контент", back: "Повернутися на сайт", publicNote: "Публікації бачать усі.",
      accountEyebrow: "ВАШ ОБЛІКОВИЙ ЗАПИС", signInTitle: "Раді бачити", accountDescription: "Увійди або створи обліковий запис Silva Quieta, щоб долучитися до спільноти.",
      nickname: "Ім’я у спільноті", password: "Пароль",
      passwordHint: "Щонайменше 8 символів. Відновлення пароля електронною поштою недоступне.",
      composeEyebrow: "ПОДІЛИСЯ ЗІ СПІЛЬНОТОЮ", composeTitle: "Що в тебе росте?",
      postLabel: "Розкажи про рослину, постав запитання чи поділися спостереженням",
      addPhoto: "Додати фото", imageHint: "JPG, PNG або WebP · до 5 МБ. Фото буде загальнодоступним.",
      publish: "Опублікувати", loading: "Завантажуємо публікації…", failed: "Не вдалося завантажити стрічку. Спробуй оновити сторінку.",
      empty: "Тут поки тихо. Поділися першою історією про рослини.",
      comment: "Відповісти", comments: "Відповіді", noComments: "Відповідей поки немає.",
      commentPlaceholder: "Напиши відповідь…", send: "Надіслати", like: "Подобається",
      report: "Поскаржитися", reportComment: "Повідомити", reportPrompt: "Чому ви хочете поскаржитися? Наприклад: спам, образа чи небезпечна порада.",
      reportSent: "Скаргу надіслано. Дякуємо, що допомагаєш дбати про спільноту.",
      reportDuplicate: "Ти вже надсилав скаргу на цю публікацію.",
      accountRequired: "Щоб долучитися до спільноти, спочатку увійди або створи обліковий запис.",
      loginFailed: "Не вдалося увійти. Перевір ім’я та пароль.",
      signupFailed: "Не вдалося створити обліковий запис. Можливо, це ім’я вже зайняте.",
      profileFailed: "Не вдалося завантажити профіль спільноти.",
      publishFailed: "Не вдалося опублікувати запис. Спробуй ще раз.",
      commentFailed: "Не вдалося надіслати відповідь. Спробуй ще раз.",
      voteFailed: "Не вдалося зберегти вподобання.",
      reportFailed: "Не вдалося надіслати скаргу. Спробуй ще раз.",
      noSupabase: "Спільноту ще не підключено до бази даних.",
      authWorking: "Підключаємо обліковий запис…", postWorking: "Публікуємо…",
      recent: "щойно", imageTooLarge: "Зображення має бути не більше 5 МБ.",
      imageType: "Вибери зображення JPG, PNG або WebP.", removeImage: "Видалити фото",
      more: "Показати ще", close: "Закрити", sortNew: "Нові публікації", sortTop: "Популярні публікації",
      dateLocale: "uk-UA", noText: "Додай текст публікації.", postNumber: (n) => `${n} відповідей`,
      signupName: "Це ім’я буде видимим у спільноті.", saved: "Збережено.",
      signupAvatar: "Вибрати фото", avatarPickerHint: "Натисни або перетягни зображення сюди",
      signupAvatarHint: "Необов’язково · JPG, PNG або WebP · до 2 МБ. Аватар буде загальнодоступним.",
      signupAvatarSaved: "Обліковий запис створено, аватар додано.", signupAvatarFailed: "Обліковий запис створено, але аватар не вдалося завантажити. Його можна додати у профілі.",
      myPosts: "Мої публікації", savedPosts: "Збережене", profileEyebrow: "ВАШ ПРОФІЛЬ",
      profileTitle: "Профіль спільноти", changeAvatar: "Вибрати фото", removeAvatar: "Видалити аватар",
      avatarHint: "JPG, PNG або WebP · до 2 МБ. Аватар буде загальнодоступним. Для входу використовуй попередній нік.",
      saveProfile: "Зберегти профіль",
      currentPhoto: "Поточне фото",
      edited: "змінено",
      saveChanges: "Зберегти зміни", editPost: "Редагувати", deletePost: "Видалити",
      savePost: "До збереженого", unsavePost: "Прибрати зі збереженого", editComment: "Редагувати відповідь",
      confirmDeletePost: "Видалити цю публікацію та всі відповіді? Цю дію не можна скасувати.",
      confirmDeleteComment: "Видалити цю відповідь? Цю дію не можна скасувати.",
      profileSaved: "Профіль оновлено.", profileSaveFailed: "Не вдалося оновити профіль. Спробуй ще раз.",
      deleteFailed: "Не вдалося видалити запис. Спробуй ще раз.", editFailed: "Не вдалося зберегти зміни.",
      saveFailed: "Не вдалося оновити збережене. Спробуй ще раз.",
      invalidNickname: "Використовуй 3–24 літери, цифри, крапки, дефіси чи підкреслення.",
      avatarTooLarge: "Аватар має бути не більшим за 2 МБ.", avatarType: "Вибери зображення JPG, PNG або WebP.",
      savedEmpty: "Тут будуть публікації, які ти збережеш.",
      myEmpty: "У тебе поки немає публікацій.",
    },
    en: {
      eyebrow: "SILVA QUIETA · COMMUNITY", title: "Plants bring us together.",
      subtitle: "Share discoveries, ask questions, and help each other grow.",
      signIn: "Sign in", signUp: "Create account", signOut: "Sign out", createPost: "New post",
      newest: "New", popular: "Popular", refresh: "Refresh", loadMore: "Load more",
      aboutTitle: "One shared garden.", aboutText: "A place for questions, observations, and small wins. Post about plants, be kind to others, and keep personal information private.",
      ruleOne: "Plants and gardening only", ruleTwo: "Respect people and their experience",
      ruleThree: "Report spam and harmful content", back: "Back to the website", publicNote: "Posts are public.",
      accountEyebrow: "YOUR ACCOUNT", signInTitle: "Welcome back", accountDescription: "Sign in or create a Silva Quieta account to join the community.",
      nickname: "Community name", password: "Password",
      passwordHint: "At least 8 characters. Password recovery by email is unavailable.",
      composeEyebrow: "SHARE WITH THE COMMUNITY", composeTitle: "What’s growing?",
      postLabel: "Tell us about a plant, ask a question, or share an observation",
      addPhoto: "Add a photo", imageHint: "JPG, PNG, or WebP · up to 5 MB. Photos are public.",
      publish: "Publish", loading: "Loading posts…", failed: "Could not load the feed. Try refreshing the page.",
      empty: "It’s quiet here for now. Share the first plant story.",
      comment: "Reply", comments: "Replies", noComments: "No replies yet.",
      commentPlaceholder: "Write a reply…", send: "Send", like: "Like",
      report: "Report", reportComment: "Report", reportPrompt: "Why are you reporting this? For example: spam, abuse, or unsafe advice.",
      reportSent: "Report sent. Thanks for helping keep this community welcoming.",
      reportDuplicate: "You’ve already reported this post.",
      accountRequired: "Sign in or create an account to participate in the community.",
      loginFailed: "Could not sign in. Check your name and password.",
      signupFailed: "Could not create the account. This name may already be taken.",
      profileFailed: "Could not load your community profile.",
      publishFailed: "Could not publish the post. Please try again.",
      commentFailed: "Could not send your reply. Please try again.",
      voteFailed: "Could not save your like.",
      reportFailed: "Could not send the report. Please try again.",
      noSupabase: "The community database is not configured yet.",
      authWorking: "Connecting your account…", postWorking: "Publishing…",
      recent: "just now", imageTooLarge: "Image must be 5 MB or smaller.",
      imageType: "Choose a JPG, PNG, or WebP image.", removeImage: "Remove photo",
      more: "Load more", close: "Close", sortNew: "Newest posts", sortTop: "Popular posts",
      dateLocale: "en-US", noText: "Add some text to your post.", postNumber: (n) => `${n} replies`,
      signupName: "This name will be visible to the community.", saved: "Saved.",
      signupAvatar: "Choose a photo", avatarPickerHint: "Click or drag an image here",
      signupAvatarHint: "Optional · JPG, PNG, or WebP · up to 2 MB. Your avatar will be public.",
      signupAvatarSaved: "Account created and avatar added.", signupAvatarFailed: "Account created, but the avatar couldn’t be uploaded. You can add it in your profile.",
      myPosts: "My posts", savedPosts: "Saved", profileEyebrow: "YOUR PROFILE",
      profileTitle: "Community profile", changeAvatar: "Choose a photo", removeAvatar: "Remove avatar",
      avatarHint: "JPG, PNG, or WebP · up to 2 MB. Your avatar will be public. Keep using your original sign-in name.",
      saveProfile: "Save profile",
      currentPhoto: "Current photo",
      edited: "edited",
      saveChanges: "Save changes", editPost: "Edit", deletePost: "Delete",
      savePost: "Save", unsavePost: "Unsave", editComment: "Edit reply",
      confirmDeletePost: "Delete this post and all replies? This can’t be undone.",
      confirmDeleteComment: "Delete this reply? This can’t be undone.",
      profileSaved: "Profile updated.", profileSaveFailed: "Could not update your profile. Please try again.",
      deleteFailed: "Could not delete the item. Please try again.", editFailed: "Could not save your changes.",
      saveFailed: "Could not update saved posts. Please try again.",
      invalidNickname: "Use 3–24 letters, numbers, dots, hyphens, or underscores.",
      avatarTooLarge: "Avatar must be 2 MB or smaller.", avatarType: "Choose a JPG, PNG, or WebP image.",
      savedEmpty: "Posts you save will appear here.",
      myEmpty: "You haven’t posted anything yet.",
    },
  };
  const locale = (() => {
    const query = new URLSearchParams(location.search).get("locale");
    const saved = localStorage.getItem("silva-community-locale");
    const value = ["ru", "uk", "en"].includes(query) ? query : ["ru", "uk", "en"].includes(saved) ? saved : "ru";
    document.documentElement.lang = value;
    return value;
  })();
  const text = copy[locale];
  const config = window.FLORA_SUPABASE_CONFIG;
  const supabaseLib = window.supabase?.createClient;
  const client = config && supabaseLib
    ? supabaseLib(config.url, config.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } })
    : null;
  const feed = document.querySelector("#feed");
  const status = document.querySelector("#feed-status");
  const loadMore = document.querySelector("#load-more");
  const authDialog = document.querySelector("#auth-dialog");
  const postDialog = document.querySelector("#post-dialog");
  const profileDialog = document.querySelector("#profile-dialog");
  const profileForm = document.querySelector("#profile-form");
  const profileStatus = document.querySelector("#profile-status");
  const profileNickname = document.querySelector("#profile-nickname");
  const avatarInput = document.querySelector("#avatar-image");
  const authForm = document.querySelector("#auth-form");
  const authStatus = document.querySelector("#auth-status");
  const postForm = document.querySelector("#post-form");
  const postStatus = document.querySelector("#post-status");
  let currentUser = null;
  let profile = null;
  let authMode = "login";
  let sortMode = "new";
  let feedOffset = 0;
  let hasMore = false;
  let pendingAction = null;
  let selectedImage = null;
  let editingPostId = null;
  let existingPostImage = null;
  let removeExistingPostImage = false;
  let selectedAvatar = null;
  let selectedSignupAvatar = null;
  let signupAvatarReader = null;
  let avatarPreviewReader = null;
  let removeExistingAvatar = false;
  let editingComment = null;
  const loadedComments = new Set();
  const postsById = new Map();
  const reportTargetsSent = new Set();

  const setStatus = (element, message, isError = false) => {
    element.textContent = message;
    element.dataset.error = String(isError);
  };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
  const formatDate = (date) => {
    const time = new Date(date);
    if (!Number.isFinite(time.getTime())) return "";
    const elapsed = Date.now() - time.getTime();
    if (elapsed < 60_000) return text.recent;
    return new Intl.DateTimeFormat(text.dateLocale, { dateStyle: "medium", timeStyle: "short" }).format(time);
  };
  const authNickname = (user) => {
    const metadataNickname = user?.user_metadata?.nickname;
    return typeof metadataNickname === "string" && metadataNickname.trim()
      ? metadataNickname.trim()
      : user?.email?.split("@")[0] || (locale === "en" ? "Gardener" : "Садовод");
  };
  const nicknameToEmail = async (nickname) => {
    const bytes = new TextEncoder().encode(nickname.normalize("NFKC").trim().toLocaleLowerCase("ru-RU"));
    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
    const identity = [...hash.slice(0, 16)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `flora-${identity}@login.flora-anotomy.invalid`;
  };
  const getPublicImage = (path) => {
    if (!path || !client) return "";
    return client.storage.from("silva-community").getPublicUrl(path).data.publicUrl;
  };
  const avatarMarkup = (nickname, path, className) => {
    const initial = esc((nickname || "S").slice(0, 1).toLocaleUpperCase(locale));
    const url = getPublicImage(path);
    return `<span class="${className}" role="img" aria-label="${esc(nickname)}"><span>${initial}</span>${url ? `<img src="${esc(url)}" alt="" loading="lazy">` : ""}</span>`;
  };
  const handleAvatarErrors = (container) => {
    container.querySelectorAll(".avatar-photo, .author-avatar img, .comment-avatar img, .account-avatar img, .profile-avatar img, .signup-avatar-preview img").forEach((image) => {
      image.addEventListener("error", () => image.remove(), { once: true });
    });
  };
  const removeStorageImage = async (path) => {
    if (!path) return;
    const { error } = await client.storage.from("silva-community").remove([path]);
    if (error) console.error("Could not remove the old community image.", error);
  };
  const requireAuth = (action) => {
    if (currentUser) return true;
    pendingAction = action;
    setStatus(authStatus, text.accountRequired);
    if (!authDialog.open) authDialog.showModal();
    document.querySelector("#nickname").focus();
    return false;
  };
  const updateAccountButton = () => {
    const button = document.querySelector("#account-open");
    const nickname = profile?.nickname || authNickname(currentUser);
    button.innerHTML = currentUser
      ? `${avatarMarkup(nickname, profile?.avatar_path, "account-avatar")}<span>${esc(nickname)}</span>`
      : esc(text.signIn);
    button.setAttribute("aria-label", currentUser ? `${nickname} · ${text.profileTitle}` : text.signIn);
    button.title = currentUser ? text.profileTitle : text.signIn;
    document.querySelectorAll(".signed-in-only").forEach((element) => { element.hidden = !currentUser; });
    handleAvatarErrors(button);
  };
  const ensureProfile = async (user, nickname) => {
    const { data: existing, error: readError } = await client
      .from("community_profiles")
      .select("user_id,nickname,avatar_path")
      .eq("user_id", user.id)
      .maybeSingle();
    if (readError) throw readError;
    if (existing) return existing;
    const { data, error } = await client.from("community_profiles")
      .insert({ user_id: user.id, nickname: nickname || authNickname(user) })
      .select("user_id,nickname,avatar_path")
      .single();
    if (error) throw error;
    return data;
  };
  const setCurrentUser = async (user) => {
    currentUser = user;
    profile = null;
    if (user && client) {
      try {
        profile = await ensureProfile(user, authNickname(user));
      } catch (error) {
        currentUser = null;
        console.error("Could not initialize community profile.", error);
        throw error;
      }
    }
    updateAccountButton();
    await loadFeed(true);
  };
  const renderCopy = () => {
    document.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (text[key]) element.textContent = text[key];
    });
    document.querySelector("#nickname").setAttribute("aria-label", text.nickname);
    document.querySelector("#password").setAttribute("aria-label", text.password);
    document.querySelector("#post-body").setAttribute("placeholder", text.postLabel);
    profileNickname.setAttribute("aria-label", text.nickname);
  };
  const setAuthMode = (mode) => {
    authMode = mode;
    document.querySelectorAll("[data-auth-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.authMode === mode);
    });
    document.querySelector("#auth-title").textContent = mode === "signup" ? text.signUp : text.signInTitle;
    document.querySelector("#auth-submit").textContent = mode === "signup" ? text.signUp : text.signIn;
    document.querySelector("#password").autocomplete = mode === "signup" ? "new-password" : "current-password";
    document.querySelector("#signup-avatar-control").hidden = mode !== "signup";
    document.querySelector("#signup-avatar-hint").hidden = mode !== "signup";
    setStatus(authStatus, mode === "signup" ? text.signupName : "");
  };
  const validateAvatarFile = (file, statusElement) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setStatus(statusElement, text.avatarType, true);
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus(statusElement, text.avatarTooLarge, true);
      return false;
    }
    return true;
  };
  const enableAvatarDrop = (picker, onFile) => {
    picker.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      picker.classList.add("is-dragging");
    });
    picker.addEventListener("dragenter", (event) => {
      event.preventDefault();
      picker.classList.add("is-dragging");
    });
    picker.addEventListener("dragleave", (event) => {
      if (!picker.contains(event.relatedTarget)) picker.classList.remove("is-dragging");
    });
    picker.addEventListener("drop", (event) => {
      event.preventDefault();
      picker.classList.remove("is-dragging");
      const file = [...(event.dataTransfer?.files || [])].find((item) => item.type.startsWith("image/"));
      if (file) onFile(file);
    });
  };
  const renderSignupAvatarPreview = () => {
    const preview = document.querySelector("#signup-avatar-preview");
    const nickname = document.querySelector("#nickname").value.trim() || "S";
    preview.innerHTML = `<span>${esc(nickname.slice(0, 1).toLocaleUpperCase(locale))}</span>`;
    document.querySelector("#signup-avatar-remove").hidden = !selectedSignupAvatar;
    document.querySelector("#signup-avatar-picker [data-copy='signupAvatar']").textContent =
      selectedSignupAvatar?.name || text.signupAvatar;
    if (!selectedSignupAvatar) return;
    const file = selectedSignupAvatar;
    const reader = new FileReader();
    signupAvatarReader = reader;
    reader.addEventListener("load", () => {
      if (signupAvatarReader !== reader || selectedSignupAvatar !== file) return;
      preview.innerHTML = `<span>${esc((document.querySelector("#nickname").value.trim() || "S").slice(0, 1).toLocaleUpperCase(locale))}</span><img src="${esc(reader.result)}" alt="">`;
    }, { once: true });
    reader.readAsDataURL(file);
  };
  const chooseSignupAvatar = (file) => {
    const input = document.querySelector("#signup-avatar-image");
    if (!validateAvatarFile(file, authStatus)) {
      input.value = "";
      selectedSignupAvatar = null;
      signupAvatarReader = null;
      renderSignupAvatarPreview();
      return;
    }
    selectedSignupAvatar = file;
    renderSignupAvatarPreview();
    setStatus(authStatus, "");
  };
  const chooseProfileAvatar = (file) => {
    if (!validateAvatarFile(file, profileStatus)) {
      avatarInput.value = "";
      selectedAvatar = null;
      avatarPreviewReader = null;
      updateProfilePreview();
      return;
    }
    selectedAvatar = file;
    removeExistingAvatar = false;
    updateProfilePreview();
    setStatus(profileStatus, "");
  };
  const saveSignupAvatar = async () => {
    if (!selectedSignupAvatar) return;
    let uploadedPath = "";
    let saved = false;
    try {
      uploadedPath = await uploadPhoto(selectedSignupAvatar);
      const { data, error } = await client.from("community_profiles")
        .update({ avatar_path: uploadedPath })
        .eq("user_id", currentUser.id)
        .select("user_id,nickname,avatar_path")
        .single();
      if (error) throw error;
      profile = data;
      saved = true;
      updateAccountButton();
      await loadFeed(true);
      setStatus(status, text.signupAvatarSaved);
    } catch (error) {
      console.error("Could not save the signup avatar.", error);
      if (uploadedPath && !saved) await removeStorageImage(uploadedPath);
      setStatus(status, text.signupAvatarFailed, true);
    }
  };
  const renderPost = (post) => {
    postsById.set(post.id, post);
    const nickname = post.author_nickname || (locale === "en" ? "Gardener" : "Садовод");
    const imageUrl = getPublicImage(post.image_path);
    const liked = Boolean(post.liked_by_me);
    const saved = Boolean(post.saved_by_me);
    const ownPost = currentUser?.id === post.author_id;
    const article = document.createElement("article");
    article.className = "post-card";
    article.dataset.postId = post.id;
    article.innerHTML = `
      <header class="post-author">
        ${avatarMarkup(nickname, post.author_avatar_path, "author-avatar")}
        <strong>${esc(nickname)}</strong>
        <time datetime="${esc(post.updated_at || post.created_at)}">${esc(formatDate(post.updated_at || post.created_at))}${post.updated_at && post.updated_at !== post.created_at ? " · " + esc(text.edited) : ""}</time>
      </header>
      <p class="post-body">${esc(post.body)}</p>
      ${imageUrl ? `<img class="post-image" src="${esc(imageUrl)}" alt="" loading="lazy" decoding="async">` : ""}
      <div class="post-actions">
        <button class="action-button ${liked ? "is-liked" : ""}" type="button" data-like="${esc(post.id)}" aria-pressed="${liked}" ${currentUser ? "" : `aria-label="${esc(text.like)}"`}>♡ <span>${esc(post.likes_count)}</span></button>
        <button class="action-button" type="button" data-comments="${esc(post.id)}" data-count="${esc(Number(post.comments_count) || 0)}" aria-expanded="false">↩ <span>${esc(text.postNumber(Number(post.comments_count) || 0))}</span></button>
        <button class="action-button ${saved ? "is-liked" : ""}" type="button" data-save-post="${esc(post.id)}" aria-pressed="${saved}">${esc(saved ? text.unsavePost : text.savePost)}</button>
        ${ownPost ? `<button class="report-button" type="button" data-edit-post="${esc(post.id)}">${esc(text.editPost)}</button><button class="report-button" type="button" data-delete-post="${esc(post.id)}">${esc(text.deletePost)}</button>` : ""}
        <button class="report-button" type="button" data-report-post="${esc(post.id)}">${esc(text.report)}</button>
      </div>
      <section class="comments" data-comments-panel="${esc(post.id)}" hidden></section>`;
    feed.append(article);
    handleAvatarErrors(article);
  };
  const loadFeed = async (reset = false) => {
    if (!client) {
      setStatus(status, text.noSupabase, true);
      return;
    }
    if (reset) {
      feedOffset = 0;
      feed.replaceChildren();
      loadedComments.clear();
      postsById.clear();
      loadMore.hidden = true;
    }
    setStatus(status, text.loading);
    document.querySelectorAll(".feed-tab").forEach((button) => {
      const active = button.dataset.sort === sortMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.setAttribute("aria-label", ({
        new: text.sortNew,
        top: text.sortTop,
        mine: text.myPosts,
        saved: text.savedPosts,
      })[button.dataset.sort]);
    });
    const { data, error } = await client.rpc("community_feed", {
      p_sort: sortMode,
      p_limit: 30,
      p_offset: feedOffset,
    });
    if (error) {
      console.error("Could not load community feed.", error);
      setStatus(status, text.failed, true);
      return;
    }
    const posts = Array.isArray(data) ? data : [];
    if (reset && posts.length === 0) {
      feed.innerHTML = `<p class="empty-state">${esc(sortMode === "saved" ? text.savedEmpty : sortMode === "mine" ? text.myEmpty : text.empty)}</p>`;
    } else {
      posts.forEach(renderPost);
    }
    feedOffset += posts.length;
    hasMore = posts.length === 30;
    loadMore.hidden = !hasMore;
    setStatus(status, "");
  };
  const loadComments = async (postId, panel) => {
    if (!client) return;
    panel.replaceChildren();
    const { data, error } = await client.from("community_comments")
      .select("id,post_id,author_id,body,created_at,community_profiles!community_comments_author_id_fkey(nickname,avatar_path)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) {
      console.error("Could not load post replies.", error);
      panel.textContent = text.failed;
      return;
    }
    if (!data.length) {
      const empty = document.createElement("p");
      empty.className = "comment-body";
      empty.textContent = text.noComments;
      panel.append(empty);
    } else {
      data.forEach((comment) => {
        const nickname = comment.community_profiles?.nickname || (locale === "en" ? "Gardener" : "Садовод");
        const ownsComment = currentUser?.id === comment.author_id;
        const item = document.createElement("article");
        item.className = "comment";
        item.dataset.commentId = comment.id;
        item.innerHTML = `<div class="comment-head">${avatarMarkup(nickname, comment.community_profiles?.avatar_path, "comment-avatar")}<strong>${esc(nickname)}</strong><time datetime="${esc(comment.created_at)}">${esc(formatDate(comment.created_at))}</time>${ownsComment ? `<button class="comment-report" type="button" data-edit-comment="${esc(comment.id)}">${esc(text.editPost)}</button><button class="comment-report" type="button" data-delete-comment="${esc(comment.id)}">${esc(text.deletePost)}</button>` : ""}<button class="comment-report" type="button" data-report-comment="${esc(comment.id)}">${esc(text.reportComment)}</button></div><p class="comment-body">${esc(comment.body)}</p>`;
        panel.append(item);
        handleAvatarErrors(item);
      });
    }
    if (currentUser) {
      const form = document.createElement("form");
      form.className = "comment-form";
      form.dataset.commentFor = postId;
      form.innerHTML = `<input name="body" maxlength="1000" required placeholder="${esc(text.commentPlaceholder)}" aria-label="${esc(text.commentPlaceholder)}"><button type="submit">${esc(text.send)}</button>`;
      panel.append(form);
    }
    loadedComments.add(postId);
  };
  const uploadPhoto = async (file) => {
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${currentUser.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("silva-community").upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    return path;
  };
  const updatePostImageLabel = () => {
    const hasCurrentImage = editingPostId && existingPostImage && !removeExistingPostImage;
    document.querySelector("#image-name").textContent =
      selectedImage?.name || (hasCurrentImage ? text.currentPhoto : "");
    document.querySelector("#remove-post-image").hidden = !selectedImage && !hasCurrentImage;
  };
  const createPost = async (event) => {
    event.preventDefault();
    if (!requireAuth(() => postDialog.showModal())) return;
    const body = document.querySelector("#post-body").value.trim();
    if (!body) {
      setStatus(postStatus, text.noText, true);
      return;
    }
    const button = document.querySelector("#post-submit");
    button.disabled = true;
    button.textContent = text.postWorking;
    let uploadedPath = "";
    let postPersisted = false;
    try {
      if (selectedImage) uploadedPath = await uploadPhoto(selectedImage);
      const imagePath = uploadedPath || (removeExistingPostImage ? null : existingPostImage);
      const result = editingPostId
        ? await client.from("community_posts").update({ body, image_path: imagePath })
          .eq("id", editingPostId).eq("author_id", currentUser.id)
        : await client.from("community_posts").insert({
          author_id: currentUser.id,
          body,
          image_path: imagePath || null,
        });
      const { error } = result;
      if (error) throw error;
      postPersisted = true;
      if (editingPostId && existingPostImage && imagePath !== existingPostImage) {
        await removeStorageImage(existingPostImage);
      }
      postDialog.close();
      postForm.reset();
      selectedImage = null;
      editingPostId = null;
      existingPostImage = null;
      removeExistingPostImage = false;
      updatePostImageLabel();
    } catch (error) {
      console.error("Could not publish community post.", error);
      if (uploadedPath && !postPersisted) {
        const { error: cleanupError } = await client.storage.from("silva-community").remove([uploadedPath]);
        if (cleanupError) console.error("Could not remove the unused community image.", cleanupError);
      }
      setStatus(postStatus, editingPostId ? text.editFailed : text.publishFailed, true);
      return;
    } finally {
      button.disabled = false;
      button.textContent = editingPostId ? text.saveChanges : text.publish;
    }
    await loadFeed(true);
  };
  const createComment = async (event) => {
    const form = event.target.closest("form[data-comment-for]");
    if (!form) return;
    event.preventDefault();
    if (!requireAuth()) return;
    const body = new FormData(form).get("body").toString().trim();
    if (!body) return;
    const button = form.querySelector("button");
    button.disabled = true;
    const { error } = await client.from("community_comments").insert({
      post_id: form.dataset.commentFor,
      author_id: currentUser.id,
      body,
    });
    if (error) {
      console.error("Could not send community reply.", error);
      button.disabled = false;
      setStatus(status, text.commentFailed, true);
      return;
    }
    const postCard = form.closest(".post-card");
    await loadComments(form.dataset.commentFor, postCard.querySelector(".comments"));
    const countButton = postCard.querySelector("[data-comments]");
    const count = Number(countButton.dataset.count || 0) + 1;
    countButton.dataset.count = String(count);
    countButton.querySelector("span").textContent = text.postNumber(count);
    setStatus(status, "");
  };
  const openPostEditor = (post) => {
    editingPostId = post.id;
    existingPostImage = post.image_path;
    removeExistingPostImage = false;
    selectedImage = null;
    postForm.reset();
    document.querySelector("#post-body").value = post.body;
    updatePostImageLabel();
    document.querySelector("#post-submit").textContent = text.saveChanges;
    document.querySelector("#post-dialog h2").textContent = text.editPost;
    setStatus(postStatus, "");
    postDialog.showModal();
  };
  const toggleSavedPost = async (postId) => {
    if (!requireAuth()) return;
    const post = postsById.get(postId);
    if (!post) return;
    const result = post.saved_by_me
      ? await client.from("community_saved_posts").delete().eq("post_id", postId).eq("user_id", currentUser.id)
      : await client.from("community_saved_posts").insert({ post_id: postId, user_id: currentUser.id });
    if (result.error) {
      console.error("Could not update saved community post.", result.error);
      setStatus(status, text.saveFailed, true);
      return;
    }
    await loadFeed(true);
  };
  const deletePost = async (postId) => {
    if (!window.confirm(text.confirmDeletePost)) return;
    const post = postsById.get(postId);
    const { error } = await client.from("community_posts").delete()
      .eq("id", postId).eq("author_id", currentUser.id);
    if (error) {
      console.error("Could not delete community post.", error);
      setStatus(status, text.deleteFailed, true);
      return;
    }
    if (post?.image_path) await removeStorageImage(post.image_path);
    await loadFeed(true);
  };
  const openCommentEditor = (button) => {
    const comment = button.closest(".comment");
    editingComment = comment?.dataset.commentId;
    document.querySelector("#comment-edit-body").value = comment?.querySelector(".comment-body").textContent || "";
    setStatus(document.querySelector("#comment-edit-status"), "");
    document.querySelector("#comment-edit-dialog").showModal();
  };
  const deleteComment = async (button) => {
    if (!window.confirm(text.confirmDeleteComment)) return;
    const item = button.closest(".comment");
    const { error } = await client.from("community_comments").delete()
      .eq("id", item.dataset.commentId).eq("author_id", currentUser.id);
    if (error) {
      console.error("Could not delete community reply.", error);
      setStatus(status, text.deleteFailed, true);
      return;
    }
    const card = button.closest(".post-card");
    await loadComments(card.dataset.postId, card.querySelector(".comments"));
    const countButton = card.querySelector("[data-comments]");
    const count = Math.max(0, Number(countButton.dataset.count || 0) - 1);
    countButton.dataset.count = String(count);
    countButton.querySelector("span").textContent = text.postNumber(count);
  };
  const updateProfilePreview = () => {
    const preview = document.querySelector("#profile-avatar-preview");
    const nickname = profileNickname.value || currentUser?.user_metadata?.nickname || "S";
    const path = removeExistingAvatar ? null : profile?.avatar_path;
    const url = getPublicImage(path);
    preview.innerHTML = `<span>${esc(nickname.slice(0, 1).toLocaleUpperCase(locale))}</span>${url ? `<img src="${esc(url)}" alt="">` : ""}`;
    document.querySelector("#avatar-remove").hidden =
      !selectedAvatar && (!profile?.avatar_path || removeExistingAvatar);
    document.querySelector("#profile-avatar-picker [data-copy='changeAvatar']").textContent =
      selectedAvatar?.name || text.changeAvatar;
    handleAvatarErrors(preview);
    if (selectedAvatar) {
      const file = selectedAvatar;
      const reader = new FileReader();
      avatarPreviewReader = reader;
      reader.addEventListener("load", () => {
        if (avatarPreviewReader !== reader || selectedAvatar !== file) return;
        preview.innerHTML = `<span>${esc((profileNickname.value || "S").slice(0, 1).toLocaleUpperCase(locale))}</span><img src="${esc(reader.result)}" alt="">`;
      }, { once: true });
      reader.readAsDataURL(file);
      document.querySelector("#profile-avatar-picker [data-copy='changeAvatar']").textContent = file.name;
    }
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    const nickname = profileNickname.value.normalize("NFKC").trim();
    if (!/^[\p{L}\p{N}_.-]{3,24}$/u.test(nickname)) {
      setStatus(profileStatus, text.invalidNickname, true);
      return;
    }
    const submit = document.querySelector("#profile-submit");
    submit.disabled = true;
    let uploadedAvatar = "";
    let profilePersisted = false;
    try {
      if (selectedAvatar) uploadedAvatar = await uploadPhoto(selectedAvatar);
      const avatarPath = uploadedAvatar || (removeExistingAvatar ? null : profile.avatar_path);
      const { data, error } = await client.from("community_profiles")
        .update({ nickname, avatar_path: avatarPath })
        .eq("user_id", currentUser.id)
        .select("user_id,nickname,avatar_path")
        .single();
      if (error) throw error;
      profilePersisted = true;
      const previousAvatar = profile.avatar_path;
      profile = data;
      if (previousAvatar && previousAvatar !== avatarPath) await removeStorageImage(previousAvatar);
      selectedAvatar = null;
      removeExistingAvatar = false;
      avatarPreviewReader = null;
      avatarInput.value = "";
      profileNickname.value = profile.nickname;
      updateProfilePreview();
      updateAccountButton();
      setStatus(profileStatus, text.profileSaved);
    } catch (error) {
      console.error("Could not save community profile.", error);
      if (uploadedAvatar && !profilePersisted) await removeStorageImage(uploadedAvatar);
      setStatus(profileStatus, text.profileSaveFailed, true);
    } finally {
      submit.disabled = false;
    }
    if (profilePersisted) await loadFeed(true);
  };
  const toggleLike = async (postId, button) => {
    if (!requireAuth()) return;
    button.disabled = true;
    const liked = button.getAttribute("aria-pressed") === "true";
    const query = client.from("community_votes");
    const result = liked
      ? await query.delete().eq("post_id", postId).eq("user_id", currentUser.id)
      : await query.insert({ post_id: postId, user_id: currentUser.id });
    if (result.error) {
      console.error("Could not update community vote.", result.error);
      setStatus(status, text.voteFailed, true);
      button.disabled = false;
      return;
    }
    await loadFeed(true);
  };
  const reportContent = async (target, id) => {
    if (!requireAuth()) return;
    const reason = window.prompt(text.reportPrompt);
    if (reason === null) return;
    const trimmedReason = reason.trim().slice(0, 500);
    if (!trimmedReason) return;
    const localKey = `${target}:${id}`;
    if (reportTargetsSent.has(localKey)) {
      setStatus(status, text.reportDuplicate);
      return;
    }
    const { error } = await client.from("community_reports").insert({
      reporter_id: currentUser.id,
      [target === "post" ? "post_id" : "comment_id"]: id,
      reason: trimmedReason,
    });
    if (error) {
      if (error.code === "23505") {
        reportTargetsSent.add(localKey);
        setStatus(status, text.reportDuplicate);
      } else {
        console.error("Could not submit community report.", error);
        setStatus(status, text.reportFailed, true);
      }
      return;
    }
    reportTargetsSent.add(localKey);
    setStatus(status, text.reportSent);
  };

  document.querySelectorAll("[data-copy]").forEach((element) => {
    const key = element.dataset.copy;
    if (text[key]) element.textContent = text[key];
  });
  const localeSelect = document.querySelector("#locale-select");
  localeSelect.value = locale;
  localeSelect.addEventListener("change", () => {
    localStorage.setItem("silva-community-locale", localeSelect.value);
    const url = new URL(location.href);
    url.searchParams.set("locale", localeSelect.value);
    location.assign(url.href);
  });
  document.querySelectorAll("[data-auth-mode]").forEach((button) =>
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode))
  );
  document.querySelector("#account-open").addEventListener("click", async () => {
    if (currentUser) {
      profileNickname.value = profile.nickname;
      selectedAvatar = null;
      removeExistingAvatar = false;
      avatarInput.value = "";
      updateProfilePreview();
      setStatus(profileStatus, "");
      profileDialog.showModal();
      return;
    }
    if (!client) {
      setStatus(status, text.noSupabase, true);
      return;
    }
    if (!authDialog.open) authDialog.showModal();
  });
  document.querySelector("#compose-open").addEventListener("click", () => {
    if (!requireAuth(() => postDialog.showModal())) return;
    editingPostId = null;
    existingPostImage = null;
    removeExistingPostImage = false;
    selectedImage = null;
    postForm.reset();
    document.querySelector("#image-name").textContent = "";
    document.querySelector("#remove-post-image").hidden = true;
    document.querySelector("#post-submit").textContent = text.publish;
    document.querySelector("#post-dialog h2").textContent = text.composeTitle;
    setStatus(postStatus, "");
    if (!postDialog.open) postDialog.showModal();
  });
  document.querySelector("#refresh-feed").addEventListener("click", () => void loadFeed(true));
  document.querySelectorAll(".feed-tab").forEach((button) => button.addEventListener("click", () => {
    if (["mine", "saved"].includes(button.dataset.sort) && !requireAuth()) return;
    sortMode = button.dataset.sort;
    void loadFeed(true);
  }));
  loadMore.addEventListener("click", () => void loadFeed(false));
  feed.addEventListener("click", async (event) => {
    const likeButton = event.target.closest("[data-like]");
    if (likeButton) {
      await toggleLike(likeButton.dataset.like, likeButton);
      return;
    }
    const saveButton = event.target.closest("[data-save-post]");
    if (saveButton) {
      await toggleSavedPost(saveButton.dataset.savePost);
      return;
    }
    const editPostButton = event.target.closest("[data-edit-post]");
    if (editPostButton) {
      if (requireAuth()) openPostEditor(postsById.get(editPostButton.dataset.editPost));
      return;
    }
    const deletePostButton = event.target.closest("[data-delete-post]");
    if (deletePostButton) {
      if (requireAuth()) await deletePost(deletePostButton.dataset.deletePost);
      return;
    }
    const editCommentButton = event.target.closest("[data-edit-comment]");
    if (editCommentButton) {
      if (requireAuth()) openCommentEditor(editCommentButton);
      return;
    }
    const deleteCommentButton = event.target.closest("[data-delete-comment]");
    if (deleteCommentButton) {
      if (requireAuth()) await deleteComment(deleteCommentButton);
      return;
    }
    const commentsButton = event.target.closest("[data-comments]");
    if (commentsButton) {
      const postId = commentsButton.dataset.comments;
      const panel = feed.querySelector(`[data-comments-panel="${CSS.escape(postId)}"]`);
      const opening = panel.hidden;
      panel.hidden = !opening;
      commentsButton.setAttribute("aria-expanded", String(opening));
      if (opening && !loadedComments.has(postId)) await loadComments(postId, panel);
      return;
    }
    const reportPostButton = event.target.closest("[data-report-post]");
    if (reportPostButton) {
      await reportContent("post", reportPostButton.dataset.reportPost);
      return;
    }
    const reportCommentButton = event.target.closest("[data-report-comment]");
    if (reportCommentButton) {
      await reportContent("comment", reportCommentButton.dataset.reportComment);
    }
  });
  feed.addEventListener("submit", (event) => void createComment(event));
  document.querySelector("#post-image").addEventListener("change", (event) => {
    const file = event.target.files[0] || null;
    if (!file) {
      selectedImage = null;
      updatePostImageLabel();
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      event.target.value = "";
      setStatus(postStatus, text.imageType, true);
      selectedImage = null;
      updatePostImageLabel();
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setStatus(postStatus, text.imageTooLarge, true);
      selectedImage = null;
      updatePostImageLabel();
      return;
    }
    selectedImage = file;
    removeExistingPostImage = false;
    updatePostImageLabel();
    setStatus(postStatus, "");
  });
  document.querySelector("#remove-post-image").addEventListener("click", () => {
    selectedImage = null;
    document.querySelector("#post-image").value = "";
    if (editingPostId) removeExistingPostImage = true;
    updatePostImageLabel();
  });
  postForm.addEventListener("submit", (event) => void createPost(event));
  profileForm.addEventListener("submit", (event) => void saveProfile(event));
  profileNickname.addEventListener("input", updateProfilePreview);
  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0] || null;
    if (!file) {
      selectedAvatar = null;
      avatarPreviewReader = null;
      updateProfilePreview();
      return;
    }
    chooseProfileAvatar(file);
  });
  enableAvatarDrop(document.querySelector("#profile-avatar-picker"), chooseProfileAvatar);
  document.querySelector("#avatar-remove").addEventListener("click", () => {
    selectedAvatar = null;
    avatarInput.value = "";
    removeExistingAvatar = true;
    updateProfilePreview();
  });
  document.querySelector("#sign-out").addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      console.error("Could not sign out from the community.", error);
      setStatus(profileStatus, text.loginFailed, true);
      return;
    }
    profileDialog.close();
    sortMode = "new";
    await setCurrentUser(null);
  });
  document.querySelector("#nickname").addEventListener("input", renderSignupAvatarPreview);
  document.querySelector("#signup-avatar-image").addEventListener("change", (event) => {
    const file = event.target.files[0] || null;
    if (!file) {
      selectedSignupAvatar = null;
      signupAvatarReader = null;
      renderSignupAvatarPreview();
      return;
    }
    chooseSignupAvatar(file);
  });
  enableAvatarDrop(document.querySelector("#signup-avatar-picker"), chooseSignupAvatar);
  document.querySelector("#signup-avatar-remove").addEventListener("click", () => {
    selectedSignupAvatar = null;
    signupAvatarReader = null;
    document.querySelector("#signup-avatar-image").value = "";
    renderSignupAvatarPreview();
  });
  document.querySelector("#comment-edit-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = document.querySelector("#comment-edit-body").value.trim();
    if (!body || !editingComment) return;
    const submit = event.currentTarget.querySelector("button[type=submit]");
    submit.disabled = true;
    const { error } = await client.from("community_comments").update({ body })
      .eq("id", editingComment).eq("author_id", currentUser.id);
    if (error) {
      console.error("Could not update community reply.", error);
      setStatus(document.querySelector("#comment-edit-status"), text.editFailed, true);
      submit.disabled = false;
      return;
    }
    const comment = document.querySelector(`[data-comment-id="${CSS.escape(editingComment)}"]`);
    if (comment) comment.querySelector(".comment-body").textContent = body;
    document.querySelector("#comment-edit-dialog").close();
    editingComment = null;
    submit.disabled = false;
  });
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) {
      setStatus(authStatus, text.noSupabase, true);
      return;
    }
    const nickname = document.querySelector("#nickname").value.normalize("NFKC").trim();
    const password = document.querySelector("#password").value;
    if (!/^[\p{L}\p{N}_.-]{3,24}$/u.test(nickname)) {
      setStatus(authStatus, locale === "en" ? "Use 3–24 letters, numbers, dots, hyphens, or underscores." : locale === "uk" ? "Використовуй 3–24 літери, цифри, крапки, дефіси чи підкреслення." : "Используй 3–24 буквы, цифры, точки, дефисы или подчёркивания.", true);
      return;
    }
    if (password.length < 8) {
      setStatus(authStatus, locale === "en" ? "Password must be at least 8 characters." : locale === "uk" ? "Пароль має містити щонайменше 8 символів." : "Пароль должен содержать не менее 8 символов.", true);
      return;
    }
    const submit = document.querySelector("#auth-submit");
    const submittingMode = authMode;
    submit.disabled = true;
    document.querySelectorAll("[data-auth-mode]").forEach((button) => { button.disabled = true; });
    setStatus(authStatus, text.authWorking);
    try {
      const email = await nicknameToEmail(nickname);
      const result = submittingMode === "signup"
        ? await client.auth.signUp({ email, password, options: { data: { nickname } } })
        : await client.auth.signInWithPassword({ email, password });
      if (result.error || !result.data.session) {
        console.error("Community authentication failed.", result.error);
        setStatus(authStatus, submittingMode === "signup" ? text.signupFailed : text.loginFailed, true);
        return;
      }
      try {
        await setCurrentUser(result.data.user);
      } catch (error) {
        setStatus(authStatus, text.profileFailed, true);
        return;
      }
      if (submittingMode === "signup") await saveSignupAvatar();
      authDialog.close();
      authForm.reset();
      selectedSignupAvatar = null;
      signupAvatarReader = null;
      document.querySelector("#signup-avatar-image").value = "";
      renderSignupAvatarPreview();
      const action = pendingAction;
      pendingAction = null;
      if (typeof action === "function") action();
    } catch (error) {
      console.error("Community authentication request failed.", error);
      setStatus(authStatus, submittingMode === "signup" ? text.signupFailed : text.loginFailed, true);
    } finally {
      submit.disabled = false;
      document.querySelectorAll("[data-auth-mode]").forEach((button) => { button.disabled = false; });
    }
  });

  renderCopy();
  setAuthMode("login");
  renderSignupAvatarPreview();
  updateAccountButton();
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-ready")));
  if (!client) {
    setStatus(status, text.noSupabase, true);
  } else {
    client.auth.getSession().then(async ({ data, error }) => {
      if (error) throw error;
      await setCurrentUser(data.session?.user || null);
    }).catch((error) => {
      console.error("Could not restore community account session.", error);
      setStatus(status, text.profileFailed, true);
    });
  }
})();
