<template>
  <div class="dashboard-main-content">
    <header class="navbar">
      <div class="navbar-left">
        <img src="/logo.svg" alt="Invoxa Logo" class="navbar-logo">
        <div class="greeting-text">
          <span class="user-greeting">{{ langStore.t('welcomeMessage') }}</span>
          <span class="user-name">{{ userName }}!</span>
        </div>
      </div>
      <div class="navbar-right">
        <button class="btn btn-primary btn-sm" @click="goToCreateInvoice">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {{ langStore.t('createInvoice') }}
        </button>
      </div>
    </header>

    <main class="dashboard-content-area">
      <!-- Loading State -->
      <div v-if="invoiceStore.isLoading && !invoiceStore.isInitialized" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your data...</p>
      </div>

      <template v-else>
        <section class="summary-cards-section">
          <SummaryCard
            v-for="card in summaryData"
            :key="card.label"
            :icon="card.icon"
            :value="card.value"
            :label="card.label"
            :color="card.color"
            :value-color="card.valueColor"
          />
        </section>

        <section class="recent-invoices-section rounded-card">
          <div class="section-header">
            <h2>{{ langStore.t('recentInvoices') }}</h2>
            <router-link to="/history" class="view-all">{{ langStore.t('actions') }}</router-link>
          </div>
          
          <div v-if="recentInvoices.length > 0" class="invoice-list">
            <div v-for="invoice in recentInvoices" :key="invoice.id" class="invoice-item">
              <div class="invoice-info" @click="$router.push(`/edit/${invoice.id}`)">
                <div class="invoice-detail-customer">
                  <span class="invoice-id">#{{ invoice.id.slice(-4).toUpperCase() }}</span>
                  <span class="invoice-customer">{{ invoice.clientName }}</span>
                </div>
                <div class="invoice-detail-date">{{ invoice.date }}</div>
                <div class="invoice-detail-amount">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</div>
                <div class="invoice-detail-status">
                  <span class="status-badge" :class="invoice.status?.toLowerCase() || 'paid'">{{ invoice.status || 'Paid' }}</span>
                </div>
              </div>
              
              <div class="invoice-actions">
                <button class="action-btn download" @click.stop="downloadInvoice(invoice)" title="Download PDF">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button class="action-btn edit" @click.stop="$router.push(`/edit/${invoice.id}`)" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn delete" @click.stop="confirmDelete(invoice.id)" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
             <div class="empty-icon">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             </div>
             <p>No invoices found. Create your first one!</p>
             <button class="btn btn-primary" @click="goToCreateInvoice" style="margin-top: 20px;">
               Create Now
             </button>
          </div>
        </section>

        <section class="analytics-section rounded-card">
          <h2>{{ langStore.t('dashboard') }} Analytics</h2>
          <div class="chart-wrapper">
            <div class="chart">
              <div v-for="(day, index) in chartData" :key="index" class="bar-container">
                <div class="bar" :style="{ height: day.height, backgroundColor: day.color }"></div>
                <span class="day-label">{{ day.label }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="quick-actions-section rounded-card mobile-only">
          <h2>Quick Actions</h2>
          <div class="actions-buttons">
            <button class="btn btn-secondary btn-icon" @click="goToCreateInvoice">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              {{ langStore.t('createInvoice') }}
            </button>
            <button class="btn btn-secondary btn-icon" @click="$router.push('/history')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              {{ langStore.t('actions') }}
            </button>
            <button class="btn btn-secondary btn-icon" @click="$router.push('/settings')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              {{ langStore.t('settings') }}
            </button>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { authStore } from '@/store/authStore';
import { invoiceStore } from '@/store/invoiceStore';
import { langStore } from '@/store/languageStore';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import SummaryCard from '@/components/SummaryCard.vue';
import router from '@/router';

// SVGs for summary cards
const docIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
const coinIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="6"></line></svg>';
const cardIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>';
const calendarIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';

onMounted(() => {
  if (!invoiceStore.isInitialized && authStore.user) {
    invoiceStore.init();
  }
});

const userName = computed(() => authStore.user?.displayName?.split(' ')[0] || 'User');

const allInvoicesSorted = computed(() => {
  return [...invoiceStore.invoices].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
});

const summaryData = computed(() => [
  { 
    icon: docIcon, 
    value: invoiceStore.invoices.length, 
    label: langStore.t('totalInvoices'), 
    color: 'rgba(34, 197, 94, 0.1)' 
  },
  { 
    icon: coinIcon, 
    value: invoiceStore.invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0), 
    label: langStore.t('totalEarnings'), 
    color: 'rgba(37, 99, 235, 0.1)' 
  },
  { 
    icon: cardIcon, 
    value: invoiceStore.invoices.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + Number(inv.total || 0), 0), 
    label: 'Pending', 
    color: 'rgba(235, 153, 37, 0.1)' 
  },
  { 
    icon: calendarIcon, 
    value: invoiceStore.invoices.filter(i => {
      const today = new Date().toDateString();
      const invDate = new Date(i.createdAt || 0).toDateString();
      return today === invDate;
    }).length, 
    label: langStore.t('invoicesToday'), 
    color: 'rgba(34, 197, 94, 0.1)' 
  },
]);

