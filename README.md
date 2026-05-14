# BilboDev Web

Web de la comunidad BilboDev migrada a [Nuxt](https://nuxt.com/). La app publica la home, el archivo de eventos pasados y la página para proponer charlas usando datos locales generados desde Meetup.

## Requisitos

- Node.js 22
- npm

## Instalación

```bash
npm install
```

## Desarrollo

Arranca el servidor local en `http://localhost:3000`:

```bash
npm run dev
```

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run generate  # generación estática
npm run preview   # previsualizar build
npm run scrape    # actualizar datos desde Meetup
```

## Estructura

- `app/pages/`: páginas Nuxt (`/`, `/archive`, `/transmission`).
- `app/components/`: componentes Vue reutilizables.
- `app/assets/css/`: estilos migrados desde la versión vanilla.
- `app/data/`: JSON consumidos por la app.
- `public/`: assets servidos tal cual, como el logo.
- `scripts/scrape-meetup.mjs`: scraper de Meetup.

## Datos De Meetup

El scraper lee el grupo `bilbo-dev` en Meetup y actualiza:

- `app/data/group-info.json`
- `app/data/meetup-events.json`
- `app/data/upcoming-events.json`

Para ejecutarlo manualmente:

```bash
npm run scrape
```

## Automatización

El workflow `.github/workflows/daily-meetup-scrape.yml` ejecuta el scraper cada día a las `05:00 UTC` y también puede lanzarse manualmente desde GitHub Actions. Si los JSON cambian, el workflow crea un commit con los datos actualizados.

## Iconos

Los iconos del footer usan [`@nuxt/icon`](https://github.com/nuxt/icon) con nombres de Iconify, por ejemplo `simple-icons:instagram`.

## Producción

Genera el build:

```bash
npm run build
```

Previsualiza el resultado:

```bash
npm run preview
```
