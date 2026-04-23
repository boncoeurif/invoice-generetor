<template>
  <div class="history-view">
    <header class="page-header">
      <h1>{{ langStore.t('recentInvoices') }}</h1>
      <p>View and manage all your generated invoices</p>
    </header>

    <div class="search-bar rounded-card">
      <div class="search-input-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input v-model="searchQuery" placeholder="Search by customer name..." />
      </div>
    </div>

    <div v-if="filteredInvoices.length > 0" class="invoice-grid">
      <div v-for="invoice in filteredInvoices" :key="invoice.id" class="invoice-card rounded-card">
        <div class="card-top">
          <div class="client-info">
            <span class="invoice-id">#{{ invoice.id.slice(-4).toUpperCase() }}</span>
            <h3>{{ invoice.clientName }}</h3>
            <span class="date">{{ invoice.date }}</span>
          </div>
          <div class="status-section">
            <span class="status-badge" :class="invoice.status?.toLowerCase() || 'paid'">{{ invoice.status || 'Paid' }}</span>
          </div>
        </div>

        <div class="card-details">
          <div class="detail-item">
            <span class="label">Amount</span>
            <span class="value">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Items</span>
            <span class="value">{{ invoice.itemName }} ({{ invoice.quantity }} {{ invoice.unit }})</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-secondary btn-icon" @click="downloadInvoice(invoice)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
          <button class="btn btn-secondary btn-icon" @click="$router.push(`/edit/${invoice.id}`)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button class="btn btn-delete btn-icon" @click="confirmDelete(invoice.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.2;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
      <p v-if="searchQuery">No invoices matching "{{ searchQuery }}"</p>
      <p v-else>You haven't created any invoices yet.</p>
      <button class="btn btn-primary" @click="$router.push('/create')">Create Invoice</button>
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
  if (confirm("Are you sure you want to delete this invoice?")) {
    await invoiceStore.deleteInvoice(id);
  }
};
</script>

<style scoped>
.history-view {
  padding: 1rem;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 80px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--color-text-secondary);
}

.search-bar {
  background: var(--color-surface);
  padding: 15px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.05);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0,0,0,0.2);
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}

.search-icon {
  color: var(--color-text-secondary);
}

.search-input-wrapper input {
  background: none;
  border: none;
  color: #fff;
  width: 100%;
  font-size: 1rem;
  outline: none;
}

.invoice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.invoice-card {
  background: var(--color-surface);
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
}

.invoice-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.client-info h3 {
  margin: 5px 0;
  font-size: 1.15rem;
  color: #fff;
}

.invoice-id {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.status-badge.paid { background-color: rgba(34, 197, 94, 0.1); color: #22C55E; }
.status-badge.pending { background-color: rgba(234, 179, 8, 0.1); color: #EAB308; }

.card-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.detail-item .label { color: var(--color-text-secondary); }
.detail-item .value { color: #fff; font-weight: 700; }

.card-actions {
  display: flex;
  gap: 10px;
}

.card-actions .btn {
  flex: 1;
  font-size: 0.85rem;
  padding: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  flex: 0 0 48px !important;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: var(--color-text-secondary);
}

.empty-icon {
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .invoice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
