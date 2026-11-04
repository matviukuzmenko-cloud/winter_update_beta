import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localizationDirectory = path.join(root, "localization");
const catalogPath = path.join(localizationDirectory, "catalog-source.json");
const progressPath = path.join(localizationDirectory, "agrarii-plant-name-research.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const progress = JSON.parse(await readFile(progressPath, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "{}";
  throw error;
}));
const resultBySlug = progress.results || {};
const requestIntervalMs = 1000;
let lastRequestAt = 0;

async function fetchRespectfully(url, label) {
  const wait = requestIntervalMs - (Date.now() - lastRequestAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    lastRequestAt = Date.now();
    let response;
    try {
      response = await fetch(url, {
        headers: { "User-Agent": "SilvaQuietaBotanicalCatalog/1.0 (plant name localization)" },
        signal: AbortSignal.timeout(30000),
      });
    } catch (error) {
      if (attempt === 4) {
        throw new Error(`${label} failed after retries: ${error.message}`, { cause: error });
      }
      await new Promise((resolve) => setTimeout(resolve, Math.max(attempt * 2000, requestIntervalMs)));
      continue;
    }
    if (response.ok) return response;
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`${label} failed with HTTP ${response.status}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, Math.max(attempt * 2000, requestIntervalMs)));
  }
  throw new Error(`${label} failed after retries.`);
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
}

function plainText(value) {
  return decodeHtml(value.replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function plantNameFromHeading(value) {
  return value
    .replace(/^(?:опис(?:\s+та\s+характеристика)?\s+рослини|рослина)\s+/iu, "")
    .trim();
}

function htmlAttribute(value) {
  const match = value.match(/\bhref=["'](\/plants\/[^"']+)["']/i);
  return match?.[1] || "";
}

function latinNamesInExplicitFields(text) {
  const labeledValues = [...text.matchAll(/(?:назва на латині|название на латинском)\s*[:—-]\s*([^.;]+)/giu)]
    .map((match) => match[1].trim());
  return catalog.records
    .filter((record) => labeledValues.some((value) =>
      value.toLocaleLowerCase("en") === record.latin.toLocaleLowerCase("en")
    ))
    .map((record) => record.latin);
}

const slugs = new Set();
for (let page = 0; page <= 16; page += 1) {
  const url = new URL("https://agrarii-razom.com.ua/plants");
  if (page) url.searchParams.set("page", String(page));
  const response = await fetchRespectfully(url, `Agrarii plant index page ${page}`);
  const html = await response.text();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']*\/plants\/[^"']+)["'][^>]*>/gi)) {
    const href = htmlAttribute(match[0]);
    if (href && !href.includes("?")) slugs.add(href.split("/").at(-1));
  }
}

console.log(`Agrarii index: found ${slugs.size} unique plant pages.`);

let completed = 0;
for (const slug of slugs) {
  if (resultBySlug[slug]) {
    completed += 1;
    continue;
  }
  const url = new URL(`/plants/${slug}`, "https://agrarii-razom.com.ua");
  const response = await fetchRespectfully(url, `Agrarii plant page ${slug}`);
  const html = await response.text();
  const title = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "";
  const body = plainText(html);
  resultBySlug[slug] = {
    slug,
    title: plantNameFromHeading(plainText(title)),
    url: url.href,
    exactLatinNames: latinNamesInExplicitFields(body),
  };
  completed += 1;
  if (completed % 25 === 0 || completed === slugs.size) {
    await writeFile(progressPath, `${JSON.stringify({ source: "Agrarii Razom", results: resultBySlug }, null, 2)}\n`, "utf8");
    console.log(`Agrarii plant pages: checked ${completed}/${slugs.size}.`);
  }
}

const candidateNames = new Map();
for (const page of Object.values(resultBySlug)) {
  if (!page?.title) continue;
  for (const latin of page.exactLatinNames || []) {
    const key = latin.toLocaleLowerCase("en");
    const record = catalog.records.find((item) => item.latin.toLocaleLowerCase("en") === key);
    if (!record) continue;
    const match = candidateNames.get(key) || { record, entries: [] };
    match.entries.push({ title: plantNameFromHeading(page.title), url: page.url });
    candidateNames.set(key, match);
  }
}

const overrides = JSON.parse(await readFile(path.join(localizationDirectory, "manual-translation-overrides.json"), "utf8"));
let updated = 0;
let ambiguous = 0;
for (const [key, match] of candidateNames) {
  const uniqueTitles = [...new Set(match.entries.map((entry) => entry.title).filter(Boolean))];
  if (uniqueTitles.length !== 1) {
    ambiguous += 1;
    continue;
  }
  const manual = overrides.uk?.[key];
  if (typeof manual === "string" && manual.trim()) continue;
  match.record.uk.name = uniqueTitles[0];
  match.record.uk.nameBasis = "agrarii-razom";
  match.record.uk.nameSourceUrl = match.entries[0].url;
  updated += 1;
}

for (const record of catalog.records) {
  const manualName = overrides.uk?.[record.latin.toLocaleLowerCase("en")];
  if (typeof manualName !== "string" || !manualName.trim()) continue;
  record.uk.name = manualName.trim();
  record.uk.nameBasis = "manual-review";
  const sourceUrl = record.en?.nameSourceUrl || record.uk.nameSourceUrl;
  if (sourceUrl) record.uk.nameSourceUrl = sourceUrl;
  else delete record.uk.nameSourceUrl;
}

const report = {
  indexPages: 17,
  plantPages: slugs.size,
  exactScientificNameMatches: candidateNames.size,
  namesApplied: updated,
  ambiguousMatches: ambiguous,
};
catalog.nameResearch.agrariiRazom = report;
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

console.log(JSON.stringify(report, null, 2));
