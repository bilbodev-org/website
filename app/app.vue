<template>
  <div class="app-root">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'es',
    class: 'dark'
  }
})

useSeoMeta({
  title: 'BilboDev // Main Terminal',
  description: 'BilboDev es la comunidad de desarrollo de software en Bilbao. Eventos, charlas y networking para desarrolladores.',
  ogTitle: 'BilboDev',
  ogDescription: 'Comunidad de desarrollo de software en Bilbao.',
  ogType: 'website'
})
</script>
