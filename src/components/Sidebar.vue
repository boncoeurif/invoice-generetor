<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/logo.svg" alt="Invoxa Logo" class="sidebar-logo">
      <span class="brand-name">Invoxa</span>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" class="nav-link" exact>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </span> 
            <span class="label">{{ langStore.t('home') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </span> 
            <span class="label">{{ langStore.t('dashboard') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reports" class="nav-link">
             <span class="icon">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
             </span>
             <span class="label">{{ langStore.t('dailyReport') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/create" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </span> 
            <span class="label">{{ langStore.t('createInvoice') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/history" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span> 
            <span class="label">{{ langStore.t('actions') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/recycle-bin" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </span> 
            <span class="label">{{ langStore.t('recycleBin') }}</span>
          </router-link>
        </li>

        <li>
          <router-link to="/help" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </span> 
            <span class="label">{{ langStore.t('help') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </span> 
            <span class="label">{{ langStore.t('settings') }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { langStore } from '@/store/languageStore'
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid var(--glass-border);
  position: sticky;
  top: 0;
  z-index: 1100;
}

.sidebar-header {
  padding: 0 12px 48px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-logo {
  height: 38px;
  width: auto;
  filter: drop-shadow(0 4px 6px rgba(16, 185, 129, 0.2));
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--text-primary) 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 700;
  padding: 14px 18px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  gap: 14px;
  border: 1px solid transparent;
}

.nav-link .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.5);
  color: var(--text-primary);
  transform: translateX(4px);
  border-color: var(--glass-border);
}

.nav-link.router-link-active {
  background: white;
  color: var(--primary-green);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.nav-link.router-link-active .icon {
  color: var(--primary-green);
  transform: scale(1.1);
}

.nav-link .label {
  transition: all 0.3s ease;
}

.nav-link.router-link-active .label {
  font-weight: 800;
}
</style>
