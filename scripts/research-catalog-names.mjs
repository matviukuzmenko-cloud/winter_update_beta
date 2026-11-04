import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localizationDirectory = path.join(root, "localization");
const catalogPath = path.join(localizationDirectory, "catalog-source.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const overrides = JSON.parse(await readFile(
  path.join(localizationDirectory, "manual-translation-overrides.json"),
  "utf8",
));
const batchSize = 30;
const endpoint = "https://query.wikidata.org/sparql";
const isCommonLabel = (label, latin) =>
  Boolean(label?.trim()) && label.trim().toLocaleLowerCase("en") !== latin.toLocaleLowerCase("en");
const preferredName = (values) =>
  [...values].sort((first, second) =>
    first.localeCompare(second, "en", { sensitivity: "base" })
  )[0] || "";

const batches = [];
for (let index = 0; index < catalog.records.length; index += batchSize) {
  batches.push(catalog.records.slice(index, index + batchSize));
}

const escapeLiteral = (value) => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
const research = new Map();

for (let index = 0; index < batches.length; index += 1) {
  const records = batches[index];
  const names = records.map((record) => escapeLiteral(record.latin)).join(" ");
  const query = `
    SELECT ?scientificName ?entity ?labelEn ?labelUk ?commonName ?commonNameLanguage WHERE {
      VALUES ?scientificName { ${names} }
      ?entity wdt:P225 ?scientificName .
      OPTIONAL {
        ?entity rdfs:label ?labelEn .
        FILTER(LANG(?labelEn) = "en")
      }
      OPTIONAL {
        ?entity rdfs:label ?labelUk .
        FILTER(LANG(?labelUk) = "uk")
      }
      OPTIONAL {
        ?entity wdt:P1843 ?commonName .
        BIND(LANG(?commonName) AS ?commonNameLanguage)
        FILTER(?commonNameLanguage IN ("en", "uk"))
      }
    }`;
  const url = new URL(endpoint);
  url.searchParams.set("query", query);

  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "SilvaQuietaBotanicalCatalog/1.0 (plant name localization)",
      },
      signal: AbortSignal.timeout(45000),
    });
    if (response.ok) break;
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`Wikidata query failed with HTTP ${response.status} for batch ${index + 1}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
  }

  const result = await response.json();
  for (const binding of result.results?.bindings || []) {
    const latin = binding.scientificName?.value;
    if (!latin) continue;
    const entry = research.get(latin) || {
      entityUrl: binding.entity?.value || "",
      labelEn: "",
      labelUk: "",
      vernacularEn: new Set(),
      vernacularUk: new Set(),
    };
    entry.labelEn ||= binding.labelEn?.value || "";
    entry.labelUk ||= binding.labelUk?.value || "";
    const commonName = binding.commonName?.value?.trim();
    const language = binding.commonNameLanguage?.value;
    if (commonName && language === "en") entry.vernacularEn.add(commonName);
    if (commonName && language === "uk") entry.vernacularUk.add(commonName);
    research.set(latin, entry);
  }

  if ((index + 1) % 5 === 0 || index + 1 === batches.length) {
    console.log(`Wikidata: checked ${Math.min((index + 1) * batchSize, catalog.records.length)}/${catalog.records.length} species.`);
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
}

const summary = {
  checked: catalog.records.length,
  wikidataMatches: 0,
  ukrainianWikidataNames: 0,
  englishWikidataNames: 0,
  englishSourceFallbacks: 0,
  latinFallbacks: { uk: 0, en: 0 },
};

for (const record of catalog.records) {
  const entry = research.get(record.latin);
  const sourceUrl = entry?.entityUrl?.replace("http://www.wikidata.org/", "https://www.wikidata.org/") || "";
  if (entry) summary.wikidataMatches += 1;
  record.uk ||= { care: {} };
  record.en ||= { care: {} };

  const ukrainianLabel = isCommonLabel(entry?.labelUk, record.latin) &&
    /[А-Яа-яІіЇїЄєҐґ]/.test(entry.labelUk)
    ? entry.labelUk.trim()
    : "";
  const ukrainianVernacular = preferredName(entry?.vernacularUk || []);
  const manualUkrainian = overrides.uk?.[record.latin.toLocaleLowerCase("en")];
  const previousUkrainianName = record.uk.name;
  const ukrainianName = typeof manualUkrainian === "string" && manualUkrainian.trim()
    ? manualUkrainian.trim()
    : ukrainianLabel || ukrainianVernacular ||
      (!record.nameWasTranscribed && isCommonLabel(previousUkrainianName, record.latin) ? previousUkrainianName : "");
  if (ukrainianName) {
    record.uk.name = ukrainianName;
    record.uk.nameBasis = manualUkrainian
      ? "manual-review"
      : ukrainianLabel
        ? "wikidata-label"
        : ukrainianVernacular
          ? "wikidata-vernacular-name"
          : "source-common-name-translation";
    if (manualUkrainian) {
      const manualSourceUrl = record.uk.nameSourceUrl || record.en.nameSourceUrl || sourceUrl;
      if (manualSourceUrl) record.uk.nameSourceUrl = manualSourceUrl;
      else delete record.uk.nameSourceUrl;
    } else if (ukrainianLabel || ukrainianVernacular) {
      record.uk.nameSourceUrl = sourceUrl;
      summary.ukrainianWikidataNames += 1;
    } else {
      delete record.uk.nameSourceUrl;
    }
  } else {
    record.uk.name = record.latin;
    record.uk.nameBasis = "scientific-name";
    delete record.uk.nameSourceUrl;
    summary.latinFallbacks.uk += 1;
  }

  const englishVernacular = preferredName(entry?.vernacularEn || []);
  const englishLabel = isCommonLabel(entry?.labelEn, record.latin) ? entry.labelEn.trim() : "";
  const sourceEnglishName = record.sourceEnglishName?.trim();
  const sourceCommonName = sourceEnglishName &&
    sourceEnglishName.toLocaleLowerCase("en") !== record.latin.toLocaleLowerCase("en") &&
    /^[\x20-\x7e]+$/.test(sourceEnglishName)
    ? sourceEnglishName
    : "";
  const manualEnglish = overrides.en?.[record.latin.toLocaleLowerCase("en")];
  const previousEnglishName = record.en.name;
  const englishName = typeof manualEnglish === "string" && manualEnglish.trim()
    ? manualEnglish.trim()
    : englishVernacular || englishLabel || sourceCommonName ||
      (!record.nameWasTranscribed && isCommonLabel(previousEnglishName, record.latin) ? previousEnglishName : "");
  if (englishName) {
    record.en.name = englishName;
    record.en.nameBasis = manualEnglish
      ? "manual-review"
      : englishVernacular || englishLabel
        ? "wikidata-common-name"
        : sourceCommonName
          ? "catalog-source-common-name"
          : "source-common-name-translation";
    if (manualEnglish) {
      const manualSourceUrl = record.en.nameSourceUrl || sourceUrl;
      if (manualSourceUrl) record.en.nameSourceUrl = manualSourceUrl;
      else delete record.en.nameSourceUrl;
    } else if (englishVernacular || englishLabel) {
      record.en.nameSourceUrl = sourceUrl;
      summary.englishWikidataNames += 1;
    } else {
      delete record.en.nameSourceUrl;
      if (sourceCommonName) summary.englishSourceFallbacks += 1;
    }
  } else {
    record.en.name = record.latin;
    record.en.nameBasis = "scientific-name";
    delete record.en.nameSourceUrl;
    summary.latinFallbacks.en += 1;
  }
}

catalog.nameResearch = {
  provider: "Wikidata",
  property: "P225 exact scientific name; P1843 vernacular name",
  retrievedAt: new Date().toISOString(),
  summary,
};
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

console.log(JSON.stringify(summary, null, 2));
