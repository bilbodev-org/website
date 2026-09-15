// Only public group event data is persisted. Never save the Apollo cache itself:
// it also contains member profiles and RSVPs.
export const meetupUrl = 'https://www.meetup.com/es-es/bilbo-dev/'

export function eventImageUrl(value) {
  if (typeof value !== 'string' || !value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && (url.hostname === 'meetupstatic.com' || url.hostname.endsWith('.meetupstatic.com'))
      ? url.href : null
  } catch {
    return null
  }
}

export function eventUrl(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.hostname !== 'www.meetup.com'
    || !/^\/(?:[a-z]{2}-[a-z]{2}\/)?bilbo-dev\/events\/\d+\/?$/i.test(url.pathname)) {
    throw new Error(`Convocatoria ajena a BilboDev o URL inválida: ${value}`)
  }
  return `https://www.meetup.com/bilbo-dev/events/${url.pathname.match(/events\/(\d+)/)[1]}/`
}

export function validateEvent(event) {
  if (!/^\d+$/.test(event.id) || !event.title?.trim() || typeof event.description !== 'string'
    || !Number.isFinite(Date.parse(event.date)) || !/(Z|[+-]\d{2}:\d{2})$/.test(event.date)
    || (event.endDate !== null && (!Number.isFinite(Date.parse(event.endDate)) || Date.parse(event.endDate) < Date.parse(event.date)))
    || !['scheduled', 'cancelled'].includes(event.status)
    || typeof event.location !== 'string' || typeof event.address !== 'string'
    || typeof event.isOnline !== 'boolean'
    || (event.imageUrl != null && !eventImageUrl(event.imageUrl))
    || !eventUrl(event.url).endsWith(`/events/${event.id}/`)) {
    throw new Error(`Evento inválido: ${event.id ?? 'sin ID'}`)
  }
  return event
}

export function parseListing(html, type) {
  const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(([, attrs]) => /\bid\s*=\s*["']__NEXT_DATA__["']/i.test(attrs))
  if (!script) throw new Error('Meetup no devuelve datos públicos reconocibles (bloqueo o cambio de formato).')
  const state = JSON.parse(script[2]).props?.pageProps?.__APOLLO_STATE__
  if (!state) throw new Error('Falta el estado público de Meetup.')
  const resolve = value => value?.__ref ? state[value.__ref] : value
  const group = Object.values(state).find(value => value?.__typename === 'Group' && value.urlname === 'bilbo-dev')
  if (!group || group.isPrivate) throw new Error('El grupo público BilboDev no está disponible.')
  const direction = type === 'past' ? 'DESC' : 'ASC'
  const connections = Object.entries(group).filter(([key, value]) => key.startsWith('events(')
    && key.includes(`"sort":"${direction}"`) && Array.isArray(value?.edges) && value?.pageInfo)
  if (connections.length !== 1) throw new Error(`Listado ${type} ausente o ambiguo.`)
  const [, connection] = connections[0]
  if (!Number.isInteger(connection.totalCount) || typeof connection.pageInfo.hasNextPage !== 'boolean') {
    throw new Error('Metadatos de paginación inválidos.')
  }
  const events = connection.edges.map(edge => {
    const raw = resolve(edge.node)
    if (!raw || resolve(raw.group)?.urlname !== 'bilbo-dev') throw new Error('Referencia a evento inválida.')
    if (!['ACTIVE', 'PAST', 'CANCELLED'].includes(raw.status)) throw new Error(`Estado desconocido: ${raw.status}`)
    const venue = resolve(raw.venue)
    return validateEvent({
      id: String(raw.id), title: raw.title, description: raw.description,
      date: raw.dateTime, endDate: raw.endTime ?? null,
      imageUrl: eventImageUrl(resolve(raw.featuredEventPhoto)?.highResUrl)
        ?? eventImageUrl(resolve(raw.displayPhoto)?.highResUrl),
      url: eventUrl(raw.eventUrl), status: raw.status === 'CANCELLED' ? 'cancelled' : 'scheduled',
      isOnline: raw.isOnline === true,
      location: raw.isOnline ? 'Online' : [venue?.name, venue?.city].filter(Boolean).join(' · ') || 'Lugar por confirmar',
      address: raw.isOnline ? '' : venue?.address ?? ''
    })
  })
  if (new Set(events.map(event => event.id)).size !== events.length
    || events.length > connection.totalCount || (connection.pageInfo.hasNextPage && !events.length)) {
    throw new Error('Listado incompleto o inconsistente.')
  }
  return { events, total: connection.totalCount, hasNextPage: connection.pageInfo.hasNextPage }
}

const localDay = value => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date(value))

export async function scrapeEvents(fetchHtml, { maxPages = 100 } = {}) {
  const result = new Map()
  for (const type of ['upcoming', 'past']) {
    const found = new Map()
    const url = new URL('events/', meetupUrl)
    url.searchParams.set('type', type)
    let total
    for (let page = 0; ; page++) {
      if (page >= maxPages) throw new Error('Límite de páginas alcanzado; no se guardará un archivo parcial.')
      const listing = parseListing(await fetchHtml(url.href), type)
      total ??= listing.total
      const previousSize = found.size
      for (const event of listing.events) found.set(event.id, event)
      if (!listing.hasNextPage) break
      if (found.size === previousSize) throw new Error('La paginación no avanza; revisa los filtros de Meetup.')
      // Public date filters, inclusive of the boundary day, so simultaneous
      // events are not silently skipped. Overlapping records are deduplicated.
      const dates = listing.events.map(event => Date.parse(event.date))
      const boundary = type === 'past' ? Math.min(...dates) : Math.max(...dates)
      const parameter = type === 'past' ? 'endDate' : 'startDate'
      const nextDay = localDay(boundary)
      if (url.searchParams.get(parameter) === nextDay) {
        throw new Error('Demasiados eventos en el mismo día para los filtros públicos; archivo sin modificar.')
      }
      url.searchParams.set(parameter, nextDay)
    }
    if (found.size !== total) throw new Error(`Archivo ${type} incompleto: ${found.size} de ${total}.`)
    for (const event of found.values()) result.set(event.id, event)
  }
  return [...result.values()]
}

export function mergeEvents(previous, incoming) {
  const events = new Map(previous.map(event => [validateEvent(event).id, event]))
  for (const event of incoming) events.set(validateEvent(event).id, event)
  return [...events.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id))
}
