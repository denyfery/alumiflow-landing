import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const base = 'https://alumiflow.com';
const siteIdentity = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AlumiFlow',
    url: base + '/',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AlumiFlow',
    url: base + '/',
    logo: base + '/assets/alumiflow-mark.png',
  },
];
const homeStructuredData = siteIdentity
  .map((item) => `    <script type="application/ld+json">${JSON.stringify(item).replaceAll('<', '\\u003c')}</script>`)
  .join('\n');
const homePages = {
  id: {
    path: '/',
    title: 'Software Workshop Kaca dan Aluminium | AlumiFlow',
    description: 'Kelola customer, survei, penawaran, pekerjaan, instalasi, dan pembayaran workshop kaca dan aluminium dalam satu alur. Jadwalkan demo AlumiFlow.',
    ogLocale: 'id_ID',
  },
  en: {
    path: '/en/',
    title: 'Glass and Aluminium Workshop Software | AlumiFlow',
    description: 'Connect customer requests, surveys, quotes, jobs, installations, and payments in one workflow for glass and aluminium workshops. Book an AlumiFlow demo.',
    ogLocale: 'en_US',
  },
};

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

try {
  const [{ default: App }, { default: GuidePage }, { guides }, { guidePaths }, { LanguageProvider }] = await Promise.all([
    vite.ssrLoadModule('/src/App.tsx'),
    vite.ssrLoadModule('/src/GuidePage.tsx'),
    vite.ssrLoadModule('/src/guides.ts'),
    vite.ssrLoadModule('/src/guideLinks.ts'),
    vite.ssrLoadModule('/src/i18n.tsx'),
  ]);

  const pages = Object.entries(homePages).map(([locale, page]) => ({
    ...page, locale, alternates: { id: '/', en: '/en/' },
  }));
  for (const [guideKey, localized] of Object.entries(guides)) {
    for (const [locale, guide] of Object.entries(localized)) {
      pages.push({
        ...guide, locale, guideKey,
        ogLocale: locale === 'id' ? 'id_ID' : 'en_US',
        alternates: guidePaths[guideKey],
      });
    }
  }

  for (const page of pages) {
    const content = renderToString(createElement(LanguageProvider, { locale: page.locale },
      page.guideKey ? createElement(GuidePage, { guideKey: page.guideKey }) : createElement(App)));
    const html = template
      .replaceAll('__HTML_LANG__', page.locale)
      .replaceAll('__TITLE__', escapeHtml(page.title))
      .replaceAll('__META_DESCRIPTION__', escapeHtml(page.description))
      .replaceAll('__CANONICAL__', base + page.path)
      .replaceAll('__ALTERNATE_ID__', base + page.alternates.id)
      .replaceAll('__ALTERNATE_EN__', base + page.alternates.en)
      .replaceAll('__OG_LOCALE__', page.ogLocale)
      .replace('</head>', `${page.path === '/' ? homeStructuredData + '\n' : ''}  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
    if (/__[A-Z_]+__/.test(html) || !html.includes(`<div id="root">${content}`)) {
      throw new Error(`Prerender gagal untuk ${page.path}`);
    }
    const directory = new URL('../dist/' + page.path.slice(1), import.meta.url);
    await mkdir(directory, { recursive: true });
    const output = new URL('index.html', directory);
    await writeFile(output, html);
    console.log(`Prerender ${page.path}: ${content.length} karakter HTML`);
  }
} finally {
  await vite.close();
}
