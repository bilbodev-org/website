# BilboDev

Web de la Asociación Tecnológica BilboDev, realizada con Nuxt 4, Vue 3 y Three.js.

La web institucional está activa por defecto. Existe una vista opcional de **Página en construcción** para mantenimiento temporal.

## Desarrollo

```bash
npm install
npm run dev
```

Para activar temporalmente la vista de construcción, ejecuta `NUXT_PUBLIC_SITE_UNDER_CONSTRUCTION=true npm run dev`. La vista temporal indica `noindex, nofollow` a los buscadores; no debe estar activa durante la revisión de Ad Grants.

## Verificación y producción

```bash
npm test
npm run typecheck
npm run build
npm run generate
```

`build` crea el servidor Nuxt. `generate` genera las ocho páginas como HTML estático en `.output/public`.

## Contenido

- `app/pages/`: inicio, asociación, encuentros, participación, transparencia, contacto, aviso legal y privacidad.
- `app/data/meetup-events.json`: archivo de eventos reales obtenido de Meetup.
- `scripts/sync-meetup.mjs`: sincronización de las páginas públicas, sin API ni Meetup Pro.
- `docs/EVENTOS.md`: funcionamiento, automatización y mantenimiento de la agenda.
- `app/data/association.ts`: denominación, registro, municipio del domicilio social, contacto y junta. El NIF sigue en tramitación.
- `app/components/ArrowScene.client.vue`: flechas Three.js, arrastre, controles por teclado, pausa, reinicio y movimiento reducido.
- `app/assets/css/main.css`: diseño adaptable y tipografías alojadas localmente.
- `docs/PUBLICACION.md`: fuentes, créditos y cambios necesarios antes de solicitar Google para Organizaciones sin Ánimo de Lucro.

La agenda se alimenta de un archivo versionado de Meetup, actualizable con `npm run events:sync` y mediante GitHub Actions. Las inscripciones se gestionan en Meetup; el contacto directo se muestra en la web. Antes de reenviar la solicitud de Ad Grants, desplegar y revisar la versión pública definitiva.

## Actualizar los eventos

```bash
npm run events:sync
```

Requiere Node.js 22 y acceso a las páginas públicas de Meetup; no requiere instalar dependencias, claves ni suscripción Pro. La vista `/agenda` incluye próximos encuentros, archivo con búsqueda y filtro por año, descripciones, horarios de Bilbao y enlaces individuales. La portada utiliza la misma fuente.

El workflow `.github/workflows/sync-meetup.yml` está preparado para actualizar el JSON cada día y bajo demanda cuando se suba a GitHub. Consulta [Eventos](docs/EVENTOS.md) para los permisos necesarios y la regeneración del sitio estático. El modo de construcción permanece desactivado por defecto.
