import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://consultoriodentalsatelite.com.mx',
  output: 'static',
  compressHTML: false,
  // Keep the existing .html files and clean Vercel URLs, including /en/.
  build: { format: 'preserve' },
});
