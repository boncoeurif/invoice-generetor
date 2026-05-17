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
        <div class="item-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="item-text">
          <span class="label">{{ langStore.t('totalTransactions') }}</span>
          <span class="value">{{ filteredInvoices.length }}</span>
        </div>
      </div>
      <div class="summary-item">
        <div class="item-icon earnings">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div class="item-text">
          <span class="label">{{ langStore.t('grandTotals') }}</span>
          <span class="value">{{ langStore.currency }} {{ grandTotal.toLocaleString() }}</span>
        </div>
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
.reports-view { padding: 1.5rem; max-width: 1000px; margin: 0 auto; padding-bottom: 100px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 20px; }
.page-header h1 { font-size: 2.25rem; color: var(--text-primary); font-weight: 900; margin: 0; }

.date-selector input { 
  background: var(--surface-white); 
  color: var(--text-primary); 
  border: 1.5px solid var(--border-color); 
  padding: 12px 16px; 
  border-radius: 12px; 
  font-family: inherit;
  font-weight: 800;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.date-selector input:focus { border-color: var(--primary-green); box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1); }

.report-summary { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
  padding: 32px; 
  gap: 32px; 
  margin-bottom: 32px; 
  background: var(--surface-white);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.summary-item { display: flex; align-items: center; gap: 20px; }
.item-icon { 
  width: 56px; 
  height: 56px; 
  background: #f0fdf4; 
  color: var(--primary-green); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 16px;
  flex-shrink: 0;
  border: 1px solid #dcfce7;
}
.item-icon.earnings { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }

.item-text { display: flex; flex-direction: column; gap: 4px; }
.item-text .label { color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }
.item-text .value { font-size: 1.75rem; font-weight: 900; color: var(--text-primary); line-height: 1.2; }

.report-table { 
  padding: 0; 
  overflow: hidden; 
  background: var(--surface-white);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.table-wrapper { overflow-x: auto; padding: 12px; }

table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text-primary); min-width: 600px; }
th { 
  text-align: left; 
  color: var(--text-secondary); 
  padding: 18px 24px; 
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.08em;
  border-bottom: 1.5px solid var(--border-color);
  background: #f8fafc;
}
td { 
  padding: 20px 24px; 
  border-bottom: 1px solid var(--border-color);
  font-size: 0.95rem;
  font-weight: 600;
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8fafc; }

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .report-summary { padding: 24px; }
}
</style>
