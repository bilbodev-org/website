<script setup lang="ts">
const { t } = useI18n()
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })
const navigation = computed(() => [
  { to: '/asociacion', text: t('common.association') },
  { to: '/agenda', text: t('common.events') },
  { to: '/transparencia', text: t('common.transparency') }
])
useHead(() => ({
  htmlAttrs: {
    lang: route.path === '/eu' || route.path.startsWith('/eu/') ? 'eu-ES' : 'es-ES',
    dir: 'ltr'
  }
}))
const siteUnderConstruction = useRuntimeConfig().public.siteUnderConstruction
if (!siteUnderConstruction) {
  useSeoMeta({ description: () => t('site.description') })
}
</script>

<template>
  <ConstructionPage v-if="siteUnderConstruction" />
  <div v-else class="site-shell">
    <a class="skip-link" href="#contenido">{{ $t('common.skip') }}</a>
    <header class="site-header wrap">
      <NuxtLinkLocale class="brand-link" to="/" :aria-label="$t('common.home')"><BrandLogo /></NuxtLinkLocale>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-controls="main-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? $t('common.close') : $t('common.menu') }}</button>
      <nav id="main-nav" class="main-nav" :class="{ 'is-open': menuOpen }" :aria-label="$t('common.mainNavigation')">
        <NuxtLinkLocale v-for="item in navigation" :key="item.to" :to="item.to">{{ item.text }}</NuxtLinkLocale>
        <LanguageSwitcher />
        <NuxtLinkLocale class="nav-join" to="/participa">{{ $t('common.join') }} <span aria-hidden="true">↗</span></NuxtLinkLocale>
      </nav>
    </header>
    <main id="contenido"><NuxtPage /></main>
    <footer class="site-footer wrap">
      <div class="footer-top">
        <div><NuxtLinkLocale to="/" :aria-label="$t('common.home')"><BrandLogo /></NuxtLinkLocale><p>{{ $t('footer.tagline') }}</p></div>
        <div class="footer-links"><span class="eyebrow">{{ $t('footer.associationHeading') }}</span><NuxtLinkLocale to="/asociacion">{{ $t('footer.about') }}</NuxtLinkLocale><NuxtLinkLocale to="/transparencia">{{ $t('common.transparency') }}</NuxtLinkLocale><NuxtLinkLocale to="/contacto">{{ $t('common.contact') }}</NuxtLinkLocale></div>
        <div class="footer-links"><span class="eyebrow">{{ $t('footer.findUs') }}</span><a href="https://www.meetup.com/es-es/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('common.meetup') }}</a><a href="https://www.linkedin.com/company/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('common.linkedin') }}</a><a href="https://www.instagram.com/bilbo_dev/" target="_blank" rel="noopener noreferrer">{{ $t('common.instagram') }}</a><NuxtLinkLocale to="/agenda">{{ $t('footer.ourEvents') }}</NuxtLinkLocale></div>
        <div class="footer-location"><span class="location-cross" aria-hidden="true">✳</span><span>{{ $t('footer.location') }}<br><span class="muted">43°15′ N · 2°56′ O</span></span></div>
      </div>
      <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} {{ $t('footer.nonProfit') }}</span><div><NuxtLinkLocale to="/aviso-legal">{{ $t('common.legal') }}</NuxtLinkLocale><NuxtLinkLocale to="/privacidad">{{ $t('common.privacy') }}</NuxtLinkLocale></div><span class="footer-basque">{{ $t('footer.motto') }}</span></div>
    </footer>
    <NuxtRouteAnnouncer />
  </div>
</template>
