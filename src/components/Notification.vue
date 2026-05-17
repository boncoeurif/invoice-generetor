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
  min-width: 300px;
  max-width: 450px;
  padding: 16px 20px;
  border-radius: 16px;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.toast.success .toast-icon { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.toast.error .toast-icon { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.toast.warning .toast-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.toast.info .toast-icon { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }

.toast-message {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Animations */
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
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
