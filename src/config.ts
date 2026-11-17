/** Deployed origin. `astro.config.mjs` `site` and canonical URLs both use this. */
export const SITE = 'https://nav.e-ink.me';

/** Listing suggestions and corrections. There is no on-site form. */
export const CONTACT_EMAIL = 'openminimax@gmail.com';

/**
 * Umami website id.
 * Leave this an empty string to skip analytics entirely — the script tag is
 * not rendered, and the build does not contact Umami.
 * NOTE: this intentionally uses e-ink.me's website id (Alex, 2026-11-17 —
 * the separate nav website was deleted from Umami). Filter by hostname in
 * Umami to tell nav.e-ink.me traffic apart from e-ink.me traffic.
 */
export const UMAMI_WEBSITE_ID = '1d1fb9fa-b17e-4b56-8f34-bcf9b89143e4';

/** Used only when UMAMI_WEBSITE_ID is a non-empty string. */
export const UMAMI_SCRIPT_SRC = 'https://umami.selenium39.me/script.js';

export const FAMILY = [
  { id: 'tools', href: 'https://e-ink.me', external: true },
  { id: 'news', href: 'https://news.e-ink.me', external: true },
  { id: 'wiki', href: 'https://wiki.e-ink.me', external: true },
  { id: 'games', href: 'https://games.e-ink.me', external: true },
  { id: 'nav', href: '', external: false },
] as const;
