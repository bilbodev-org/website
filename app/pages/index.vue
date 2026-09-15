<script setup lang="ts">
import { eventDate } from '~/data/events'
const { upcoming: nextEvents } = useEvents()
const upcoming = computed(() => nextEvents.value.find(event => event.status !== 'cancelled'))
useSeoMeta({ title: 'BilboDev — Tecnología con raíces, conocimiento sin fronteras', description: 'Somos la Asociación Tecnológica BilboDev. Más de 200 personas compartiendo programación, ideas y encuentros desde Bilbao para todo Euskadi.' })
</script>

<template>
  <div class="home-page">
    <section class="hero wrap">
      <ClientOnly><ArrowScene /></ClientOnly>
      <div class="hero-topline eyebrow"><span><span class="small-cross" aria-hidden="true">+</span> ASOCIACIÓN TECNOLÓGICA · BILBAO</span><span>EST. NOVIEMBRE 2025</span></div>
      <div class="hero-main">
        <div class="hero-copy"><p class="hero-greeting">Kaixo, developer.</p><h1>El siguiente<br>Bilbao se escribe<br><span class="lavender">en comunidad<span class="accent">.</span></span></h1><p class="hero-description">De compartir código a compartir futuro. Somos una asociación sin ánimo de lucro que conecta a quienes crean tecnología en Euskadi.</p><div class="hero-actions"><NuxtLink class="button primary" to="/agenda">Nos vemos en el próximo <span aria-hidden="true">↗</span></NuxtLink><NuxtLink class="text-link" to="/asociacion">Conoce BilboDev <span aria-hidden="true">↗</span></NuxtLink></div></div>
        <div class="hero-arrow-space" aria-hidden="true"></div>
      </div>
      <div class="hero-bottom"><span>De la cultura de hacer.<br><strong>A la cultura de compartir.</strong></span><div class="hero-stat"><strong>200<span class="accent">+</span></strong><span>personas en Meetup<br>y una misma curiosidad</span></div><a href="#origen" class="scroll-link">SIGUE LA RÍA <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="origen" class="origin-section">
      <div class="river-photo"><img src="/images/bilbao.jpg" alt="El museo Guggenheim junto a la ría de Bilbao y los edificios de la ciudad" width="8415" height="2330" loading="lazy"><div class="photo-caption"><span>BILBAO. SIEMPRE EN CONSTRUCCIÓN.</span><span>INDUSTRIA → CULTURA → TECNOLOGÍA</span></div></div>
      <div class="origin-content wrap"><div class="eyebrow"><span class="accent">01 /</span> NUESTRAS RAÍCES</div><div><h2>Antes construíamos barcos.<br>Ahora, también conexiones.</h2><p>Bilbao sabe lo que significa transformarse. Nos inspira esa forma de hacer: aprender con las manos, construir junto a otras personas y abrir nuevos caminos.</p><p>Desde noviembre de 2025, trasladamos ese espíritu a la programación multiplataforma. Charlas, experiencias y conversaciones para que el conocimiento tecnológico circule por Euskadi.</p><NuxtLink class="text-link" to="/asociacion">Esta es nuestra historia <span aria-hidden="true">↗</span></NuxtLink></div></div>
    </section>
    <section class="next-section wrap"><div class="section-heading"><div><div class="eyebrow"><span class="accent">02 /</span> DEL CÓDIGO AL ENCUENTRO</div><h2>Nos vemos fuera del editor.</h2></div><NuxtLink class="text-link" to="/agenda">Todos los encuentros <span aria-hidden="true">↗</span></NuxtLink></div><NuxtLink v-if="upcoming" to="/agenda" class="next-event"><EventImage :src="upcoming.imageUrl" :title="upcoming.title" /><div class="event-day"><strong>{{ eventDate(upcoming.date, { day: '2-digit' }) }}</strong><span>{{ eventDate(upcoming.date, { month: 'short', year: 'numeric' }) }}</span></div><div class="next-event-info"><span class="eyebrow accent">PRÓXIMO ENCUENTRO · {{ upcoming.isOnline ? 'ONLINE' : 'BILBAO' }}</span><h3>{{ upcoming.title }}</h3><span class="muted">{{ upcoming.location }} <span class="separator">/</span> {{ eventDate(upcoming.date, { hour: '2-digit', minute: '2-digit' }) }} h</span></div><span class="circle-arrow" aria-hidden="true">↗</span></NuxtLink><div v-else class="empty-events"><h3>La conversación continúa.</h3><p>Consulta en Meetup las nuevas convocatorias y descubre lo que hemos compartido en encuentros anteriores.</p><a href="https://www.meetup.com/es-es/bilbo-dev/" class="text-link">Ver el grupo en Meetup ↗</a></div></section>
    <section class="join-strip wrap"><span class="eyebrow">ONGI ETORRI · AQUÍ TIENES TU SITIO</span><div><h2>Tu curiosidad.<br>Nuestro punto de encuentro.</h2><NuxtLink class="button primary" to="/participa">Forma parte de BilboDev <span aria-hidden="true">↗</span></NuxtLink></div><p>No importa tu lenguaje, tu plataforma o los años que lleves programando.</p></section>
  </div>
</template>
