import rawCatalog from '../data/sites.yaml?raw';
import { assertCatalog, parseCatalog } from '../data/load.mjs';
import { formatOrder, languageOrder, pricingOrder, type Locale } from '../i18n/ui';

export interface Localized {
  en: string;
  zh: string;
}

export interface Cta {
  href: Localized;
  title: Localized;
  body: Localized;
  action: Localized;
}

export interface Category {
  slug: string;
  title: Localized;
  meta: Localized;
  intro: Localized;
  seeAlso: string[];
  cta: Cta;
}

export type Pricing = (typeof pricingOrder)[number];

export interface Entry {
  id: string;
  name: string;
  url: string;
  description: Localized;
  category: string;
  formats: string[];
  languages: string[];
  pricing: Pricing;
  registration: boolean;
  region: Localized;
  featured: boolean;
}

interface RawCategory extends Omit<Category, 'slug'> {}

const data = parseCatalog(rawCatalog);
const errors = assertCatalog(data);
if (errors.length > 0) {
  throw new Error(`src/data/sites.yaml is incomplete:\n${errors.map((error) => `- ${error}`).join('\n')}`);
}

const rawCategories = data.categories as Record<string, RawCategory>;

export const categories: Category[] = Object.entries(rawCategories).map(([slug, category]) => ({
  slug,
  ...category,
}));

export const entries = data.entries as Entry[];

export function categoryBySlug(slug: string): Category {
  const category = categories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Unknown category: ${slug}`);
  return category;
}

export function entriesIn(slug: string): Entry[] {
  return entries.filter((entry) => entry.category === slug);
}

const HOUSE_IDS = new Set(['eink-me', 'iloveepub']);

/** House tools stay featured, but they follow the other picks. */
export function featuredEntries(): Entry[] {
  const featured = entries.filter((entry) => entry.featured);
  return [
    ...featured.filter((entry) => !HOUSE_IDS.has(entry.id)),
    ...featured.filter((entry) => HOUSE_IDS.has(entry.id)),
  ];
}

function byOrder(values: string[], order: readonly string[]): string[] {
  const unique = [...new Set(values)];
  unique.sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return unique;
}

export function formatsOf(list: Entry[]): string[] {
  return byOrder(
    list.flatMap((entry) => entry.formats),
    formatOrder,
  );
}

export function languagesOf(list: Entry[]): string[] {
  return byOrder(
    list.flatMap((entry) => entry.languages),
    languageOrder,
  );
}

export function pricingOf(list: Entry[]): Pricing[] {
  const present = new Set(list.map((entry) => entry.pricing));
  return pricingOrder.filter((item) => present.has(item));
}

export function usedFormats(): string[] {
  return formatsOf(entries);
}

export function usedLanguages(): string[] {
  return languagesOf(entries);
}

export function usedPricing(): Pricing[] {
  return pricingOf(entries);
}

function joinWrappedLines(part: string): string {
  const lines = part
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.reduce((acc, line) => {
    if (!acc) return line;
    const cjk = /[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/;
    const gap = cjk.test(acc.slice(-1)) && cjk.test(line[0] ?? '') ? '' : ' ';
    return acc + gap + line;
  }, '');
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => joinWrappedLines(part))
    .filter(Boolean);
}

export function domainOf(url: string): string {
  return new URL(url).hostname;
}

export function haystack(entry: Entry): string {
  return [entry.name, entry.description.en, entry.description.zh, ...entry.formats, ...entry.languages]
    .join(' ')
    .toLowerCase();
}

export function itemListLd(name: string, list: Entry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      url: entry.url,
    })),
  };
}

export function text(locale: Locale, value: Localized): string {
  return value[locale];
}
