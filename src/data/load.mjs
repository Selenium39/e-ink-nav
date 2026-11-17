import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(root, 'sites.yaml');

export const LOCALES = ['en', 'zh'];
export const PRICING = ['free', 'freemium', 'subscription', 'paid'];
export const CATEGORY_SLUGS = [
  'free-ebooks',
  'ebook-stores',
  'library-borrowing',
  'reading-apps',
  'ebook-tools',
  'audiobooks',
  'communities',
  'dictionaries',
];

const DUPLICATE_URLS_OK = new Set(['https://weread.qq.com', 'https://www.kobo.com']);

const BLOCKED_HOSTS = [
  'libgen',
  'librarygenesis',
  'z-lib',
  'zlibrary',
  'zlib',
  'annas-archive',
  'anna-archive',
  'mobilism',
  'pdfdrive',
  'oceanofpdf',
  'epub.pub',
];

function trimDeep(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(trimDeep);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) out[key] = trimDeep(item);
    return out;
  }
  return value;
}

export function parseCatalog(raw) {
  return trimDeep(parseYaml(raw));
}

export function loadCatalog() {
  const raw = fs.readFileSync(dataPath, 'utf8');
  return { data: parseCatalog(raw), path: dataPath };
}

function isString(value) {
  return typeof value === 'string';
}

