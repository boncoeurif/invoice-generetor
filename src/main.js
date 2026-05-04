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

createApp(App).use(router).mount('#app')
