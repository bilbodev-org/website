<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: () => t('participate.seoTitle'),
  description: () => t('participate.seoDescription')
})
</script>

<template><div>
  <PageIntro number="03" :label="$t('participate.label')" :title="$t('participate.title')" :description="$t('participate.description')" />
  <section class="participation-list wrap"><article><span class="participation-number">01</span><div><span class="eyebrow lavender">{{ $t('participate.meetLabel') }}</span><h2>{{ $t('participate.meetTitle') }}</h2><p>{{ $t('participate.meetText') }}</p><a class="button primary" href="https://www.meetup.com/es-es/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('participate.joinMeetup') }}</a><p class="small muted">{{ $t('participate.memberNote') }}</p></div></article><article><span class="participation-number">02</span><div><span class="eyebrow lavender">{{ $t('participate.shareLabel') }}</span><h2>{{ $t('participate.shareTitle') }}</h2><p>{{ $t('participate.shareText') }}</p><NuxtLinkLocale class="text-link" to="/contacto">{{ $t('participate.propose') }}</NuxtLinkLocale></div></article><article><span class="participation-number">03</span><div><span class="eyebrow lavender">{{ $t('participate.helpLabel') }}</span><h2>{{ $t('participate.helpTitle') }}</h2><p>{{ $t('participate.helpText') }}</p><NuxtLinkLocale class="text-link" to="/contacto">{{ $t('participate.collaborate') }}</NuxtLinkLocale></div></article></section>
  <section class="faq-section wrap"><div><div class="eyebrow">{{ $t('participate.before') }}</div><h2>{{ $t('participate.faqTitle1') }}<br>{{ $t('participate.faqTitle2') }}</h2></div><div class="faq-list"><details><summary>{{ $t('participate.faq1Q') }}</summary><p>{{ $t('participate.faq1A') }}</p></details><details><summary>{{ $t('participate.faq2Q') }}</summary><p>{{ $t('participate.faq2A') }}</p></details><details><summary>{{ $t('participate.faq3Q') }}</summary><p>{{ $t('participate.faq3A') }}</p></details><details><summary>{{ $t('participate.faq4Q') }}</summary><p>{{ $t('participate.faq4A') }}</p></details><details><summary>{{ $t('participate.faq5Q') }}</summary><p>{{ $t('participate.faq5A') }}</p></details></div></section>
</div></template>
