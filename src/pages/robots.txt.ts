export const prerender = true;

export function GET({ site }: { site: URL | undefined }) {
  const base = site ?? new URL('https://dollarangle.vercel.app');
  const sitemap = new URL('/sitemap.xml', base).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}