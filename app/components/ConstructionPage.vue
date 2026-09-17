<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: () => t('construction.seoTitle'),
  description: () => t('construction.seoDescription'),
  robots: 'noindex, nofollow'
})
</script>

<template>
  <div class="construction-page">
    <a class="skip-link" href="#contenido">{{ $t('common.skip') }}</a>

    <header class="construction-header construction-wrap">
      <NuxtLinkLocale to="/" :aria-label="$t('common.home')"><BrandLogo /></NuxtLinkLocale>
      <div class="construction-header-actions"><LanguageSwitcher /><span class="construction-status"><span aria-hidden="true" /> {{ $t('construction.status') }}</span></div>
    </header>

    <main id="contenido" class="construction-main construction-wrap">
      <div class="construction-copy">
        <p class="construction-eyebrow"><span>01 /</span> {{ $t('construction.eyebrow') }}</p>
        <h1>{{ $t('construction.title1') }}<br><span>{{ $t('construction.title2') }}<span class="construction-period">.</span></span></h1>
        <p class="construction-description">{{ $t('construction.description') }}</p>
        <p class="construction-continuity">{{ $t('construction.continuity') }}</p>
        <div class="construction-actions">
          <a class="construction-button" href="https://www.meetup.com/es-es/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('construction.meetup') }} <span aria-hidden="true">↗</span></a>
          <a class="construction-text-link" href="https://www.linkedin.com/company/bilbo-dev/" target="_blank" rel="noopener noreferrer">{{ $t('construction.linkedin') }} <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <div class="construction-art" aria-hidden="true">
        <span class="construction-art-label">43°15′ N / 2°56′ O</span>
        <svg viewBox="0 0 600 560" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="280" r="214" stroke="#DDD1E6" stroke-opacity=".18" />
          <circle cx="300" cy="280" r="164" stroke="#DDD1E6" stroke-opacity=".12" stroke-dasharray="3 9" />
          <path d="M300 27V75M300 485V533M47 280H95M505 280H553" stroke="#DDD1E6" stroke-opacity=".28" />
          <path d="M120 300L310 260L250 340L280 430Z" fill="#FBC15D" stroke="#FBC15D" stroke-width="15" stroke-linejoin="round" />
          <path d="M340 240L460 100L490 280L410 240Z" fill="#B26EC0" stroke="#B26EC0" stroke-width="15" stroke-linejoin="round" />
          <path d="M95 432H166M433 101H514" stroke="#FBC15D" stroke-opacity=".72" stroke-width="2" />
          <circle cx="300" cy="280" r="3" fill="#F7F5F6" />
        </svg>
        <span class="construction-art-caption">BILBO<span>DEV</span> / {{ $t('construction.movement') }}</span>
      </div>
    </main>

    <footer class="construction-footer construction-wrap">
      <span>{{ $t('construction.footer') }}</span>
      <span>{{ $t('footer.motto') }}</span>
    </footer>
    <NuxtRouteAnnouncer />
  </div>
</template>

<style scoped>
.construction-page{min-height:100vh;min-height:100svh;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;background:radial-gradient(ellipse 50% 70% at 78% 44%,#37274775,transparent 75%),radial-gradient(ellipse 55% 75% at 4% 100%,#42213c45,transparent 80%),#171723}
.construction-wrap{width:min(1320px,calc(100% - 112px));margin-inline:auto}
.construction-header{height:106px;display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line)}
.construction-header>a{display:inline-flex}
.construction-header-actions{display:flex;align-items:center;gap:24px}
.construction-status,.construction-eyebrow,.construction-art-label,.construction-art-caption{font-size:.75rem;line-height:1.5;letter-spacing:.14em;font-weight:600}
.construction-status{display:flex;align-items:center;gap:12px;color:var(--muted);white-space:nowrap}
.construction-status>span{width:8px;height:8px;border-radius:50%;background:var(--orange);box-shadow:0 0 0 5px #fbc15d1c}
.construction-main{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);align-items:center;gap:3vw;padding-block:56px 72px}
.construction-copy{position:relative;z-index:1}
.construction-eyebrow{color:var(--muted);margin-bottom:32px}
.construction-eyebrow span{color:var(--orange);margin-right:12px}
.construction-copy h1{max-width:760px;font-size:clamp(3.65rem,6.4vw,6.9rem);line-height:1.04;letter-spacing:-.07em;margin-bottom:35px;text-wrap:balance}
.construction-copy h1>span{color:var(--light-lavender)}
.construction-period{color:var(--orange)}
.construction-description{max-width:560px;font-size:clamp(1.0625rem,1.45vw,1.25rem);line-height:1.7;margin-bottom:18px}
.construction-continuity{color:var(--text);font-size:1rem;margin-bottom:37px}
.construction-actions{display:flex;align-items:center;gap:30px;flex-wrap:wrap}
.construction-button{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:56px;padding:15px 21px;border-radius:3px;background:var(--orange);color:#25212a;font-size:.9375rem;font-weight:700}
.construction-button:hover{background:#ffd58e;transform:translateY(-2px)}
.construction-text-link{display:inline-flex;align-items:center;gap:19px;padding-bottom:7px;border-bottom:1px solid var(--line);font-size:.9375rem}
.construction-text-link:hover{color:var(--orange);border-color:var(--orange)}
.construction-art{position:relative;min-height:470px;display:grid;place-items:center;background-image:linear-gradient(#ddd1e611 1px,transparent 1px),linear-gradient(90deg,#ddd1e611 1px,transparent 1px);background-size:56px 56px;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.construction-art svg{display:block;width:min(100%,580px);height:auto;filter:drop-shadow(0 22px 28px #0002)}
.construction-art-label,.construction-art-caption{position:absolute;color:var(--muted)}
.construction-art-label{top:22px;right:18px}
.construction-art-caption{bottom:22px;left:18px}
.construction-art-caption span{color:var(--orange)}
.construction-footer{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid var(--line);font-size:.8125rem;color:var(--muted)}
.construction-footer span:last-child{color:var(--light-lavender)}
@media(max-width:1100px){.construction-wrap{width:calc(100% - 64px)}.construction-main{gap:0}.construction-copy h1{font-size:clamp(3.35rem,6.5vw,5.6rem)}.construction-art{min-height:400px}}
@media(max-width:780px){.construction-wrap{width:calc(100% - 40px)}.construction-header{height:82px}.construction-header :deep(.brand){width:158px}.construction-status{font-size:.6875rem}.construction-main{grid-template-columns:1fr;padding-block:58px 30px}.construction-copy h1{font-size:clamp(3rem,10vw,5rem);margin-bottom:28px}.construction-eyebrow{margin-bottom:25px}.construction-description{max-width:610px}.construction-art{min-height:280px;max-width:520px;width:100%;margin:20px auto 0}.construction-art svg{width:min(100%,400px)}.construction-art-label,.construction-art-caption{font-size:.625rem}.construction-footer{padding-block:22px;min-height:70px}}
@media(max-width:480px){.construction-header-actions{gap:10px}.construction-status{display:none;letter-spacing:.06em}.construction-copy h1{font-size:clamp(2.7rem,11.6vw,4rem)}.construction-actions{align-items:flex-start;flex-direction:column;gap:25px}.construction-button{width:100%}.construction-art{min-height:240px}.construction-footer{align-items:flex-start;flex-direction:column;gap:8px;font-size:.75rem}}
</style>
