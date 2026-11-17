import { filtersActive, matchesEntry, normalizeQuery } from './match.mjs';

type EntryData = {
  hay: string;
  formats: string[];
  langs: string[];
  pricing: string;
};

function readEntry(el: HTMLElement): EntryData {
  return {
    hay: el.dataset.hay ?? '',
    formats: (el.dataset.formats ?? '').split(',').filter(Boolean),
    langs: (el.dataset.langs ?? '').split(',').filter(Boolean),
    pricing: el.dataset.pricing ?? '',
  };
}

function currentTheme(): 'dark' | 'light' {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'dark' || explicit === 'light') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncThemeChrome(explicit: boolean): void {
  const theme = currentTheme();
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (button) button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  if (!explicit) return;
  const color = theme === 'dark' ? '#0F0F0F' : '#FAFAFA';
  const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
  const [first, ...rest] = metas;
  if (first) {
    first.setAttribute('content', color);
    first.removeAttribute('media');
  }
  for (const extra of rest) extra.remove();
}

function initTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;
  const root = document.documentElement;
  syncThemeChrome(root.hasAttribute('data-theme'));

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode */
    }
    syncThemeChrome(true);
  });

  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const onScheme = () => {
    if (!root.hasAttribute('data-theme')) syncThemeChrome(false);
  };
  if (typeof scheme.addEventListener === 'function') {
    scheme.addEventListener('change', onScheme);
  } else {
    const legacy = scheme as MediaQueryList & { addListener?: (listener: () => void) => void };
    legacy.addListener?.(onScheme);
  }
}

function initCatalog(): void {
  const catalog = document.querySelector<HTMLElement>('[data-catalog]');
  const form = document.querySelector<HTMLFormElement>('[data-filters]');
  if (!catalog || !form) return;

  const qInput = form.querySelector<HTMLInputElement>('[data-q]');
  const formatSel = form.querySelector<HTMLSelectElement>('[data-format]');
  const langSel = form.querySelector<HTMLSelectElement>('[data-lang]');
  const pricingSel = form.querySelector<HTMLSelectElement>('[data-pricing]');
  const countEl = document.querySelector<HTMLElement>('[data-count]');
  const emptyEl = catalog.querySelector<HTMLElement>('[data-empty]');
  const featured = document.querySelector<HTMLElement>('[data-featured]');
  const cards = [...catalog.querySelectorAll<HTMLElement>('[data-entry]')];
  const groups = [...catalog.querySelectorAll<HTMLElement>('[data-group]')];
  const template = catalog.dataset.countTemplate ?? '{n}';

  const readFilters = () => ({
    q: qInput?.value ?? '',
    format: formatSel?.value ?? '',
    lang: langSel?.value ?? '',
    pricing: pricingSel?.value ?? '',
  });

  const apply = () => {
    const filters = readFilters();
    const active = filtersActive(filters);
    let shown = 0;
    for (const card of cards) {
      const ok = matchesEntry(readEntry(card), filters);
      card.hidden = !ok;
      if (ok) shown += 1;
    }
    for (const group of groups) {
      const visible = group.querySelectorAll('[data-entry]:not([hidden])').length;
      group.hidden = visible === 0;
      const groupCount = group.querySelector('[data-group-count]');
      if (groupCount) groupCount.textContent = String(visible);
    }
    if (featured) featured.hidden = active;
    if (countEl) countEl.textContent = template.replace('{n}', String(shown));
    if (emptyEl) emptyEl.hidden = shown !== 0;

    const url = new URL(window.location.href);
    const next: Record<string, string> = {
      q: normalizeQuery(filters.q),
      format: filters.format,
      lang: filters.lang,
      pricing: filters.pricing,
    };
    for (const [key, value] of Object.entries(next)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);

    document.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((anchor) => {
      const target = new URL(anchor.getAttribute('href') ?? anchor.href, window.location.origin);
      target.search = url.search;
      anchor.href = `${target.pathname}${target.search}${target.hash}`;
    });
  };

  const params = new URLSearchParams(window.location.search);
  if (qInput && params.has('q')) qInput.value = params.get('q') ?? '';
  if (formatSel && params.get('format')) {
    const wanted = params.get('format') ?? '';
    if ([...formatSel.options].some((option) => option.value === wanted)) formatSel.value = wanted;
  }
  if (langSel && params.get('lang')) {
    const wanted = params.get('lang') ?? '';
    if ([...langSel.options].some((option) => option.value === wanted)) langSel.value = wanted;
  }
  if (pricingSel && params.get('pricing')) {
    const wanted = params.get('pricing') ?? '';
    if ([...pricingSel.options].some((option) => option.value === wanted)) pricingSel.value = wanted;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
  });
  form.addEventListener('input', apply);
  form.addEventListener('change', apply);
  form.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (qInput) qInput.value = '';
    if (formatSel) formatSel.value = '';
    if (langSel) langSel.value = '';
    if (pricingSel) pricingSel.value = '';
    apply();
  });

  apply();
}

export function initSite(): void {
  initTheme();
  initCatalog();
}
