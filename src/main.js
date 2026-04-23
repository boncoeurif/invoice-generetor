import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { registerSW } from 'virtual:pwa-register'

// Automatically check for service worker updates
registerSW({ immediate: true })

createApp(App).use(router).mount('#app')
