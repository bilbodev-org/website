<template>
  <div>
    <AppHeader />

    <main id="main-content" class="archive-main">
      <div class="grid-bg"></div>

      <div class="archive-container">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">
              Eventos <span class="title-gradient">Pasados</span>
            </h1>
            <p class="page-subtitle">{{ events.length }} eventos encontrados en el grupo bilbo-dev.</p>
          </div>
        </div>

        <div class="filter-bar">
          <div class="filter-row">
            <div class="search-group">
              <div class="search-prefix">
                <span class="search-prompt"></span>
              </div>
              <input
                v-model="query"
                type="text"
                placeholder="Buscar por título..."
                class="search-input"
                autocomplete="off"
                aria-label="Buscar eventos"
              />
              <div class="search-suffix">
                <span class="material-symbols-outlined search-icon">search</span>
              </div>
            </div>

            <div class="filters-group">
              <div class="select-wrapper">
                <select v-model="selectedYear" class="select-box" aria-label="Filtrar por año">
                  <option value="">Todos los años</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <div class="select-arrow">
                  <span class="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-section">
          <div class="archive-grid">
            <article
              v-for="(event, index) in filteredEvents"
              :key="event.id"
              class="archive-card"
            >
              <div class="card-image-wrapper">
                <img
                  v-if="event.image"
                  :src="event.image"
                  :alt="event.title"
                  class="card-img"
                  loading="lazy"
                />
                <div v-else class="card-img-placeholder">
                  <span class="material-symbols-outlined placeholder-icon">event</span>
                </div>
                <div v-if="event.attendees > 0" class="card-badge">
                  <span class="badge-text">{{ event.attendees }} asistentes</span>
                </div>
              </div>

              <div class="card-body">
                <div>
                  <div class="card-meta">
                    <span class="card-date">{{ event.date }} · {{ event.time }}</span>
                    <span class="card-id">#{{ String(index + 1).padStart(3, '0') }}</span>
                  </div>
                  <h3 class="card-title">{{ event.title }}</h3>
                  <p v-if="event.venue" class="card-venue">
                    <span class="material-symbols-outlined venue-icon">location_on</span>
                    {{ event.venue }}, {{ event.city }}
                  </p>
                  <p v-if="event.description" class="card-description">{{ event.description }}</p>
                </div>
                <a
                  :href="event.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="card-link"
                >
                  <span>Ver en Meetup</span>
                  <span class="material-symbols-outlined card-arrow">arrow_right_alt</span>
                </a>
              </div>
            </article>
          </div>

          <div v-if="filteredEvents.length === 0" class="empty-state">
            <span class="material-symbols-outlined empty-icon">search_off</span>
            <p class="empty-text">Sin resultados</p>
            <p class="empty-sub">Intenta con otros términos de búsqueda.</p>
          </div>
        </div>

        <div class="end-marker">
          <span class="end-dot"></span>
          <span>Fin del listado · {{ events.length }} eventos</span>
          <span class="end-dot"></span>
        </div>
      </div>

      <button
        class="scroll-top-btn"
        :class="{ visible: showScrollTop }"
        aria-label="Volver arriba"
        @click="scrollToTop"
      >
        <span class="material-symbols-outlined">arrow_upward</span>
      </button>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import meetupEvents from '~/data/meetup-events.json'

interface MeetupEvent {
  id: string
  title: string
  date: string
  time: string
  description?: string
  url: string
  image?: string
  venue?: string
  city?: string
  attendees: number
}

const events = meetupEvents as MeetupEvent[]
const query = ref('')
const selectedYear = ref('')
const showScrollTop = ref(false)

const years = computed(() => {
  return [...new Set(events.map((event) => event.date?.split('-')[0]).filter(Boolean))].sort((a, b) => Number(b) - Number(a))
})

const filteredEvents = computed(() => {
  const normalizedQuery = query.value.toLowerCase().trim()

  return events.filter((event) => {
    const titleMatch = !normalizedQuery || event.title.toLowerCase().includes(normalizedQuery)
    const yearMatch = !selectedYear.value || event.date?.startsWith(selectedYear.value)

    return titleMatch && yearMatch
  })
})

function onScroll() {
  showScrollTop.value = window.scrollY > 600
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

useSeoMeta({
  title: 'BilboDev - Eventos Pasados',
  description: 'Archivo de eventos pasados de la comunidad BilboDev.'
})
</script>
