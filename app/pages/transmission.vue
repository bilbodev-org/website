<template>
  <div>
    <AppHeader />

    <main id="main-content" class="transmission-main">
      <div class="ambient-glow"></div>

      <div class="central-column">
        <div class="page-header">
          <div class="header-title-group">
            <span class="status-label">Abiertos a propuestas</span>
            <h1 class="page-title">Propón una charla</h1>
          </div>
          <p class="page-description">
            Envía tu propuesta para el próximo evento. Buscamos charlas sobre tecnología,
            arquitectura de software, diseño y experiencias reales del día a día como desarrollador.
          </p>
        </div>

        <div class="form-outer">
          <div class="form-inner">
            <template v-if="submitState === 'idle'">
              <div class="form-header">
                <h3 class="form-title">Envío de propuesta</h3>
              </div>

              <form class="form-body" @submit.prevent="submitProposal">
                <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
                <input type="hidden" name="from_name" value="BilboDev Transmission" />
                <input v-model="proposal.botcheck" type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off" />

                <div class="form-group" :class="{ 'field-error': errors.codename }">
                  <label for="codename" class="form-label">Nombre <span class="required-mark">*</span></label>
                  <div class="input-wrapper">
                    <input
                      id="codename"
                      v-model="proposal.codename"
                      type="text"
                      name="codename"
                      placeholder="ej. Ana García"
                      class="input-field"
                      required
                    />
                    <div class="input-icon">
                      <span class="material-symbols-outlined">badge</span>
                    </div>
                  </div>
                  <span v-if="errors.codename" class="error-message">&gt; {{ errors.codename }}</span>
                </div>

                <div class="form-group" :class="{ 'field-error': errors.email }">
                  <label for="email" class="form-label">Email de contacto <span class="required-mark">*</span></label>
                  <div class="input-wrapper">
                    <input
                      id="email"
                      v-model="proposal.email"
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      class="input-field"
                      required
                    />
                    <div class="input-icon">
                      <span class="material-symbols-outlined">alternate_email</span>
                    </div>
                  </div>
                  <span v-if="errors.email" class="error-message">&gt; {{ errors.email }}</span>
                </div>

                <div class="form-group" :class="{ 'field-error': errors.talkTitle }">
                  <label for="talk_title" class="form-label">Título de la charla <span class="required-mark">*</span></label>
                  <input
                    id="talk_title"
                    v-model="proposal.talkTitle"
                    type="text"
                    name="talk_title"
                    placeholder="ej. SvelteKit y el Edge"
                    class="input-field"
                    required
                  />
                  <span v-if="errors.talkTitle" class="error-message">&gt; {{ errors.talkTitle }}</span>
                </div>

                <div class="form-group" :class="{ 'field-error': errors.abstract }">
                  <div class="label-row">
                    <label for="abstract" class="form-label">Descripción <span class="required-mark">*</span></label>
                    <span class="markdown-hint">Admite Markdown</span>
                  </div>
                  <textarea
                    id="abstract"
                    v-model="proposal.abstract"
                    name="abstract"
                    rows="5"
                    placeholder="Cuéntanos de qué va tu charla..."
                    class="input-field textarea-field"
                    required
                  ></textarea>
                  <span v-if="errors.abstract" class="error-message">&gt; {{ errors.abstract }}</span>
                </div>

                <div class="form-group">
                  <label for="duration" class="form-label">Duración estimada</label>
                  <div class="input-wrapper">
                    <select id="duration" v-model="proposal.duration" name="duration" class="input-field select-field">
                      <option>Charla Relámpago (10m)</option>
                      <option>Protocolo Estándar (30m)</option>
                      <option>Inmersión Profunda (45m+)</option>
                    </select>
                    <div class="select-icon">
                      <span class="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>

                <button type="submit" class="submit-btn" :disabled="submitting">
                  <span class="submit-btn-label">{{ submitting ? 'Enviando...' : 'Enviar propuesta' }}</span>
                </button>
              </form>
            </template>

            <div v-else class="success-panel">
              <span class="material-symbols-outlined" :style="{ fontSize: '3rem', color: submitState === 'success' ? 'var(--primary)' : '#ff5470' }">
                {{ submitState === 'success' ? 'check_circle' : 'error' }}
              </span>
              <h3 class="success-title">{{ submitState === 'success' ? '¡Propuesta enviada!' : 'Error al enviar' }}</h3>
              <p class="success-text">{{ submitMessage }}</p>
              <button type="button" class="success-btn" @click="resetForm">
                {{ submitState === 'success' ? 'Enviar otra propuesta' : 'Reintentar' }}
              </button>
            </div>
          </div>
        </div>

        <div class="uplink-divider">
          <div class="divider-line"></div>
          <h3 class="divider-label">Únete a la comunidad</h3>
          <div class="divider-line"></div>
        </div>

        <div class="community-grid">
          <a v-for="card in communityCards" :key="card.name" :href="card.href" class="comm-card">
            <div class="comm-icon">
              <span class="material-symbols-outlined comm-icon-symbol">{{ card.icon }}</span>
            </div>
            <span class="comm-name">{{ card.name }}</span>
            <span class="comm-action">{{ card.action }}</span>
          </a>
        </div>
      </div>
    </main>

    <footer class="transmission-footer">
      <div class="marquee-wrapper">
        <div class="marquee-track">
          <span class="marquee-text">
            BilboDev — Desde 2019 — Código · Diseño · Cerveza — Próximo evento en preparación — BilboDev — Desde 2019 — Código · Diseño · Cerveza — Próximo evento en preparación —
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const web3FormsEndpoint = 'https://api.web3forms.com/submit'

