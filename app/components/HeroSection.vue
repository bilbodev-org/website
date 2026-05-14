<template>
  <section class="hero-section">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="hero-layout">
      <div class="hero-content">
        <div v-if="event">
          <h2 class="hero-badge">Próximo evento</h2>
          <h1 class="hero-title">{{ event.title }}</h1>
          <p class="hero-desc">{{ event.description }}</p>
        </div>

        <div v-else>
          <h1 class="hero-title hero-title--logo">
            <img
              class="hero-logo"
              src="/bilbodev-logo-white.svg"
              alt="BilboDev"
              width="444"
              height="136"
              decoding="async"
            />
          </h1>
          <p class="hero-desc">
            La comunidad tech de Bilbao. Charlas, código, diseño y networking en el Greater Bilbao.
            Nuevo evento en preparación, mantente conectado.
          </p>
        </div>

        <div class="action-group">
          <a
            v-if="event?.url"
            :href="event.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            Asistir
            <span class="material-symbols-outlined arrow-icon">arrow_forward</span>
          </a>
          <template v-else>
            <NuxtLink to="/archive" class="btn-primary">
              Ver eventos
              <span class="material-symbols-outlined arrow-icon">arrow_forward</span>
            </NuxtLink>
            <NuxtLink to="/transmission" class="btn-outline">Proponer charla</NuxtLink>
          </template>
        </div>
      </div>

      <div class="data-block">
        <div class="event-details">
          <div class="details-list">
            <template v-if="event">
              <div class="detail-item">
                <span class="material-symbols-outlined detail-icon">calendar_month</span>
                <div>
                  <span class="detail-label">Fecha</span>
                  <span class="detail-value">{{ event.date || 'TBA' }}</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="material-symbols-outlined detail-icon">schedule</span>
                <div>
                  <span class="detail-label">Hora</span>
                  <span class="detail-value">{{ event.time ? `${event.time} CET` : 'TBA' }}</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="material-symbols-outlined detail-icon">location_on</span>
                <div>
                  <span class="detail-label">Lugar</span>
                  <span class="detail-value">{{ event.venue || 'TBA' }}</span>
                  <span v-if="event.city" class="detail-subtext">{{ event.city }}</span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="detail-item">
                <span class="material-symbols-outlined detail-icon">terminal</span>
                <div>
                  <span class="detail-label">Próximo evento</span>
                  <span class="detail-value">En preparación...</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="material-symbols-outlined detail-icon">group</span>
                <div>
                  <span class="detail-label">Comunidad</span>
                  <span class="detail-value">Activa</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="material-symbols-outlined detail-icon">location_on</span>
                <div>
                  <span class="detail-label">Sede</span>
                  <span class="detail-value">Bilbao, Euskadi</span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="quick-stats">
          <template v-if="event">
            <div class="stat">
              <span class="stat-value">{{ attendees }}</span>
              <span class="stat-label">Asistentes</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">Gratis</span>
              <span class="stat-label">Entrada</span>
            </div>
          </template>
          <template v-else>
            <div class="stat">
              <span class="stat-value">2025</span>
              <span class="stat-label">Fundación</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">Gratis</span>
              <span class="stat-label">Siempre</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import upcomingEvents from '~/data/upcoming-events.json'

interface EventItem {
  title: string
  date?: string
  time?: string
  description?: string
  url?: string
  venue?: string
  city?: string
  attendees?: number
}

const event = computed(() => (upcomingEvents as EventItem[])[0] ?? null)
const attendees = computed(() => {
  const value = event.value?.attendees ?? 0

  return value > 0 ? String(value).padStart(2, '0') : '--'
})
</script>