const recentInvoices = computed(() => {
  return allInvoicesSorted.value.slice(0, 5);
});

const chartData = ref([
  { label: 'Mon', height: '70%', color: '#22C55E' },
  { label: 'Tue', height: '50%', color: '#22C55E' },
  { label: 'Wed', height: '85%', color: '#2563EB' },
  { label: 'Thu', height: '60%', color: '#22C55E' },
  { label: 'Fri', height: '75%', color: '#22C55E' },
  { label: 'Sat', height: '40%', color: '#2563EB' },
  { label: 'Sun', height: '65%', color: '#22C55E' },
]);

const goToCreateInvoice = () => {
  router.push('/create');
};

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
.dashboard-main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--color-background);
  font-family: var(--font-family-sans);
  padding: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: var(--color-text-secondary);
  gap: 20px;
}

.spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--color-surface);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  margin: 0 0 20px 0;
  box-shadow: var(--soft-shadow);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navbar-logo {
  height: 35px;
  width: auto;
}

.greeting-text {
  display: flex;
  flex-direction: column;
}

.user-greeting {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.user-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.navbar-right .btn-primary {
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 12px;
}

.dashboard-content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 40px;
}

.summary-cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.analytics-section {
  padding: 24px;
  background-color: var(--color-surface);
}

.analytics-section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chart-wrapper {
  height: 180px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.chart {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-end;
  justify-content: space-around;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.bar {
  width: 30px;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
}

.day-label {
  margin-top: 12px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.recent-invoices-section {
  padding: 24px;
  background-color: var(--color-surface);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.view-all {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
}

.invoice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(255,255,255,0.02);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s ease;
}

.invoice-item:hover {
  background-color: rgba(255,255,255,0.04);
}

.invoice-info {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
}

.invoice-detail-customer {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.invoice-id {
  font-size: 0.7rem;
  color: var(--color-primary);
  font-weight: 700;
}

.invoice-customer {
  font-weight: 600;
  color: var(--color-text-primary);
}

.invoice-detail-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.invoice-detail-amount {
  font-weight: 700;
  color: var(--color-text-primary);
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  width: fit-content;
}

.status-badge.paid { background-color: rgba(34, 197, 94, 0.1); color: #22C55E; }
.status-badge.pending { background-color: rgba(234, 179, 8, 0.1); color: #EAB308; }

.invoice-actions {
  display: flex;
  gap: 8px;
  margin-left: 20px;
}

.action-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
  transform: translateY(-2px);
}

.action-btn.download:hover { color: var(--color-primary); border-color: var(--color-primary); }
.action-btn.edit:hover { color: #3b82f6; border-color: #3b82f6; }
.action-btn.delete:hover { color: #ef4444; border-color: #ef4444; }

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
}

.empty-icon {
  margin-bottom: 15px;
  color: rgba(255,255,255,0.1);
}

.quick-actions-section {
  padding: 24px;
  background-color: var(--color-surface);
}

.quick-actions-section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.actions-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.btn-secondary {
  background-color: rgba(255,255,255,0.03);
  color: var(--color-text-primary);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mobile-only { display: none; }

@media (max-width: 768px) {
  .mobile-only { display: block; }
  .navbar {
    padding: 12px 16px;
  }
  .navbar-left { gap: 10px; }
  .navbar-logo { height: 28px; }
  .user-name { font-size: 1rem; }
  
  .invoice-info {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .invoice-detail-date, .invoice-detail-status {
    display: none;
  }
  .invoice-detail-amount {
    text-align: right;
  }
  .invoice-actions {
    margin-left: 10px;
    gap: 4px;
  }
  .action-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
