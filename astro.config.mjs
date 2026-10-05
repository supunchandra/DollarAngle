import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://dollarangle.example';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never'
});
