#!/usr/bin/env python3
"""Translate plant catalog JSON into frontend-ready English and Ukrainian bundles."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "localization" / "catalog-source.json"
DEFAULT_OUTPUT_DIR = ROOT / "localization"
DEFAULT_OVERRIDES = ROOT / "localization" / "manual-translation-overrides.json"
LOCALES = ("uk", "en")
CARE_FIELDS = ("watering", "lighting", "humidity")
FAMILY_PATTERN = re.compile(
    r"(?:представител(?:ь|я)|вид)\s+семейства\s+([^.;,]+)",
    re.IGNORECASE,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Translate a Russian, English, or Ukrainian plant catalog into en/uk JSON and JavaScript bundles. "
            "Existing translations are kept unless --force is used."
        )
    )
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Source catalog JSON.")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR, help="Where to save locale bundles.")
    parser.add_argument("--overrides", type=Path, default=DEFAULT_OVERRIDES, help="Optional reviewed translations JSON.")
    parser.add_argument(
        "--source-language",
        choices=("ru", "uk", "en"),
        default="ru",
        help="Language of the input fields (default: ru).",
    )
    parser.add_argument("--force", action="store_true", help="Translate source fields again, replacing existing translations.")
    parser.add_argument(
        "--refresh-cache",
        action="store_true",
        help="Ignore saved Google translation cache entries while translating.",
    )
    parser.add_argument("--retries", type=int, default=4, help="Attempts per failed translation request.")
    parser.add_argument("--delay", type=float, default=0.25, help="Seconds to wait between translation requests.")
    parser.add_argument("--checkpoint-every", type=int, default=25, help="Save output after this many catalog records.")
    return parser.parse_args()


def read_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json_atomic(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            "w",
            encoding="utf-8",
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as file:
            temporary_path = Path(file.name)
            json.dump(value, file, ensure_ascii=False, indent=2)
            file.write("\n")
        os.replace(temporary_path, path)
    finally:
        if temporary_path and temporary_path.exists():
            temporary_path.unlink()


def as_text(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def source_fields(record: dict[str, Any]) -> dict[str, Any]:
    source_name = as_text(record.get("sourceName") or record.get("name"))
    scientific_name = as_text(record.get("latin") or record.get("scientificName"))
    common_name_exists = record.get(
        "russianCommonNameAvailable",
        bool(source_name and source_name != scientific_name),
    )
    name = source_name if common_name_exists and source_name else scientific_name or source_name
    description = as_text(record.get("sourceDescription") or record.get("description"))
    category = as_text(record.get("sourceCategory") or record.get("sourceGroup") or record.get("category") or record.get("group"))
    care = record.get("sourceCare") or record.get("care") or {}
    distribution = as_text(record.get("sourceDistribution") or record.get("distribution"))
    family_match = FAMILY_PATTERN.search(description)
    family = family_match.group(1).strip() if family_match else as_text(record.get("sourceFamily") or record.get("familyName"))
    if not family:
        family = as_text(record.get("familyLatin") or record.get("family"))

    fields: dict[str, Any] = {
        "name": name,
        "family": family,
        "category": category,
        "group": as_text(record.get("sourceGroup") or record.get("group") or category),
        "description": description,
        "care": {key: as_text(care.get(key)) for key in CARE_FIELDS},
        "distribution": distribution,
    }
    if not common_name_exists and scientific_name:
        fields["name"] = scientific_name
        fields["_preserve_name"] = True
    if not distribution:
        fields.pop("distribution")
    return fields


def record_list(data: Any) -> list[dict[str, Any]]:
    if isinstance(data, dict) and isinstance(data.get("records"), list):
        records = data["records"]
    elif isinstance(data, list):
        records = data
    elif isinstance(data, dict):
        records = [
            {"latin": latin, **value}
            for latin, value in data.items()
            if isinstance(value, dict)
        ]
    else:
        raise ValueError("Input must be a catalog object with 'records', a list, or a Latin-name keyed JSON object.")

    valid_records = [
        record for record in records
        if isinstance(record, dict) and as_text(record.get("latin") or record.get("scientificName"))
    ]
    if not valid_records:
        raise ValueError("No plant records with a Latin scientific name were found.")
    return valid_records


def protect_scientific_names(text: str, names: list[str]) -> tuple[str, dict[str, str]]:
    replacements: dict[str, str] = {}
    protected = text
    unique_names = sorted({name for name in names if name}, key=len, reverse=True)
    for index, name in enumerate(unique_names):
        token = f"ZXQPLANTTOKEN{index:04d}ZXQ"
        if name in protected:
            protected = protected.replace(name, token)
            replacements[token] = name
    return protected, replacements


def translated_region_list(
    value: str,
    translate: Any,
    locale: str,
    existing: str,
    record_key: str,
    field: str,
) -> str:
    regions = [part.strip() for part in value.split(",")]
    translated_regions = []
    existing_regions = [part.strip() for part in existing.split(",")] if existing else []
    for index, region in enumerate(regions):
        old_translation = existing_regions[index] if index < len(existing_regions) else ""
        result = translate(region, locale, old_translation, record_key, field)
        translated_regions.append(result or old_translation or region)
    return ", ".join(translated_regions)


def main() -> int:
    args = parse_args()
    if args.retries < 1:
        raise ValueError("--retries must be at least 1.")
    if args.delay < 0:
        raise ValueError("--delay cannot be negative.")
    if args.checkpoint_every < 1:
        raise ValueError("--checkpoint-every must be at least 1.")

    try:
        from deep_translator import GoogleTranslator
    except ImportError as error:
        raise RuntimeError(
            "Missing dependency. Install it with: python -m pip install -r requirements-localization.txt"
        ) from error

    source_data = read_json(args.input)
    records = record_list(source_data)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    cache_path = args.output_dir / ".catalog-translation-cache.json"
    failures_path = args.output_dir / "catalog-translation-errors.json"
    cache = read_json(cache_path, {"uk": {}, "en": {}})
    overrides = read_json(args.overrides, {})
    if not isinstance(cache, dict):
        raise ValueError(f"Translation cache must be a JSON object: {cache_path}")
    if not isinstance(overrides, dict):
        raise ValueError(f"Manual translation overrides must be a JSON object: {args.overrides}")
    failures: list[dict[str, str]] = []
    failure_keys: set[tuple[str, str, str]] = set()
    try:
        translators = {
            locale: GoogleTranslator(source=args.source_language, target=locale)
            for locale in LOCALES
            if locale != args.source_language
        }
    except Exception as error:
        raise RuntimeError(f"Could not initialize GoogleTranslator for locales {', '.join(LOCALES)}: {error}") from error
    protected_names_by_record: dict[str, list[str]] = {}
    for record in records:
        latin = as_text(record.get("latin") or record.get("scientificName"))
        protected_names_by_record[latin] = [latin, as_text(record.get("familyLatin"))]

    outputs: dict[str, dict[str, Any]] = {}
    for locale in LOCALES:
        output_path = args.output_dir / f"catalog-{locale}.json"
        previous_output = read_json(output_path, {})
        if not isinstance(previous_output, dict):
            previous_output = {}
        outputs[locale] = previous_output

    request_count = 0
    cache_dirty = False

    def translate(
        text: str,
        locale: str,
        existing: str,
        record_key: str,
        field: str,
    ) -> str | None:
        nonlocal request_count, cache_dirty
        text = as_text(text)
        if not text:
            return existing or None
        if locale in overrides and text in overrides[locale]:
            return as_text(overrides[locale][text])
        if locale == args.source_language:
            return text
        if not args.force and existing:
            return existing
        if not args.refresh_cache and text in cache.get(locale, {}):
            return as_text(cache[locale][text])

        protected_text, tokens = protect_scientific_names(
            text,
            protected_names_by_record.get(record_key, []),
        )
        last_error: Exception | None = None
        for attempt in range(1, args.retries + 1):
            try:
                translated = translators[locale].translate(protected_text)
                if not isinstance(translated, str) or not translated.strip():
                    raise ValueError("Translation service returned an empty result.")
                for token, scientific_name in tokens.items():
                    if token not in translated:
                        raise ValueError(f"Translation service changed protected scientific name marker {token}.")
                    translated = translated.replace(token, scientific_name)
                translated = translated.strip()
                cache.setdefault(locale, {})[text] = translated
                cache_dirty = True
                request_count += 1
                if request_count % 10 == 0:
                    write_json_atomic(cache_path, cache)
                    cache_dirty = False
                if args.delay:
                    time.sleep(args.delay)
                return translated
            except Exception as error:
                last_error = error
                print(
                    f"Retry {attempt}/{args.retries} failed for {locale}:{record_key}:{field}: {error}",
                    file=sys.stderr,
                )
                if attempt < args.retries:
                    time.sleep(min(attempt * 1.5, 8))

        message = str(last_error) if last_error else "Unknown translation failure."
        failure_key = (locale, record_key, field)
        if failure_key not in failure_keys:
            failures.append({
                "locale": locale,
                "latin": record_key,
                "field": field,
                "source": text,
                "error": message,
                "fallback": "kept existing translation" if existing else "kept source text",
            })
            failure_keys.add(failure_key)
            write_json_atomic(failures_path, failures)
        return existing or text

    def save_outputs() -> None:
        for locale in LOCALES:
            json_path = args.output_dir / f"catalog-{locale}.json"
            write_json_atomic(json_path, outputs[locale])
            js_path = args.output_dir / f"catalog-{locale}.js"
            js_path.parent.mkdir(parents=True, exist_ok=True)
            temporary_path: Path | None = None
            try:
                with tempfile.NamedTemporaryFile(
                    "w",
                    encoding="utf-8",
                    dir=js_path.parent,
                    prefix=f".{js_path.name}.",
                    suffix=".tmp",
                    delete=False,
                ) as file:
                    temporary_path = Path(file.name)
                    file.write(
                        "window.FLORA_CATALOG_LOCALIZATION = "
                        + json.dumps(outputs[locale], ensure_ascii=False, separators=(",", ":"))
                        + ";\n"
                    )
                os.replace(temporary_path, js_path)
            finally:
                if temporary_path and temporary_path.exists():
                    temporary_path.unlink()
        write_json_atomic(failures_path, failures)

    if not failures_path.exists():
        write_json_atomic(failures_path, [])

    for index, record in enumerate(records, start=1):
        latin = as_text(record.get("latin") or record.get("scientificName"))
        fields = source_fields(record)
        for locale in LOCALES:
            previous = outputs[locale].get(latin.lower(), {})
            if not isinstance(previous, dict):
                previous = {}
            existing_record = record.get(locale, {})
            if not isinstance(existing_record, dict):
                existing_record = {}
            translated_record: dict[str, Any] = dict(previous)

            name_source = as_text(fields.get("name"))
            preserve_name = bool(fields.get("_preserve_name", False))
            if preserve_name:
                translated_record["name"] = name_source
            else:
                translated_record["name"] = translate(
                    name_source, locale, as_text(existing_record.get("name") or previous.get("name")), latin, "name"
                ) or name_source

            for field in ("family", "category", "group", "description"):
                source_value = as_text(fields.get(field))
                if not source_value:
                    continue
                translated_record[field] = translate(
                    source_value,
                    locale,
                    as_text(existing_record.get(field) or previous.get(field)),
                    latin,
                    field,
                ) or source_value

            existing_care = existing_record.get("care", {})
            previous_care = previous.get("care", {})
            if not isinstance(existing_care, dict):
                existing_care = {}
            if not isinstance(previous_care, dict):
                previous_care = {}
            translated_care = dict(previous_care)
            for field in CARE_FIELDS:
                source_value = as_text(fields.get("care", {}).get(field))
                if not source_value:
                    continue
                translated_care[field] = translate(
                    source_value,
                    locale,
                    as_text(existing_care.get(field) or previous_care.get(field)),
                    latin,
                    f"care.{field}",
                ) or source_value
            if translated_care:
                translated_record["care"] = translated_care

            distribution = as_text(fields.get("distribution"))
            if distribution:
                translated_record["distribution"] = translated_region_list(
                    distribution,
                    translate,
                    locale,
                    as_text(existing_record.get("distribution") or previous.get("distribution")),
                    latin,
                    "distribution",
                )
            outputs[locale][latin.lower()] = translated_record

        if index % args.checkpoint_every == 0 or index == len(records):
            if cache_dirty:
                write_json_atomic(cache_path, cache)
                cache_dirty = False
            save_outputs()
            print(f"Processed {index}/{len(records)} plants; translation requests: {request_count}.")

    print(f"Saved English and Ukrainian JSON/JavaScript bundles in {args.output_dir}.")
    print(f"Translation failures: {len(failures)}; see {failures_path}.")
    return 0 if not failures else 2


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"Catalog translation stopped: {error}", file=sys.stderr)
        raise SystemExit(1) from error
