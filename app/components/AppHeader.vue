<template>
  <header class="header">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <div class="header-container">
      <NuxtLink to="/" class="logo-group" aria-label="BilboDev, ir al inicio" @click="closeMenu">
        <img
          class="logo-image"
          src="/bilbodev-logo-white.svg"
          alt="BilboDev"
          width="128"
          height="128"
          loading="eager"
          decoding="async"
        />
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Navegación principal">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: isActive(link.to) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <button
        class="mobile-menu-btn"
        :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="toggleMenu"
      >
        <span class="material-symbols-outlined">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <nav id="mobile-menu" class="mobile-menu" :class="{ open: menuOpen }" aria-label="Menú de navegación">
      <NuxtLink
        v-for="link in links"
        :key="`mobile-${link.to}`"
        :to="link.to"
        class="nav-link"
        :class="{ active: isActive(link.to) }"
        @click="closeMenu"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/archive', label: 'Eventos pasados' },
  { to: '/transmission', label: 'Proponer charla' }
]

function isActive(path: string) {
  return route.path === path
}

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
