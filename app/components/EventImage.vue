<script setup lang="ts">
const props = defineProps<{ src?: string | null; title: string }>()
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img
    v-if="src && !failed"
    class="event-image"
    :src="src"
    :alt="`Cartel de ${title}`"
    width="960"
    height="540"
    loading="lazy"
    decoding="async"
    referrerpolicy="no-referrer"
    @error="failed = true"
  >
</template>
