<template>
  <div class="app-root">
    <NuxtRouteAnnouncer />
    <MaintenanceScreen v-if="maintenance.enabled" :content="maintenance" />
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const maintenance = appConfig.maintenance

useHead({
  htmlAttrs: {
    lang: 'es',
    class: 'dark'
  }
})

useSeoMeta({
  title: () => maintenance.enabled ? maintenance.title : 'BilboDev // Main Terminal',
  description: () => maintenance.enabled ? maintenance.message : 'BilboDev es la comunidad de desarrollo de software en Bilbao. Eventos, charlas y networking para desarrolladores.',
  ogTitle: () => maintenance.enabled ? maintenance.title : 'BilboDev',
  ogDescription: () => maintenance.enabled ? maintenance.message : 'Comunidad de desarrollo de software en Bilbao.',
  ogType: 'website',
  robots: () => maintenance.enabled ? 'noindex, nofollow' : undefined
})
</script>
