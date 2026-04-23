<template>
  <div class="settings-view">
    <header class="settings-header">
      <h1>{{ langStore.t('settings') }}</h1>
    </header>

    <div class="settings-card">
      <div class="setting-item">
        <label>{{ langStore.t('language') }}</label>
        <div class="choice-grid">
          <button :class="{ active: langStore.locale === 'en' }" @click="langStore.setLocale('en')">English</button>
          <button :class="{ active: langStore.locale === 'fr' }" @click="langStore.setLocale('fr')">Français</button>
          <button :class="{ active: langStore.locale === 'rw' }" @click="langStore.setLocale('rw')">Kinyarwanda</button>
        </div>
      </div>

      <div class="setting-item">
        <label>{{ langStore.t('currency') }}</label>
        <div class="choice-grid">
          <button :class="{ active: langStore.currency === '$' }" @click="langStore.setCurrency('$')">$ (USD)</button>
          <button :class="{ active: langStore.currency === 'FRW' }" @click="langStore.setCurrency('FRW')">FRW</button>
          <button :class="{ active: langStore.currency === '€' }" @click="langStore.setCurrency('€')">€ (EUR)</button>
        </div>
      </div>

      <div class="setting-item">
        <label>{{ langStore.t('businessMode') }}</label>
        <div class="mode-grid">
          <div 
            v-for="mode in modes" 
            :key="mode.id"
            class="mode-option"
            :class="{ active: langStore.businessMode === mode.id }"
            @click="langStore.setBusinessMode(mode.id)"
          >
            <div class="mode-icon" v-html="mode.icon"></div>
            <div class="mode-text">
              <span class="mode-name">{{ langStore.t(mode.label) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-actions">
      <button @click="authStore.logout" class="btn-logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Sign Out
      </button>
    </div>

    <div class="footer-info">
      <p>Invoxa-rw v1.0.2</p>
      <p>&copy; 2026 Invoxa-rw. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { langStore } from '@/store/languageStore'
import { authStore } from '@/store/authStore'

const modes = [
  { id: 'general', label: 'modeGeneral', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>' },
  { id: 'medical', label: 'modeMedical', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>' },
  { id: 'service', label: 'modeService', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' },
  { id: 'restaurant', label: 'modeRestaurant', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>' },
  { id: 'hardware', label: 'modeHardware', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"></path><path d="M3 21v-3l9-9"></path><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z"></path><path d="m9.5 15.5 3 3"></path><path d="m10.5 14.5 3 3"></path><path d="m11.5 13.5 3 3"></path><path d="m12.5 12.5 3 3"></path></svg>' }
]
</script>

<style scoped>
.settings-view {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 1.75rem;
  color: #fff;
}

.settings-card {
  background: var(--color-surface);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.setting-item label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.choice-grid button {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.choice-grid button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.mode-option {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.mode-option:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.mode-option.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.mode-icon :deep(svg) {
  width: 32px;
  height: 32px;
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.mode-option.active .mode-icon :deep(svg) {
  color: var(--color-primary);
}

.mode-name {
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
}

.footer-info {
  margin-top: 3rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
}

.auth-actions {
  margin-top: 2rem;
}

.btn-logout {
  width: 100%;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .mode-grid {
    grid-template-columns: 1fr;
  }
  .mode-option {
    flex-direction: row;
    justify-content: flex-start;
    padding: 16px;
  }
}
</style>
