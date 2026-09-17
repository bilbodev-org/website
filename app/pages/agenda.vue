<script setup lang="ts">
import type { MeetupEvent } from '~/data/events'
import { eventDate, eventDescription, meetupUrl, syncedAt } from '~/data/events'

const { t, locale } = useI18n()
useSeoMeta({
  title: () => t('agenda.seoTitle'),
  description: () => t('agenda.seoDescription')
})

const { now, upcoming, past } = useEvents()
const query = ref('')
const selectedYear = ref('all')
const requestPath = useRequestURL().pathname
const eventLocale = requestPath === '/eu' || requestPath.startsWith('/eu/') ? 'eu' : 'es'
const formatEventDate = (value: string, options: Intl.DateTimeFormatOptions) => eventDate(value, options, eventLocale)
const years = computed(() => [...new Set(past.value.map(event => formatEventDate(event.date, { year: 'numeric' })))])
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(locale.value === 'eu' ? 'eu-ES' : 'es-ES')
const filteredPast = computed(() => past.value.filter(event =>
  (selectedYear.value === 'all' || formatEventDate(event.date, { year: 'numeric' }) === selectedYear.value)
  && normalize(`${event.title} ${event.description} ${event.location}`).includes(normalize(query.value.trim()))
))
const stale = computed(() => now.value - Date.parse(syncedAt) > 7 * 24 * 60 * 60 * 1000)
const statusLabel = (event: MeetupEvent) => {
  if (event.status === 'cancelled') return t('common.cancelled')
  if (Date.parse(event.date) <= now.value && Date.parse(event.endDate ?? event.date) > now.value) return t('common.inProgress')
  return event.isOnline ? t('common.online') : t('common.inPerson')
}
const clearFilters = () => {
  query.value = ''
  selectedYear.value = 'all'
}
</script>

<template>
  <div>
    <header class="wrap events-intro">
      <div class="eyebrow accent">02 / {{ $t('agenda.label') }}</div>
      <h1>{{ $t('agenda.title') }}</h1>
      <p>{{ $t('agenda.description') }}</p>
      <nav class="events-jump" :aria-label="$t('agenda.sections')">
        <a href="#proximos" class="text-link">{{ $t('agenda.upcoming') }} <span>{{ upcoming.length }}</span> ↓</a>
        <a href="#pasados" class="text-link">{{ $t('agenda.past') }} <span>{{ past.length }}</span> ↓</a>
      </nav>
      <p class="source-note">{{ $t('agenda.sourceBefore') }} <a :href="meetupUrl" target="_blank" rel="noopener noreferrer">BilboDev Meetup ↗</a> · {{ $t('agenda.updated', { date: formatEventDate(syncedAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }) }}</p>
      <p v-if="stale" class="events-stale" role="status">{{ $t('agenda.stale') }}</p>
    </header>

    <section id="proximos" class="wrap agenda-upcoming" aria-labelledby="upcoming-title">
      <h2 id="upcoming-title">{{ $t('agenda.upcomingTitle') }}</h2>
      <article v-for="event in upcoming" :key="event.id" class="featured-event">
        <time class="featured-date" :datetime="event.date"><strong>{{ formatEventDate(event.date, { day: '2-digit' }) }}</strong><span>{{ formatEventDate(event.date, { month: 'long', year: 'numeric' }) }}</span></time>
        <div>
          <EventImage :src="event.imageUrl" :title="event.title" />
          <span class="tag">{{ statusLabel(event) }}</span>
          <h3>{{ event.title }}</h3>
          <div class="event-meta"><span>{{ event.location }}</span><span>{{ formatEventDate(event.date, { weekday: 'long', hour: '2-digit', minute: '2-digit' }) }} h<template v-if="event.endDate"> · {{ $t('common.end') }}: {{ formatEventDate(event.endDate, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }} h</template></span></div>
          <p v-if="event.address" class="small muted">{{ event.address }}</p>
          <p class="event-description">{{ eventDescription(event.description) || $t('agenda.detailsFallback') }}</p>
          <a class="button primary" :href="event.url" target="_blank" rel="noopener noreferrer">{{ event.status === 'cancelled' ? $t('agenda.cancelDetails') : $t('agenda.viewDetails') }} ↗</a>
          <p class="small muted">{{ $t('agenda.capacityNote') }}</p>
        </div>
      </article>
      <div v-if="!upcoming.length" class="empty-events"><h3>{{ $t('agenda.emptyUpcomingTitle') }}</h3><p>{{ $t('agenda.emptyUpcomingText') }}</p><a :href="meetupUrl" class="text-link" target="_blank" rel="noopener noreferrer">{{ $t('agenda.meetupNews') }}</a></div>
    </section>

    <section id="pasados" class="wrap archive-section" aria-labelledby="past-title">
      <div class="section-heading"><div><div class="eyebrow">{{ $t('agenda.archiveLabel') }}</div><h2 id="past-title">{{ $t('agenda.archiveTitle') }}</h2></div></div>
      <div class="events-filters">
        <label>{{ $t('agenda.search') }}<input v-model="query" type="search" :placeholder="$t('agenda.searchPlaceholder')" aria-controls="archive-results"></label>
        <label>{{ $t('agenda.year') }}<select v-model="selectedYear" aria-controls="archive-results"><option value="all">{{ $t('agenda.all') }}</option><option v-for="year in years" :key="year" :value="year">{{ year }}</option></select></label>
      </div>
      <p class="results-count small muted" role="status">{{ $t(filteredPast.length === 1 ? 'agenda.resultOne' : 'agenda.resultMany', { count: filteredPast.length }) }}</p>
      <div id="archive-results">
        <article v-for="event in filteredPast" :key="event.id" class="archive-event">
          <div class="archive-event-cover">
            <EventImage :src="event.imageUrl" :title="event.title" />
            <time :datetime="event.date">{{ formatEventDate(event.date, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }} h</time>
          </div>
          <div>
            <span class="eyebrow lavender">{{ event.status === 'cancelled' ? $t('common.cancelled') : event.isOnline ? $t('common.online') : $t('common.inPerson') }}</span>
            <h3>{{ event.title }}</h3><p class="small muted">{{ event.location }}</p>
            <details class="event-details"><summary>{{ $t('agenda.readDescription') }}<span class="sr-only"> {{ $t('agenda.of', { title: event.title }) }}</span></summary><p class="event-description">{{ eventDescription(event.description) || $t('agenda.noDescription') }}</p><p v-if="event.address" class="small muted">{{ event.address }}</p><p v-if="event.endDate" class="small muted">{{ $t('common.end') }}: {{ formatEventDate(event.endDate, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }} h</p></details>
          </div>
          <a :href="event.url" target="_blank" rel="noopener noreferrer" class="archive-link" :aria-label="$t('agenda.meetupAria', { title: event.title })">Meetup ↗</a>
        </article>
        <div v-if="!filteredPast.length" class="empty-events"><p>{{ past.length ? $t('agenda.noMatches') : $t('agenda.noPast') }}</p><button v-if="query || selectedYear !== 'all'" class="button" @click="clearFilters">{{ $t('agenda.clearFilters') }}</button></div>
      </div>
    </section>
  </div>
</template>
