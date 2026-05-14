<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-brand">
        <NuxtLink to="/" class="footer-logo-link" aria-label="BilboDev, ir al inicio">
          <img
            class="footer-logo"
            src="/bilbodev-logo-white.svg"
            alt=""
            width="160"
            height="48"
            loading="lazy"
            decoding="async"
          />
        </NuxtLink>
        <p class="footer-tagline">
          Comunidad de desarrollo en Bilbao.<br />
          Código, diseño y networking.
        </p>
      </div>

      <nav class="footer-nav" aria-label="Navegación del footer">
        <span class="footer-heading">&gt; navegación</span>
        <NuxtLink to="/" class="footer-link">Inicio</NuxtLink>
        <NuxtLink to="/archive" class="footer-link">Eventos pasados</NuxtLink>
        <NuxtLink to="/transmission" class="footer-link">Proponer charla</NuxtLink>
      </nav>

      <div class="footer-social">
        <span class="footer-heading">&gt; síguenos</span>
        <div class="footer-social-row">
          <a
            v-for="social in socialLinks"
            :key="social.href"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-social-link"
            :aria-label="social.label"
          >
            <Icon :name="social.icon" class="footer-social-icon" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span class="footer-copy">© {{ currentYear }} BilboDev</span>
      <span class="footer-prompt">$ bilbodev --connect<span class="footer-caret">_</span></span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const socialLinks = [
  {
    href: 'https://www.instagram.com/bilbo_dev/',
    label: 'Instagram de BilboDev',
    icon: 'simple-icons:instagram'
  },
  {
    href: 'https://www.linkedin.com/company/bilbo-dev',
    label: 'LinkedIn de BilboDev',
    icon: 'simple-icons:linkedin'
  },
  {
    href: 'https://www.meetup.com/bilbo-dev',
    label: 'Meetup de BilboDev',
    icon: 'simple-icons:meetup'
  }
]
</script>
