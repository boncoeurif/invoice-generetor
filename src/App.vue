<template>
  <div id="app" :class="['app-layout', isMobile ? 'mobile-mode' : 'desktop-mode']">
    
    <!-- 1. Show Navigation only if Logged In -->
    <template v-if="authStore.user">
      <Sidebar v-if="!isMobile" />

      <div class="content-area">
        <Notification />
        
        <main class="main-content">
          <div class="container">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </main>

        <!-- Bottom Nav Optimized for Mobile -->
        <nav v-if="isMobile" class="bottom-nav">
          <router-link to="/" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </div>
            <span>{{ langStore.t('dashboard') }}</span>
          </router-link>
          
          <router-link to="/history" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </div>
            <span>{{ langStore.t('actions') }}</span>
          </router-link>

          <router-link to="/create" class="nav-item create-nav-btn">
            <div class="plus-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
          </router-link>

          <router-link to="/help" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <span>{{ langStore.t('help') }}</span>
          </router-link>

          <router-link to="/settings" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <span>{{ langStore.t('settings') }}</span>
          </router-link>
        </nav>
      </div>
    </template>

    <!-- 2. Show Login Screen if Not Logged In -->
    <template v-else>
      <div v-if="!authStore.isInitialized" class="auth-loading">
        <div class="spinner"></div>
      </div>
      <router-view v-else />
    </template>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Notification from '@/components/Notification.vue'
import { langStore } from '@/store/languageStore'
import { authStore } from '@/store/authStore'

const isMobile = ref(window.innerWidth <= 768)
const updateBreakpoint = () => { isMobile.value = window.innerWidth <= 768 }

onMounted(() => {
  window.addEventListener('resize', updateBreakpoint)
  setTimeout(() => {
    document.body.classList.add('app-loaded')
  }, 100)
})

onUnmounted(() => { window.removeEventListener('resize', updateBreakpoint) })
</script>

<style>
:root {
  --primary-green: #22C55E;
  --bg-dark: #0F172A;
  --surface-dark: #111827;
  --text-primary: #FFFFFF;
  --text-secondary: #9CA3AF;
  --nav-height: 75px;
}

/* Base Styles */
* { box-sizing: border-box; }
html, body { 
  margin: 0; padding: 0; width: 100%;
  background-color: var(--bg-dark); 
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  overflow-y: auto !important;
  overflow-x: hidden;
}

.auth-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.app-layout { display: flex; min-height: 100vh; width: 100%; }
.content-area { flex: 1; display: flex; flex-direction: column; width: 100%; }
.main-content { padding: 1.5rem; width: 100%; }
.container { max-width: 1200px; margin: 0 auto; width: 100%; }

.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: var(--nav-height);
  background: rgba(17, 24, 39, 0.98);
  backdrop-filter: blur(15px);
  display: flex; justify-content: space-around; align-items: center;
  border-top: 1px solid rgba(255,255,255,0.08);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  text-decoration: none; color: var(--text-secondary); font-size: 0.62rem; gap: 4px;
}

.nav-item.router-link-active { color: var(--primary-green); }

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-nav-btn { position: relative; top: -15px; flex: 0 0 60px; }
.plus-circle {
  width: 50px; height: 50px;
  background: var(--primary-green);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
  border: 4px solid var(--bg-dark);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .app-layout { display: block; }
  .content-area { display: block; }
  .main-content { padding: 1rem; padding-bottom: calc(var(--nav-height) + 40px); }
}
</style>
