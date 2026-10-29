import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Check Astro's rendered output: checking .astro source would miss build regressions.
const projectRoot = resolve(import.meta.dirname, '..');
const root = resolve(projectRoot, 'dist');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(projectRoot, 'src/styles/global.css'), 'utf8');
const script = await readFile(resolve(projectRoot, 'src/scripts/site.js'), 'utf8');
const failures = [];

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const matches = (pattern) => html.match(pattern) ?? [];
const appointmentLinks = [...html.matchAll(/<a\b[^>]*\bdata-appointment-link\b[^>]*>/g)];
const whatsappLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"#]+)"/g)];


expect(matches(/<h1(?:\s|>)/g).length === 1, 'The page must contain exactly one H1.');
expect(
  html.includes('<title>Dentista en Ciudad Satélite | Consultorio Dental Satélite</title>'),
  'The required title is missing.',
);
expect(html.includes('rel="canonical" href="https://'), 'The HTTPS canonical is missing.');
expect(html.includes('property="og:title"'), 'Open Graph tags are missing.');
expect(html.includes('"@type": "Dentist"'), 'Dentist structured data is missing.');
expect(!/(?:href|src)="http:\/\//.test(html), 'An internal HTTP URL remains in the HTML.');
expect(appointmentLinks.length >= 10, 'Appointment actions must lead to the booking form.');
expect(appointmentLinks.every(match => match[0].includes('href="#contacto"')), 'Appointment actions must lead to #contacto.');
expect(
  whatsappLinks.every((match) => new URL(match[1]).pathname === '/525534360587'),
  'Direct WhatsApp contact links must use the requested number.',
);
expect(!html.includes('Agendar por WhatsApp'), 'The booking CTA must not open WhatsApp directly.');
expect(/width="\d+" height="\d+"[^>]*alt="[^"]+"/.test(html), 'Images need dimensions and alt text.');
expect(html.includes('loading="lazy"'), 'Below-the-fold image lazy loading is missing.');
expect(!html.includes('20+ años') && !html.includes('<cite>'), 'Unverified experience or testimonials remain.');
expect(html.includes('Escáner intraoral') && html.includes('Radiografía digital'), 'Confirmed technology is missing.');
expect(matches(/class="team-card"/g).length === 8, 'Expected eight team members.');
expect(matches(/<details>/g).length === 7, 'Expected seven treatment descriptions.');
expect(html.includes('tel:+525553938629'), 'The clinic phone is missing.');
const sectionIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  expect(sectionIds.has(match[1]), `Broken section link: ${match[1]}`);
}
JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
expect(css.length > 0, 'The stylesheet is empty.');
expect(script.length > 0, 'The script is empty.');

const pages = [
  ['index.html', 'es', '/'],
  ['aviso-de-privacidad.html', 'es', '/aviso-de-privacidad'],
  ['en/index.html', 'en', '/en/'],
  ['en/privacy-notice.html', 'en', '/en/privacy-notice'],
];
const routes = new Map(pages.map(([file, , route]) => [route, file]));
for (const [file, language, route] of pages) {
  const page = await readFile(resolve(root, file), 'utf8');
  expect(page.includes(`lang="${language}"`), `Wrong language: ${file}`);
  expect(page.includes(`rel="canonical" href="https://consultoriodentalsatelite.com.mx${route}"`), `Wrong canonical: ${file}`);
  expect(page.includes('hreflang="es-MX"') && page.includes('hreflang="en"') && page.includes('hreflang="x-default"'), `Missing language alternates: ${file}`);
  expect((page.match(/aria-current="page"/g) ?? []).length >= 1, `Missing active language: ${file}`);
  expect((page.match(/class="brand-logo"/g) ?? []).length === 2, `Header or footer logo missing: ${file}`);
  expect(!page.includes('midentista@') && !page.includes('mailto:'), `Unconfirmed email address: ${file}`);
  expect(page.includes('Circuito Historiadores S 44, Local 3'), `Wrong address: ${file}`);
  expect((page.match(/<h1(?:\s|>)/g) ?? []).length === 1, `Expected one H1: ${file}`);
  if (file.includes('privacidad') || file.includes('privacy-notice')) {
    for (const text of ['Lourdes Carrillo Rojas', 'CARL680626156', 'Régimen Simplificado de Confianza (RESICO)']) {
      expect(page.includes(text), `Missing legal identity in ${file}: ${text}`);
    }
  }
  if (file === 'index.html' || file === 'en/index.html') {
    for (const name of [
      'CD Lourdes Carrillo Rojas',
      'LO Karen Jiménez Márquez',
      'CD Xóchitl Felix Roldán',
      'CDEO Juan Carlos Cervantes Riquelme',
      'CD Cesar Ojeda Vallesillo',
      'LCD Iván Barrera Hernández',
      'Betzabe Vázquez Torres',
      'Ana Ramos Castillo',
    ]) {
      expect(page.includes(`<h3>${name}</h3>`), `Missing or incorrect team member in ${file}: ${name}`);
    }
    expect(page.includes('data-appointment-form'), `Missing appointment form: ${file}`);
    expect(page.includes('action="https://formspree.io/f/xnppzwew"'), `Wrong Formspree endpoint: ${file}`);
    for (const field of ['name', 'phone', 'date', 'time', 'consent']) {
      expect(page.includes(`name="${field}"`), `Missing appointment field ${field}: ${file}`);
    }
  }
  const localLinks = [
    ...page.matchAll(/(?:href|src)="((?!https?:|#|tel:|mailto:)[^"?]+)"/g),
    ...page.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g),
  ];
  for (const match of localLinks) {
    for (const item of match[1].split(',')) {
      const candidate = item.trim().split(/\s+/)[0];
      const pathname = new URL(candidate, `https://example.com${route}`).pathname;
      const target = routes.get(pathname) ?? pathname.slice(1);
      await access(resolve(root, target)).catch(() => failures.push(`Broken link in ${file}: ${candidate}`));
    }
  }
  const stylesheet = page.match(/<link[^>]+href="([^\"]+\.css)"/);
  expect(Boolean(stylesheet), `Missing compiled Astro stylesheet: ${file}`);
  if (stylesheet) {
    const builtCss = await readFile(resolve(root, stylesheet[1].replace(/^\//, '')), 'utf8');
    expect(builtCss.includes('#1f42b2'), `Brand color missing from compiled CSS: ${file}`);
    for (const match of builtCss.matchAll(/url\(["']?(\/assets\/[^\s)'\"]+)/g)) {
      await access(resolve(root, match[1].slice(1))).catch(() => failures.push(`Broken CSS asset: ${match[1]}`));
    }
  }
  if (route === '/' || route === '/en/') {
    expect(/<script[^>]+type="module"[^>]+src="\/_astro\//.test(page), `Missing bundled interactions: ${file}`);
  }
  if (file === 'en/index.html') {
    expect((page.match(/<details>/g) ?? []).length === 7, 'English treatments missing.');
    expect((page.match(/class="team-card"/g) ?? []).length === 8, 'English team incomplete.');
    expect(page.includes('Open menu') && page.includes('Privacy notice'), 'English interface incomplete.');
    JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    for (const match of page.matchAll(/href="(https:\/\/wa\.me\/[^"#]+)"/g)) {
      const url = new URL(match[1]);
      expect(url.pathname === '/525534360587', 'Wrong English WhatsApp number.');
      expect(!url.searchParams.has('text') || url.searchParams.get('text').startsWith('Hello,'), 'English WhatsApp message missing.');
    }
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

console.log('Astro output, bilingual routes, assets, branding, legal identity, SEO, and appointment-link checks passed.');
