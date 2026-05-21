<template>
  <div class="settings-view">
    <header class="settings-header">
      <h1>{{ langStore.t('settings') }}</h1>
    </header>

    <div v-if="profileStore.isLoading" class="profile-loading">
      <div class="spinner"></div>
    </div>

    <template v-else>
      <!-- 1. Business Profile Section -->
      <section class="settings-section">
        <h2 class="section-title">{{ langStore.t('businessProfile') || 'Business Profile' }}</h2>
        <div class="settings-card profile-form">
          <div class="form-grid">
            <div class="form-group">
              <label>{{ langStore.t('businessName') || 'Business Name' }}</label>
              <input v-model="localProfile.businessName" :placeholder="langStore.t('placeholderBusinessName') || 'Enter your business name'" />
            </div>
            <div class="form-group">
              <label>{{ langStore.t('email') || 'Business Email' }}</label>
              <input v-model="localProfile.email" :placeholder="langStore.t('placeholderEmail') || 'Enter your business email'" />
            </div>
            <div class="form-group">
              <label>{{ langStore.t('phone') || 'Phone Number' }}</label>
              <input v-model="localProfile.phone" :placeholder="langStore.t('placeholderPhone') || '+250 XXX XXX XXX'" />
            </div>
            <div class="form-group">
              <label>{{ langStore.t('address') || 'Address' }}</label>
              <input v-model="localProfile.address" :placeholder="langStore.t('placeholderAddress') || 'Enter your business address'" />
            </div>
          </div>

          <div class="divider"></div>

          <h3 class="subsection-title">{{ langStore.t('bankDetails') || 'Bank Details' }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>{{ langStore.t('bankName') || 'Bank Name' }}</label>
              <input v-model="localProfile.bankName" :placeholder="langStore.t('placeholderBankName') || 'Enter bank name'" />
            </div>
            <div class="form-group">
              <label>{{ langStore.t('accountNumber') || 'Account Number' }}</label>
              <input v-model="localProfile.accountNumber" :placeholder="langStore.t('placeholderAccountNumber') || 'Enter account number'" />
            </div>
          </div>

          <button @click="saveProfile" class="btn-save-profile" :disabled="isSaving">
            <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            {{ isSaving ? langStore.t('processing') : langStore.t('saveChanges') || 'Save Profile' }}
          </button>
        </div>
      </section>

      <!-- 2. Preferences Section -->
      <section class="settings-section">
        <h2 class="section-title">{{ langStore.t('preferences') || 'Preferences' }}</h2>
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
      </section>
    </template>

    <div class="auth-actions">
      <button @click="authStore.logout" class="btn-logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Sign Out
      </button>
    </div>

    <div class="footer-info">
      <p>Invoxa Pro v1.2.0</p>
      <p>&copy; 2026 Invoxa. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { langStore } from '@/store/languageStore'
import { authStore } from '@/store/authStore'
import { profileStore } from '@/store/userProfileStore'
import { notificationStore } from '@/store/notificationStore'

const isSaving = ref(false)
const localProfile = reactive({ ...profileStore.profile })

// Sync local profile when store loads
watch(() => profileStore.profile, (newProfile) => {
  Object.assign(localProfile, newProfile)
}, { deep: true })

const saveProfile = async () => {
  isSaving.value = true
  try {
    await profileStore.saveProfile(localProfile)
    notificationStore.success(langStore.t('profileUpdated') || 'Profile updated successfully!')
  } catch (error) {
    notificationStore.error(langStore.t('errorUpdating') || 'Failed to update profile.')
  } finally {
    isSaving.value = false
  }
}

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
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 100px;
}

.settings-header {
  margin-bottom: 2.5rem;
}

.settings-header h1 {
  font-size: 2.25rem;
  color: var(--text-primary);
  font-weight: 900;
}

.settings-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.subsection-title {
  font-size: 0.9rem;
  color: var(--primary-green);
  font-weight: 800;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.settings-card {
  background: var(--surface-white);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 800;
  text-transform: uppercase;
}

.form-group input {
  background: #f8fafc;
  border: 1.5px solid var(--border-color);
  padding: 14px 18px;
  border-radius: 14px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: var(--primary-green);
  outline: none;
  background: #fff;
}

.divider {
  height: 1px;
  background: var(--border-color);
  margin: 10px 0;
}

.btn-save-profile {
  background: var(--primary-green);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
  margin-top: 10px;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
}

.btn-save-profile:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}

.setting-item label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.choice-grid button {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 16px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.choice-grid button:hover {
  background: #f1f5f9;
  border-color: var(--text-secondary);
}

.choice-grid button.active {
  background: var(--primary-green);
  border-color: var(--primary-green);
  color: #fff;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.mode-option {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.mode-option:hover {
  background: #f1f5f9;
  border-color: var(--text-secondary);
  transform: translateY(-2px);
}

.mode-option.active {
  background: #f0fdf4;
  border-color: var(--primary-green);
  transform: translateY(-2px);
}

.mode-icon :deep(svg) {
  width: 36px;
  height: 36px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.mode-option:hover .mode-icon :deep(svg) {
  color: var(--text-primary);
}

.mode-option.active .mode-icon :deep(svg) {
  color: var(--primary-green);
}

.mode-name {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 1rem;
}

.profile-loading {
  display: flex;
  justify-content: center;
  padding: 100px 0;
}

.spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.footer-info {
  margin-top: 4rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-actions {
  margin-top: 2.5rem;
}

.btn-logout {
  width: 100%;
  background: #fff;
  color: #ef4444;
  border: 1.5px solid #fee2e2;
  padding: 18px;
  border-radius: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #fef2f2;
  border-color: #ef4444;
}

@media (max-width: 600px) {
  .mode-grid {
    grid-template-columns: 1fr;
  }
  .mode-option {
    flex-direction: row;
    justify-content: flex-start;
    padding: 18px 24px;
    gap: 20px;
  }
  .settings-card {
    padding: 24px 20px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>