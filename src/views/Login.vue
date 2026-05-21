<template>
  <div class="login-view">
    <div class="bg-decoration">
      <div class="glow-orb g1"></div>
      <div class="glow-orb g2"></div>
      <div class="glow-orb g3"></div>
    </div>
    
    <div class="login-container">
      <div class="login-card glass-card">
        <header class="login-header">
          <div class="logo-wrapper">
            <img src="/logo2.png" alt="Invoxa Logo">
          </div>
          <h1>Invoxa Pro</h1>
          <p class="subtitle">{{ langStore.t('loginSubtitle') }}</p>
        </header>

        <div class="login-actions">
          <button @click="authStore.loginWithGoogle" class="btn-google">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            <span>{{ langStore.t('signInWithGoogle') }}</span>
          </button>
        </div>

        <footer class="login-footer">
          <p>{{ langStore.t('termsAgreement') }}</p>
        </footer>
      </div>

      <div class="login-decoration-text">
        <span>Empowering Businesses Worldwide</span>
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
  background-color: #0F172A; /* Deep Navy */
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: float 20s infinite alternate ease-in-out;
}

.g1 { width: 400px; height: 400px; background: #10B981; top: -100px; left: -100px; }
.g2 { width: 500px; height: 500px; background: #6366F1; bottom: -150px; right: -100px; animation-delay: -5s; }
.g3 { width: 300px; height: 300px; background: #3B82F6; top: 30%; right: 10%; animation-delay: -10s; }

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(100px, 100px) scale(1.2); }
}

.login-container {
  width: 100%;
  max-width: 480px;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  padding: 60px 48px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.logo-wrapper {
  width: 90px;
  height: 90px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.logo-wrapper img { height: 50px; }

h1 { font-size: 2.5rem; font-weight: 900; color: white; margin: 0 0 12px 0; letter-spacing: -0.04em; }
.subtitle { color: rgba(255, 255, 255, 0.6); font-size: 1.1rem; font-weight: 600; margin-bottom: 48px; }

.btn-google {
  width: 100%;
  background: white;
  color: #1E293B;
  border: none;
  padding: 18px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.btn-google:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3); }
.btn-google:active { transform: translateY(-1px); }

.login-footer { margin-top: 48px; }
.login-footer p { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); font-weight: 500; line-height: 1.5; }

.login-decoration-text {
  margin-top: 40px;
  text-align: center;
}
.login-decoration-text span {
  font-size: 0.8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

@media (max-width: 480px) {
  .glass-card { padding: 48px 24px; }
  h1 { font-size: 2rem; }
}
</style>
