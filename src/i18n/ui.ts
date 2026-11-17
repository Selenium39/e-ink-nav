import { SITE } from '../config';

/**
 * UI chrome strings. Entry blurbs and category essays live in src/data/sites.yaml.
 *
 * To add a locale:
 * 1. Append its code to `locales` here and to `LOCALES` in src/data/load.mjs.
 * 2. Add htmlLang, hreflang, and every UI string below.
 * 3. Add a folder src/pages/<code>/ that passes the new locale into the views.
 * 4. Fill every localized field in src/data/sites.yaml.
 * 5. Register the locale in astro.config.mjs (`i18n.locales` and sitemap `i18n`).
 */
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const htmlLang: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
};

export const hreflang: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
};

export function localePath(locale: Locale, slug = ''): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  if (!slug) return prefix === '' ? '/' : prefix;
  return `${prefix}/${slug}`;
}

export function absoluteUrl(pathname: string): string {
  if (pathname === '/') return `${SITE}/`;
  return `${SITE}${pathname}`;
}

const ui = {
  en: {
    skip: 'Skip to content',
    familyLabel: 'e-ink family',
    family: {
      tools: 'Tools',
      news: 'News',
      wiki: 'Wiki',
      games: 'Games',
      nav: 'Nav',
    },
    lang: { en: 'EN', zh: '中文' },
    langLabel: 'Language',
    theme: { toggle: 'Toggle dark or light theme', toDark: 'Dark', toLight: 'Light' },
    heroEyebrow: 'e-ink.me family',
    heroTitle: 'Legal ebook resources',
    heroLede:
      'A paper catalog of places to find, borrow, buy, and read ebooks — libraries, stores, reading apps, and the tools that sit between them.',
    heroRedline:
      'Public domain, open access, stores, libraries, and ordinary software. No pirate libraries.',
    homeDescription:
      'A catalog of legal ebook libraries, stores, library loans, reading apps, tools, audiobooks, and communities.',
    featuredTitle: 'Featured',
    featuredNote: 'A short list, not a ranking.',
    categoriesTitle: 'Categories',
    categoriesNav: 'Categories',
    categoriesCount: '{n} listings',
    filtersLegend: 'Search and filter',
    filtersSearch: 'Search',
    filtersPlaceholder: 'Name, description, or format',
    filtersFormat: 'Format',
    filtersLanguage: 'Language',
    filtersPricing: 'Pricing',
    filtersAll: 'All',
    filtersReset: 'Clear',
    filtersCount: '{n} shown',
    filtersEmpty: 'Nothing matches. Clear a filter or try another word.',
    pricing: {
      free: 'Free',
      freemium: 'Freemium',
      subscription: 'Subscription',
      paid: 'Paid',
    },
    tagFeatured: 'Featured',
    tagAccount: 'Account',
    homeAllTitle: 'All listings',
    categoryBack: 'All listings',
    categorySeeAlso: 'See also',
    categoryEntries: 'Listings',
    home: 'Home',
    breadcrumbLabel: 'Breadcrumb',
    visitSite: 'Visit official site',
    relatedEntries: 'Related listings',
    relatedAll: 'See all',
    metaSite: 'Official site',
    metaCategory: 'Category',
    metaFormats: 'Formats',
    metaLanguages: 'Languages',
    metaPricing: 'Pricing',
    metaRegistration: 'Account',
    metaRegion: 'Region note',
    registrationRequired: 'Required',
    registrationNone: 'Not required',
    ctaEyebrow: 'Related tool',
    footerFamily: 'e-ink family',
    footerSuggest: 'Suggest a listing / corrections:',
    footerLegal: 'Legal resources only. Part of the e-ink.me family.',
    mailSubject: 'nav.e-ink.me listing suggestion',
    notFoundTitle: 'Page not found',
    notFoundBody: 'That page is not in the catalog.',
    notFoundHome: 'Back to the catalog',
    openExternal: 'Visit',
  },
  zh: {
    skip: '跳到正文',
    familyLabel: 'e-ink 家族',
    family: {
      tools: '工具',
      news: '新闻',
      wiki: '百科',
      games: '游戏',
      nav: '导航',
    },
    lang: { en: 'EN', zh: '中文' },
    langLabel: '语言',
    theme: { toggle: '切换深色或浅色', toDark: '深色', toLight: '浅色' },
    heroEyebrow: 'e-ink.me 家族',
    heroTitle: '电子书资源导航',
    heroLede: '找书、借书、买书、读书工具的一份纸感目录。只做电子书这一件事。',
    heroRedline: '只收公有领域、开放获取、正版商店、图书馆和正规软件。不收盗版书库。',
    homeDescription:
      '合法电子书资源目录，收录公版书库、正版商店、图书馆借阅、阅读应用、格式工具、有声书与读者社区。',
    featuredTitle: '精选',
    featuredNote: '少量条目，不是排行。',
    categoriesTitle: '分类',
    categoriesNav: '分类',
    categoriesCount: '共 {n} 条',
    filtersLegend: '搜索与筛选',
    filtersSearch: '搜索',
    filtersPlaceholder: '名称、简介或格式',
    filtersFormat: '格式',
    filtersLanguage: '语言',
    filtersPricing: '价格',
    filtersAll: '全部',
    filtersReset: '清除',
    filtersCount: '显示 {n} 条',
    filtersEmpty: '没有符合条件的条目。清除筛选，或换一个词。',
    pricing: {
      free: '免费',
      freemium: '免费+付费',
      subscription: '订阅',
      paid: '付费',
    },
    tagFeatured: '精选',
    tagAccount: '需注册',
    homeAllTitle: '全部条目',
    categoryBack: '全部目录',
    categorySeeAlso: '另见',
    categoryEntries: '条目',
    home: '首页',
    breadcrumbLabel: '面包屑导航',
    visitSite: '访问官方网站',
    relatedEntries: '同类条目',
    relatedAll: '查看全部',
    metaSite: '官方网站',
    metaCategory: '分类',
    metaFormats: '格式',
    metaLanguages: '语言',
    metaPricing: '价格',
    metaRegistration: '账号',
    metaRegion: '地区说明',
    registrationRequired: '需要注册',
    registrationNone: '无需注册',
    ctaEyebrow: '相关工具',
    footerFamily: 'e-ink 家族',
    footerSuggest: '推荐收录 / 勘误：',
    footerLegal: '只收录合法资源。e-ink.me 家族站点。',
    mailSubject: 'nav.e-ink.me 收录建议',
    notFoundTitle: '没有这一页',
    notFoundBody: '目录里没有这个地址。',
    notFoundHome: '回到目录',
    openExternal: '访问',
  },
} as const;

