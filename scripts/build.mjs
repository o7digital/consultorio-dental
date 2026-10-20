import { cp, mkdir, rm } from 'node:fs/promises';

const outputDirectory = new URL('../dist/', import.meta.url);
const projectDirectory = new URL('../', import.meta.url);
const files = [
  'index.html',
  'aviso-de-privacidad.html',
  'favicon.svg',
  'styles.css',
  'script.js',
  'robots.txt',
  'sitemap.xml',
  'assets',
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  files.map((file) =>
    cp(new URL(file, projectDirectory), new URL(file, outputDirectory), {
      recursive: true,
    }),
  ),
);

console.log('Static site built successfully in dist/.');
