<script setup lang="ts">
import { eventDate, eventDescription, meetupUrl, syncedAt } from '~/data/events'

useSeoMeta({ title: 'Eventos próximos y pasados — BilboDev', description: 'Consulta las charlas y encuentros de BilboDev: fechas, horarios, lugares y descripciones de las convocatorias publicadas en Meetup.' })
const { now, upcoming, past } = useEvents()
const query = ref('')
const selectedYear = ref('Todos')
const years = computed(() => [...new Set(past.value.map(event => eventDate(event.date, { year: 'numeric' })))])
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
const filteredPast = computed(() => past.value.filter(event =>
  (selectedYear.value === 'Todos' || eventDate(event.date, { year: 'numeric' }) === selectedYear.value)
  && normalize(`${event.title} ${event.description} ${event.location}`).includes(normalize(query.value.trim()))
))
const stale = computed(() => now.value - Date.parse(syncedAt) > 7 * 24 * 60 * 60 * 1000)
</script>

<template>
  <div>
    <header class="wrap events-intro">
      <div class="eyebrow accent">02 / ENCUENTROS</div>
      <h1>Nos vemos en BilboDev.</h1>
      <p>Charlas, ideas y comunidad en Bilbao. Consulta los encuentros y reserva tu plaza en Meetup.</p>
      <nav class="events-jump" aria-label="Secciones de la agenda">
        <a href="#proximos" class="text-link">Próximos <span>{{ upcoming.length }}</span> ↓</a>
        <a href="#pasados" class="text-link">Pasados <span>{{ past.length }}</span> ↓</a>
      </nav>
      <p class="source-note">Datos de <a :href="meetupUrl" target="_blank" rel="noopener noreferrer">BilboDev en Meetup ↗</a> · Actualizados el <time :datetime="syncedAt">{{ eventDate(syncedAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</time>. Horarios de Bilbao (Europe/Madrid).</p>
      <p v-if="stale" class="events-stale" role="status">Hace más de una semana que no se actualiza la agenda. Consulta Meetup para confirmar fechas y nuevas convocatorias.</p>
    </header>

    <section id="proximos" class="wrap agenda-upcoming" aria-labelledby="upcoming-title">
      <h2 id="upcoming-title">Próximos encuentros.</h2>
      <article v-for="event in upcoming" :key="event.id" class="featured-event">
        <time class="featured-date" :datetime="event.date"><strong>{{ eventDate(event.date, { day: '2-digit' }) }}</strong><span>{{ eventDate(event.date, { month: 'long', year: 'numeric' }) }}</span></time>
        <div>
          <EventImage :src="event.imageUrl" :title="event.title" />
          <span class="tag">{{ event.status === 'cancelled' ? 'Cancelado' : Date.parse(event.date) <= now ? 'En curso' : event.isOnline ? 'Online' : 'Presencial' }}</span>
          <h3>{{ event.title }}</h3>
          <div class="event-meta"><span>{{ event.location }}</span><span>{{ eventDate(event.date, { weekday: 'long', hour: '2-digit', minute: '2-digit' }) }} h<template v-if="event.endDate"> · Fin: {{ eventDate(event.endDate, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }} h</template></span></div>
          <p v-if="event.address" class="small muted">{{ event.address }}</p>
          <p class="event-description">{{ eventDescription(event.description) || 'Consulta los detalles de esta convocatoria en Meetup.' }}</p>
          <a class="button primary" :href="event.url" target="_blank" rel="noopener noreferrer">{{ event.status === 'cancelled' ? 'Consultar cancelación en Meetup' : 'Ver convocatoria en Meetup' }} ↗</a>
          <p class="small muted">Consulta en la convocatoria el aforo, la inscripción y los posibles cambios.</p>
        </div>
      </article>
      <div v-if="!upcoming.length" class="empty-events"><h3>Preparando la próxima conversación.</h3><p>La siguiente fecha se anunciará en nuestro grupo. Mientras tanto, descubre los encuentros anteriores.</p><a :href="meetupUrl" class="text-link" target="_blank" rel="noopener noreferrer">Consultar novedades en Meetup ↗</a></div>
    </section>

    <section id="pasados" class="wrap archive-section" aria-labelledby="past-title">
      <div class="section-heading"><div><div class="eyebrow">EL CONOCIMIENTO QUE YA COMPARTIMOS</div><h2 id="past-title">Archivo de encuentros.</h2></div></div>
      <div class="events-filters">
        <label>Buscar en el archivo<input v-model="query" type="search" placeholder="Título, contenido o lugar" aria-controls="archive-results"></label>
        <label>Año<select v-model="selectedYear" aria-controls="archive-results"><option>Todos</option><option v-for="year in years" :key="year">{{ year }}</option></select></label>
      </div>
      <p class="results-count small muted" role="status">{{ filteredPast.length }} {{ filteredPast.length === 1 ? 'encuentro' : 'encuentros' }}</p>
      <div id="archive-results">
        <article v-for="event in filteredPast" :key="event.id" class="archive-event">
          <div class="archive-event-cover">
            <EventImage :src="event.imageUrl" :title="event.title" />
            <time :datetime="event.date">{{ eventDate(event.date, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }} h</time>
          </div>
          <div>
            <span class="eyebrow lavender">{{ event.status === 'cancelled' ? 'Cancelado' : event.isOnline ? 'Online' : 'Presencial' }}</span>
            <h3>{{ event.title }}</h3><p class="small muted">{{ event.location }}</p>
            <details class="event-details"><summary>Leer descripción<span class="sr-only"> de {{ event.title }}</span></summary><p class="event-description">{{ eventDescription(event.description) || 'Sin descripción disponible.' }}</p><p v-if="event.address" class="small muted">{{ event.address }}</p><p v-if="event.endDate" class="small muted">Fin: {{ eventDate(event.endDate, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }} h</p></details>
          </div>
          <a :href="event.url" target="_blank" rel="noopener noreferrer" class="archive-link" :aria-label="`Consultar ${event.title} en Meetup`">Meetup ↗</a>
        </article>
        <div v-if="!filteredPast.length" class="empty-events"><p>{{ past.length ? 'No hay encuentros que coincidan con esta búsqueda.' : 'Todavía no hay encuentros pasados en el archivo.' }}</p><button v-if="query || selectedYear !== 'Todos'" class="button" @click="query = ''; selectedYear = 'Todos'">Limpiar filtros</button></div>
      </div>
    </section>
  </div>
</template>
