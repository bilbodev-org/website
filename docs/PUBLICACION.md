# BilboDev: revisión antes de la publicación definitiva

La web implementa un sitio informativo Nuxt con identidad, misión, actividades, participación, contacto, transparencia, aviso legal y privacidad. Esta versión contiene datos institucionales de ejemplo expresamente solicitados para el diseño. No está lista para presentarse como documentación oficial.

## Sustituir datos de ejemplo

Editar `app/data/association.ts`: NIF, inscripción registral, domicilio, correo y junta. Los valores actuales son ficticios; el dominio `.example` no es un contacto operativo. Cambiar `demo` a `false` solo tras validar toda la información y actualizar las menciones de ejemplo en transparencia, aviso legal y privacidad. Incorporar estatutos, acta y cuentas auténticas cuando estén aprobados y disponibles. No se han creado documentos ni importes contables falsos.

El canal funcional de contacto es el grupo público de Meetup. Añadir correo institucional verificado y revisar responsable y tratamientos de privacidad antes de la apertura pública. Las inscripciones en Meetup no equivalen a altas de socios.

## Google para Organizaciones sin Ánimo de Lucro

Fuentes oficiales consultadas el 10 de septiembre de 2026:
- Directrices de participación para España: https://support.google.com/nonprofits/answer/3215869?hl=es&co=GENIE.CountryCode%3DES
- Política de sitios web para Ad Grants: https://support.google.com/grants/answer/1657899?hl=en
- Información general: https://www.google.com/nonprofits/

La participación general requiere que la entidad cumpla los requisitos de su país y sea verificada por Goodstack. La política web de Ad Grants es un requisito adicional de ese producto: contenido propio sustancial, misión y actividades claras, identidad, navegación funcional, acceso móvil, HTTPS y dominio controlado por la asociación. Una web no garantiza la aprobación. La vista previa privada no sustituye el dominio público definitivo.

Antes de solicitar el programa: verificar elegibilidad registral, aportar datos reales, revisar textos legales según los tratamientos reales, publicar en un dominio bajo control de la asociación con HTTPS y acceso público, comprobar el rendimiento móvil del sitio definitivo y mantener la actividad actualizada. No hay analítica ni donaciones en esta implementación.

## Contenido y mantenimiento

`app/data/events.ts` contiene siete encuentros documentados en https://www.meetup.com/es-es/bilbo-dev/ y el archivo previo https://www.meetup.com/es-ES/bilbo-frontend/. No existe sincronización automática: actualizar al anunciar nuevos encuentros. Las fechas incorporan la zona horaria de Bilbao. Los eventos pasados se clasifican al abrir la página, pero también se debe regenerar periódicamente el sitio estático para que el HTML inicial siga actualizado. La cifra «200+» corresponde a miembros del grupo de Meetup, no socios ni asistentes únicos; fue aportada por la asociación.

Fotografía: Tiia Monto, https://commons.wikimedia.org/wiki/File:Bilbao_panorama_2.jpg, CC BY-SA 3.0. Versión reducida a 2400 px, encuadrada y con superposición de color en CSS. Se conserva su atribución en el aviso legal.

Logotipo original facilitado por el usuario: `public/images/bilbodev-original.png`. El encabezado utiliza una marca vectorial de interfaz y las flechas se reconstruyen con Three.js. No se ha modificado el archivo original.

## Comandos

- `npm install`
- `npm run dev`
- `npm run build`: servidor Nuxt de producción.
- `npm run generate`: HTML estático prerenderizado en `.output/public`, apto para Sites o alojamiento estático.
- `npm run typecheck`: comprobación TypeScript de la aplicación y de la configuración Nuxt.

Las dos flechas flotan en una capa transparente de toda la portada y acompañan el scroll. Arrastrar gira libremente en 360°; Mayús + arrastrar mueve la flecha por la pantalla y Alt + arrastrar la gira en el plano. Los giros usan cuaterniones incrementales, conservan la orientación e incorporan inercia. Hay controles de teclado (direcciones y Q/E), pausa y reinicio. Se respeta movimiento reducido, los enlaces reciben prioridad sobre la capa y el scroll táctil permanece nativo. La escena se carga solo en la home y libera sus recursos al salir. La animación se detiene fuera de la home o con la pestaña oculta. Hay una alternativa SVG si no hay WebGL.
