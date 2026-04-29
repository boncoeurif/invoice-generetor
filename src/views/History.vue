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
            <span class="date">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {{ invoice.date }}
            </span>
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
            <span class="label">Item</span>
            <span class="value text-truncate">{{ invoice.items?.[0]?.name || invoice.itemName }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-action-secondary" @click="downloadInvoice(invoice)" title="Download PDF">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>PDF</span>
          </button>
          <button class="btn btn-action-secondary" @click="$router.push(`/edit/${invoice.id}`)" title="Edit Invoice">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button class="btn btn-action-delete" @click="confirmDelete(invoice.id)" title="Delete">
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
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px;
}

.page-header { margin-bottom: 2.5rem; }
.page-header h1 { font-size: 2.25rem; color: #fff; margin-bottom: 0.5rem; font-weight: 900; }
.page-header p { color: var(--color-text-secondary); font-size: 1rem; }

.search-bar {
  background: var(--color-surface);
  padding: 12px;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 18px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0,0,0,0.2);
  padding: 12px 20px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: border-color 0.2s;
}

.search-input-wrapper:focus-within { border-color: var(--color-primary); }
.search-icon { color: var(--color-text-secondary); }
.search-input-wrapper input { background: none; border: none; color: #fff; width: 100%; font-size: 1rem; outline: none; }

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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 24px;
}

.invoice-card:hover {
  transform: translateY(-8px);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.client-info h3 { margin: 8px 0; font-size: 1.25rem; color: #fff; font-weight: 800; }
.invoice-id { font-size: 0.7rem; font-weight: 900; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.1em; }
.date { font-size: 0.8rem; color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px; font-weight: 600; }

.status-badge {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.status-badge.paid { background: rgba(34, 197, 94, 0.1); color: #22C55E; }

.card-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.detail-item { display: flex; justify-content: space-between; align-items: center; }
.detail-item .label { color: var(--color-text-secondary); font-size: 0.85rem; font-weight: 600; }
.detail-item .value { color: #fff; font-weight: 800; font-size: 1rem; }
.text-truncate { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.card-actions { display: flex; gap: 10px; }

.btn-action-secondary {
  flex: 1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

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
.empty-icon { margin-bottom: 24px; opacity: 0.5; }
</style>
