import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "localization", "catalog-source.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const locales = ["uk", "en"];
const maxChunkLength = 3200;
const concurrency = 4;

for (const record of catalog.records) {
  const sourceEnglishName = record.sourceEnglishName?.trim();
  if (
    !record.russianCommonNameAvailable &&
    sourceEnglishName &&
    sourceEnglishName.toLocaleLowerCase("en") !== record.latin.toLocaleLowerCase("en") &&
    /^[\x20-\x7e]+$/.test(sourceEnglishName)
  ) {
    record.en ||= { care: {} };
    record.en.name = sourceEnglishName;
  }
}

function localizedFields(record) {
  const fields = {
    name: record.russianCommonNameAvailable ? record.sourceName : record.latin,
    category: record.sourceCategory,
    description: record.sourceDescription,
    watering: record.sourceCare.watering,
    lighting: record.sourceCare.lighting,
    humidity: record.sourceCare.humidity,
  };
  if (record.sourceDistribution.trim()) fields.distribution = record.sourceDistribution;
  return fields;
}

function token(recordIndex, field) {
  const fieldCode = {
    name: "N",
    category: "C",
    description: "D",
    watering: "W",
    lighting: "L",
    humidity: "H",
    distribution: "R",
  }[field];
  return `ZXQSTART${recordIndex.toString().padStart(4, "0")}${fieldCode}ZXQ`;
}

function chunksFor(records, locale) {
  const chunks = [];
  let chunk = [];
  let length = 0;

  for (let index = 0; index < records.length; index += 1) {
    const translated = records[index][locale];
    const fields = Object.fromEntries(Object.entries(localizedFields(records[index])).filter(([field]) =>
      field === "watering" || field === "lighting" || field === "humidity"
        ? !translated?.care?.[field]
        : !translated?.[field]
    ));
    if (!Object.keys(fields).length) continue;
    const text = Object.entries(fields).map(([field, value]) => `${token(index, field)}\n${value}\n`).join("");
    if (chunk.length && length + text.length > maxChunkLength) {
      chunks.push(chunk);
      chunk = [];
      length = 0;
    }
    if (text.length > maxChunkLength) {
      throw new Error(`Translation entry exceeds the safe request size: ${records[index].latin}`);
    }
    chunk.push({ index, text, fields: Object.keys(fields) });
    length += text.length;
  }
  if (chunk.length) chunks.push(chunk);
  return chunks;
}

async function translateText(text, locale) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "ru");
  url.searchParams.set("tl", locale);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (response.ok) break;
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`Translation service returned HTTP ${response.status} for ${locale}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
  const result = await response.json();
  if (!Array.isArray(result?.[0])) throw new Error(`Translation service returned an invalid response for ${locale}.`);
  return result[0].map((segment) => segment[0] || "").join("");
}

async function runPool(items, worker) {
  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const current = next;
      next += 1;
      await worker(items[current], current);
    }
  });
  await Promise.all(workers);
}

for (const locale of locales) {
  const localeRecords = chunksFor(catalog.records, locale);
  let completedChunks = 0;
  await runPool(localeRecords, async (chunk) => {
    const source = chunk.map((entry) => entry.text).join("");
    const translated = await translateText(source, locale);
    const markerPattern = /ZXQSTART\d{4}[NCDWLHR]ZXQ/g;
    const markers = translated.match(markerPattern) || [];
    const expected = chunk.flatMap((entry) => entry.fields.map((field) => token(entry.index, field)));
    if (markers.length !== expected.length || expected.some((marker) => !markers.includes(marker))) {
      throw new Error(`Translation markers were changed or omitted in ${locale} chunk ${completedChunks + 1}.`);
    }
    for (let index = 0; index < markers.length; index += 1) {
      if (markers[index] !== expected[index]) {
        throw new Error(`Translation field order changed in ${locale} chunk ${completedChunks + 1}.`);
      }
    }

    for (let index = 0; index < expected.length; index += 1) {
      const marker = expected[index];
      const start = translated.indexOf(marker) + marker.length;
      const end = index + 1 < expected.length ? translated.indexOf(expected[index + 1], start) : translated.length;
      const translatedValue = translated.slice(start, end).trim();
      const recordIndex = Number(marker.slice(8, 12));
      const code = marker.slice(12, 13);
      const field = { N: "name", C: "category", D: "description", W: "watering", L: "lighting", H: "humidity", R: "distribution" }[code];
      const target = (catalog.records[recordIndex][locale] ||= { care: {} });
      if (field === "watering" || field === "lighting" || field === "humidity") target.care[field] = translatedValue;
      else target[field] = translatedValue;
      if (!translatedValue) throw new Error(`Empty ${locale}.${field} translation for ${catalog.records[recordIndex].latin}.`);
    }

    completedChunks += 1;
    if (completedChunks % 20 === 0 || completedChunks === localeRecords.length) {
      console.log(`${locale}: translated ${completedChunks}/${localeRecords.length} batches`);
    }
  });

  for (const record of catalog.records) {
    if (record.nameWasTranscribed) record[locale].nameBasis = "scientific-name";
  }
}

catalog.translationStatus = "machine-draft";
catalog.translationMetadata = {
  provider: "Google Translate",
  translatedAt: new Date().toISOString(),
  reviewRequired: true,
  scientificNamesPreserved: true,
  note: "Machine-translated draft. Review botanical common names, descriptions, care, and distribution before publication.",
};
await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
const translationDirectory = path.join(root, "localization");
await mkdir(translationDirectory, { recursive: true });
for (const locale of locales) {
  const entries = Object.fromEntries(catalog.records.map((record) => [
    record.latin.toLocaleLowerCase("en"),
    record[locale],
  ]));
  const output = `window.FLORA_CATALOG_LOCALIZATION = ${JSON.stringify(entries)};\n`;
  await writeFile(path.join(translationDirectory, `catalog-${locale}.js`), output, "utf8");
}
console.log(`Saved ${catalog.records.length} translated catalog entries for uk and en.`);
