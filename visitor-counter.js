(() => {
  const yesterdayOutput = document.querySelector("#visitor-yesterday");
  const onlineOutput = document.querySelector("#visitor-online");
  const card = document.querySelector(".visitor-fact");
  const endpoint = window.FLORA_VISITOR_STATS_ENDPOINT;
  if (!yesterdayOutput || !onlineOutput || !card || !endpoint) return;

  const visitorIdKey = "silva-anonymous-visitor-id";
  const visitorIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const formatter = new Intl.NumberFormat(window.FLORA_LOCALE || "ru");
  let visitorId;

  try {
    const savedId = localStorage.getItem(visitorIdKey);
    visitorId = visitorIdPattern.test(savedId || "") ? savedId : crypto.randomUUID();
    localStorage.setItem(visitorIdKey, visitorId);
  } catch (error) {
    console.error("Could not save the anonymous visitor ID.", error);
    visitorId = crypto.randomUUID();
  }

  const parseCount = (value) => {
    const count = typeof value === "number" ? value : Number(value);
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new TypeError("The visitor statistics response contains an invalid count.");
    }
    return count;
  };

  let requestPending = false;
  const updateStats = async () => {
    if (requestPending || document.visibilityState === "hidden") return;
    requestPending = true;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Visitor statistics request failed: HTTP ${response.status}`);
      const stats = await response.json();
      yesterdayOutput.textContent = formatter.format(parseCount(stats.yesterday));
      onlineOutput.textContent = formatter.format(parseCount(stats.online));
      card.dataset.state = "ready";
    } catch (error) {
      card.dataset.state = "unavailable";
      console.error("Visitor statistics could not be updated.", error);
    } finally {
      requestPending = false;
    }
  };

  const scheduleUpdate = () => {
    window.setTimeout(async () => {
      await updateStats();
      scheduleUpdate();
    }, 60_000);
  };
  void updateStats();
  scheduleUpdate();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void updateStats();
  });
})();
