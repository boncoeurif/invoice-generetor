<template>
  <div class="login-view">
    <div class="bg-glow"></div>
    <div class="login-card">
      <div class="logo-section">
        <div class="logo-wrapper">
          <img src="/logo2.png" alt="Invoxa Logo" class="login-logo">
        </div>
        <h1>Invoxa</h1>
        <p>{{ langStore.t('loginSubtitle') }}</p>
      </div>

      <div class="action-section">
        <button @click="authStore.loginWithGoogle" class="btn-google">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
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
  background-color: var(--bg-light);
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0) 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.login-card {
  background: var(--surface-white);
  padding: 4rem 3rem;
  border-radius: 32px;
  width: 100%;
  max-width: 440px;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);
  position: relative;
  z-index: 1;
}

.logo-section {
  margin-bottom: 3.5rem;
}

.logo-wrapper {
  background: #f8fafc;
  width: 100px;
  height: 100px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 1px solid var(--border-color);
}

.login-logo {
  height: 60px;
}

.login-card h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.login-card p {
  color: var(--text-secondary);
  margin-top: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-google {
  width: 100%;
  background: #fff;
  color: var(--text-primary);
  border: 1.5px solid var(--border-color);
  padding: 16px;
  border-radius: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-google:hover {
  transform: translateY(-2px);
  background: #f8fafc;
  border-color: var(--text-primary);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.terms {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2.5rem;
  line-height: 1.5;
  font-weight: 500;
}

@media (max-width: 480px) {
  .login-card {
    padding: 3rem 2rem;
  }
}
</style>
