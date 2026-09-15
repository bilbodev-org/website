import { readFile, writeFile, rename, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { meetupUrl, scrapeEvents, mergeEvents } from './meetup.mjs'

const output = fileURLToPath(new URL('../app/data/meetup-events.json', import.meta.url))
const temporary = `${output}.${process.pid}.tmp`
let requestCount = 0
async function fetchHtml(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (requestCount++) await delay(1200 * (attempt + 1))
    console.log(`Consultando ${url}`)
    let response
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': 'BilboDev-events/1.0 (public community event archive)', 'Accept-Language': 'es-ES,es;q=0.9' },
        signal: AbortSignal.timeout(30_000)
      })
    } catch (error) {
      if (attempt < 2) continue
      throw error
    }
    if ((response.status >= 500 || response.status === 429) && attempt < 2) {
      const retryAfter = response.headers.get('retry-after')
      const seconds = Number(retryAfter)
      const wait = retryAfter ? (Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now()) : 3000
      if (wait > 60_000) throw new Error('Meetup pide esperar; vuelve a ejecutar la sincronización más tarde.')
      await delay(Math.max(3000, Number.isFinite(wait) ? wait : 3000))
      continue
    }
    if (!response.ok) throw new Error(`Meetup responde HTTP ${response.status}; archivo sin modificar.`)
    if (!response.headers.get('content-type')?.includes('text/html')) throw new Error('Meetup no devuelve HTML.')
    return response.text()
  }
}

try {
  let previous = { events: [] }
  try {
    previous = JSON.parse(await readFile(output, 'utf8'))
    if (previous.schemaVersion !== 1 || !Array.isArray(previous.events)) throw new Error('Archivo local inválido.')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const incoming = await scrapeEvents(fetchHtml)
  const events = mergeEvents(previous.events, incoming)
  // Preserve missing historical events. A missing future event is ambiguous:
  // do not continue showing it as scheduled or invent a cancellation.
  const missing = previous.events.filter(event => Date.parse(event.endDate ?? event.date) >= Date.now()
    && !incoming.some(current => current.id === event.id))
  if (missing.length) throw new Error(`Han desaparecido convocatorias futuras (${missing.map(e => e.id).join(', ')}). Revisión manual necesaria.`)
  const data = { schemaVersion: 1, source: meetupUrl, syncedAt: new Date().toISOString(), events }
  await mkdir(dirname(output), { recursive: true })
  await writeFile(temporary, JSON.stringify(data, null, 2) + '\n')
  await rename(temporary, output)
  console.log(`Guardados ${events.length} eventos (${incoming.length} consultados en Meetup).`)
} catch (error) {
  console.error(`No se ha actualizado el archivo: ${error.message}`)
  process.exitCode = 1
} finally {
  await rm(temporary, { force: true })
}
