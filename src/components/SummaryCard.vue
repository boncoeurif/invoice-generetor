<template>
  <div class="summary-card">
    <div class="card-glow" :style="{ backgroundColor: color }"></div>
    <div class="card-content">
      <div class="icon-outer" :style="{ borderColor: color + '44' }">
        <div class="icon-wrapper" :style="{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` }">
          <component v-if="typeof icon !== 'string'" :is="icon" class="card-icon" />
          <span v-else v-html="icon" class="card-icon-html"></span>
        </div>
      </div>
      <div class="text-content">
        <span class="label">{{ label }}</span>
        <span class="value">{{ formattedValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: [Object, String],
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});
</script>

<style scoped>
.summary-card {
  position: relative;
  padding: 30px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid var(--glass-border);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: var(--shadow-md);
  cursor: pointer;
}

.summary-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-lg);
}

.card-glow {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.15;
  pointer-events: none;
  transition: all 0.4s ease;
}

.summary-card:hover .card-glow {
  opacity: 0.25;
  transform: scale(1.5);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.icon-outer {
  padding: 6px;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: all 0.4s ease;
}

.summary-card:hover .icon-outer {
  transform: rotate(10deg);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  width: 58px;
  height: 58px;
  box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1);
}

.card-icon, .card-icon-html :deep(svg) {
  width: 28px;
  height: 28px;
  color: #fff;
}

.card-icon-html {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.value {
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

@media (max-width: 768px) {
  .summary-card { padding: 24px; }
  .value { font-size: 1.6rem; }
  .icon-wrapper { width: 50px; height: 50px; }
}
</style>
