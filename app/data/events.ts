import archive from './meetup-events.json'
import { partitionEvents } from './event-utils.mjs'

export interface MeetupEvent {
  id: string
  title: string
  description: string
  date: string
  endDate: string | null
  url: string
  status: string
  isOnline: boolean
  location: string
  address: string
  imageUrl?: string | null
}

export const meetupUrl = archive.source
export const syncedAt = archive.syncedAt
export const events: MeetupEvent[] = archive.events
export { partitionEvents }

export function eventDate(value: string, options: Intl.DateTimeFormatOptions, locale = 'es') {
  if (locale.toLowerCase().startsWith('eu')) return basqueEventDate(value, options)
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', ...options }).format(new Date(value))
}

const basqueMonths = {
  long: ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'],
  genitive: ['urtarrilaren', 'otsailaren', 'martxoaren', 'apirilaren', 'maiatzaren', 'ekainaren', 'uztailaren', 'abuztuaren', 'irailaren', 'urriaren', 'azaroaren', 'abenduaren'],
  short: ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.']
}
const basqueWeekdays: Record<string, string> = {
  Sun: 'igandea', Mon: 'astelehena', Tue: 'asteartea', Wed: 'asteazkena',
  Thu: 'osteguna', Fri: 'ostirala', Sat: 'larunbata'
}

function basqueEventDate(value: string, options: Intl.DateTimeFormatOptions) {
  // Numeric parts are intentionally read through a widely supported locale.
  // Some browsers report support for eu-ES but silently format it in Spanish.
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date(value)).map(part => [part.type, part.value]))

  const year = parts.year ?? ''
  const monthIndex = Number(parts.month ?? 1) - 1
  const day = options.day === '2-digit' ? (parts.day ?? '') : String(Number(parts.day ?? 0))
  const month = (options.month === 'short' ? basqueMonths.short[monthIndex] : basqueMonths.long[monthIndex]) ?? ''
  const monthWithDay = (options.month === 'short' ? month : basqueMonths.genitive[monthIndex]) ?? ''
  let date = ''

  if (options.weekday) date = basqueWeekdays[parts.weekday ?? ''] ?? ''
  if (options.year && options.month && options.day) date = `${year}ko ${monthWithDay} ${day}a`
  else if (options.year && options.month) date = `${year}ko ${month}`
  else if (options.year) date = year
  else if (options.month && options.day) date = `${monthWithDay} ${day}a`
  else if (options.month) date = month ?? ''
  else if (options.day) date = day

  const time = options.hour ? `${parts.hour}:${parts.minute}` : ''
  return [date, time].filter(Boolean).join(date && time ? ', ' : '')
}

// Plain text only: Meetup descriptions contain Markdown; never inject remote HTML.
export function eventDescription(value: string) {
  return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)').replace(/\*\*|__|`/g, '')
}
