<template>
  <div class="reports-view">
    <header class="page-header">
      <h1>{{ langStore.t('dailyReport') }}</h1>
      <div class="date-selector">
        <input type="month" v-model="selectedMonth" />
      </div>
    </header>

    <div class="report-summary rounded-card">
      <div class="summary-item">
        <span class="label">{{ langStore.t('totalTransactions') }}</span>
        <span class="value">{{ filteredInvoices.length }}</span>
      </div>
      <div class="summary-item">
        <span class="label">{{ langStore.t('grandTotals') }}</span>
        <span class="value">{{ langStore.currency }} {{ grandTotal.toLocaleString() }}</span>
      </div>
    </div>

    <div class="report-table rounded-card">
      <table>
        <thead>
          <tr>
            <th>{{ langStore.t('date') }}</th>
            <th>{{ langStore.t('customer') }}</th>
            <th>{{ langStore.t('total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id">
            <td>{{ invoice.date }}</td>
            <td>{{ invoice.clientName }}</td>
            <td>{{ langStore.currency }} {{ Number(invoice.total).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { invoiceStore } from '@/store/invoiceStore';
import { langStore } from '@/store/languageStore';

const selectedMonth = ref(new Date().toISOString().slice(0, 7));

const filteredInvoices = computed(() => {
  return invoiceStore.invoices.filter(inv => {
    // Basic date parsing logic
    const invDate = new Date(inv.createdAt);
    const month = (invDate.getMonth() + 1).toString().padStart(2, '0');
    const year = invDate.getFullYear();
    return `${year}-${month}` === selectedMonth.value;
  });
});

const grandTotal = computed(() => {
  return filteredInvoices.value.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
});
</script>

<style scoped>
.reports-view { padding: 1rem; max-width: 900px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { color: #fff; }
.date-selector input { background: var(--color-surface); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; }

.report-summary { display: grid; grid-template-columns: 1fr 1fr; padding: 24px; gap: 20px; margin-bottom: 20px; }
.summary-item { display: flex; flex-direction: column; }
.summary-item .label { color: var(--color-text-secondary); font-size: 0.8rem; text-transform: uppercase; }
.summary-item .value { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }

.report-table { padding: 20px; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; color: #fff; }
th { text-align: left; color: var(--color-text-secondary); padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
</style>
