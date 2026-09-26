<script setup lang="ts">
import { association } from '~/data/association'

const { t } = useI18n()
useSeoMeta({
  title: () => t('contact.seoTitle'),
  description: () => t('contact.seoDescription')
})
</script>

<template><div><PageIntro number="05" :label="$t('contact.label')" :title="$t('contact.title')" :description="$t('contact.description')" />
<section class="contact-layout wrap"><div><span class="eyebrow accent">{{ $t('contact.talk') }}</span><h2>{{ $t('contact.community1') }}<br>{{ $t('contact.community2') }}</h2><p>{{ $t('contact.channel') }}</p><a class="button primary" :href="`mailto:${association.email}`">{{ association.email }} ↗</a><a class="text-link" href="https://www.meetup.com/es-es/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('contact.meetup') }}</a><a class="text-link" href="https://www.linkedin.com/company/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('contact.linkedin') }}</a><a class="text-link" href="https://www.instagram.com/bilbo_dev/" target="_blank" rel="noopener noreferrer">{{ $t('contact.instagram') }}</a></div><div class="contact-note"><span class="eyebrow">{{ $t('contact.startWell') }}</span><h3>{{ $t('contact.tellUs') }}</h3><ul><li><strong>{{ $t('contact.proposalLead') }}</strong> {{ $t('contact.proposalText') }}</li><li><strong>{{ $t('contact.collaborationLead') }}</strong> {{ $t('contact.collaborationText') }}</li><li><strong>{{ $t('contact.participationLead') }}</strong> {{ $t('contact.participationText') }}</li></ul><p>{{ $t('contact.sensitive') }}</p></div></section>
<section class="editorial-grid wrap"><div class="eyebrow">{{ $t('contact.bilbao') }}</div><div class="prose"><h2>{{ $t('contact.river') }}</h2><p>{{ $t('contact.locationText') }}</p><NuxtLinkLocale class="text-link" to="/agenda">{{ $t('contact.places') }}</NuxtLinkLocale></div></section>
</div></template>
