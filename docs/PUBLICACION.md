# BilboDev: revisión institucional y publicación

La web implementa un sitio informativo Nuxt con identidad, misión, actividades, participación, contacto, transparencia, aviso legal y privacidad. La información registral se contrastó el 26 de septiembre de 2026 con la resolución de inscripción aportada por la asociación.

## Datos institucionales verificados y pendientes

La resolución identifica a la Asociación Tecnológica BilboDev con el número AS/B/27080/2026 en el Registro General de Asociaciones del País Vasco. Indica que la asociación se constituyó el 15 de abril de 2026 en Etxebarri (Bizkaia) y que su actividad se desarrolla principalmente en Bizkaia. La firma electrónica de la resolución es del 24 de agosto de 2026. El documento solo indica el municipio del domicilio social; no acredita la dirección postal completa que figuraba antes en la web.

La asociación confirmó que el NIF sigue en tramitación, que el correo público es `hello@bilbodev.com` y que la junta está integrada por Aarón Barcos en Presidencia y Rebeca Fernandes en Secretaría y Tesorería. Quedan por confirmar la dirección postal completa, si se desea publicarla, y la disponibilidad de estatutos, memoria y cuentas para su difusión. No se han creado documentos ni importes contables ficticios. Las inscripciones en Meetup no equivalen a altas de socios.

## Google para Organizaciones sin Ánimo de Lucro

Fuentes oficiales consultadas el 10 de septiembre de 2026:
- Directrices de participación para España: https://support.google.com/nonprofits/answer/3215869?hl=es&co=GENIE.CountryCode%3DES
- Política de sitios web para Ad Grants: https://support.google.com/grants/answer/1657899?hl=en
- Información general: https://www.google.com/nonprofits/

La participación general requiere que la entidad cumpla los requisitos de su país y sea verificada por Goodstack. La política web de Ad Grants es un requisito adicional de ese producto: contenido propio sustancial, misión y actividades claras, identidad, navegación funcional, acceso móvil, HTTPS y dominio controlado por la asociación. Una web no garantiza la aprobación.

Antes de reenviar la solicitud: desplegar estos cambios en `www.bilbodev.com`, revisar los textos legales según los tratamientos reales, comprobar las páginas públicas y mantener la actividad actualizada. La medición de PageSpeed Insights realizada el 25 de septiembre de 2026 dio 95/100 en rendimiento móvil para la portada. No hay donaciones implementadas.

## Contenido y mantenimiento

`app/data/meetup-events.json` guarda las convocatorias públicas de BilboDev en Meetup. Se actualiza con `npm run events:sync` o con el workflow diario de GitHub Actions. La agenda muestra cuándo se consultó la fuente y avisa si han pasado más de siete días. Las fechas se presentan en la zona horaria de Bilbao y los eventos cambian de sección al finalizar. Hay que regenerar y desplegar el sitio estático después de sincronizar para publicar los cambios. Consulta `docs/EVENTOS.md`. La cifra «200+» corresponde a miembros del grupo de Meetup, no socios ni asistentes únicos; fue aportada por la asociación.

Fotografía: Tiia Monto, https://commons.wikimedia.org/wiki/File:Bilbao_panorama_2.jpg, CC BY-SA 3.0. Versión reducida a 2400 px, encuadrada y con superposición de color en CSS. Se conserva su atribución en el aviso legal.

Logotipo original facilitado por el usuario: `public/images/bilbodev-original.png`. El encabezado utiliza una marca vectorial de interfaz y las flechas se reconstruyen con Three.js. No se ha modificado el archivo original.

## Comandos

- `npm install`
- `npm run dev`
- `npm run build`: servidor Nuxt de producción.
- `npm run generate`: HTML estático prerenderizado en `.output/public`, apto para Sites o alojamiento estático.
- `npm run typecheck`: comprobación TypeScript de la aplicación y de la configuración Nuxt.

Las dos flechas flotan en una capa transparente de toda la portada y acompañan el scroll. Arrastrar gira libremente en 360°; Mayús + arrastrar mueve la flecha por la pantalla y Alt + arrastrar la gira en el plano. Los giros usan cuaterniones incrementales, conservan la orientación e incorporan inercia. Hay controles de teclado (direcciones y Q/E), pausa y reinicio. Se respeta movimiento reducido, los enlaces reciben prioridad sobre la capa y el scroll táctil permanece nativo. La escena se carga solo en la home y libera sus recursos al salir. La animación se detiene fuera de la home o con la pestaña oculta. Hay una alternativa SVG si no hay WebGL.
