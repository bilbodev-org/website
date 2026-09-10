<script setup lang="ts">defineProps<{ number: string; label: string; title: string; description: string }>()</script>
<template><header class="page-intro wrap"><div class="eyebrow"><span class="accent">{{ number }} /</span> {{ label }}</div><h1>{{ title }}</h1><p>{{ description }}</p></header></template>
