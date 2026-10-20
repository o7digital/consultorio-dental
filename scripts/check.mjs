import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
const script = await readFile(resolve(root, 'script.js'), 'utf8');
const failures = [];

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const matches = (pattern) => html.match(pattern) ?? [];
const appointmentLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"#]+)"/g)];
const localAssetLinks = [
  ...html.matchAll(/(?:href|src)="((?!https?:|#|tel:|mailto:)[^"?]+)"/g),
  ...html.matchAll(/(?:srcset)="([^"]+)"/g),
];

expect(matches(/<h1(?:\s|>)/g).length === 1, 'The page must contain exactly one H1.');
expect(
  html.includes('<title>Dentista en Ciudad Satélite | Consultorio Dental Satélite</title>'),
  'The required title is missing.',
);
expect(html.includes('rel="canonical" href="https://'), 'The HTTPS canonical is missing.');
expect(html.includes('property="og:title"'), 'Open Graph tags are missing.');
expect(html.includes('"@type": "Dentist"'), 'Dentist structured data is missing.');
expect(!/(?:href|src)="http:\/\//.test(html), 'An internal HTTP URL remains in the HTML.');
expect(appointmentLinks.length >= 12, 'Appointment links are missing.');
expect(
  appointmentLinks.every((match) => new URL(match[1]).pathname === '/525534360587'),
  'Every appointment link must use the requested WhatsApp URL.',
);
expect(/width="\d+" height="\d+"[^>]*alt="[^"]+"/.test(html), 'Images need dimensions and alt text.');
expect(html.includes('loading="lazy"'), 'Below-the-fold image lazy loading is missing.');
expect(!html.includes('20+ años') && !html.includes('<cite>'), 'Unverified experience or testimonials remain.');
expect(html.includes('Escáner intraoral') && html.includes('Radiografía digital'), 'Confirmed technology is missing.');
expect(matches(/class="team-card"/g).length === 5, 'Expected five clinicians.');
expect(matches(/<details>/g).length === 7, 'Expected seven treatment descriptions.');
expect(html.includes('tel:+525553938629'), 'The clinic phone is missing.');
const sectionIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  expect(sectionIds.has(match[1]), `Broken section link: ${match[1]}`);
}
JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
expect(css.length > 0, 'The stylesheet is empty.');
expect(script.length > 0, 'The script is empty.');

for (const match of localAssetLinks) {
  const value = match[1];
  const candidates = value.includes(',')
    ? value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0])
    : [value];

  for (const candidate of candidates) {
    await access(resolve(root, candidate === '/aviso-de-privacidad' ? 'aviso-de-privacidad.html' : candidate)).catch(() => {
      failures.push(`Missing local asset: ${candidate}`);
    });
  }
}

await Promise.all(
  ['robots.txt', 'sitemap.xml'].map((file) =>
    access(resolve(root, file)).catch(() => failures.push(`Missing SEO file: ${file}`)),
  ),
);

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('HTML, assets, SEO, and appointment-link checks passed.');
