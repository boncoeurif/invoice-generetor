<template>
  <div id="app" :class="['app-layout', isMobile ? 'mobile-mode' : 'desktop-mode']">
    
    <!-- 1. Authenticated App Structure -->
    <template v-if="authStore.user && showNavigation">
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

        <!-- Bottom Nav (Mobile Only) -->
        <nav v-if="isMobile" class="bottom-nav">
          <router-link to="/" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <span>{{ langStore.t('home') }}</span>
          </router-link>

          <router-link to="/dashboard" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </div>
            <span>{{ langStore.t('dashboard') }}</span>
          </router-link>

          <router-link to="/history" class="nav-item">
            <div class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span>{{ langStore.t('actions') }}</span>
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

        <!-- Premium Floating Action Button (Mobile Only) -->
        <router-link v-if="isMobile" to="/create" class="mobile-fab">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </router-link>
      </div>
    </template>

    <!-- 2. Public / Full-screen Views (Home & Login) -->
    <template v-else>
      <div v-if="!authStore.isInitialized" class="auth-loading">
        <div class="spinner"></div>
      </div>
      <router-view v-else />
    </template>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Notification from '@/components/Notification.vue'
import { langStore } from '@/store/languageStore'
import { authStore } from '@/store/authStore'

const route = useRoute()
const isMobile = ref(window.innerWidth <= 768)
const updateBreakpoint = () => { isMobile.value = window.innerWidth <= 768 }

// NAVIGATION VISIBILITY LOGIC
// We show navigation if user is logged in (even on Home page)
// but hide it if they are on Login or if they are a guest on Home page.
const showNavigation = computed(() => {
  if (route.path === '/login' || route.path === '/') return false
  return !!authStore.user
})

onMounted(() => {
  window.addEventListener('resize', updateBreakpoint)
  setTimeout(() => {
    document.body.classList.add('app-loaded')
  }, 100)
})

onUnmounted(() => { window.removeEventListener('resize', updateBreakpoint) })
</script>

<style>
/* CSS for the Premium Fintech Light Theme */
:root {
  --primary-green: #10B981;
  --primary-dark: #059669;
  --primary-light: #D1FAE5;
  --bg-light: #F8FAFC; /* Clean off-white */
  --surface-white: #FFFFFF; /* Pure white for depth */
  --text-primary: #0F172A; /* Deep slate for maximum readability */
  --text-secondary: #475569; /* Slate for secondary info */
  --border-color: #E2E8F0; /* Clean border */
  --nav-height: 75px;
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.5);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --color-primary: var(--primary-green);
  --color-surface: var(--surface-white);
  --color-text-secondary: var(--text-secondary);
}

/* Base Styles */
* { box-sizing: border-box; }
html, body { 
  margin: 0; padding: 0; width: 100%;
  background-color: var(--bg-light);
  background-image: radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
                    radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow-y: auto !important;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.auth-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.spinner {
  width: 40px; height: 40px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.app-layout { display: flex; min-height: 100vh; width: 100%; background: transparent; }
.content-area { flex: 1; display: flex; flex-direction: column; width: 100%; min-height: 100vh; }
.main-content { padding: 2rem; width: 100%; flex: 1; }
.container { max-width: 1300px; margin: 0 auto; width: 100%; }

.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: var(--nav-height);
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  display: flex; justify-content: space-around; align-items: center;
  border-top: 1px solid var(--glass-border);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -10px 25px rgba(0,0,0,0.05);
}

.nav-item {
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  text-decoration: none; 
  color: var(--text-secondary); 
  font-size: 0.75rem; 
  gap: 6px;
  transition: all 0.2s ease;
  font-weight: 700;
}

.nav-item.router-link-active { 
  color: var(--primary-green);
}

.nav-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.nav-item.router-link-active .nav-icon {
  background: #f0fdf4;
  color: var(--primary-green);
  border: 1.5px solid #dcfce7;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.mobile-fab { display: none; }

@media (max-width: 768px) {
  .app-layout { display: block; }
  .content-area { display: block; }
  .main-content { padding: 1rem; padding-bottom: calc(var(--nav-height) + 140px); }
  
  .mobile-fab {
    position: fixed;
    bottom: calc(var(--nav-height) + 30px);
    right: 25px;
    width: 68px;
    height: 68px;
    background: var(--primary-green);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 30px rgba(34, 197, 94, 0.5);
    z-index: 2000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 4px solid #fff;
  }
  
  .mobile-fab:active {
    transform: scale(0.9) translateY(2px);
  }

  /* Force larger fonts for mobile inputs for better visibility */
  input, select, textarea {
    font-size: 16px !important; /* Prevents iOS zoom and improves readability */
  }
}
</style>
