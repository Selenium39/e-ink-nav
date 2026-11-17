import { assertCatalog, cjkChars, englishWords, loadCatalog } from '../src/data/load.mjs';

const { data, path } = loadCatalog();
const errors = assertCatalog(data);

if (errors.length) {
  console.error(`Data check failed (${errors.length}) — ${path}`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const featured = data.entries.filter((entry) => entry.featured).map((entry) => entry.id);
console.log(`OK ${data.entries.length} entries, ${featured.length} featured`);
console.log(`Featured: ${featured.join(', ')}`);
console.log('Category intro lengths:');
for (const [slug, category] of Object.entries(data.categories)) {
  console.log(
    `  ${slug}: en ${englishWords(category.intro.en)} words, zh ${cjkChars(category.intro.zh)} 汉字`,
  );
}
console.log('Every entry has all required fields and valid values.');
