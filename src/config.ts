/** Deployed origin. `astro.config.mjs` `site` and canonical URLs both use this. */
export const SITE = 'https://nav.e-ink.me';

/** Listing suggestions and corrections. There is no on-site form. */
export const CONTACT_EMAIL = 'openminimax@gmail.com';

/**
 * Umami website id.
 * Leave this an empty string to skip analytics entirely — the script tag is
 * not rendered, and the build does not contact Umami.
 * Set a real id (and, if you self-host, UMAMI_SCRIPT_SRC) when the site is ready.
 */
export const UMAMI_WEBSITE_ID = '5729785d-21a0-455f-86da-812ffb13ecb2';

/** Used only when UMAMI_WEBSITE_ID is a non-empty string. */
export const UMAMI_SCRIPT_SRC = 'https://umami.selenium39.me/script.js';

export const FAMILY = [
  { id: 'tools', href: 'https://e-ink.me', external: true },
  { id: 'news', href: 'https://news.e-ink.me', external: true },
  { id: 'wiki', href: 'https://wiki.e-ink.me', external: true },
  { id: 'games', href: 'https://games.e-ink.me', external: true },
  { id: 'nav', href: '', external: false },
] as const;
