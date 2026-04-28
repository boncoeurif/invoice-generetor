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
            <span class="date">{{ langStore.t('deletedAt') }}: {{ new Date(invoice.deletedAt).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="card-details">
          <div class="detail-item">
            <span class="label">Amount</span>
            <span class="value">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-secondary btn-icon" @click="restoreInvoice(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            {{ langStore.t('restore') }}
          </button>
          <button class="btn btn-delete btn-icon" @click="permanentlyDelete(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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
.recycle-bin-view { padding: 1rem; max-width: 1000px; margin: 0 auto; }
.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; color: #fff; }
.page-header p { color: var(--color-text-secondary); }
.invoice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.invoice-card { background: var(--color-surface); padding: 24px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 20px; }
.client-info h3 { margin: 5px 0; font-size: 1.15rem; color: #fff; }
.invoice-id { font-size: 0.75rem; font-weight: 800; color: var(--color-primary); text-transform: uppercase; }
.date { font-size: 0.85rem; color: #ef4444; }
.card-details { padding: 15px 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.detail-item { display: flex; justify-content: space-between; }
.detail-item .label { color: var(--color-text-secondary); }
.detail-item .value { color: #fff; font-weight: 700; }
.card-actions { display: flex; gap: 10px; }
.btn { flex: 1; padding: 10px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-secondary { background: rgba(255,255,255,0.05); color: #fff; }
.btn-delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; flex: 0 0 45px !important; }
.empty-state { text-align: center; padding: 100px 20px; color: var(--color-text-secondary); }
.empty-icon { color: rgba(255,255,255,0.2); margin-bottom: 20px; }
</style>
