import fs from 'node:fs';
import path from 'node:path';
import { loadCatalog } from '../src/data/load.mjs';

const dist = path.resolve('dist');
const slugs = [
  'free-ebooks',
  'ebook-stores',
  'library-borrowing',
  'reading-apps',
  'ebook-tools',
  'audiobooks',
  'communities',
  'dictionaries',
];

const { data } = loadCatalog();
const totalEntries = data.entries.length;
const expectedSitemapUrls = (1 + Object.keys(data.categories).length) * 2 + totalEntries * 2;

// Analytics intent lives in src/config.ts: a non-empty UMAMI_WEBSITE_ID means
// every page must render the script tag; an empty one means no analytics.
const configSrc = fs.readFileSync(path.resolve('src/config.ts'), 'utf8');
const umamiWebsiteId = configSrc.match(/export const UMAMI_WEBSITE_ID = ['"]([^'"]*)['"]/)?.[1] ?? '';
const umamiScriptSrc = configSrc.match(/export const UMAMI_SCRIPT_SRC = ['"]([^'"]*)['"]/)?.[1] ?? '';
const umamiScriptHost = umamiScriptSrc === '' ? '' : new URL(umamiScriptSrc).hostname;
const expectedCounts = Object.fromEntries(
  slugs.map((slug) => [slug, data.entries.filter((entry) => entry.category === slug).length]),
);

const pages = [
  ['/', 'dist/index.html', 'en', totalEntries],
  ['/zh', 'dist/zh.html', 'zh-CN', totalEntries],
  ...slugs.flatMap((slug) => [
    [`/${slug}`, `dist/${slug}.html`, 'en', null],
    [`/zh/${slug}`, `dist/zh/${slug}.html`, 'zh-CN', null],
  ]),
];

let failed = 0;
function fail(message) {
  failed += 1;
  console.error(`FAIL ${message}`);
}

if (!fs.existsSync(dist)) fail('dist/ is missing');

for (const [url, file, lang, homeCount] of pages) {
  if (!fs.existsSync(file)) {
    fail(`missing ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes(`lang="${lang}"`)) fail(`${url} lang`);
  if (!html.includes('rel="canonical"')) fail(`${url} canonical`);
  if (!html.includes('hreflang="en"') || !html.includes('hreflang="zh-CN"') || !html.includes('hreflang="x-default"')) {
    fail(`${url} hreflang`);
  }
  if (!html.includes('application/ld+json') || !html.includes('"@type":"ItemList"')) fail(`${url} ItemList`);
  if (!html.includes('data-filters') || !html.includes('data-q') || !html.includes('data-format') || !html.includes('data-lang') || !html.includes('data-pricing')) {
    fail(`${url} filters`);
  }
  if (!html.includes('data-lang-link')) fail(`${url} language switch`);
  if (html.includes('cloud.umami.is')) fail(`${url} umami cloud host should be absent`);
  if (umamiWebsiteId === '') {
    if (html.includes('umami')) fail(`${url} umami should be absent`);
  } else {
    if (!html.includes(`data-website-id="${umamiWebsiteId}"`)) fail(`${url} umami website id`);
    if (!html.includes(umamiScriptHost)) fail(`${url} umami script host`);
  }
  if (!html.includes('mailto:openminimax@gmail.com')) fail(`${url} mailto`);
  const entries = html.match(/data-entry="1"/g)?.length ?? 0;
  if (homeCount !== null && entries !== homeCount) fail(`${url} has ${entries} entries, expected ${homeCount}`);
  const slug = url.split('/').filter(Boolean).pop();
  if (homeCount === null && expectedCounts[slug] !== entries) {
    fail(`${url} has ${entries} entries, expected ${expectedCounts[slug]}`);
  }
  if (homeCount === null && !html.includes('class="cta"')) fail(`${url} missing CTA`);
  if (homeCount === null && !html.includes('class="prose"')) fail(`${url} missing intro`);
}

function readDist(file, label) {
  if (!fs.existsSync(file)) {
    fail(`missing ${label}: ${file}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

const zhStores = readDist('dist/zh/ebook-stores.html', 'zh stores');
if (zhStores !== null) {
  if (!zhStores.includes('只有 MOBI')) fail('zh stores CTA hook');
  if (!zhStores.includes('https://e-ink.me/zh/convert/mobi-to-epub')) fail('zh stores CTA url');
  if (!zhStores.includes('href="/zh"') && !zhStores.includes("href='/zh'")) fail('zh stores link to /zh');
  if (!zhStores.includes('hreflang="en" href="https://nav.e-ink.me/ebook-stores"')) fail('zh stores en alternate');
}

const enHome = readDist('dist/index.html', 'en home');
if (enHome !== null && !enHome.includes('href="/zh"')) fail('home zh switch');
if (enHome !== null && !enHome.includes('data-featured')) fail('home featured');
const zhHome = readDist('dist/zh.html', 'zh home');
if (zhHome !== null && !zhHome.includes('电子书资源导航')) fail('zh home title');
if (zhHome !== null && !zhHome.includes('推荐收录 / 勘误')) fail('zh footer');

const notFound = readDist('dist/404.html', '404');
if (notFound !== null && notFound.includes('rel="canonical"')) fail('404 should not emit a canonical');
if (notFound !== null && !notFound.includes('lang="zh-CN"')) fail('404 chinese block lang');

const sitemap = readDist('dist/sitemap-0.xml', 'sitemap');
if (sitemap !== null) {
  const locs = sitemap.match(/<loc>/g)?.length ?? 0;
  if (locs !== expectedSitemapUrls) fail(`sitemap has ${locs} urls, expected ${expectedSitemapUrls}`);
  if (sitemap.includes('/404')) fail('sitemap includes 404');
}

const robots = readDist('dist/robots.txt', 'robots');
if (robots !== null && !robots.includes('Sitemap: https://nav.e-ink.me/sitemap-index.xml')) fail('robots sitemap');

if (failed) {
  console.error(`${failed} dist check(s) failed`);
  process.exit(1);
}
console.log(`OK dist: ${pages.length} pages, filters and ItemList present, Umami present with website id ${umamiWebsiteId}, sitemap ${expectedSitemapUrls} urls.`);
