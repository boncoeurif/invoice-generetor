<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/logo.svg" alt="Invoxa Logo" class="sidebar-logo">
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </span> 
            {{ langStore.t('dashboard') }}
          </router-link>
        </li>
        <li>
          <router-link to="/reports" class="nav-link">
             <span class="icon">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
             </span>
             {{ langStore.t('dailyReport') }}
          </router-link>
        </li>
        <li>
          <router-link to="/create" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span> 
            {{ langStore.t('createInvoice') }}
          </router-link>
        </li>
        <li>
          <router-link to="/history" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </span> 
            {{ langStore.t('actions') }}
          </router-link>
        </li>
        <li>
          <router-link to="/recycle-bin" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </span> 
            {{ langStore.t('recycleBin') }}
          </router-link>
        </li>
        <li>
          <router-link to="/settings" class="nav-link">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </span> 
            {{ langStore.t('settings') }}
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
  width: 260px;
  background-color: var(--color-surface);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-shadow: 4px 0 24px rgba(0,0,0,0.2);
  border-right: 1px solid rgba(255,255,255,0.05);
}

.sidebar-header {
  padding: 0 12px 32px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 32px;
}

.sidebar-logo {
  height: 32px;
  width: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  gap: 12px;
}

.nav-link .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.nav-link.router-link-active {
  background-color: rgba(34, 197, 94, 0.1);
  color: var(--color-primary);
}

.nav-link.router-link-active .icon {
  color: var(--color-primary);
}
</style>
