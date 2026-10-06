import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://dollarangle.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never'
});
