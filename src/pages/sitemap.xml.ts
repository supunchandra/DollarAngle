import { getVisibleArticles } from '../lib/content';

export const prerender = true;

const staticPaths = [
  '/',
  '/explore',
  '/about',
  '/editorial-policy',
  '/disclaimer',
  '/contact',
  '/topics/personal-finance',
  '/topics/investing',
  '/topics/markets',
  '/topics/economy',
  '/topics/real-estate',
  '/topics/crypto'
];

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET({ site }: { site: URL | undefined }) {
  const base = site ?? new URL('https://dollarangle.vercel.app');
  const articles = await getVisibleArticles();

  const urls = [
    ...staticPaths.map((path) => ({ loc: new URL(path, base).href })),
    ...articles.map((entry) => ({
      loc: new URL(`/articles/${entry.id}`, base).href,
      lastmod: (entry.data.updatedDate ?? entry.data.pubDate).toISOString().slice(0, 10)
    }))
  ];

  const body = urls
    .map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}