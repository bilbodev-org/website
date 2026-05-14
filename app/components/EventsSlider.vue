<template>
  <section v-if="photos.length" class="events-slider" role="region" aria-label="Galería de fotos de eventos">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="gallery-viewport">
      <button type="button" class="gallery-btn gallery-btn--prev" aria-label="Foto anterior" @click="navigate(-1)">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>

      <div ref="wrapper" class="gallery-track-wrapper">
        <div ref="track" class="gallery-track" :style="trackStyle">
          <div v-for="(photo, index) in photos" :key="`${photo.src}-${index}`" class="gallery-slide">
            <img
              class="gallery-image"
              :src="photo.src.replace('/public/', '/')"
              :alt="photo.alt || 'Foto de evento BilboDev'"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <button type="button" class="gallery-btn gallery-btn--next" aria-label="Siguiente foto" @click="navigate(1)">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import galleryPhotos from '~/data/gallery-photos.json'

interface GalleryPhoto {
  src: string
  alt?: string
}

const photos = galleryPhotos as GalleryPhoto[]
const currentIndex = ref(0)
const wrapper = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const offset = ref(0)

const trackStyle = computed(() => ({
  transform: `translateX(-${offset.value}px)`,
  transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
}))

function updateOffset() {
  const currentSlide = track.value?.querySelectorAll<HTMLElement>('.gallery-slide')[currentIndex.value]
  if (!currentSlide || !wrapper.value) {
    return
  }

  offset.value = currentSlide.offsetLeft - (wrapper.value.offsetWidth - currentSlide.offsetWidth) / 2
}

function navigate(direction: number) {
  currentIndex.value = (currentIndex.value + direction + photos.length) % photos.length
  nextTick(updateOffset)
}

onMounted(() => {
  updateOffset()
  window.addEventListener('resize', updateOffset)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateOffset)
})
</script>
