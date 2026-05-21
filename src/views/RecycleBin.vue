<template>
  <div class="recycle-bin-view">
    <header class="page-header">
      <div class="header-left">
        <h1>{{ langStore.t('recycleBin') }}</h1>
        <p class="subtitle">{{ langStore.t('recycleBinSubtitle') }}</p>
      </div>
      <div class="header-right">
        <div class="info-badge glass-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>Items are automatically removed after 7 days</span>
        </div>
      </div>
    </header>

    <div v-if="deletedInvoices.length > 0" class="invoice-grid">
      <div v-for="invoice in deletedInvoices" :key="invoice.id" class="invoice-card glass-card">
        <div class="card-glow"></div>
        <div class="card-top">
          <div class="client-meta">
            <span class="invoice-id">#{{ invoice.id.slice(-4).toUpperCase() }}</span>
            <h3>{{ invoice.clientName }}</h3>
          </div>
          <div class="countdown-box" :title="`Expires on ${getExpiryDate(invoice.deletedAt)}`">
            <span class="days-left">{{ getDaysRemaining(invoice.deletedAt) }}d left</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">{{ langStore.t('amount') }}</span>
            <span class="value amount">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</span>
          </div>
          <div class="info-row">
            <span class="label">Deleted on</span>
            <span class="value">{{ new Date(invoice.deletedAt).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn-action restore" @click="restoreInvoice(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span>Restore</span>
          </button>
          <button class="btn-action danger" @click="permanentlyDelete(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state glass-card">
      <div class="empty-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </div>
      <h2>{{ langStore.t('emptyRecycleBin') }}</h2>
      <p>{{ langStore.t('emptyRecycleBinText') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { invoiceStore } from '@/store/invoiceStore';
import { langStore } from '@/store/languageStore';

const deletedInvoices = computed(() => [...invoiceStore.deletedInvoices].sort((a,b) => (b.deletedAt || 0) - (a.deletedAt || 0)));

const restoreInvoice = async (id) => {
  await invoiceStore.restoreInvoice(id);
};

const permanentlyDelete = async (id) => {
  if (confirm(langStore.t('confirmPermanentDelete') || "Permanently delete this invoice? This cannot be undone.")) {
    await invoiceStore.permanentlyDeleteInvoice(id);
  }
};

const getDaysRemaining = (deletedAt) => {
  if (!deletedAt) return 7;
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const timePassed = Date.now() - deletedAt;
  const remaining = Math.ceil((SEVEN_DAYS_MS - timePassed) / (24 * 60 * 60 * 1000));
  return Math.max(0, remaining);
};

const getExpiryDate = (deletedAt) => {
  if (!deletedAt) return '';
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  return new Date(deletedAt + SEVEN_DAYS_MS).toLocaleDateString();
};
</script>

<style scoped>
.recycle-bin-view { padding: 40px; max-width: 1400px; margin: 0 auto; padding-bottom: 120px; }

.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; gap: 32px; flex-wrap: wrap; }
.header-left h1 { font-size: 2.5rem; font-weight: 900; color: var(--text-primary); margin: 0 0 8px 0; letter-spacing: -0.04em; }
.subtitle { font-size: 1.1rem; color: var(--text-secondary); font-weight: 600; margin: 0; }

.info-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 16px;
  background: rgba(59, 130, 246, 0.05);
  border: 1.5px solid rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  font-size: 0.85rem;
  font-weight: 700;
}

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
.invoice-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-lg); border-color: #EF4444; }

.card-glow { position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: radial-gradient(circle, #EF4444 0%, transparent 70%); opacity: 0.03; pointer-events: none; }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.client-meta h3 { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 4px 0 0 0; letter-spacing: -0.02em; }
.invoice-id { font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; }

.countdown-box {
  background: #FEF2F2;
  color: #EF4444;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  border: 1px solid #FEE2E2;
}

.card-body { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; border-top: 1.5px solid rgba(226, 232, 240, 0.5); border-bottom: 1.5px solid rgba(226, 232, 240, 0.5); }
.info-row { display: flex; justify-content: space-between; align-items: center; }
.info-row .label { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }
.info-row .value { font-weight: 800; color: var(--text-primary); font-size: 1rem; }
.info-row .value.amount { font-size: 1.25rem; }

.card-actions { display: flex; gap: 12px; }
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
.btn-action.restore { background: #F0FDF4; color: #10B981; border-color: #DCFCE7; }
.btn-action.restore:hover { background: #DCFCE7; border-color: #10B981; }
.btn-action.danger { flex: 0 0 48px; color: #EF4444; border-color: #FEE2E2; }
.btn-action.danger:hover { background: #FEE2E2; }

.empty-state { text-align: center; padding: 100px 40px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.empty-illustration { color: var(--text-secondary); opacity: 0.2; }
.empty-state h2 { font-size: 1.75rem; font-weight: 900; color: var(--text-primary); margin: 0; }
.empty-state p { font-size: 1.1rem; color: var(--text-secondary); font-weight: 500; }

@media (max-width: 768px) {
  .recycle-bin-view { padding: 24px 16px; }
  .invoice-grid { grid-template-columns: 1fr; }
}
</style>
