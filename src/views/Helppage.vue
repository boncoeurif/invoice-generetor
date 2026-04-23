<template>
  <div class="helppage-view">
    <header class="page-header">
      <h1>{{ langStore.t('help') }}</h1>
    </header>

    <!-- Guidance Section -->
    <section class="help-card">
      <div class="card-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <h2>{{ langStore.t('howToUse') }}</h2>
      </div>
      <p class="intro-text">{{ langStore.t('howToUseIntro') }}</p>
      
      <div class="steps-list">
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>{{ langStore.t('dashboard') }}:</strong>
            <span>{{ langStore.t('step1') }}</span>
          </div>
        </div>
        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>{{ langStore.t('createInvoice') }}:</strong>
            <span>{{ langStore.t('step2') }}</span>
          </div>
        </div>
        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-content">
            <strong>{{ langStore.t('recycleBin') }}:</strong>
            <span>{{ langStore.t('step4') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Feedback Section -->
    <section class="help-card feedback-card">
      <div class="card-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <h2>{{ langStore.t('feedbackTitle') }}</h2>
      </div>
      <p class="intro-text">{{ langStore.t('feedbackIntro') }}</p>

      <form @submit.prevent="submitFeedback" class="feedback-form">
        <div class="form-group">
          <label>{{ langStore.t('yourName') }}</label>
          <input type="text" v-model="from_name" required :placeholder="langStore.t('yourName')">
        </div>
        <div class="form-group">
          <label>{{ langStore.t('yourEmail') }}</label>
          <input type="email" v-model="from_email" required :placeholder="langStore.t('yourEmail')">
        </div>
        <div class="form-group">
          <label>{{ langStore.t('yourFeedback') }}</label>
          <textarea v-model="message" rows="4" required :placeholder="langStore.t('feedbackPlaceholder')"></textarea>
        </div>
        <button type="submit" class="btn-submit">
          {{ langStore.t('sendFeedback') }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emailjs from 'emailjs-com'
import { langStore } from '@/store/languageStore'

emailjs.init('4pEz8Ivxy7ikNqL9B')

const from_name = ref('')
const from_email = ref('')
const message = ref('')

const submitFeedback = () => {
  const templateParams = {
    from_name: from_name.value,
    from_email: from_email.value,
    message: message.value,
  }

  emailjs.send('service_3wei1up', 'template_k6say24', templateParams)
    .then(() => {
       alert(langStore.t('feedbackSuccess'))
       from_name.value = ''
       from_email.value = ''
       message.value = ''
    }, () => {
       alert(langStore.t('feedbackFailed'))
    })
}
</script>

<style scoped>
.helppage-view {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #fff;
  margin: 0;
}

.help-card {
  background: var(--surface-dark);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 1.1rem;
  color: #fff;
  margin: 0;
}

.header-icon {
  color: var(--primary-green);
}

.intro-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 16px;
  background: rgba(255,255,255,0.02);
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.03);
}

.step-number {
  width: 28px;
  height: 28px;
  background: var(--primary-green);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-content strong {
  font-size: 0.95rem;
  color: #fff;
}

.step-content span {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Form Styles */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input, .form-group textarea {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--primary-green);
  outline: none;
}

.btn-submit {
  background: var(--primary-green);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .helppage-view {
    padding: 0.5rem;
  }
  
  .help-card {
    padding: 20px;
  }
}
</style>