const proposal = reactive({
  codename: '',
  email: '',
  talkTitle: '',
  abstract: '',
  duration: 'Protocolo Estándar (30m)',
  botcheck: false
})

const errors = reactive({
  codename: '',
  email: '',
  talkTitle: '',
  abstract: ''
})

const submitting = ref(false)
const submitState = ref<'idle' | 'success' | 'error'>('idle')
const submitMessage = ref('')

const communityCards = [
  { icon: 'tag', name: 'Slack', action: 'Unirse al servidor', href: '#' },
  { icon: 'mic', name: 'Discord', action: 'Conectar', href: '#' },
  { icon: 'public', name: 'Redes sociales', action: 'Seguirnos', href: '#' },
  { icon: 'play_circle', name: 'Vídeos', action: 'Ver archivo', href: '#' }
]

function clearErrors() {
  errors.codename = ''
  errors.email = ''
  errors.talkTitle = ''
  errors.abstract = ''
}

function validateProposal() {
  clearErrors()

  if (!proposal.codename.trim()) {
    errors.codename = 'El nombre es obligatorio'
  }

  if (!proposal.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(proposal.email)) {
    errors.email = 'Introduce un email válido'
  }

  if (!proposal.talkTitle.trim()) {
    errors.talkTitle = 'El título es obligatorio'
  }

  if (!proposal.abstract.trim()) {
    errors.abstract = 'La descripción es obligatoria'
  }

  return !errors.codename && !errors.email && !errors.talkTitle && !errors.abstract
}

function buildFormData() {
  const formData = new FormData()

  formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')
  formData.append('from_name', 'BilboDev Transmission')
  formData.append('codename', proposal.codename)
  formData.append('email', proposal.email)
  formData.append('talk_title', proposal.talkTitle)
  formData.append('abstract', proposal.abstract)
  formData.append('duration', proposal.duration)
  formData.append('subject', `[BilboDev] Propuesta de charla: ${proposal.talkTitle}`)

  return formData
}

async function submitProposal() {
  if (!validateProposal()) {
    return
  }

  submitting.value = true

  try {
    const response = await fetch(web3FormsEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: buildFormData()
    })
    const data = await response.json()

    if (response.ok && data.success) {
      submitState.value = 'success'
      submitMessage.value = 'Hemos recibido tu propuesta. Te contactaremos en breve.'
    } else {
      submitState.value = 'error'
      submitMessage.value = data.message || 'No se pudo enviar la propuesta. Inténtalo de nuevo.'
    }
  } catch {
    submitState.value = 'error'
    submitMessage.value = 'Error de red. Comprueba tu conexión e inténtalo de nuevo.'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  submitState.value = 'idle'
  submitMessage.value = ''
}

useSeoMeta({
  title: 'BilboDev - Transmisión',
  description: 'Envía una propuesta de charla para próximos eventos de BilboDev.'
})
</script>
