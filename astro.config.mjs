import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// English lives at the root. Every other locale is a path prefix (`/zh/...`).
// Adding a language means a new prefix plus copy in src/data/sites.yaml — see src/i18n/ui.ts.
export default defineConfig({
  site: 'https://nav.e-ink.me',
  output: 'static',
  trailingSlash: 'never',
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
