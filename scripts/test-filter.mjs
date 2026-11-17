import assert from 'node:assert/strict';
import { filtersActive, matchesEntry, normalizeQuery } from '../src/scripts/match.mjs';

function entry(partial) {
  return {
    hay: '',
    formats: [],
    langs: [],
    pricing: 'free',
    ...partial,
    hay: String(partial.hay ?? '').toLowerCase(),
  };
}

const gutenberg = entry({
  hay: 'project gutenberg 古腾堡 epub pdf en',
  formats: ['EPUB', 'PDF', 'TXT'],
  langs: ['en', 'zh'],
  pricing: 'free',
});
const audible = entry({
  hay: 'audible 有声书',
  formats: ['AAX'],
  langs: ['en'],
  pricing: 'subscription',
});
const shuge = entry({
  hay: '书格 shuge 古籍 pdf zh',
  formats: ['PDF'],
  langs: ['zh'],
  pricing: 'free',
});
const weread = entry({
  hay: '微信读书 weread epub',
  formats: ['EPUB', 'PDF'],
  langs: ['zh'],
  pricing: 'freemium',
});

assert.equal(normalizeQuery('  MOBI   File '), 'mobi file');
assert.equal(matchesEntry(gutenberg, {}), true);
assert.equal(matchesEntry(gutenberg, { q: '  GUTEN  ' }), true);
assert.equal(matchesEntry(gutenberg, { q: '古腾堡' }), true);
assert.equal(matchesEntry(gutenberg, { q: 'audible' }), false);
assert.equal(matchesEntry(gutenberg, { format: 'EPUB' }), true);
assert.equal(matchesEntry(gutenberg, { format: 'AAX' }), false);
assert.equal(matchesEntry(shuge, { format: 'EPUB' }), false);
assert.equal(matchesEntry(audible, { format: '' }), true);
assert.equal(matchesEntry(gutenberg, { lang: 'zh' }), true);
assert.equal(matchesEntry(audible, { lang: 'zh' }), false);
assert.equal(matchesEntry(weread, { pricing: 'freemium' }), true);
assert.equal(matchesEntry(weread, { pricing: 'free' }), false);
assert.equal(matchesEntry(gutenberg, { q: 'gutenberg', format: 'EPUB', lang: 'en', pricing: 'free' }), true);
assert.equal(matchesEntry(gutenberg, { q: 'gutenberg', format: 'EPUB', lang: 'en', pricing: 'paid' }), false);
assert.equal(matchesEntry(weread, { lang: 'zh', format: 'PDF', pricing: 'freemium' }), true);
assert.equal(matchesEntry(weread, { lang: 'en', format: 'PDF' }), false);
assert.equal(filtersActive({ q: '  ', format: '', lang: '', pricing: '' }), false);
assert.equal(filtersActive({ q: 'a', format: '', lang: '', pricing: '' }), true);
assert.equal(filtersActive({ q: '', format: 'EPUB', lang: '', pricing: '' }), true);

const catalog = [gutenberg, audible, shuge, weread];
const visible = catalog.filter((item) =>
  matchesEntry(item, { q: '', format: 'PDF', lang: 'zh', pricing: 'free' }),
);
assert.deepEqual(visible, [gutenberg, shuge].filter((item) => item.pricing === 'free' && item.langs.includes('zh') && item.formats.includes('PDF')));
assert.equal(visible.length, 2);

console.log('OK filter logic: text, format, language, pricing, and combined AND.');
