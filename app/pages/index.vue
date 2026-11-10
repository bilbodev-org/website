<script setup lang="ts">
import { eventDate } from '~/data/events'

const { t, locale } = useI18n()
const { upcoming: nextEvents } = useEvents()
const upcoming = computed(() => nextEvents.value.find(event => event.status !== 'cancelled'))
const requestPath = useRequestURL().pathname
const eventLocale = requestPath === '/eu' || requestPath.startsWith('/eu/') ? 'eu' : 'es'
const formatEventDate = (value: string, options: Intl.DateTimeFormatOptions) => eventDate(value, options, eventLocale)

useSeoMeta({
  title: () => t('site.title'),
  description: () => t('home.seoDescription')
})
</script>

<template>
  <div class="home-page">
    <section class="hero wrap">
      <div class="hero-topline eyebrow"><span><span class="small-cross" aria-hidden="true">+</span> {{ $t('home.topline') }}</span><span>{{ $t('home.established') }}</span></div>
      <div class="hero-main">
        <div class="hero-copy"><p class="hero-greeting">{{ $t('home.greeting') }}</p><h1>{{ $t('home.title1') }}<br>{{ $t('home.title2') }}<br><span class="lavender">{{ $t('home.title3') }}<span class="accent">.</span></span></h1><p class="hero-description">{{ $t('home.description') }}</p><div class="hero-actions"><NuxtLinkLocale class="button primary" to="/agenda">{{ $t('home.nextEvent') }} <span aria-hidden="true">↗</span></NuxtLinkLocale><NuxtLinkLocale class="text-link" to="/asociacion">{{ $t('home.discover') }} <span aria-hidden="true">↗</span></NuxtLinkLocale></div></div>
        <div class="hero-arrow-space" aria-hidden="true"><svg class="hero-mark hero-mark-orange" viewBox="-1.2 -1.5 2.4 3"><path d="M0-1.32-.98.83 0 .40 .98.83Z" fill="#fbc15d" stroke="#fbc15d" stroke-width=".07" stroke-linejoin="round" /></svg><svg class="hero-mark hero-mark-lavender" viewBox="-1.2 -1.5 2.4 3"><path d="M0-1.32-.98.83 0 .40 .98.83Z" fill="#b26ec0" stroke="#b26ec0" stroke-width=".07" stroke-linejoin="round" /></svg></div>
      </div>
      <div class="hero-bottom"><span>{{ $t('home.culture1') }}<br><strong>{{ $t('home.culture2') }}</strong></span><div class="hero-stat"><strong>200<span class="accent">+</span></strong><span>{{ $t('home.people') }}</span></div><a href="#origen" class="scroll-link">{{ $t('home.followRiver') }} <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="origen" class="origin-section">
      <div class="river-photo"><img src="/images/bilbao.webp" :alt="$t('home.imageAlt')" width="2400" height="664" loading="lazy" decoding="async"><div class="photo-caption"><span>{{ $t('home.caption1') }}</span><span>{{ $t('home.caption2') }}</span></div></div>
      <div class="origin-content wrap"><div class="eyebrow"><span class="accent">01 /</span> {{ $t('home.rootsLabel') }}</div><div><h2>{{ $t('home.rootsTitle1') }}<br>{{ $t('home.rootsTitle2') }}</h2><p>{{ $t('home.rootsP1') }}</p><p>{{ $t('home.rootsP2') }}</p><NuxtLinkLocale class="text-link" to="/asociacion">{{ $t('home.history') }} <span aria-hidden="true">↗</span></NuxtLinkLocale></div></div>
    </section>
    <section class="mission-section wrap" aria-labelledby="mission-title"><div class="section-heading"><div><div class="eyebrow"><span class="accent">02 /</span> {{ $t('home.missionLabel') }}</div><h2 id="mission-title">{{ $t('home.missionTitle') }}</h2></div></div><p class="mission-lead">{{ $t('home.missionIntro') }}</p><div class="mission-grid"><article><h3>{{ $t('home.activity1Title') }}</h3><p>{{ $t('home.activity1Text') }}</p><NuxtLinkLocale class="text-link" to="/agenda">{{ $t('home.activity1Link') }} ↗</NuxtLinkLocale></article><article><h3>{{ $t('home.activity2Title') }}</h3><p>{{ $t('home.activity2Text') }}</p><NuxtLinkLocale class="text-link" to="/participa">{{ $t('home.activity2Link') }} ↗</NuxtLinkLocale></article><article><h3>{{ $t('home.activity3Title') }}</h3><p>{{ $t('home.activity3Text') }}</p><NuxtLinkLocale class="text-link" to="/contacto">{{ $t('home.activity3Link') }} ↗</NuxtLinkLocale></article></div></section>
    <section class="next-section wrap"><div class="section-heading"><div><div class="eyebrow"><span class="accent">03 /</span> {{ $t('home.codeToMeeting') }}</div><h2>{{ $t('home.outsideEditor') }}</h2></div><NuxtLinkLocale class="text-link" to="/agenda">{{ $t('home.allEvents') }} <span aria-hidden="true">↗</span></NuxtLinkLocale></div><NuxtLinkLocale v-if="upcoming" to="/agenda" class="next-event"><EventImage :src="upcoming.imageUrl" :title="upcoming.title" /><div class="event-day"><strong>{{ formatEventDate(upcoming.date, { day: '2-digit' }) }}</strong><span>{{ formatEventDate(upcoming.date, { month: 'short', year: 'numeric' }) }}</span></div><div class="next-event-info"><span class="eyebrow accent">{{ $t('home.nextMeeting') }} · {{ upcoming.isOnline ? $t('common.online').toLocaleUpperCase(locale) : $t('common.cityLabel') }}</span><h3>{{ upcoming.title }}</h3><span class="muted">{{ upcoming.location }} <span class="separator">/</span> {{ formatEventDate(upcoming.date, { hour: '2-digit', minute: '2-digit' }) }} h</span></div><span class="circle-arrow" aria-hidden="true">↗</span></NuxtLinkLocale><div v-else class="empty-events"><h3>{{ $t('home.emptyTitle') }}</h3><p>{{ $t('home.emptyText') }}</p><NuxtLinkLocale to="/agenda" class="text-link">{{ $t('home.pastEvents') }} ↗</NuxtLinkLocale></div></section>
    <section class="join-strip wrap"><span class="eyebrow">{{ $t('home.welcome') }}</span><div><h2>{{ $t('home.curiosity1') }}<br>{{ $t('home.curiosity2') }}</h2><NuxtLinkLocale class="button primary" to="/participa">{{ $t('home.joinBilboDev') }} <span aria-hidden="true">↗</span></NuxtLinkLocale></div><p>{{ $t('home.noMatter') }}</p></section>
  </div>
</template>
