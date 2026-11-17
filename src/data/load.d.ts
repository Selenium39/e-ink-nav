export function parseCatalog(raw: string): { categories: Record<string, unknown>; entries: unknown[] };
export function loadCatalog(): { data: { categories: Record<string, unknown>; entries: unknown[] }; path: string };
export function assertCatalog(data: unknown): string[];
export function englishWords(text: string): number;
export function cjkChars(text: string): number;
