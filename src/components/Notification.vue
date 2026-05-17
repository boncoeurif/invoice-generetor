<template>
  <div class="notification-container">
    <transition-group name="toast-list">
      <div 
        v-for="note in notificationStore.notifications" 
        :key="note.id" 
        :class="['toast', note.type]"
        @click="notificationStore.remove(note.id)"
      >
        <div class="toast-icon">
          <svg v-if="note.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="note.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <span class="toast-message">{{ note.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { notificationStore } from '@/store/notificationStore'
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 320px;
  max-width: 450px;
  padding: 16px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
}

.toast.success .toast-icon { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
.toast.error .toast-icon { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }
.toast.warning .toast-icon { background: #fffbeb; color: #92400e; border: 1px solid #fef3c7; }
.toast.info .toast-icon { background: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; }

.toast-message {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

/* Animations */
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}
.toast-list-enter-active, .toast-list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.toast-list-leave-active {
  position: absolute;
}
</style>
