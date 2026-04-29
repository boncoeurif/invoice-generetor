<template>
  <div class="recycle-bin-view">
    <header class="page-header">
      <h1>{{ langStore.t('recycleBin') }}</h1>
      <p>{{ langStore.t('recycleBinSubtitle') }}</p>
    </header>

    <div v-if="deletedInvoices.length > 0" class="invoice-grid">
      <div v-for="invoice in deletedInvoices" :key="invoice.id" class="invoice-card rounded-card">
        <div class="card-top">
          <div class="client-info">
            <span class="invoice-id">#{{ invoice.id.slice(-4).toUpperCase() }}</span>
            <h3>{{ invoice.clientName }}</h3>
            <span class="date deleted-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              {{ langStore.t('deletedAt') }}: {{ new Date(invoice.deletedAt).toLocaleDateString() }}
            </span>
          </div>
        </div>

        <div class="card-details">
          <div class="detail-item">
            <span class="label">Amount</span>
            <span class="value">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-action-restore" @click="restoreInvoice(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            {{ langStore.t('restore') }}
          </button>
          <button class="btn btn-action-delete" @click="permanentlyDelete(invoice.id)" title="Permanently Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.2;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </div>
      <h3>{{ langStore.t('emptyRecycleBin') }}</h3>
      <p>{{ langStore.t('emptyRecycleBinText') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { invoiceStore } from '@/store/invoiceStore';
import { langStore } from '@/store/languageStore';

const deletedInvoices = computed(() => invoiceStore.deletedInvoices);

const restoreInvoice = async (id) => {
  await invoiceStore.restoreInvoice(id);
};

const permanentlyDelete = async (id) => {
  if (confirm(langStore.t('confirmPermanentDelete'))) {
    await invoiceStore.permanentlyDeleteInvoice(id);
  }
};
</script>

<style scoped>
.recycle-bin-view { padding: 1.5rem; max-width: 1200px; margin: 0 auto; padding-bottom: 100px; }
.page-header { margin-bottom: 2.5rem; }
.page-header h1 { font-size: 2.25rem; color: #fff; font-weight: 900; }
.page-header p { color: var(--color-text-secondary); }

.invoice-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
  gap: 24px; 
}

@media (max-width: 400px) {
  .invoice-grid { grid-template-columns: 1fr; }
}

.invoice-card { 
  background: var(--color-surface); 
  padding: 24px; 
  border: 1px solid rgba(255,255,255,0.05); 
  display: flex; 
  flex-direction: column; 
  gap: 24px; 
  border-radius: 24px;
  transition: all 0.3s ease;
}

.invoice-card:hover { transform: translateY(-5px); border-color: rgba(239, 68, 68, 0.2); }

.client-info h3 { margin: 8px 0; font-size: 1.25rem; color: #fff; font-weight: 800; }
.invoice-id { font-size: 0.7rem; font-weight: 900; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.1em; }
.date { font-size: 0.8rem; display: flex; align-items: center; gap: 6px; font-weight: 600; }
.deleted-date { color: #ef4444; }

.card-details { padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.detail-item { display: flex; justify-content: space-between; }
.detail-item .label { color: var(--color-text-secondary); font-size: 0.85rem; }
.detail-item .value { color: #fff; font-weight: 800; }

.card-actions { display: flex; gap: 10px; }

.btn-action-restore {
  flex: 1;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: var(--color-primary);
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-action-restore:hover { background: rgba(34, 197, 94, 0.2); }

.btn-action-delete {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-action-delete:hover { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4); }

.empty-state { text-align: center; padding: 100px 20px; color: var(--color-text-secondary); }
.empty-icon { color: rgba(255,255,255,0.1); margin-bottom: 20px; }
</style>
