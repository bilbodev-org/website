<script setup lang="ts">
import { association } from '~/data/association'

const { t } = useI18n()
const boardRoleKeys = ['transparency.presidency', 'transparency.secretary', 'transparency.treasury'] as const
const boardRole = (index: number) => t(boardRoleKeys[index] ?? 'transparency.presidency')
useSeoMeta({
  title: () => t('transparency.seoTitle'),
  description: () => t('transparency.seoDescription')
})
</script>

<template><div><PageIntro number="04" :label="$t('transparency.label')" :title="$t('transparency.title')" :description="$t('transparency.description')" />
<section class="wrap transparency-content"><DemoNotice v-if="association.demo" /><div class="editorial-grid inner"><div class="eyebrow">{{ $t('transparency.identityLabel') }}</div><div class="prose"><h2>{{ $t('transparency.identityTitle') }}</h2><p>{{ $t('transparency.identityText') }}</p><dl class="info-table"><div><dt>{{ $t('transparency.name') }}</dt><dd>{{ association.name }}</dd></div><div><dt>{{ $t('transparency.nif') }}</dt><dd>{{ association.nif }}</dd></div><div><dt>{{ $t('transparency.registry') }}</dt><dd>{{ association.registry }}</dd></div><div><dt>{{ $t('transparency.address') }}</dt><dd>{{ association.address }}</dd></div><div><dt>{{ $t('transparency.scope') }}</dt><dd>Euskadi</dd></div></dl></div></div>
<div class="editorial-grid inner"><div class="eyebrow">{{ $t('transparency.boardLabel') }}</div><div class="prose"><h2>{{ $t('transparency.boardTitle') }}</h2><p>{{ $t('transparency.boardText') }}</p><dl class="info-table"><div v-for="(member, index) in association.board" :key="member.name"><dt>{{ boardRole(index) }}</dt><dd>{{ member.name }} <span class="small muted">{{ $t('common.fictitious') }}</span></dd></div></dl></div></div>
<div class="editorial-grid inner"><div class="eyebrow">{{ $t('transparency.activityLabel') }}</div><div class="prose"><h2>{{ $t('transparency.activityTitle') }}</h2><p>{{ $t('transparency.activityP1') }}</p><p>{{ $t('transparency.activityP2') }}</p><NuxtLinkLocale class="text-link" to="/agenda">{{ $t('transparency.archive') }}</NuxtLinkLocale></div></div>
<div class="editorial-grid inner"><div class="eyebrow">{{ $t('transparency.docsLabel') }}</div><div class="prose"><h2>{{ $t('transparency.docsTitle') }}</h2><p>{{ $t('transparency.docsP1') }}</p><p>{{ $t('transparency.docsP2') }}</p><NuxtLinkLocale class="text-link" to="/contacto">{{ $t('transparency.contact') }}</NuxtLinkLocale></div></div></section>
</div></template>
