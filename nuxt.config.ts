// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@vercel/analytics'],
  css: ['~/assets/css/global.css'],
  routeRules: {
    '/archive.html': { redirect: '/archive' },
    '/transmission.html': { redirect: '/transmission' },
    '/event.html': { redirect: '/' }
  }
})
