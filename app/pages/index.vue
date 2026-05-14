<template>
  <div>
    <div class="background-layer bg-grid-pattern"></div>
    <AppHeader />

    <main id="main-content" class="main-content">
      <HeroSection />
      <CommunityMetrics />
    </main>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'BilboDev // Main Terminal',
  description: 'BilboDev es la comunidad de desarrollo de software en Bilbao. Eventos, charlas y networking para desarrolladores.'
})
</script>
