<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>
<template><div class="site-shell"><header class="site-header wrap"><a href="/" aria-label="BilboDev, inicio"><BrandLogo /></a></header><main class="page-intro wrap" style="min-height:75vh"><p class="eyebrow accent">{{ error.statusCode === 404 ? '404 / FUERA DE RUTA' : 'ALGO NO HA SALIDO COMO ESPERÁBAMOS' }}</p><h1>{{ error.statusCode === 404 ? 'Esta conexión todavía no existe.' : 'Vamos a intentarlo de nuevo.' }}</h1><p>{{ error.statusCode === 404 ? 'La página que buscas no está aquí. Puedes volver al inicio para encontrar la asociación, los encuentros y la comunidad.' : 'No hemos podido cargar esta página. Vuelve al inicio o inténtalo de nuevo en unos instantes.' }}</p><button class="button primary" style="margin-top:32px" @click="clearError({ redirect: '/' })">Volver a BilboDev ↗</button></main></div></template>
