import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localizationDirectory = path.join(root, "localization");
const catalogPath = path.join(localizationDirectory, "catalog-source.json");
const progressPath = path.join(localizationDirectory, "inaturalist-common-name-research.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const progress = JSON.parse(await readFile(progressPath, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "{}";
  throw error;
}));
const results = progress.results || {};
const requestIntervalMs = 1000;
let lastRequestAt = 0;

async function fetchJson(url, label) {
  const wait = requestIntervalMs - (Date.now() - lastRequestAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    lastRequestAt = Date.now();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "SilvaQuietaBotanicalCatalog/1.0 (plant common-name research)",
        },
        signal: AbortSignal.timeout(30000),
      });
    } catch (error) {
      if (attempt === 4) {
        throw new Error(`${label} failed after retries: ${error.message}`, { cause: error });
      }
      await new Promise((resolve) => setTimeout(resolve, Math.max(attempt * 2000, requestIntervalMs)));
      continue;
    }
    if (response.ok) return response.json();
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`${label} failed with HTTP ${response.status}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, Math.max(attempt * 2000, requestIntervalMs)));
  }
  throw new Error(`${label} failed after retries.`);
}

const manualOverrides = JSON.parse(await readFile(
  path.join(localizationDirectory, "manual-translation-overrides.json"),
  "utf8",
));
const manualEnglishNames = new Set(Object.keys(manualOverrides.en || {}));
const candidates = catalog.records.filter((record) =>
  ["source-common-name-translation", "scientific-name"].includes(record.en?.nameBasis) ||
  manualEnglishNames.has(record.latin.toLocaleLowerCase("en"))
);
const pending = candidates.filter((record) => !results[record.latin]);
let completed = 0;

for (const record of pending) {
  const searchUrl = new URL("https://api.inaturalist.org/v1/taxa/autocomplete");
  searchUrl.searchParams.set("q", record.latin);
  searchUrl.searchParams.set("rank", "species");
  searchUrl.searchParams.set("locale", "en");
  const search = await fetchJson(searchUrl, `iNaturalist search for ${record.latin}`);
  const taxon = (search.results || []).find((item) =>
    item.name?.toLocaleLowerCase("en") === record.latin.toLocaleLowerCase("en")
  );

  if (!taxon) {
    results[record.latin] = { status: "no-exact-match" };
  } else {
    const detailUrl = new URL(`https://api.inaturalist.org/v1/taxa/${taxon.id}`);
    detailUrl.searchParams.set("locale", "en");
    const detail = await fetchJson(detailUrl, `iNaturalist taxon details for ${record.latin}`);
    const details = detail.results?.[0] || detail.taxon || detail;
    const commonName = details.preferred_common_name?.trim() || "";
    results[record.latin] = commonName &&
      commonName.toLocaleLowerCase("en") !== record.latin.toLocaleLowerCase("en")
      ? {
          status: "common-name-found",
          commonName,
          source: `https://www.inaturalist.org/taxa/${taxon.id}`,
        }
      : {
          status: "no-common-name",
          source: `https://www.inaturalist.org/taxa/${taxon.id}`,
        };
  }

  completed += 1;
  if (completed % 20 === 0 || completed === pending.length) {
    await writeFile(progressPath, `${JSON.stringify({ source: "iNaturalist", results }, null, 2)}\n`, "utf8");
    console.log(`iNaturalist exact-name checks: ${completed}/${pending.length}.`);
  }
}

let exactMatches = 0;
let commonNamesApplied = 0;
let unverifiedTranslationsRemoved = 0;
for (const record of candidates) {
  const result = results[record.latin];
  if (!result) continue;
  if (result.status !== "no-exact-match") exactMatches += 1;

  const manualName = manualOverrides.en?.[record.latin.toLocaleLowerCase("en")];
  if (typeof manualName === "string" && manualName.trim()) {
    record.en.name = manualName.trim();
    record.en.nameBasis = "manual-review";
    if (result.source) record.en.nameSourceUrl = result.source;
    else delete record.en.nameSourceUrl;
  } else if (result.status === "common-name-found") {
    record.en.name = result.commonName;
    record.en.nameBasis = "inaturalist-common-name";
    record.en.nameSourceUrl = result.source;
    commonNamesApplied += 1;
  } else if (record.en.nameBasis === "source-common-name-translation") {
    record.en.name = record.latin;
    record.en.nameBasis = "scientific-name";
    delete record.en.nameSourceUrl;
    unverifiedTranslationsRemoved += 1;
  }
}

