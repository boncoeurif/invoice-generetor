<template>
  <div class="history-view">
    <header class="page-header">
      <div class="header-left">
        <h1>{{ langStore.t('recentInvoices') }}</h1>
        <p class="subtitle">{{ langStore.t('historySubtitle') }}</p>
      </div>
      <div class="header-right">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input v-model="searchQuery" :placeholder="langStore.t('searchPlaceholder')" />
        </div>
      </div>
    </header>

    <div v-if="filteredInvoices.length > 0" class="invoice-grid">
      <div v-for="invoice in filteredInvoices" :key="invoice.id" class="invoice-card glass-card">
        <div class="card-glow"></div>
        <div class="card-top">
          <div class="client-meta">
            <span class="invoice-id">#{{ invoice.id.slice(-4).toUpperCase() }}</span>
            <h3>{{ invoice.clientName }}</h3>
          </div>
          <div class="status-box">
            <span class="status-badge" :class="invoice.status?.toLowerCase() || 'paid'">{{ invoice.status || 'Paid' }}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">{{ langStore.t('date') }}</span>
            <span class="value">{{ invoice.date }}</span>
          </div>
          <div class="info-row">
            <span class="label">{{ langStore.t('amount') }}</span>
            <span class="value amount">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="btn-action" @click="downloadInvoice(invoice)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>PDF</span>
          </button>
          <button class="btn-action primary" @click="$router.push(`/edit/${invoice.id}`)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>{{ langStore.t('edit') }}</span>
          </button>
          <button class="btn-action danger" @click="confirmDelete(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state glass-card">
      <div class="empty-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      </div>
      <h2>{{ searchQuery ? langStore.t('noMatchingInvoices') : langStore.t('noInvoicesYet') }}</h2>
      <p v-if="searchQuery">Try adjusting your search terms</p>
      <button class="btn-primary" @click="$router.push('/create')">{{ langStore.t('createInvoice') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { invoiceStore } from '@/store/invoiceStore';
import { langStore } from '@/store/languageStore';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

const searchQuery = ref('');

const filteredInvoices = computed(() => {
  const all = [...invoiceStore.invoices].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  if (!searchQuery.value) return all;
  
  const q = searchQuery.value.toLowerCase();
  return all.filter(inv => 
    inv.clientName?.toLowerCase().includes(q) || 
    inv.id?.toLowerCase().includes(q)
  );
});

const downloadInvoice = (invoice) => {
  generateInvoicePDF(invoice, langStore.t);
};

const confirmDelete = async (id) => {
  if (confirm(langStore.t('deleteConfirm'))) {
    await invoiceStore.deleteInvoice(id);
  }
};
</script>

<style scoped>
.history-view { padding: 40px; max-width: 1400px; margin: 0 auto; padding-bottom: 120px; }

.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; gap: 32px; flex-wrap: wrap; }
.header-left h1 { font-size: 2.5rem; font-weight: 900; color: var(--text-primary); margin: 0 0 8px 0; letter-spacing: -0.04em; }
.subtitle { font-size: 1.1rem; color: var(--text-secondary); font-weight: 600; margin: 0; }

.search-box {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  min-width: 350px;
  transition: all 0.3s;
}
.search-box:focus-within { border-color: var(--primary-green); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.search-box input { border: none; outline: none; padding: 12px 0; width: 100%; font-size: 1rem; font-weight: 600; color: var(--text-primary); background: transparent; }
.search-box svg { color: var(--text-secondary); }

.invoice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 32px; }

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.invoice-card { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.invoice-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }

.card-glow { position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: radial-gradient(circle, var(--primary-green) 0%, transparent 70%); opacity: 0.05; pointer-events: none; }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.client-meta h3 { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 4px 0 0 0; letter-spacing: -0.02em; }
.invoice-id { font-size: 0.75rem; font-weight: 900; color: var(--primary-green); text-transform: uppercase; letter-spacing: 0.1em; }

.status-badge { padding: 6px 14px; border-radius: 12px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
.status-badge.paid { background: #DCFCE7; color: #059669; }

.card-body { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; border-top: 1.5px solid rgba(226, 232, 240, 0.5); border-bottom: 1.5px solid rgba(226, 232, 240, 0.5); }
.info-row { display: flex; justify-content: space-between; align-items: center; }
.info-row .label { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }
.info-row .value { font-weight: 800; color: var(--text-primary); font-size: 1rem; }
.info-row .value.amount { font-size: 1.25rem; color: var(--text-primary); }

.card-footer { display: flex; gap: 12px; }
.btn-action {
  flex: 1;
  background: white;
  border: 1px solid var(--border-color);
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;
}
.btn-action:hover { background: #F8FAFC; border-color: var(--text-primary); transform: translateY(-2px); }
.btn-action.primary { background: var(--text-primary); color: white; border: none; }
.btn-action.primary:hover { background: var(--primary-green); }
.btn-action.danger { flex: 0 0 48px; color: #EF4444; border-color: #FEE2E2; }
.btn-action.danger:hover { background: #FEE2E2; }

.empty-state { text-align: center; padding: 100px 40px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.empty-illustration { color: var(--primary-green); opacity: 0.2; }
.empty-state h2 { font-size: 1.75rem; font-weight: 900; color: var(--text-primary); margin: 0; }
.btn-primary {
  background: var(--primary-green);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s;
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); filter: brightness(1.05); }

@media (max-width: 768px) {
  .history-view { padding: 24px 16px; }
  .search-box { min-width: 100%; }
  .invoice-grid { grid-template-columns: 1fr; }
}
</style>
