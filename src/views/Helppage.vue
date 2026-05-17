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
import { notificationStore } from '@/store/notificationStore'

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
       notificationStore.success(langStore.t('feedbackSuccess') || 'Feedback sent successfully!')
       from_name.value = ''
       from_email.value = ''
       message.value = ''
    }, () => {
       notificationStore.error(langStore.t('feedbackFailed') || 'Failed to send feedback.')
    })
}
</script>

<style scoped>
.helppage-view {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  padding-bottom: 100px;
}

.page-header h1 {
  font-size: 2.25rem;
  color: var(--text-primary);
  font-weight: 900;
  margin: 0;
}

.help-card {
  background: var(--surface-white);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.card-header h2 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 800;
}

.header-icon {
  color: var(--primary-green);
}

.intro-text {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
  font-weight: 500;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 20px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 18px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.step-item:hover {
  transform: translateX(8px);
  border-color: var(--primary-green);
  background: #fff;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--primary-green);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.2);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.step-content strong {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.step-content span {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  font-weight: 500;
}

/* Form Styles */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-group input, .form-group textarea {
  background: #f8fafc;
  border: 1.5px solid var(--border-color);
  color: var(--text-primary);
  padding: 16px;
  border-radius: 14px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--primary-green);
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.08);
}

.btn-submit {
  background: var(--primary-green);
  color: #fff;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
}

.btn-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}

@media (max-width: 768px) {
  .helppage-view {
    padding: 1rem;
  }
  
  .help-card {
    padding: 24px;
  }
  
  .step-item {
    padding: 16px;
  }
}
</style>
