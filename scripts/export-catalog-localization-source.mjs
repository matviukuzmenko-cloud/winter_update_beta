import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = await readFile(path.join(root, "script.js"), "utf8");
const outputPath = path.join(root, "localization", "catalog-source.json");
let previousCatalog = { records: [] };
try {
  previousCatalog = JSON.parse(await readFile(outputPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const previousRecords = new Map(previousCatalog.records.map((record) => [record.latin.toLocaleLowerCase("en"), record]));
const sourceFiles = [
  "flora-extra.js",
  "flora-additional.js",
  "flora-houseplants.js",
  "flora-expansion.js",
  "flora-new-pack.js",
  "flora-1000.js",
  "flora-1111.js",
  "flora-1500.js",
  "flora-more.js",
];
const window = {};

function objectDeclaration(name) {
  const marker = `const ${name} = {`;
  const declarationStart = appSource.indexOf(marker);
  if (declarationStart < 0) throw new Error(`Could not find ${name} in script.js.`);
  const start = appSource.indexOf("{", declarationStart);
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = start; index < appSource.length; index += 1) {
    const character = appSource[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "\"" || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return vm.runInNewContext(`(${appSource.slice(start, index + 1)})`);
    }
  }
  throw new Error(`Could not parse ${name} from script.js.`);
}

const familyLabels = objectDeclaration("familyLabels");
const familyAliases = objectDeclaration("familyAliases");
const plantGroupDescriptions = objectDeclaration("plantGroupDescriptions");
const plantGroupCare = objectDeclaration("plantGroupCare");

function transcribeScientificName(name) {
  const digraphs = { sch: "ш", ch: "х", ph: "ф", th: "т", sh: "ш", ae: "э", oe: "э", qu: "кв" };
  const letters = { a: "а", b: "б", c: "к", d: "д", e: "е", f: "ф", g: "г", h: "г", i: "и", j: "й", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "к", r: "р", s: "с", t: "т", u: "у", v: "в", w: "в", x: "кс", y: "и", z: "з" };
  return name.toLowerCase().replace(/sch|ch|ph|th|sh|ae|oe|qu|[a-z]/g, (part) => digraphs[part] || letters[part])
    .replace(/^([а-яё])/, (letter) => letter.toLocaleUpperCase("ru"));
}

function catalogGroup(item) {
  const group = item.group || item.plantGroup || "Цветы";
  if (group !== "Комнатные растения") return group;
  const genus = item.latin.split(/\s+/)[0];
  if (item.classKey === "Polypodiopsida") return "Папоротники";
  if (item.classKey === "Pinopsida") return "Хвойные";
  if (item.family === "Cactaceae") return "Кактусы";
  if (item.family === "Crassulaceae" ||
      ["Aloe", "Echeveria", "Gasteria", "Haworthiopsis", "Kalanchoe", "Sedum"].includes(genus)) return "Суккуленты";
  if (["Ficus", "Heptapleurum", "Dracaena", "Schefflera"].includes(genus) ||
      ["Moraceae", "Araliaceae"].includes(item.family)) return "Деревья и кустарники";
  return "Цветы";
}

for (const file of sourceFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  vm.runInNewContext(source, { window, Object, Array, String }, { filename: file });
}
const rangesSource = await readFile(path.join(root, "flora-ranges.js"), "utf8");
vm.runInNewContext(rangesSource, { window, Object, Array, String }, { filename: "flora-ranges.js" });

const recordsByLatin = new Map();
let sourceRecordCount = 0;

for (const [sourceFile, key] of [
  ["flora-extra.js", "FLORA_EXTRA_FLOWERS"],
  ["flora-additional.js", "FLORA_ADDITIONAL_FLOWERS"],
  ["flora-houseplants.js", "FLORA_HOUSEPLANTS"],
  ["flora-expansion.js", "FLORA_EXPANSION_FLOWERS"],
  ["flora-new-pack.js", "FLORA_NEW_PACK"],
  ["flora-1000.js", "FLORA_1000_FLOWERS"],
  ["flora-1111.js", "FLORA_1111_FLOWERS"],
  ["flora-1500.js", "FLORA_1500_FLOWERS"],
  ["flora-more.js", "FLORA_MORE_FLOWERS"],
]) {
  for (const item of window[key] || []) {
    sourceRecordCount += 1;
    const latin = typeof item.latin === "string" ? item.latin.trim().replace(/\s+/g, " ") : "";
    if (!latin) throw new Error(`${sourceFile} contains a plant without a stable Latin identifier.`);
    const keyLatin = latin.toLocaleLowerCase("en");
    const existing = recordsByLatin.get(keyLatin) || { latin };
    const record = { ...existing };

    for (const field of ["name", "family", "group", "category", "description", "distribution", "photoNote", "nameSource", "classKey"]) {
      if ((!record[field] || !String(record[field]).trim()) && item[field] && String(item[field]).trim()) {
        record[field] = String(item[field]).trim();
      }
    }

    const hasRussianName = item.native === true || Boolean(item.nameSource);
    if (hasRussianName && !record.russianNameAvailable && item.name) {
      record.name = String(item.name).trim();
      record.nameSource = item.nameSource || "";
    }

    if (item.care && typeof item.care === "object") {
      record.care ||= {};
      for (const field of ["watering", "lighting", "humidity"]) {
        if (!record.care[field] && typeof item.care[field] === "string" && item.care[field].trim()) {
          record.care[field] = item.care[field].trim();
        }
      }
    }

    record.sources = [...new Set([...(record.sources || []), sourceFile])];
    record.russianNameAvailable = record.russianNameAvailable || hasRussianName;
    recordsByLatin.set(keyLatin, record);
  }
}

const records = [...recordsByLatin.values()]
  .sort((left, right) => left.latin.localeCompare(right.latin, "en"))
  .map((record) => {
    const name = record.russianNameAvailable ? record.name : transcribeScientificName(record.latin);
    const group = catalogGroup(record);
    const familyLabel = familyLabels[record.family] || familyAliases[record.family] || record.family;
    const careDefaults = plantGroupCare[group] || plantGroupCare["Цветы"];
    const care = Object.fromEntries(["watering", "lighting", "humidity"].map((key) => [
      key,
      record.care?.[key]?.trim() || careDefaults[key],
    ]));
    const sourceDescription = record.description ||
      `${name} (${record.latin}) — представитель семейства ${familyLabel}. ${plantGroupDescriptions[group] || plantGroupDescriptions["Цветы"]}`;
    const careSummary = [
      ["Полив", care.watering],
      ["Освещение", care.lighting],
      ["Влажность", care.humidity],
    ].map(([label, text]) => `${label}: ${text}`).join(" ");
    const savedTranslations = previousRecords.get(record.latin.toLocaleLowerCase("en"));
    const range = window.FLORA_RANGES?.[record.latin.toLocaleLowerCase("en")];

    return {
      latin: record.latin,
      sourceName: name,
      sourceNameLanguage: "ru",
      russianCommonNameAvailable: Boolean(record.russianNameAvailable),
      nameWasTranscribed: !record.russianNameAvailable,
      sourceEnglishName: record.russianNameAvailable ? "" : record.name || "",
      nameSource: record.nameSource || "",
      familyLatin: record.family || "",
      sourceGroup: group,
      sourceCategory: record.category && record.category !== "Комнатные растения" ? record.category : group,
      sourceDescription: `${record.description?.trim() || sourceDescription} Уход: ${careSummary}`,
      sourceCare: care,
      sourceDistribution: record.distribution || (Array.isArray(range) && typeof range[0] === "string" ? range[0] : ""),
      sourcePhotoNote: record.photoNote || "",
      sources: record.sources,
      uk: savedTranslations?.uk || null,
      en: savedTranslations?.en || null,
    };
  });

const output = {
  schemaVersion: 1,
  sourceLanguage: "ru",
  translationStatus: "source-inventory",
  sourceRecordCount,
  uniquePlantCount: records.length,
  preservedFields: ["latin", "familyLatin", "photo attribution", "photo license", "source URLs"],
  sharedTemplates: {
    plantGroupDescriptions,
    plantGroupCare,
    uk: {
      plantGroupDescriptions: {
        "Цветы": "Квіткова рослина з різноманіттям форм і сортів. Зовнішній вигляд і сезон цвітіння залежать від конкретного виду.",
        "Кактусы": "Кактус із характерними ареолами та різними силуетами — від округлих до витягнутих. Кактуси запасають вологу й зазвичай надають перевагу сонячному місцю.",
        "Суккуленты": "Сукулент, що запасає вологу в листі або стеблах. Різноманіття форм і фактур робить ці рослини цікавим акцентом в інтер’єрі.",
        "Папоротники": "Папороть із виразним листям. Папороті не утворюють квіток і насіння; їх вирощують заради зелені та фактури листя.",
        "Хвойные": "Хвойна рослина з голчастим або лускатим листям. Вона надає композиції структури протягом усього року, а розмір та умови вирощування залежать від виду.",
        "Деревья и кустарники": "Деревна рослина, що додає об’єму та зелені саду. Форма крони й сезонні особливості залежать від виду."
      },
      plantGroupCare: {
        "Цветы": {
          watering: "Поливайте після підсихання верхнього шару ґрунту; не залишайте воду в піддоні.",
          lighting: "Яскраве розсіяне світло; захищайте від полуденного сонця.",
          humidity: "Звичайна кімнатна вологість; провітрюйте без холодних протягів."
        },
        "Кактусы": {
          watering: "Поливайте рідко, лише після повного висихання субстрату; узимку скоротіть полив.",
          lighting: "Дуже яскраве освітлення; привчайте до прямого сонця поступово.",
          humidity: "Низька або звичайна вологість; забезпечте добре провітрювання."
        },
        "Суккуленты": {
          watering: "Поливайте після повного висихання ґрунту; зайву воду одразу зливайте.",
          lighting: "Яскраве світло; багатьом видам підходять кілька годин м’якого прямого сонця.",
          humidity: "Звичайна або знижена вологість; не обприскуйте розетки без потреби."
        },
        "Папоротники": {
          watering: "Підтримуйте субстрат рівномірно злегка вологим, не допускаючи перезволоження.",
          lighting: "Розсіяне світло або напівтінь; уникайте прямого сонця.",
          humidity: "Підвищена вологість і м’яка циркуляція повітря."
        },
        "Хвойные": {
          watering: "Підтримуйте помірну вологість кореневої грудки; після вкорінення поливайте під час посухи.",
          lighting: "Світле місце; враховуйте, що потреба в сонці залежить від виду.",
          humidity: "Вуличні умови та природна вологість; у контейнері не пересушуйте грудку."
        },
        "Деревья и кустарники": {
          watering: "Рясно поливайте після підсихання верхнього шару; не пересушуйте молоді рослини.",
          lighting: "Світле місце; точна потреба в сонці залежить від виду.",
          humidity: "Звичайна зовнішня вологість; важливіші дренований ґрунт і вільна циркуляція повітря."
        }
      }
    },
    en: {
      plantGroupDescriptions: {
        "Цветы": "A flowering plant with a wide variety of forms and cultivars. Its appearance and flowering season depend on the species.",
        "Кактусы": "A cactus with distinctive areoles and varied shapes, from rounded to elongated. Cacti store water and generally prefer a sunny spot.",
        "Суккуленты": "A succulent that stores water in its leaves or stems. Its varied shapes and textures make it an eye-catching accent indoors.",
        "Папоротники": "A fern with expressive foliage. Ferns do not produce flowers or seeds; they are grown for their greenery and leaf texture.",
        "Хвойные": "A conifer with needle-like or scale-like foliage. It adds year-round structure to a planting, while its size and growing conditions depend on the species.",
        "Деревья и кустарники": "A woody plant that adds volume and greenery to a garden. Its crown shape and seasonal traits depend on the species."
      },
      plantGroupCare: {
        "Цветы": {
          watering: "Water after the top layer of soil dries; do not leave water in the saucer.",
          lighting: "Bright, indirect light; protect from harsh midday sun.",
          humidity: "Average indoor humidity; ventilate without exposing the plant to cold drafts."
        },
        "Кактусы": {
          watering: "Water sparingly, only after the substrate has dried out completely; reduce watering in winter.",
          lighting: "Very bright light; acclimate gradually to direct sun.",
          humidity: "Low to average humidity; provide good ventilation."
        },
        "Суккуленты": {
          watering: "Water after the soil has dried out completely; drain excess water right away.",
          lighting: "Bright light; many species benefit from a few hours of gentle direct sun.",
          humidity: "Average to low humidity; avoid misting rosettes unless needed."
        },
        "Папоротники": {
          watering: "Keep the substrate evenly and lightly moist without waterlogging it.",
          lighting: "Indirect light or partial shade; avoid direct sun.",
          humidity: "High humidity with gentle air circulation."
        },
        "Хвойные": {
          watering: "Keep the root ball moderately moist; once established, water during dry spells.",
          lighting: "A bright spot; sunlight needs vary by species.",
          humidity: "Outdoor conditions and natural humidity; do not let container root balls dry out."
        },
        "Деревья и кустарники": {
          watering: "Water deeply after the top layer dries; do not let young plants dry out.",
          lighting: "A bright spot; exact sunlight needs depend on the species.",
          humidity: "Typical outdoor humidity; well-drained soil and good air circulation matter more."
        }
      }
    }
  },
  records,
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

const missing = {
  commonName: records.filter((record) => !record.sourceName).length,
  russianCommonName: records.filter((record) => !record.russianCommonNameAvailable).length,
  category: records.filter((record) => !record.sourceCategory).length,
  description: records.filter((record) => !record.sourceDescription).length,
  care: records.filter((record) => ["watering", "lighting", "humidity"].some((key) => !record.sourceCare[key])).length,
  distribution: records.filter((record) => !record.sourceDistribution).length,
};

console.log(JSON.stringify({
  output: path.relative(root, outputPath),
  sourceRecordCount,
  uniquePlantCount: records.length,
  duplicateSourceRecords: sourceRecordCount - records.length,
  missing,
}, null, 2));
