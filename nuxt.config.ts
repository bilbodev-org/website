export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: { siteUnderConstruction: false }
  },
  app: { head: {
    title: 'BilboDev — Tecnología con raíces, conocimiento sin fronteras',
    meta: [{ name: 'theme-color', content: '#171724' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  } },
  i18n: {
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'es', name: 'Castellano', language: 'es-ES', file: 'es.json' },
      { code: 'eu', name: 'Euskara', language: 'eu-ES', file: 'eu.json' }
    ],
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'bilbodev_locale',
      redirectOn: 'root'
    }
  },
  nitro: { prerender: {
    crawlLinks: true,
    routes: ['/', '/asociacion', '/agenda', '/participa', '/transparencia', '/contacto', '/aviso-legal', '/privacidad', '/eu', '/eu/asociacion', '/eu/agenda', '/eu/participa', '/eu/transparencia', '/eu/contacto', '/eu/aviso-legal', '/eu/privacidad']
  } },
  typescript: { strict: true }
})
