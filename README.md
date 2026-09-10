# BilboDev

Web de la Asociación Tecnológica BilboDev, realizada con Nuxt 4, Vue 3 y Three.js.

## Desarrollo

```bash
npm install
npm run dev
```

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
