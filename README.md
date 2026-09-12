# BilboDev

Web de la Asociación Tecnológica BilboDev, realizada con Nuxt 4, Vue 3 y Three.js.

La vista de **Página en construcción** está activa por defecto en todas las rutas. Así se puede publicar una presencia temporal sin mostrar el contenido institucional de ejemplo mientras se termina la web.

## Desarrollo

```bash
npm install
npm run dev
```

Para revisar la web completa durante el desarrollo, ejecuta `NUXT_PUBLIC_SITE_UNDER_CONSTRUCTION=false npm run dev`. Cuando la información esté validada y se quiera abrir el sitio definitivo, configura `NUXT_PUBLIC_SITE_UNDER_CONSTRUCTION=false` en el entorno de producción y vuelve a compilar o generar. La vista temporal indica `noindex, nofollow` a los buscadores.

## Verificación y producción

```bash
npm run typecheck
npm run build
npm run generate
```

`build` crea el servidor Nuxt. `generate` genera las ocho páginas como HTML estático en `.output/public`.

## Contenido

- `app/pages/`: inicio, asociación, encuentros, participación, transparencia, contacto, aviso legal y privacidad.
- `app/data/events.ts`: convocatorias y archivo de Meetup.
- `app/data/association.ts`: datos institucionales **ficticios**, señalados expresamente en el sitio.
- `app/components/ArrowScene.client.vue`: flechas Three.js, arrastre, controles por teclado, pausa, reinicio y movimiento reducido.
- `app/assets/css/main.css`: diseño adaptable y tipografías alojadas localmente.
- `docs/PUBLICACION.md`: fuentes, créditos y cambios necesarios antes de solicitar Google para Organizaciones sin Ánimo de Lucro.

La agenda es editorial y requiere mantenimiento. Las inscripciones y el contacto se gestionan en los canales reales de BilboDev. La vista previa es privada; sustituir los datos ficticios y completar la documentación antes de publicar definitivamente.
