<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const localePath = useLocalePath()
const goHome = () => clearError({ redirect: localePath('/') })
</script>

<template><div class="site-shell"><header class="site-header wrap"><NuxtLinkLocale to="/" :aria-label="$t('common.home')"><BrandLogo /></NuxtLinkLocale><LanguageSwitcher /></header><main class="page-intro wrap" style="min-height:75vh"><p class="eyebrow accent">{{ error.statusCode === 404 ? $t('error.notFoundLabel') : $t('error.genericLabel') }}</p><h1>{{ error.statusCode === 404 ? $t('error.notFoundTitle') : $t('error.genericTitle') }}</h1><p>{{ error.statusCode === 404 ? $t('error.notFoundText') : $t('error.genericText') }}</p><button class="button primary" style="margin-top:32px" @click="goHome">{{ $t('error.back') }}</button></main></div></template>
