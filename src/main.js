import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { registerSW } from 'virtual:pwa-register'
import { authStore } from './store/authStore'

// Break circular dependency by setting navigation hooks here
authStore.onLogin = () => router.push('/dashboard')
authStore.onLogout = () => router.push('/login')

// Automatically check for service worker updates
registerSW({ immediate: true })

// Global error handler for asset loading failures
window.addEventListener('error', (e) => {
  if (e.message.includes('Unable to preload CSS')) {
    console.warn("CSS preload error, reloading...")
    window.location.reload()
  }
}, true)

createApp(App).use(router).mount('#app')
