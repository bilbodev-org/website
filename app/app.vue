<script setup lang="ts">
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })
const navigation = [
  { to: '/asociacion', text: 'La asociación' },
  { to: '/agenda', text: 'Encuentros' },
  { to: '/transparencia', text: 'Transparencia' }
]
useSeoMeta({ description: 'Asociación Tecnológica BilboDev. Desde Bilbao, compartimos conocimiento sobre programación multiplataforma y conectamos a la comunidad tecnológica de Euskadi.' })
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header wrap">
      <NuxtLink class="brand-link" to="/" aria-label="BilboDev, inicio"><BrandLogo /></NuxtLink>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-controls="main-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Cerrar −' : 'Menú +' }}</button>
      <nav id="main-nav" class="main-nav" :class="{ 'is-open': menuOpen }" aria-label="Navegación principal">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.text }}</NuxtLink>
        <NuxtLink class="nav-join" to="/participa">Forma parte <span aria-hidden="true">↗</span></NuxtLink>
      </nav>
    </header>
    <main id="contenido"><NuxtPage /></main>
    <footer class="site-footer wrap">
      <div class="footer-top">
        <div><NuxtLink to="/" aria-label="BilboDev, inicio"><BrandLogo /></NuxtLink><p>Hecho de personas.<br>Construido en Bilbao.</p></div>
        <div class="footer-links"><span class="eyebrow">LA ASOCIACIÓN</span><NuxtLink to="/asociacion">Quiénes somos</NuxtLink><NuxtLink to="/transparencia">Transparencia</NuxtLink><NuxtLink to="/contacto">Contacto</NuxtLink></div>
        <div class="footer-links"><span class="eyebrow">NOS ENCONTRAMOS EN</span><a href="https://www.meetup.com/es-es/bilbo-dev/" target="_blank" rel="noopener noreferrer">Meetup ↗</a><a href="https://www.linkedin.com/company/bilbo-dev/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><NuxtLink to="/agenda">Nuestros encuentros</NuxtLink></div>
        <div class="footer-location"><span class="location-cross" aria-hidden="true">✳</span><span>Bilbao, Euskadi<br><span class="muted">43°15′ N · 2°56′ O</span></span></div>
      </div>
      <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Asociación Tecnológica BilboDev · Sin ánimo de lucro</span><div><NuxtLink to="/aviso-legal">Aviso legal</NuxtLink><NuxtLink to="/privacidad">Privacidad</NuxtLink></div><span class="footer-basque">Ezagutza partekatuz.</span></div>
    </footer>
    <NuxtRouteAnnouncer />
  </div>
</template>
