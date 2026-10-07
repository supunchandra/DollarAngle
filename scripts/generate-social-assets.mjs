import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const jobs = [
  ['etf-hero.svg', 'etf-social.jpg'],
  ['employer-match-hero.svg', 'employer-match-social.jpg'],
  ['interest-rates-hero.svg', 'interest-rates-social.jpg'],
  ['rent-vs-buy-hero.svg', 'rent-vs-buy-social.jpg'],
  ['market-headlines-hero.svg', 'market-headlines-social.jpg']
];

const sourceDir = path.resolve('public/article-assets');
const outputDir = path.resolve('public/social-assets');

await mkdir(outputDir, { recursive: true });

for (const [source, output] of jobs) {
  await sharp(path.join(sourceDir, source))
    .resize(1200, 675, { fit: 'cover' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(outputDir, output));
  console.log(`Generated social asset: ${output}`);
}
