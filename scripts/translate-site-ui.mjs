import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFiles = [
  "index.html",
  "script.js",
  "ai-chat.js",
  "garden.js",
  "expeditions.js",
  "ui-enhancements.js",
  "supabase-auth.js",
  "service-worker.js",
  "worker.js",
  "flora-ranges.js",
];
const outputDirectory = path.join(root, "localization");
const locales = ["uk", "en"];
const maxChunkLength = 2800;

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'");
}

function addCandidate(candidates, raw) {
  if (raw.includes("${") || raw.includes("\\${")) return;
  const value = decodeEntities(raw.replace(/\\n/g, " ").replace(/\\t/g, " ").trim().replace(/\s+/g, " "));
  if (value.length < 2 || value.length > 700 || !/[А-Яа-яЁёІіЇїЄєҐґ]/.test(value) ||
      /(?:\b(?:function|const|let|var|return|await|document|window|fetch|JSON|Promise)\b|=>|;\s*(?:return|const|if|await)\b)/.test(value)) return;
  candidates.add(value);
}

const candidates = new Set();
function extractQuotedStrings(source) {
  const values = [];
  const pattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
  for (const match of source.matchAll(pattern)) {
    const raw = match[0].slice(1, -1);
    values.push(raw.replace(/\\n/g, " ").replace(/\\t/g, " ").replace(/\\(["'\\])/g, "$1"));
  }
  return values;
}

function extractTemplateText(source) {
  const values = [];
  const pattern = /`((?:\\.|[^`\\])*)`/gs;
  for (const match of source.matchAll(pattern)) {
    const text = match[1].replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, " ");
    values.push(text.replace(/<[^>]*>/g, " "));
    for (const textNode of text.matchAll(/>([^<>]+)</g)) values.push(textNode[1]);
  }
  return values;
}

for (const file of sourceFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  for (const value of extractQuotedStrings(source)) addCandidate(candidates, value);
  for (const value of extractTemplateText(source)) addCandidate(candidates, value);
  if (file === "index.html") {
    let match;
    const textNodePattern = />([^<>]+)</g;
    while ((match = textNodePattern.exec(source))) addCandidate(candidates, match[1]);
  }
}

const records = [...candidates].sort((left, right) => left.localeCompare(right, "ru"))
  .map((source) => ({ source, uk: null, en: null }));

function token(index) {
  return `ZXQUI${index.toString().padStart(4, "0")}ZXQ`;
}

function makeChunks() {
  const chunks = [];
  let chunk = [];
  let length = 0;
  for (let index = 0; index < records.length; index += 1) {
    const text = `${token(index)}\n${records[index].source}\n`;
    if (chunk.length && length + text.length > maxChunkLength) {
      chunks.push(chunk);
      chunk = [];
      length = 0;
    }
    if (text.length > maxChunkLength) throw new Error(`UI phrase exceeds translation request size at index ${index}.`);
    chunk.push({ index, text });
    length += text.length;
  }
  if (chunk.length) chunks.push(chunk);
  return chunks;
}

async function translateText(text, locale) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  for (const [key, value] of Object.entries({ client: "gtx", sl: "ru", tl: locale, dt: "t", q: text })) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Translation service returned HTTP ${response.status} for ${locale}.`);
  const result = await response.json();
  if (!Array.isArray(result?.[0])) throw new Error(`Translation service returned an invalid response for ${locale}.`);
  return result[0].map((segment) => segment[0] || "").join("");
}

const chunks = makeChunks();
for (const locale of locales) {
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
    const chunk = chunks[chunkIndex];
    const translated = await translateText(chunk.map((entry) => entry.text).join(""), locale);
    const markers = translated.match(/ZXQUI\d{4}ZXQ/g) || [];
    if (markers.length !== chunk.length || markers.some((marker, index) => marker !== token(chunk[index].index))) {
      throw new Error(`UI translation markers changed or were omitted in ${locale} batch ${chunkIndex + 1}.`);
    }
    for (let index = 0; index < chunk.length; index += 1) {
      const marker = markers[index];
      const start = translated.indexOf(marker) + marker.length;
      const end = index + 1 < markers.length ? translated.indexOf(markers[index + 1], start) : translated.length;
      const value = translated.slice(start, end).trim();
      if (!value) throw new Error(`Empty ${locale} UI translation for source phrase ${chunk[index].index}.`);
      records[chunk[index].index][locale] = value;
    }
    if ((chunkIndex + 1) % 10 === 0 || chunkIndex + 1 === chunks.length) {
      console.log(`${locale}: translated ${chunkIndex + 1}/${chunks.length} UI batches`);
    }
  }
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "ui-source.json"),
  `${JSON.stringify({ translationStatus: "machine-draft", records }, null, 2)}\n`,
  "utf8",
);
for (const locale of locales) {
  const translations = Object.fromEntries(records.map((record) => [record.source, record[locale]]));
  await writeFile(path.join(outputDirectory, `ui-${locale}.json`), `${JSON.stringify(translations)}\n`, "utf8");
}
console.log(`Saved ${records.length} translated interface phrases.`);
