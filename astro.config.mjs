import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.ts';

// English lives at the root. Every other locale is a path prefix (`/zh/...`).
// Adding a language means a new prefix plus copy in src/data/sites.yaml — see src/i18n/ui.ts.
export default defineConfig({
  site: SITE,
  output: 'static',
  // `file` emits `/free-ebooks.html`, which Cloudflare Pages serves at the
  // slashless URL. `directory` (`.../index.html`) is normalized to a trailing slash.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
        },
      },
    }),
  ],
});