export type Messages = (typeof ui)[Locale];

export function useUi(locale: Locale): Messages {
  return ui[locale];
}

/** Full names for the language filter. Unknown codes fall back to the uppercased code. */
export const languageNames: Record<Locale, Record<string, string>> = {
  en: {
    en: 'English',
    zh: 'Chinese',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    nl: 'Dutch',
    fi: 'Finnish',
    sv: 'Swedish',
    da: 'Danish',
    ja: 'Japanese',
    ko: 'Korean',
    ru: 'Russian',
    ar: 'Arabic',
    pl: 'Polish',
    tr: 'Turkish',
  },
  zh: {
    en: '英语',
    zh: '中文',
    de: '德语',
    fr: '法语',
    es: '西班牙语',
    it: '意大利语',
    pt: '葡萄牙语',
    nl: '荷兰语',
    fi: '芬兰语',
    sv: '瑞典语',
    da: '丹麦语',
    ja: '日语',
    ko: '韩语',
    ru: '俄语',
    ar: '阿拉伯语',
    pl: '波兰语',
    tr: '土耳其语',
  },
};

export function languageName(locale: Locale, code: string): string {
  return languageNames[locale][code] ?? code.toUpperCase();
}

/** Preferred order for filter menus. Anything else is appended alphabetically. */
export const formatOrder = [
  'EPUB',
  'PDF',
  'MOBI',
  'AZW3',
  'KFX',
  'KEPUB',
  'TXT',
  'HTML',
  'DOCX',
  'FB2',
  'DJVU',
  'CBZ',
  'DAISY',
  'MP3',
  'M4B',
  'AAX',
];

export const languageOrder = [
  'en',
  'zh',
  'de',
  'fr',
  'es',
  'ja',
  'it',
  'pt',
  'nl',
  'ko',
  'ru',
  'pl',
  'sv',
  'fi',
  'da',
  'ar',
  'tr',
];

export const pricingOrder = ['free', 'freemium', 'subscription', 'paid'] as const;
