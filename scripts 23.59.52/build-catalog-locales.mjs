import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "localization", "catalog-source.json"), "utf8"));
const locales = ["uk", "en"];
const requiredFields = ["name", "category", "description"];
const careFields = ["watering", "lighting", "humidity"];

if (catalog.translationStatus !== "machine-draft") {
  throw new Error("Catalog is not marked as a completed machine-translation draft.");
}

for (const locale of locales) {
  const missing = catalog.records.filter((record) =>
    requiredFields.some((field) => !record[locale]?.[field]?.trim()) ||
    careFields.some((field) => !record[locale]?.care?.[field]?.trim()) ||
    (record.sourceDistribution.trim() && !record[locale]?.distribution?.trim())
  );
  if (missing.length) {
    throw new Error(`${locale} catalog is incomplete: ${missing.length} records missing required translations.`);
  }
}

for (const locale of locales) {
  const entries = Object.fromEntries(catalog.records.map((record) => [
    record.latin.toLocaleLowerCase("en"),
    record[locale],
  ]));
  const output = `window.FLORA_CATALOG_LOCALIZATION = ${JSON.stringify(entries)};\n`;
  await writeFile(path.join(root, "localization", `catalog-${locale}.js`), output, "utf8");
}

console.log(`Built localized bundles for all ${catalog.records.length} catalog entries in uk and en.`);