function requireLocales(value, label, errors, { allowEmpty = false } = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${label} must be an object with en and zh`);
    return;
  }
  for (const locale of LOCALES) {
    if (!isString(value[locale])) {
      errors.push(`${label}.${locale} must be a string`);
    } else if (!allowEmpty && value[locale].trim() === '') {
      errors.push(`${label}.${locale} is empty`);
    }
  }
  for (const key of Object.keys(value)) {
    if (!LOCALES.includes(key)) errors.push(`${label} has unknown locale "${key}"`);
  }
}

export function englishWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function cjkChars(text) {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
}

export function assertCatalog(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return ['catalog root must be a mapping with categories and entries'];
  }

  const categories = data.categories;
  const entries = data.entries;
  if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
    errors.push('categories must be a mapping keyed by slug');
  }
  if (!Array.isArray(entries)) {
    errors.push('entries must be a list');
    return errors;
  }

  const slugs = categories ? Object.keys(categories) : [];
  if (slugs.join(',') !== CATEGORY_SLUGS.join(',')) {
    errors.push(`category keys must equal, in order: ${CATEGORY_SLUGS.join(', ')}`);
  }

  for (const slug of CATEGORY_SLUGS) {
    const category = categories?.[slug];
    if (!category) continue;
    requireLocales(category.title, `categories.${slug}.title`, errors);
    requireLocales(category.meta, `categories.${slug}.meta`, errors);
    requireLocales(category.intro, `categories.${slug}.intro`, errors);
    if (isString(category.intro?.en) && englishWords(category.intro.en) < 300) {
      errors.push(`categories.${slug}.intro.en has ${englishWords(category.intro.en)} words (need 300+)`);
    }
    if (isString(category.intro?.zh) && cjkChars(category.intro.zh) < 300) {
      errors.push(`categories.${slug}.intro.zh has ${cjkChars(category.intro.zh)} 汉字 (need 300+)`);
    }
    if (isString(category.meta?.en) && category.meta.en.length > 180) {
      errors.push(`categories.${slug}.meta.en is ${category.meta.en.length} chars (keep it ≤ 180)`);
    }
    if (isString(category.meta?.zh) && category.meta.zh.length > 120) {
      errors.push(`categories.${slug}.meta.zh is ${category.meta.zh.length} chars (keep it ≤ 120)`);
    }
    const cta = category.cta;
    if (!cta) {
      errors.push(`categories.${slug}.cta missing`);
    } else {
      requireLocales(cta.href, `categories.${slug}.cta.href`, errors);
      requireLocales(cta.title, `categories.${slug}.cta.title`, errors);
      requireLocales(cta.body, `categories.${slug}.cta.body`, errors);
      requireLocales(cta.action, `categories.${slug}.cta.action`, errors);
      for (const locale of LOCALES) {
        const href = cta.href?.[locale];
        if (isString(href) && !href.startsWith('https://e-ink.me/')) {
          errors.push(`categories.${slug}.cta.href.${locale} must point at https://e-ink.me/`);
        }
      }
    }
    if (!Array.isArray(category.seeAlso) || category.seeAlso.length < 1) {
      errors.push(`categories.${slug}.seeAlso must list at least one slug`);
    } else {
      for (const other of category.seeAlso) {
        if (!CATEGORY_SLUGS.includes(other) || other === slug) {
          errors.push(`categories.${slug}.seeAlso has invalid slug "${other}"`);
        }
      }
    }
  }

  const seen = new Set();
  const urls = new Map();
  const descriptions = new Set();

  entries.forEach((entry, index) => {
    const where = `entries[${index}]${entry?.id ? ` (${entry.id})` : ''}`;
    if (!entry || typeof entry !== 'object') {
      errors.push(`${where} is not a mapping`);
      return;
    }
    const fields = [
      'id',
      'name',
      'url',
      'description',
      'long',
      'category',
      'formats',
      'languages',
      'pricing',
      'registration',
      'region',
      'featured',
    ];
    for (const field of fields) {
      if (!(field in entry)) errors.push(`${where} missing field ${field}`);
    }
    if (!isString(entry.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
      errors.push(`${where} id must be kebab-case`);
    } else if (seen.has(entry.id)) {
      errors.push(`${where} duplicate id`);
    } else {
      seen.add(entry.id);
    }
    if (!isString(entry.name) || entry.name.trim() === '') errors.push(`${where} name empty`);
    if (!isString(entry.url) || !/^https:\/\/[^\s]+$/.test(entry.url)) {
      errors.push(`${where} url must be an https URL`);
    } else {
      let host = '';
      try {
        host = new URL(entry.url).hostname.toLowerCase();
      } catch {
        errors.push(`${where} url did not parse`);
      }
      if (BLOCKED_HOSTS.some((piece) => host.includes(piece) || entry.url.toLowerCase().includes(piece))) {
        errors.push(`${where} url looks like a blocked pirate host`);
      }
      const prior = urls.get(entry.url);
      if (prior && !DUPLICATE_URLS_OK.has(entry.url)) {
        errors.push(`${where} duplicates URL of ${prior}`);
      }
      urls.set(entry.url, entry.id);
    }
    requireLocales(entry.description, `${where}.description`, errors);
    requireLocales(entry.long, `${where}.long`, errors);
    if (isString(entry.long?.en) && englishWords(entry.long.en) < 120) {
      errors.push(`${where}.long.en has ${englishWords(entry.long.en)} words (need 120+)`);
    }
    if (isString(entry.long?.zh) && cjkChars(entry.long.zh) < 200) {
      errors.push(`${where}.long.zh has ${cjkChars(entry.long.zh)} 汉字 (need 200+)`);
    }
    if (isString(entry.description?.en)) {
      const key = entry.description.en;
      if (key.length < 40) errors.push(`${where}.description.en is too short`);
      if (descriptions.has(`en:${key}`)) errors.push(`${where}.description.en is duplicated`);
      descriptions.add(`en:${key}`);
    }
    if (isString(entry.description?.zh)) {
      const key = entry.description.zh;
      if (cjkChars(key) < 20) errors.push(`${where}.description.zh needs at least 20 汉字`);
      if (descriptions.has(`zh:${key}`)) errors.push(`${where}.description.zh is duplicated`);
      descriptions.add(`zh:${key}`);
    }
    if (!CATEGORY_SLUGS.includes(entry.category)) {
      errors.push(`${where} category "${entry.category}" is not one of the 8 slugs`);
    }
    if (!Array.isArray(entry.formats)) {
      errors.push(`${where}.formats must be an array`);
    } else {
      for (const format of entry.formats) {
        if (!isString(format) || !/^[A-Z0-9][A-Z0-9.+-]*$/.test(format)) {
          errors.push(`${where}.formats has invalid token "${format}"`);
        }
      }
    }
    if (!Array.isArray(entry.languages) || entry.languages.length === 0) {
      errors.push(`${where}.languages must be a non-empty array`);
    } else {
      for (const code of entry.languages) {
        if (!isString(code) || !/^[a-z]{2}$/.test(code)) {
          errors.push(`${where}.languages has invalid code "${code}"`);
        }
      }
    }
    if (!PRICING.includes(entry.pricing)) errors.push(`${where}.pricing invalid`);
    if (typeof entry.registration !== 'boolean') errors.push(`${where}.registration must be boolean`);
    if (typeof entry.featured !== 'boolean') errors.push(`${where}.featured must be boolean`);
    requireLocales(entry.region, `${where}.region`, errors, { allowEmpty: true });
    if (isString(entry.region?.en) && isString(entry.region?.zh)) {
      const enEmpty = entry.region.en.trim() === '';
      const zhEmpty = entry.region.zh.trim() === '';
      if (enEmpty !== zhEmpty) errors.push(`${where}.region must be filled in both languages or neither`);
    }
  });

  for (const id of ['eink-me', 'iloveepub']) {
    const entry = entries.find((item) => item?.id === id);
    if (entry && entry.category !== 'ebook-tools') errors.push(`${id} must stay in ebook-tools`);
  }

  return errors;
}