const ukrainianTaxa = catalog.records.filter((record) => {
  const result = results[record.latin];
  return Boolean(result?.source && result.source.match(/\/taxa\/\d+$/));
});
const pendingUkrainian = ukrainianTaxa.filter((record) => !results[record.latin].ukrainianStatus);
completed = 0;
for (const record of pendingUkrainian) {
  const result = results[record.latin];
  const taxonId = result.source.match(/\/taxa\/(\d+)$/)?.[1];
  if (!taxonId) continue;

  const detailUrl = new URL(`https://api.inaturalist.org/v1/taxa/${taxonId}`);
  detailUrl.searchParams.set("locale", "uk");
  const detail = await fetchJson(detailUrl, `iNaturalist Ukrainian name for ${record.latin}`);
  const details = detail.results?.[0] || detail.taxon || detail;
  const commonName = details.preferred_common_name?.trim() || "";
  result.ukrainianStatus = commonName &&
    commonName.toLocaleLowerCase("en") !== record.latin.toLocaleLowerCase("en")
    ? "common-name-found"
    : "no-common-name";
  if (result.ukrainianStatus === "common-name-found") {
    result.ukrainianCommonName = commonName;
  }

  completed += 1;
  if (completed % 20 === 0 || completed === pendingUkrainian.length) {
    await writeFile(progressPath, `${JSON.stringify({ source: "iNaturalist", results }, null, 2)}\n`, "utf8");
    console.log(`iNaturalist Ukrainian-name checks: ${completed}/${pendingUkrainian.length}.`);
  }
}

for (const record of ukrainianTaxa) {
  const result = results[record.latin];
  const hasManualName = manualOverrides.uk?.[record.latin.toLocaleLowerCase("en")];
  if (hasManualName || result.ukrainianStatus !== "common-name-found") continue;
  if (!["scientific-name", "source-common-name-translation"].includes(record.uk.nameBasis)) continue;
  record.uk.name = result.ukrainianCommonName;
  record.uk.nameBasis = "inaturalist-common-name";
  record.uk.nameSourceUrl = result.source;
}

for (const record of catalog.records) {
  const manualName = manualOverrides.uk?.[record.latin.toLocaleLowerCase("en")];
  if (typeof manualName !== "string" || !manualName.trim()) continue;
  record.uk.name = manualName.trim();
  record.uk.nameBasis = "manual-review";
  const sourceUrl = record.uk.nameSourceUrl || record.en?.nameSourceUrl || results[record.latin]?.source;
  if (sourceUrl) record.uk.nameSourceUrl = sourceUrl;
  else delete record.uk.nameSourceUrl;
}

const report = catalog.nameResearch.iNaturalist || {
  checked: candidates.length,
  exactTaxonMatches: exactMatches,
  englishCommonNamesApplied: commonNamesApplied,
  unverifiedTranslationsRemoved,
};
const researchedUkrainianTaxa = ukrainianTaxa.filter((record) => results[record.latin].ukrainianStatus);
report.ukrainianTaxaChecked = researchedUkrainianTaxa.length;
report.ukrainianCommonNamesFound = researchedUkrainianTaxa.filter((record) =>
  results[record.latin].ukrainianStatus === "common-name-found"
).length;
report.ukrainianCommonNamesApplied = catalog.records.filter((record) =>
  record.uk.nameBasis === "inaturalist-common-name"
).length;
catalog.nameResearch.iNaturalist = report;
catalog.nameResearch.finalCatalogSummary = Object.fromEntries(["uk", "en"].map((locale) => {
  const nameBasisCounts = {};
  let scientificNameFallbacks = 0;
  for (const record of catalog.records) {
    const basis = record[locale].nameBasis || "unknown";
    nameBasisCounts[basis] = (nameBasisCounts[basis] || 0) + 1;
    if (record[locale].name.toLocaleLowerCase("en") === record.latin.toLocaleLowerCase("en")) {
      scientificNameFallbacks += 1;
    }
  }
  return [locale, {
    records: catalog.records.length,
    scientificNameFallbacks,
    nameBasisCounts,
  }];
}));
await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
for (const locale of ["uk", "en"]) {
  const entries = Object.fromEntries(catalog.records.map((record) => [
    record.latin.toLocaleLowerCase("en"),
    record[locale],
  ]));
  await writeFile(
    path.join(localizationDirectory, `catalog-${locale}.js`),
    `window.FLORA_CATALOG_LOCALIZATION = ${JSON.stringify(entries)};\n`,
    "utf8",
  );
}
await writeFile(progressPath, `${JSON.stringify({ source: "iNaturalist", results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
