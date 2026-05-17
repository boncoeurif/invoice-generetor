import { reactive } from 'vue'

export const notificationStore = reactive({
  notifications: [],

  show(message, type = 'success', duration = 3000) {
    const id = Date.now()
    this.notifications.push({ id, message, type })
    
    setTimeout(() => {
      this.remove(id)
    }, duration)
  },

  remove(id) {
    const index = this.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      this.notifications.splice(index, 1)
    }
  },

  success(message, duration) { this.show(message, 'success', duration) },
  error(message, duration) { this.show(message, 'error', duration) },
  warning(message, duration) { this.show(message, 'warning', duration) },
  info(message, duration) { this.show(message, 'info', duration) }
})
