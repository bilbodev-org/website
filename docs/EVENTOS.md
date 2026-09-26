# Eventos de Meetup

## Actualización

Con Node.js 22, ejecutar `npm run events:sync` desde el repositorio. No requiere dependencias, cookies, credenciales, API oficial ni Meetup Pro. El comando consulta secuencialmente las páginas públicas `https://www.meetup.com/es-es/bilbo-dev/events/?type=upcoming` y `?type=past`, y extrae los eventos del JSON de hidratación `__NEXT_DATA__` / `__APOLLO_STATE__`.

`app/data/meetup-events.json` es la fuente versionada. Contiene versión de esquema, fuente, fecha de consulta y eventos: ID real, título, descripción, inicio, fin si está disponible, URL individual, estado de cancelación, modalidad, lugar, dirección y URL de la imagen original de Meetup cuando está disponible. Las imágenes se cargan desde el CDN público de Meetup; si faltan o fallan, la convocatoria sigue mostrando su información. No se guardan perfiles, listas de asistentes ni el HTML descargado. El navegador utiliza el JSON incorporado a la compilación y no consulta Meetup.

Los eventos se deduplican por ID y los cambios sustituyen el registro previo. El historial que ya no aparece en Meetup se conserva. Si desaparece un evento futuro, el comando falla para que se revise manualmente: no supone una cancelación ni elimina la convocatoria automáticamente. La fecha de consulta solo se actualiza después de completar ambos listados y validar sus totales. La escritura es atómica; un error deja intacto el archivo anterior y devuelve un código distinto de cero.

## Paginación y errores

Meetup sirve actualmente 30 próximos eventos y 10 pasados por página. Cuando anuncia más páginas, se siguen los filtros públicos `startDate` / `endDate` con el día límite incluido, en Europe/Madrid. Se eliminan los duplicados y se contrasta el número final con `totalCount`. Esto evita saltarse eventos que comparten fecha. Hay un límite de 100 páginas por listado. Si hay tantos eventos en un mismo día que los filtros no permiten avanzar, el comando falla expresamente; será necesario adaptar la paginación, nunca aceptar un archivo parcial.

Las peticiones tienen un tiempo máximo de 30 segundos y una pausa de al menos 1,2 segundos entre ellas. Solo se reintentan errores de red, HTTP 429 y 5xx (hasta tres intentos). Se respeta `Retry-After` hasta 60 segundos; una espera mayor aborta la ejecución. No se intenta eludir bloqueos, CAPTCHA, acceso privado ni autenticación. Un cambio en el HTML, las referencias o los estados admitidos requiere revisar `scripts/meetup.mjs`.

## GitHub Actions

`.github/workflows/sync-meetup.yml` está preparado para ejecutarse cada día a las 06:23 UTC y manualmente desde Actions → Actualizar eventos de Meetup → Run workflow. Se activa al subirlo a la rama por defecto de GitHub, con Actions habilitado y permiso de escritura de contenido. No necesita secretos. Ejecuta los tests, sincroniza y hace commit exclusivamente del JSON. La fecha de consulta provoca un commit diario aunque no cambien las convocatorias, para que la web pueda informar de su vigencia.

Si la rama está protegida contra commits del bot, el push fallará: adaptar la política del repositorio o el workflow al proceso de PR habitual. Las ejecuciones fallidas se pueden consultar en Actions. GitHub puede retrasar ejecuciones o desactivar cron en repositorios públicos inactivos.

Este workflow actualiza el repositorio; no publica en Sites ni configura un proveedor de alojamiento. Tras actualizar el archivo, regenerar y desplegar por el procedimiento habitual. Los commits hechos con `GITHUB_TOKEN` no disparan otros workflows de tipo `push`: si la publicación usa GitHub Actions, encadenarla mediante `workflow_run` comprobando el resultado satisfactorio o añadir el build y despliegue al mismo flujo.

## Agenda y comprobación

`/agenda` presenta próximos eventos y archivo, búsqueda sin distinción de tildes, filtro por año, descripciones desplegables, cancelaciones, lugares y horarios. Los eventos en curso permanecen en próximos hasta su hora de fin; si no hay hora de fin, se utiliza el inicio. La clasificación se actualiza al abrir la página y cada minuto. La portada utiliza el primer evento próximo no cancelado. Las descripciones se muestran como texto escapado, nunca como HTML remoto.

Una consulta de más de siete días muestra un aviso para confirmar la información en Meetup. Regenerar periódicamente el HTML estático mantiene también actualizado el contenido inicial para usuarios sin JavaScript.

La web completa se muestra por defecto. Para revisar la agenda, ejecutar `npm run dev` y abrir `/agenda`; para generar el sitio estático, usar `npm run generate`. El modo de construcción es opcional y no debe estar activo durante la revisión de Ad Grants.

Verificaciones: `npm test`, `npm run typecheck`, `npm run build` y `npm run generate`. Los tests del scraper no acceden a la red y cubren extracción, datos privados excluidos, paginación solapada, fallos, deduplicación, conservación del historial y fechas.
