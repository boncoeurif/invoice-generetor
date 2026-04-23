<template>
  <div class="edit-invoice-view">
    <InvoiceForm v-if="invoice" :invoice="invoice" />
    <div v-else>Loading or Invoice Not Found...</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { invoiceStore } from '@/store/invoiceStore'
import InvoiceForm from '@/components/InvoiceForm.vue'

const route = useRoute()
const invoice = computed(() => {
  return invoiceStore.invoices.find(inv => inv.id === route.params.id)
})
</script>

<style scoped>
.edit-invoice-view {
  padding: 2rem;
}
</style>
