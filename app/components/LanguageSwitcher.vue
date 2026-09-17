<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const languages = [
  { code: 'es', short: 'ES', labelKey: 'language.es' },
  { code: 'eu', short: 'EU', labelKey: 'language.eu' }
] as const
</script>

<template>
  <div class="language-switcher" role="group" :aria-label="$t('language.label')">
    <NuxtLink
      v-for="language in languages"
      :key="language.code"
      :to="switchLocalePath(language.code)"
      :lang="language.code"
      :hreflang="language.code"
      :class="{ active: locale === language.code }"
      :aria-current="locale === language.code ? 'page' : undefined"
      :aria-label="$t(language.labelKey)"
    >
      {{ language.short }}
    </NuxtLink>
  </div>
</template>
