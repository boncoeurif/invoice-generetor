<template>
  <div v-if="isVisible" class="notification-banner">
    <div class="notification-content">
      <span class="icon">ℹ️</span>
      <p>{{ message }}</p>
    </div>
    <button @click="dismiss" class="dismiss-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
  background-color: #ecfdf5;
  border-bottom: 1px solid var(--primary-green);
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification-content p {
  margin: 0;
  color: #065f46;
  font-size: 0.9rem;
  font-weight: 500;
}

.dismiss-btn {
  background: none;
  border: none;
  color: #065f46;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.dismiss-btn:hover {
  background-color: rgba(6, 95, 70, 0.1);
}
</style>
