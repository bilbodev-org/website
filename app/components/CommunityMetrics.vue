<template>
  <section class="community-metrics" aria-label="Métricas de la comunidad">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="metrics-grid">
      <div v-for="metric in metrics" :key="metric.label" class="metric-card">
        <span class="metric-label">{{ metric.label }}</span>
        <span class="metric-value">{{ metric.value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import groupInfo from '~/data/group-info.json'
import events from '~/data/meetup-events.json'

interface MeetupEvent {
  talks?: unknown[]
}

const foundedYear = 2025

const metrics = computed(() => {
  const meetupEvents = events as MeetupEvent[]
  const talks = meetupEvents.reduce((acc, event) => acc + (Array.isArray(event.talks) ? event.talks.length : 1), 0)
  const members = (groupInfo as { members?: number }).members ?? 0

  return [
    { label: 'Eventos', value: meetupEvents.length || '00' },
    { label: 'Miembros', value: members || '00' },
    { label: 'Charlas', value: talks || '00' },
    { label: 'Desde', value: foundedYear }
  ]
})
</script>
