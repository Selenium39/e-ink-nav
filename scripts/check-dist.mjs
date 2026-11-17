import fs from 'node:fs';
import path from 'node:path';

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

const pages = [
  ['/', 'dist/index.html', 'en', 52],
  ['/zh', 'dist/zh/index.html', 'zh-CN', 52],
  ...slugs.flatMap((slug) => [
    [`/${slug}`, `dist/${slug}/index.html`, 'en', null],
    [`/zh/${slug}`, `dist/zh/${slug}/index.html`, 'zh-CN', null],
  ]),
];

const expectedCounts = {
  'free-ebooks': 12,
  'ebook-stores': 7,
  'library-borrowing': 3,
  'reading-apps': 10,
  'ebook-tools': 4,
  audiobooks: 4,
  communities: 9,
  dictionaries: 3,
};

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
  if (html.includes('umami') || html.includes('cloud.umami.is')) fail(`${url} umami should be absent`);
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

const zhStores = fs.readFileSync('dist/zh/ebook-stores/index.html', 'utf8');
if (!zhStores.includes('只有 MOBI')) fail('zh stores CTA hook');
if (!zhStores.includes('https://e-ink.me/zh/convert/mobi-to-epub')) fail('zh stores CTA url');
if (!zhStores.includes('href="/zh"') && !zhStores.includes("href='/zh'")) {
  /* language switch or crumb */
}
if (!zhStores.includes('hreflang="en" href="https://nav.e-ink.me/ebook-stores"')) fail('zh stores en alternate');

const enHome = fs.readFileSync('dist/index.html', 'utf8');
if (!enHome.includes('href="/zh"')) fail('home zh switch');
if (!enHome.includes('data-featured')) fail('home featured');
const zhHome = fs.readFileSync('dist/zh/index.html', 'utf8');
if (!zhHome.includes('电子书资源导航')) fail('zh home title');
if (!zhHome.includes('推荐收录 / 勘误')) fail('zh footer');

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const locs = sitemap.match(/<loc>/g)?.length ?? 0;
if (locs !== 18) fail(`sitemap has ${locs} urls, expected 18`);
if (sitemap.includes('/404')) fail('sitemap includes 404');

const robots = fs.readFileSync('dist/robots.txt', 'utf8');
if (!robots.includes('Sitemap: https://nav.e-ink.me/sitemap-index.xml')) fail('robots sitemap');

if (failed) {
  console.error(`${failed} dist check(s) failed`);
  process.exit(1);
}
console.log(`OK dist: ${pages.length} pages, sitemap ${locs} urls, filters and ItemList present, Umami omitted.`);
