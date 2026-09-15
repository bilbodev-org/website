export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: { siteUnderConstruction: true }
  },
  app: { head: {
    htmlAttrs: { lang: 'es' },
    title: 'BilboDev — Tecnología con raíces, conocimiento sin fronteras',
    meta: [{ name: 'theme-color', content: '#171724' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  } },
  nitro: { prerender: {
    crawlLinks: true,
    routes: ['/', '/asociacion', '/agenda', '/participa', '/transparencia', '/contacto', '/aviso-legal', '/privacidad']
  } },
  typescript: { strict: true }
})
