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
  background-color: var(--surface-white);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  border-color: var(--primary-green);
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
  color: var(--text-primary);
  line-height: 1;
}

.label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .summary-card {
    padding: 18px;
  }
  .value {
    font-size: 1.5rem;
  }
}
</style>
