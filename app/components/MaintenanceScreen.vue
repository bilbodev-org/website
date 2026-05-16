<template>
  <main class="maintenance-screen" aria-labelledby="maintenance-title">
    <div class="maintenance-background bg-grid-pattern" aria-hidden="true"></div>

    <section class="maintenance-panel">
      <img
        class="maintenance-logo"
        src="/bilbodev-logo-white.svg"
        alt="BilboDev"
        width="128"
        height="128"
        loading="eager"
        decoding="async"
      />

      <div class="maintenance-status">
        <span class="status-dot" aria-hidden="true">
          <span class="dot-ping"></span>
          <span class="dot-core"></span>
        </span>
        <span>{{ content.kicker }}</span>
      </div>

      <h1 id="maintenance-title" class="maintenance-title">{{ content.title }}</h1>
      <p class="maintenance-message">{{ content.message }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
type MaintenanceContent = {
  kicker: string
  title: string
  message: string
}

defineProps<{
  content: MaintenanceContent
}>()
</script>
