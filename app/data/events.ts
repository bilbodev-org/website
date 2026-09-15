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

export function eventDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', ...options }).format(new Date(value))
}

// Plain text only: Meetup descriptions contain Markdown; never inject remote HTML.
export function eventDescription(value: string) {
  return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)').replace(/\*\*|__|`/g, '')
}
