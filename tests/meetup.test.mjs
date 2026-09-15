import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parseListing, scrapeEvents, mergeEvents, validateEvent, eventImageUrl } from '../scripts/meetup.mjs'
import { partitionEvents } from '../app/data/event-utils.mjs'

const event = (id = '1', date = '2026-09-17T19:00:00+02:00') => ({
  id, title: 'Charla de prueba', description: 'Descripción **pública**', date, endDate: null,
  url: `https://www.meetup.com/bilbo-dev/events/${id}/`, status: 'scheduled',
  isOnline: false, location: 'Bilborock · Bilbao', address: 'Muelle de la Merced, 1',
  imageUrl: null
})

function listing(events, { type = 'past', total = events.length, more = false } = {}) {
  const state = {
    'Group:1': { __typename: 'Group', urlname: 'bilbo-dev', isPrivate: false,
      [`events({"sort":"${type === 'past' ? 'DESC' : 'ASC'}"})`]: {
        edges: events.map(e => ({ node: { __ref: `Event:${e.id}` } })), totalCount: total,
        pageInfo: { hasNextPage: more }
      }
    },
    'Venue:1': { name: 'Bilborock', city: 'Bilbao', address: 'Muelle de la Merced, 1' },
    'Member:1': { name: 'PRIVATE MEMBER NAME' },
    'PhotoInfo:1': { highResUrl: 'https://secure.meetupstatic.com/photos/event/test.jpeg' }
  }
  for (const e of events) state[`Event:${e.id}`] = {
    __typename: 'Event', id: e.id, title: e.title, description: e.description,
    dateTime: e.date, endTime: e.endDate, eventUrl: e.url,
    status: e.status === 'cancelled' ? 'CANCELLED' : 'ACTIVE', isOnline: e.isOnline,
    group: { __ref: 'Group:1' }, venue: { __ref: 'Venue:1' },
    featuredEventPhoto: e.imageUrl ? { __ref: 'PhotoInfo:1' } : null
  }
  return `<script type="application/json" id="__NEXT_DATA__">${JSON.stringify({ props: { pageProps: { __APOLLO_STATE__: state } } })}</script>`
}

test('extracts public event fields, venue references and cancellation without member data', () => {
  const e = { ...event(), status: 'cancelled' }
  assert.deepEqual(parseListing(listing([e]), 'past').events, [e])
  assert.equal(JSON.stringify(parseListing(listing([e]), 'past')).includes('PRIVATE MEMBER'), false)
})

test('rejects blocked pages, foreign URLs, missing dates and incomplete snapshots', async () => {
  assert.throws(() => parseListing('<html>Access denied</html>', 'past'))
  assert.throws(() => validateEvent({ ...event(), url: 'https://evil.example/events/1/' }))
  assert.throws(() => validateEvent({ ...event(), date: 'not-a-date' }))
  assert.throws(() => validateEvent({ ...event(), date: '2026-09-17T19:00:00' }))
  await assert.rejects(() => scrapeEvents(async url => listing([], { type: new URL(url).searchParams.get('type'), total: 3 })), /incompleto/)
})

test('extracts event photo references, falls back to displayPhoto and allows missing photos', () => {
  const e = { ...event(), imageUrl: 'https://secure.meetupstatic.com/photos/event/test.jpeg' }
  assert.equal(parseListing(listing([e]), 'past').events[0].imageUrl, e.imageUrl)
  assert.equal(parseListing(listing([e]).replace('featuredEventPhoto', 'displayPhoto'), 'past').events[0].imageUrl, e.imageUrl)
  assert.equal(parseListing(listing([event()]), 'past').events[0].imageUrl, null)
  for (const value of ['javascript:alert(1)', 'https://meetupstatic.com.evil.example/image.jpg', '', null]) {
    assert.equal(eventImageUrl(value), null)
  }
})

test('paginates public date filters with overlapping days and deduplicates', async () => {
  const recent = event('3', '2026-08-01T19:00:00+02:00')
  const middle = event('2', '2026-07-01T19:00:00+02:00')
  const old = event('1', '2026-06-01T19:00:00+02:00')
  const urls = []
  const events = await scrapeEvents(async url => {
    urls.push(url)
    const params = new URL(url).searchParams
    if (params.get('type') === 'upcoming') return listing([], { type: 'upcoming' })
    if (!params.has('endDate')) return listing([recent, middle], { total: 3, more: true })
    assert.equal(params.get('endDate'), '2026-07-01')
    return listing([middle, old])
  })
  assert.deepEqual(events.map(e => e.id), ['3', '2', '1'])
  assert.equal(urls.length, 3)
})

test('fails safely if Meetup ignores pagination or download fails', async () => {
  await assert.rejects(() => scrapeEvents(async url => new URL(url).searchParams.get('type') === 'upcoming'
    ? listing([], { type: 'upcoming' }) : listing([event()], { total: 2, more: true })), /no avanza/)
  await assert.rejects(() => scrapeEvents(async () => { throw new Error('HTTP 403') }), /403/)
})

test('preserves history, replaces changed events by ID and sorts chronologically', () => {
  const old = event('1', '2025-11-27T18:30:00+01:00')
  const current = event('2')
  const updated = { ...current, title: 'Nueva fecha', status: 'cancelled' }
  assert.deepEqual(mergeEvents([old, current], [updated]), [updated, old])
})

test('uses event end, timezone offsets and chronological order without mutating source', () => {
  const ongoing = { ...event('2'), endDate: '2026-09-17T20:30:00+02:00' }
  const next = event('3', '2026-09-18T19:00:00+02:00')
  const old = event('1', '2026-01-01T19:00:00+01:00')
  const input = [next, old, ongoing]
  const grouped = partitionEvents(input, Date.parse('2026-09-17T18:00:00Z'))
  assert.deepEqual(grouped.upcoming, [ongoing, next])
  assert.deepEqual(grouped.past, [old])
  assert.deepEqual(input, [next, old, ongoing])
  assert.deepEqual(partitionEvents(input, Date.parse(ongoing.endDate)).past, [ongoing, old])
})

test('committed archive follows schema and contains unique real event URLs', async () => {
  const archive = JSON.parse(await readFile(new URL('../app/data/meetup-events.json', import.meta.url)))
  assert.equal(archive.schemaVersion, 1)
  assert.ok(Number.isFinite(Date.parse(archive.syncedAt)))
  archive.events.forEach(validateEvent)
  assert.equal(new Set(archive.events.map(e => e.id)).size, archive.events.length)
})
