<script setup lang="ts">
import { association } from '~/data/association'

const { t } = useI18n()
useSeoMeta({ title: () => t('legal.seoTitle') })
</script>

<template><div><PageIntro number="06" :label="$t('legal.label')" :title="$t('legal.title')" :description="$t('legal.description')" /><section class="legal-content wrap"><div class="prose"><h2>{{ $t('legal.identification') }}</h2><p>{{ $t('legal.holder', { name: association.name }) }}</p><p>{{ $t('legal.details', { nif: association.nif, address: association.address, email: association.email }) }}</p><h2>{{ $t('legal.purpose') }}</h2><p>{{ $t('legal.purposeText') }}</p><h2>{{ $t('legal.links') }}</h2><p>{{ $t('legal.linksText') }}</p><h2>{{ $t('legal.photo') }}</h2><p>{{ $t('legal.photoBefore') }} <a href="https://commons.wikimedia.org/wiki/File:Bilbao_panorama_2.jpg" target="_blank" rel="noopener noreferrer">Tiia Monto / Wikimedia Commons</a>, {{ $t('legal.photoMiddle') }} <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a>. {{ $t('legal.photoAfter') }}</p><h2>{{ $t('legal.update') }}</h2><p>{{ $t('legal.updateText') }}</p></div></section></div></template>
