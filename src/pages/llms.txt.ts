import { getVisibleArticles } from '../lib/content';

export const prerender = true;

function clean(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export async function GET({ site }: { site: URL | undefined }) {
  const base = site ?? new URL('https://dollarangle.com');
  const articles = await getVisibleArticles();

  const sections = [
    '# DollarAngle',
    '',
    '> DollarAngle is a financial education and commentary publication explaining personal finance, investing, markets and the economy in plain English.',
    '',
    'Content is educational and informational only, not personalized financial, investment, tax or legal advice.',
    '',
    '## Core pages',
    '',
    `- [Home](${new URL('/', base).href}): DollarAngle homepage and latest approved content.`,
    `- [Explore](${new URL('/explore', base).href}): Browse approved guides and analysis.`,
    `- [About](${new URL('/about', base).href}): Mission, audience and editorial scope.`,
    `- [Editorial Policy](${new URL('/editorial-policy', base).href}): Sourcing, corrections, conflicts and editorial standards.`,
    `- [Financial Disclaimer](${new URL('/disclaimer', base).href}): Important limitations and risk disclosures.`,
    '',
    '## Topics',
    '',
    `- [Personal Finance](${new URL('/topics/personal-finance', base).href})`,
    `- [Investing](${new URL('/topics/investing', base).href})`,
    `- [Markets](${new URL('/topics/markets', base).href})`,
    `- [Economy](${new URL('/topics/economy', base).href})`,
    `- [Real Estate](${new URL('/topics/real-estate', base).href})`,
    `- [Crypto](${new URL('/topics/crypto', base).href})`
  ];

  if (articles.length) {
    sections.push('', '## Published articles', '');
    for (const entry of articles) {
      sections.push(
        `- [${clean(entry.data.title)}](${new URL(`/articles/${entry.id}`, base).href}): ${clean(entry.data.description)}`
      );
    }
  }

  sections.push(
    '',
    '## Crawling and discovery',
    '',
    `- [Sitemap](${new URL('/sitemap.xml', base).href})`,
    `- [Robots](${new URL('/robots.txt', base).href})`,
    ''
  );

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
