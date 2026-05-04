<template>
  <div v-if="isVisible" class="notification-banner">
    <div class="notification-content">
      <div class="notif-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </div>
      <p>{{ message }}</p>
    </div>
    <button @click="dismiss" class="dismiss-btn" aria-label="Close notification">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { langStore } from '@/store/languageStore'

const isVisible = ref(false)

const message = computed(() => {
  if (langStore.locale === 'rw') {
    return 'Fagitire zasibye zizakurwaho burundu nyuma y\'iminsi 5.'
  } else if (langStore.locale === 'fr') {
    return 'Les factures supprimées seront définitivement supprimées après 5 jours.'
  }
  return 'The deleted invoices will be removed permanently after 5 days.'
})

onMounted(() => {
  const isDismissed = sessionStorage.getItem('notif_dismissed')
  if (!isDismissed) {
    isVisible.value = true
  }
})

const dismiss = () => {
  isVisible.value = false
  sessionStorage.setItem('notif_dismissed', 'true')
}
</script>

<style scoped>
.notification-banner {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(34, 197, 94, 0.3);
  padding: 10px 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-icon-wrapper {
  background: rgba(34, 197, 94, 0.15);
  color: var(--primary-green);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-content p {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
}

.dismiss-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.dismiss-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

@media (max-width: 600px) {
  .notification-banner {
    padding: 12px 1rem;
  }
  .notification-content p {
    font-size: 0.75rem;
  }
}
</style>
