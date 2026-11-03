import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "localization", "catalog-source.json");
const catalog = JSON.parse(await readFile(sourcePath, "utf8"));
const locales = ["uk", "en"];
const requiredPlantFields = ["name", "category", "description"];
const requiredCareFields = ["watering", "lighting", "humidity"];
const failures = [];

for (const locale of locales) {
  const missing = new Map();
  const requireText = (value, field, context) => {
    if (typeof value !== "string" || !value.trim()) {
      missing.set(field, (missing.get(field) || 0) + 1);
      failures.push(`${locale}.${context}.${field}`);
    }
  };

  for (const [group, sourceDescription] of Object.entries(catalog.sharedTemplates.plantGroupDescriptions)) {
    const translated = catalog.sharedTemplates[locale]?.plantGroupDescriptions?.[group];
    requireText(translated, "plantGroupDescriptions", `sharedTemplates.${group}`);
    if (!sourceDescription.trim()) failures.push(`source.sharedTemplates.plantGroupDescriptions.${group}`);
  }

  for (const [group, sourceCare] of Object.entries(catalog.sharedTemplates.plantGroupCare)) {
    const translated = catalog.sharedTemplates[locale]?.plantGroupCare?.[group];
    for (const field of requiredCareFields) {
      requireText(translated?.[field], `plantGroupCare.${field}`, `sharedTemplates.${group}`);
      if (!sourceCare[field]?.trim()) failures.push(`source.sharedTemplates.plantGroupCare.${group}.${field}`);
    }
  }

  for (const record of catalog.records) {
    const translated = record[locale];
    for (const field of requiredPlantFields) {
      requireText(translated?.[field], field, record.latin);
    }
    for (const field of requiredCareFields) {
      requireText(translated?.care?.[field], `care.${field}`, record.latin);
    }
    if (record.sourceDistribution?.trim()) {
      requireText(translated?.distribution, "distribution", record.latin);
    }
  }

  const missingFields = [...missing.entries()]
    .map(([field, count]) => `${field}: ${count}`)
    .join(", ");
  console.log(`${locale}: ${missingFields || "catalog translation complete"}`);
}

if (failures.length) {
  console.error(`Catalog localization incomplete: ${failures.length} missing or invalid fields.`);
  process.exitCode = 1;
} else {
  console.log(`All ${catalog.records.length} plant records and shared templates are translated.`);
}
