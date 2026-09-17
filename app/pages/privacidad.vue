<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('privacy.seoTitle') })
</script>

<template><div><PageIntro number="07" :label="$t('privacy.label')" :title="$t('privacy.title')" :description="$t('privacy.description')" /><section class="legal-content wrap"><div class="prose"><h2>{{ $t('privacy.navigation') }}</h2><p>{{ $t('privacy.navigationText') }}</p><h2>{{ $t('privacy.hosting') }}</h2><p>{{ $t('privacy.hostingText') }}</p><h2>{{ $t('privacy.contact') }}</h2><p>{{ $t('privacy.contactText') }}</p><h2>{{ $t('privacy.association') }}</h2><p>{{ $t('privacy.associationText') }}</p><p>{{ $t('privacy.futureText') }}</p><NuxtLinkLocale class="text-link" to="/contacto">{{ $t('privacy.channels') }}</NuxtLinkLocale><p class="small muted">{{ $t('privacy.review') }}</p></div></section></div></template>
