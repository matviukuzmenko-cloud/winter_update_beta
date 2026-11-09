(() => {
  const productionHosts = new Set([
    "silvaquieta.com",
    "www.silvaquieta.com",
    "ailab.silvaquieta.com",
    "community.silvaquieta.com",
    "os.silvaquieta.com",
  ]);

  if (window.location.protocol !== "https:" || !productionHosts.has(window.location.hostname)) {
    return;
  }

  const language = (navigator.language || "").toLowerCase();
  const notice = language.startsWith("uk")
    ? "Silva Quieta: API і обмеження запитів працюють на сервері, не в цій вкладці."
    : language.startsWith("ru")
      ? "Silva Quieta: API и ограничения запросов работают на сервере, а не в этой вкладке."
      : "Silva Quieta: API and request limits are enforced server-side, not in this tab.";

  console.info(notice);
})();
