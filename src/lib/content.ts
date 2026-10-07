import { getCollection } from 'astro:content';

export const showDrafts = true;

export async function getVisibleArticles() {
  const entries = await getCollection('articles');
  return entries
    .filter((entry) => showDrafts || !entry.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
