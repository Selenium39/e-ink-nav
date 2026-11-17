/**
 * Pure catalog matching shared by the page and by scripts/test-filter.mjs.
 * Every active constraint must match (AND). Empty constraints match everything.
 * Text search is case-insensitive against a haystack built at render time
 * (name, both descriptions, formats, language codes).
 */

export function normalizeQuery(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * @param {{ hay: string, formats: string[], langs: string[], pricing: string }} entry
 * @param {{ q?: string, format?: string, lang?: string, pricing?: string }} filters
 */
export function matchesEntry(entry, filters) {
  const q = normalizeQuery(filters.q);
  if (q && !entry.hay.includes(q)) return false;
  if (filters.format && !entry.formats.includes(filters.format)) return false;
  if (filters.lang && !entry.langs.includes(filters.lang)) return false;
  if (filters.pricing && entry.pricing !== filters.pricing) return false;
  return true;
}

export function filtersActive(filters) {
  return Boolean(normalizeQuery(filters.q) || filters.format || filters.lang || filters.pricing);
}
