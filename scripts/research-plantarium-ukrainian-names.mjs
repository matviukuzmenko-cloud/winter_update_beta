import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localizationDirectory = path.join(root, "localization");
const catalogPath = path.join(localizationDirectory, "catalog-source.json");
const progressPath = path.join(localizationDirectory, "plantarium-ukrainian-name-research.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const progress = JSON.parse(await readFile(progressPath, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "{}";
  throw error;
}));
const results = progress.results || {};
const requestIntervalMs = 1000;
let lastRequestAt = 0;

async function fetchRespectfully(url, label) {
  const wait = requestIntervalMs - (Date.now() - lastRequestAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    lastRequestAt = Date.now();
    response = await fetch(url, {
      headers: { "User-Agent": "SilvaQuietaBotanicalCatalog/1.0 (plant name research)" },
      signal: AbortSignal.timeout(30000),
    });
    if (response.ok) return response;
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`${label} failed with HTTP ${response.status}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 2500));
  }
  throw new Error(`${label} failed after retries.`);
}

const candidates = catalog.records.filter((record) =>
  record.uk?.name?.trim().toLocaleLowerCase("en") === record.latin.toLocaleLowerCase("en")
);
const researchedLatinNames = new Set(Object.keys(results));
console.log(`Using ${researchedLatinNames.size} saved Plantarium lookups; no additional Plantarium requests will be made.`);

const russianNames = candidates
  .filter((record) => researchedLatinNames.has(record.latin))
  .filter((record) => results[record.latin]?.status === "found-russian-name")
  .map((record) => ({ latin: record.latin, russianName: results[record.latin].russianName }));
const translationBatches = [];
let translationBatch = [];
let translationBatchLength = 0;
for (const [index, item] of russianNames.entries()) {
  const marker = `ZXQNAME${index.toString().padStart(4, "0")}ZXQ`;
  const text = `${marker}\n${item.russianName}\n`;
  if (translationBatch.length && translationBatchLength + text.length > 3000) {
    translationBatches.push(translationBatch);
    translationBatch = [];
    translationBatchLength = 0;
  }
  translationBatch.push({ ...item, marker, index });
  translationBatchLength += text.length;
}
if (translationBatch.length) translationBatches.push(translationBatch);

let completedTranslations = 0;
for (const batch of translationBatches) {
  const pending = batch.filter((item) =>
    !results[item.latin]?.ukrainianName &&
    results[item.latin]?.status !== "latin-only"
  );
  if (pending.length) {
    const text = pending.map((item) => `${item.marker}\n${item.russianName}\n`).join("");
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "ru");
    url.searchParams.set("tl", "uk");
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);
    let response;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        response = await fetchRespectfully(url, `Ukrainian plant-name translation batch ${completedTranslations + 1}`);
      } catch (error) {
        if (attempt === 5 || !/HTTP 429/.test(error.message)) throw error;
        await new Promise((resolve) => setTimeout(resolve, attempt * 12000));
      }
      if (response?.ok) break;
    }

    const result = await response.json();
    if (!Array.isArray(result?.[0])) {
      throw new Error(`Invalid Google Translate response for Ukrainian name batch ${completedTranslations + 1}.`);
    }
    const translated = result[0].map((segment) => segment[0] || "").join("");
    const markers = translated.match(/ZXQNAME\d{4}ZXQ/g) || [];
    if (markers.length !== pending.length || pending.some((item) => !markers.includes(item.marker))) {
      throw new Error(`Translation markers were changed or omitted in Ukrainian name batch ${completedTranslations + 1}.`);
    }
    for (let index = 0; index < pending.length; index += 1) {
      const item = pending[index];
      if (markers[index] !== item.marker) {
        throw new Error(`Translation order changed in Ukrainian name batch ${completedTranslations + 1}.`);
      }
      const start = translated.indexOf(item.marker) + item.marker.length;
      const end = index + 1 < pending.length ? translated.indexOf(pending[index + 1].marker, start) : translated.length;
      const ukrainianName = translated.slice(start, end).trim();
      if (!/[А-Яа-яІіЇїЄєҐґ]/.test(ukrainianName)) {
        throw new Error(`Translation is not Ukrainian text for ${item.latin}: ${ukrainianName}`);
      }
      results[item.latin].status = "translated";
      results[item.latin].ukrainianName = ukrainianName;
      results[item.latin].translationSource = "Google Translate, Russian to Ukrainian";
    }
  }
  completedTranslations += 1;
  await writeFile(progressPath, `${JSON.stringify({ source: "Plantarium", results }, null, 2)}\n`, "utf8");
  if (completedTranslations % 5 === 0 || completedTranslations === translationBatches.length) {
    console.log(`Ukrainian translations: ${completedTranslations}/${translationBatches.length} batches.`);
  }
}

const overrides = JSON.parse(await readFile(
  path.join(localizationDirectory, "manual-translation-overrides.json"),
  "utf8",
));
for (const record of candidates) {
  const result = results[record.latin];
  const manualName = overrides.uk?.[record.latin.toLocaleLowerCase("en")];
  if (typeof manualName === "string" && manualName.trim()) {
    record.uk.name = manualName.trim();
    record.uk.nameBasis = "manual-review";
    const sourceUrl = record.en?.nameSourceUrl || result?.source;
    if (sourceUrl) {
      record.uk.nameSourceUrl = sourceUrl;
    } else {
      delete record.uk.nameSourceUrl;
    }
  } else if (result?.status === "translated") {
    record.uk.name = result.ukrainianName;
    record.uk.nameBasis = "plantarium-russian-name";
    record.uk.nameSourceUrl = result.source;
  }
}

const researchedRecords = candidates.filter((record) => researchedLatinNames.has(record.latin));
catalog.nameResearch.plantarium = {
  checked: researchedRecords.length,
  foundRussianNames: researchedRecords.filter((record) => results[record.latin]?.status === "translated").length,
  latinOnlyOrNotFound: researchedRecords.filter((record) => results[record.latin]?.status !== "translated").length,
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

console.log(JSON.stringify(catalog.nameResearch.plantarium, null, 2));
