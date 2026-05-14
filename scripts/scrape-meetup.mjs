import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'app', 'data')
const PAST_OUTPUT = join(DATA_DIR, 'meetup-events.json')
const UPCOMING_OUTPUT = join(DATA_DIR, 'upcoming-events.json')
const GROUP_OUTPUT = join(DATA_DIR, 'group-info.json')

const GROUP_SLUG = 'bilbo-dev'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache'
}

function resolveRef(apolloState, refObj) {
  if (refObj && typeof refObj === 'object' && '__ref' in refObj) {
    return apolloState[refObj.__ref] ?? null
  }

  return refObj ?? null
}

function normaliseDescription(value) {
  const rawDescription = String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return rawDescription.length > 350 ? `${rawDescription.slice(0, 347)}...` : rawDescription
}

function normaliseEvent(apolloState, node) {
  const photo = resolveRef(apolloState, node.featuredEventPhoto)
  const venue = resolveRef(apolloState, node.venue)
  const dateTime = node.dateTime ?? ''
  const [date = '', rawTime = ''] = dateTime.split('T')

  return {
    id: node.id ?? '',
    title: node.title ?? 'Sin título',
    date,
    time: rawTime.slice(0, 5),
    description: normaliseDescription(node.description),
    url: node.eventUrl ?? '',
    image: photo?.highResUrl ?? photo?.baseUrl ?? '',
    venue: venue?.name ?? '',
    city: venue?.city ?? '',
    attendees: node.going?.totalCount ?? 0
  }
}

function extractApolloState(html, context) {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) {
    throw new Error(`__NEXT_DATA__ not found for ${context}`)
  }

  const apolloState = JSON.parse(match[1])?.props?.pageProps?.__APOLLO_STATE__
  if (!apolloState) {
    throw new Error(`__APOLLO_STATE__ not found for ${context}`)
  }

  return apolloState
}

async function fetchHtml(url, context) {
  const response = await fetch(url, { headers: HEADERS })

  if (!response.ok) {
    throw new Error(`Meetup responded with HTTP ${response.status} for ${context}`)
  }

  return response.text()
}

async function scrapeEvents(type) {
  const html = await fetchHtml(`https://www.meetup.com/${GROUP_SLUG}/events/?type=${type}`, `${type} events`)
  const apolloState = extractApolloState(html, `${type} events`)

  const events = Object.keys(apolloState)
    .filter((key) => key.startsWith('Event:'))
    .map((key) => normaliseEvent(apolloState, apolloState[key]))

  const direction = type === 'past' ? -1 : 1

  return events.sort((a, b) => {
    const firstDate = a.date ? new Date(a.date).getTime() : 0
    const secondDate = b.date ? new Date(b.date).getTime() : 0

    return (firstDate - secondDate) * direction
  })
}

async function scrapeGroupMembers() {
  const html = await fetchHtml(`https://www.meetup.com/${GROUP_SLUG}/`, 'group page')
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)

  if (nextDataMatch) {
    const apolloState = JSON.parse(nextDataMatch[1])?.props?.pageProps?.__APOLLO_STATE__

    if (apolloState) {
      for (const key of Object.keys(apolloState)) {
        const node = apolloState[key]
        if (!node || typeof node !== 'object') {
          continue
        }

        const count =
          node.memberCount ??
          node.membersCount ??
          node.members?.totalCount ??
          (key.startsWith('Group:') && node.memberships?.count) ??
          null

        if (typeof count === 'number' && count > 0) {
          return { members: count }
        }

        if (key.startsWith('Group:') && node.memberships) {
          const ref = resolveRef(apolloState, node.memberships)
          const refCount = ref?.count ?? ref?.totalCount

          if (typeof refCount === 'number' && refCount > 0) {
            return { members: refCount }
          }
        }
      }
    }
  }

  const htmlMatch = html.match(/([\d,.]+)\s*(?:members|miembros)/i)
  if (htmlMatch) {
    const members = Number.parseInt(htmlMatch[1].replace(/[.,]/g, ''), 10)

    if (members > 0) {
      return { members }
    }
  }

  throw new Error('Could not find member count on group page')
}

async function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
}

async function run() {
  mkdirSync(DATA_DIR, { recursive: true })

  console.log('Fetching group info from Meetup...')
  try {
    const groupInfo = await scrapeGroupMembers()
    await writeJson(GROUP_OUTPUT, groupInfo)
    console.log(`Wrote group info (${groupInfo.members} members) to ${GROUP_OUTPUT}`)
  } catch (error) {
    console.error('Group info scrape failed:', error.message)
  }

  console.log('Fetching past events from Meetup...')
  try {
    const past = await scrapeEvents('past')
    await writeJson(PAST_OUTPUT, past)
    console.log(`Wrote ${past.length} past events to ${PAST_OUTPUT}`)
  } catch (error) {
    console.error('Past scrape failed:', error.message)
  }

  console.log('Fetching upcoming events from Meetup...')
  try {
    const upcoming = await scrapeEvents('upcoming')
    await writeJson(UPCOMING_OUTPUT, upcoming)
    console.log(`Wrote ${upcoming.length} upcoming events to ${UPCOMING_OUTPUT}`)
  } catch (error) {
    console.error('Upcoming scrape failed:', error.message)
    await writeJson(UPCOMING_OUTPUT, [])
    console.log('Wrote empty upcoming events (welcome mode).')
  }
}

run()
