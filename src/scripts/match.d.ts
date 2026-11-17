export function normalizeQuery(value: unknown): string;

export function matchesEntry(
  entry: { hay: string; formats: string[]; langs: string[]; pricing: string },
  filters: { q?: string; format?: string; lang?: string; pricing?: string },
): boolean;

export function filtersActive(filters: {
  q?: string;
  format?: string;
  lang?: string;
  pricing?: string;
}): boolean;
