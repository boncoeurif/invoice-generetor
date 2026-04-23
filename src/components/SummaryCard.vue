<template>
  <div class="summary-card rounded-card">
    <div class="card-content">
      <div class="icon-wrapper" :style="{ backgroundColor: color }">
        <!-- Render SVG directly if icon is a component or object -->
        <component v-if="typeof icon !== 'string'" :is="icon" class="card-icon" />
        <!-- Otherwise render as raw SVG string or emoji -->
        <span v-else v-html="icon" class="card-icon-html"></span>
      </div>
      <div class="text-content">
        <span class="value">{{ formattedValue }}</span>
        <span class="label">{{ label }}</span>
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
  valueColor: {
    type: String,
    default: '#FFFFFF',
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--color-surface);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow: var(--soft-shadow);
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.4);
  border-color: rgba(255,255,255,0.1);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
}

.card-icon, .card-icon-html :deep(svg) {
  width: 26px;
  height: 26px;
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
  gap: 4px;
}

.value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .summary-card {
    padding: 20px;
  }
  .value {
    font-size: 1.5rem;
  }
}
</style>
