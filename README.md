# e-ink-nav

**nav.e-ink.me** — a lightweight ebook resources navigation site: free ebook libraries, book stores, library borrowing, reading apps, ebook tools, audiobooks, communities, and dictionaries. Part of the [e-ink.me](https://e-ink.me) family (tools · [news](https://news.e-ink.me) · [wiki](https://wiki.e-ink.me) · [games](https://games.e-ink.me)).

Static Astro site. Every listing lives in one data file. No CMS, no backend, no accounts, no on-site submission form. Suggestions and corrections go to [openminimax@gmail.com](mailto:openminimax@gmail.com).

Legal resources only. See [PLAN.md](PLAN.md) for the spec.

## Commands

Requires Node.js `>=22.23.4` (Astro 7).

```bash
npm install
npm run dev        # local preview
npm run build      # static output in dist/
npm run preview    # serve dist/
npm run check      # data completeness + filter logic
npm run check:dist # after a build: 18 pages, sitemap, SEO tags
```

`npm run build` writes `dist/`. English pages are at `/` and `/free-ebooks` (and the other seven slugs). Chinese pages are under `/zh/`.

## Updating the catalog

Edit **`src/data/sites.yaml`** and push. That file is the whole catalog: the eight category essays and every listing.

To add or correct a listing, append or edit an object under `entries`. Every entry needs all of these fields:

| Field | Notes |
| --- | --- |
| `id` | Stable kebab-case id |
| `name` | Official name |
| `url` | Official `https` URL |
| `description.en` / `description.zh` | One or two original sentences |
| `category` | One of the eight slugs below |
| `formats` | Array of tokens the service actually offers (`EPUB`, `PDF`, …). `[]` when it does not hand out a file format |
| `languages` | Array of two-letter codes (`en`, `zh`, …) |
| `pricing` | `free`, `freemium`, `subscription`, or `paid` |
| `registration` | Boolean |
| `region.en` / `region.zh` | Both filled, or both empty strings |
| `featured` | Boolean. Keep the featured set small |

Category slugs: `free-ebooks`, `ebook-stores`, `library-borrowing`, `reading-apps`, `ebook-tools`, `audiobooks`, `communities`, `dictionaries`.

Do not add sites that are not in PLAN.md's seed list, and never add pirate or shadow libraries. `npm run check` fails the build path if a required field is missing.

Category page essays, meta descriptions, and the e-ink.me call-to-action also live in that same file, under `categories`.

## Languages

English is the default and has no prefix. Chinese is `/zh/`. UI strings are in `src/i18n/ui.ts`. To add a locale later: add the code there, fill every localized field in `sites.yaml`, add `src/pages/<code>/`, and register the locale in `astro.config.mjs` (including the sitemap `i18n` block).

## Analytics

Umami is off until `UMAMI_WEBSITE_ID` in `src/config.ts` is a non-empty string. An empty id omits the script tag, so the build does not depend on Umami. Set `UMAMI_SCRIPT_SRC` in the same file if the script is not the default Umami Cloud URL.

## 维护说明

更新站点 = 改 `src/data/sites.yaml`，跑 `npm run check`，再 push。页面从这一个文件生成，没有后台。收录和勘误只走邮件：openminimax@gmail.com。只收合法资源。
