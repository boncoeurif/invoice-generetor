<template>
  <div class="login-view">
    <div class="login-card">
      <div class="logo-section">
        <img src="/logo2.png" alt="Invoxa Logo" class="login-logo">
        <h1>Invoxa</h1>
        <p>{{ langStore.t('loginSubtitle') }}</p>
      </div>

      <div class="action-section">
        <button @click="authStore.loginWithGoogle" class="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
          {{ langStore.t('signInWithGoogle') }}
        </button>
        <p class="terms">{{ langStore.t('termsAgreement') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from '@/store/authStore'
import { langStore } from '@/store/languageStore'
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 2rem;
  /* Ensure the login card is truly centered */
  position: absolute;
  top: 0;
  left: 0;
}

.login-card {
  background: var(--color-surface);
  padding: 3rem 2rem;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.logo-section {
  margin-bottom: 3rem;
}

.login-logo {
  height: 60px;
  margin-bottom: 1.5rem;
}

.login-card h1 {
  font-size: 2rem;
  color: #fff;
  margin: 0;
}

.login-card p {
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

.btn-google {
  width: 100%;
  background: #fff;
  color: #000;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
}

.btn-google:hover {
  transform: translateY(-2px);
  background: #f8f8f8;
}

.btn-google img {
  width: 20px;
}

.terms {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 2rem;
}
</style>
