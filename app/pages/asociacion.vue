<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: () => t('association.seoTitle'),
  description: () => t('association.seoDescription')
})
</script>

<template><div>
  <PageIntro number="01" :label="$t('association.label')" :title="$t('association.title')" :description="$t('association.description')" />
  <section class="editorial-grid wrap"><div class="eyebrow">{{ $t('association.purposeLabel') }}</div><div class="prose"><h2>{{ $t('association.purposeTitle') }}</h2><p>{{ $t('association.purposeP1') }}</p><p>{{ $t('association.purposeP2') }}</p><p>{{ $t('association.purposeP3') }}</p></div></section>
  <section class="values-section wrap"><div class="section-heading"><div><div class="eyebrow">{{ $t('association.valuesLabel') }}</div><h2>{{ $t('association.valuesTitle1') }}<br>{{ $t('association.valuesTitle2') }}</h2></div></div><div class="values-list"><article><span class="accent">01</span><h3>{{ $t('association.value1Title') }}</h3><p>{{ $t('association.value1Text') }}</p></article><article><span class="accent">02</span><h3>{{ $t('association.value2Title') }}</h3><p>{{ $t('association.value2Text') }}</p></article><article><span class="accent">03</span><h3>{{ $t('association.value3Title') }}</h3><p>{{ $t('association.value3Text') }}</p></article></div></section>
  <section class="editorial-grid wrap"><div class="eyebrow">{{ $t('association.originLabel') }}</div><div class="prose"><h2>{{ $t('association.originTitle1') }}<br>{{ $t('association.originTitle2') }}</h2><p>{{ $t('association.originP1') }}</p><p>{{ $t('association.originP2') }}</p><p>{{ $t('association.originP3') }}</p><NuxtLinkLocale class="text-link" to="/agenda">{{ $t('association.journey') }}</NuxtLinkLocale></div></section>
  <section class="join-strip wrap"><span class="eyebrow">{{ $t('association.open') }}</span><div><h2>{{ $t('association.knowUs') }}</h2><NuxtLinkLocale class="button outline" to="/transparencia">{{ $t('association.seeTransparency') }}</NuxtLinkLocale></div></section>
</div></template>
