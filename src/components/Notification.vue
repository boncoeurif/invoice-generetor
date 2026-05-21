<template>
  <div class="notification-container">
    <transition-group name="toast-list">
      <div 
        v-for="note in notificationStore.notifications" 
        :key="note.id" 
        :class="['toast', note.type]"
        @click="notificationStore.remove(note.id)"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg v-if="note.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <svg v-else-if="note.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <span class="toast-message">{{ note.message }}</span>
        </div>
        <div class="progress-bar" :style="{ backgroundColor: getProgressColor(note.type) }"></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { notificationStore } from '@/store/notificationStore'

const getProgressColor = (type) => {
  switch (type) {
    case 'success': return '#10B981';
    case 'error': return '#EF4444';
    case 'warning': return '#F59E0B';
    default: return '#3B82F6';
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 32px;
  right: 32px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 320px;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.toast:hover {
  transform: scale(1.02) translateX(-5px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
}

.toast-content {
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.toast.success .toast-icon { background: #f0fdf4; color: #10B981; border: 1px solid #dcfce7; }
.toast.error .toast-icon { background: #fef2f2; color: #EF4444; border: 1px solid #fee2e2; }
.toast.warning .toast-icon { background: #fffbeb; color: #F59E0B; border: 1px solid #fef3c7; }
.toast.info .toast-icon { background: #eff6ff; color: #3B82F6; border: 1px solid #dbeafe; }

.toast-message {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.progress-bar {
  height: 3px;
  width: 100%;
  opacity: 0.3;
  animation: progress 3s linear forwards;
  transform-origin: left;
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Animations */
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
.toast-list-enter-active, .toast-list-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}
.toast-list-leave-active {
  position: absolute;
}
</style>
