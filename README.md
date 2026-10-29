# Consultorio Dental Satélite

Site Astro statique, en espagnol et en anglais, déployé sur Vercel. Le travail se fait sur la branche `dev`.

## Développement

Utiliser une version de Node.js compatible avec Astro (22.23.4 ou supérieure). Le projet Vercel utilise Node.js 24.

```sh
npm ci
npm run dev
```

## Vérification

```sh
npm run check
npm test
npm run preview
```

`check` vérifie les composants Astro et leurs types. `test` compile le site puis contrôle les quatre pages générées, les liens, les ressources, les métadonnées et les informations légales.

## Organisation

- `src/pages/` : accueil et confidentialité dans les deux langues.
- `src/layouts/SiteLayout.astro` : document HTML, métadonnées communes et mise en page.
- `src/components/` : en-tête, pied de page et choix de langue.
- `src/data/site.ts` : coordonnées, routes et libellés de navigation.
- `src/styles/global.css` : styles globaux du site.
- `src/scripts/site.js` : menu mobile et animations d’apparition.
- `public/` : logos, photos, polices, favicon, robots.txt et sitemap.xml, copiés sans modification.

Les routes publiques restent `/`, `/en/`, `/aviso-de-privacidad` et `/en/privacy-notice`. Le format de compilation `preserve` conserve les fichiers HTML correspondants ; Vercel fournit les URL sans extension grâce à `cleanUrls`.

## Demandes de rendez-vous

Le formulaire de la section `#contacto` transmet les demandes à `https://formspree.io/f/xnppzwew`. Son composant est `src/components/AppointmentForm.astro` et la validation ainsi que les retours d’envoi sont dans `src/scripts/appointment.js`. Sans JavaScript, le formulaire utilise directement sa méthode POST vers Formspree.

## Déploiement

```sh
vercel deploy --prod --yes
```

Vercel exécute `npm run build` et publie `dist/`. La liaison du projet reste dans `.vercel/`, hors Git. Le site statique ne nécessite pas d’adaptateur serveur.
