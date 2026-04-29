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
    </header>

    <main class="dashboard-content-area">
      <div v-if="invoiceStore.isLoading && !invoiceStore.isInitialized" class="loading-state">
        <div class="spinner"></div>
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
          />
        </section>

        <div class="dashboard-grid">
          <section class="recent-invoices-section rounded-card">
            <div class="section-header">
              <h2>{{ langStore.t('recentInvoices') }}</h2>
              <router-link to="/history" class="view-all">{{ langStore.t('actions') }}</router-link>
            </div>
            <div v-if="recentInvoices.length > 0" class="invoice-list">
              <div v-for="invoice in recentInvoices" :key="invoice.id" class="invoice-item">
                <div class="invoice-info" @click="$router.push(`/edit/${invoice.id}`)">
                  <div class="invoice-customer-box">
                    <span class="invoice-id">#{{ invoice.id.slice(-4).toUpperCase() }}</span>
                    <span class="invoice-customer">{{ invoice.clientName }}</span>
                  </div>
                  <div class="invoice-detail-amount">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</div>
                </div>
                <div class="invoice-actions">
                  <button class="action-btn download" @click.stop="downloadInvoice(invoice)" :title="langStore.t('download')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                  <button class="action-btn delete" @click.stop="confirmDelete(invoice.id)" :title="langStore.t('delete')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
               <p>No invoices found.</p>
            </div>
          </section>

          <section class="analytics-section rounded-card">
            <div class="section-header">
              <h2>{{ langStore.t('analytics') }}</h2>
            </div>
            <div class="chart-container">
              <div class="chart-y-axis">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>
              <div class="chart-wrapper">
                <div v-for="(day, index) in chartData" :key="index" class="bar-container">
                  <div class="bar-hint" :style="{ height: day.height }">
                    <span class="hint-value">{{ day.value }}</span>
                  </div>
                  <div class="bar" :style="{ height: day.height, backgroundColor: day.color }"></div>
                  <span class="day-label">{{ day.label }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>

      <template v-else-if="recentInvoices.length === 0">
         <div class="empty-state">
            <p>{{ langStore.t('noInvoices') }}</p>
         </div>
      </template>

    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { authStore } from '@/store/authStore';
import { invoiceStore } from '@/store/invoiceStore';
import { langStore } from '@/store/languageStore';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import SummaryCard from '@/components/SummaryCard.vue';
import router from '@/router';

onMounted(() => {
  if (!invoiceStore.isInitialized && authStore.user) {
    invoiceStore.init();
  }
});

const userName = computed(() => authStore.user?.displayName?.split(' ')[0] || langStore.t('user'));
const summaryData = computed(() => [
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', 
    value: invoiceStore.invoices.length, 
    label: langStore.t('totalInvoices'), 
    color: 'rgba(34, 197, 94, 0.1)' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', 
    value: invoiceStore.invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0), 
    label: langStore.t('totalEarnings'), 
    color: 'rgba(37, 99, 235, 0.1)' 
  },
]);

const recentInvoices = computed(() => [...invoiceStore.invoices].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5));
const chartData = computed(() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => {
    const val = Math.floor(Math.random() * 100);
    return { 
      label: day, 
      height: `${val}%`, 
      value: val,
      color: val > 70 ? '#22C55E' : val > 40 ? '#3B82F6' : '#64748B' 
    }
  });
});

const goToCreateInvoice = () => router.push('/create');
const downloadInvoice = (invoice) => generateInvoicePDF(invoice, langStore.t);
const confirmDelete = async (id) => { if (confirm("Delete?")) await invoiceStore.deleteInvoice(id); };
</script>

<style scoped>
.dashboard-main-content { position: relative; min-height: 100vh; padding-bottom: 80px; background: var(--color-background); }

.navbar { 
  display: flex; 
  justify-content: space-between; 
  padding: 20px 24px; 
  background: var(--color-surface); 
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.greeting-text { display: flex; flex-direction: column; }
.user-greeting { font-size: 0.8rem; color: var(--color-text-secondary); }
.user-name { font-size: 1.1rem; font-weight: 800; color: #fff; }

.dashboard-content-area { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto; }

.summary-cards-section { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 20px; 
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

.rounded-card {
  background: var(--color-surface);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.section-header h2 { font-size: 1.1rem; margin: 0; color: #fff; }
.view-all { font-size: 0.85rem; color: var(--color-primary); text-decoration: none; font-weight: 700; }

.invoice-list { padding: 12px; }
.invoice-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 16px; 
  border-radius: 12px; 
  transition: all 0.2s;
  border: 1px solid transparent;
}
.invoice-item:hover { 
  background: rgba(255,255,255,0.02); 
  border-color: rgba(255,255,255,0.05);
}

.invoice-info { cursor: pointer; flex: 1; display: flex; justify-content: space-between; align-items: center; margin-right: 20px; }
.invoice-customer-box { display: flex; flex-direction: column; }
.invoice-id { font-size: 0.7rem; font-weight: 800; color: var(--color-primary); text-transform: uppercase; }
.invoice-customer { font-weight: 600; color: #fff; }
.invoice-detail-amount { font-weight: 800; color: #fff; }

.invoice-actions { display: flex; gap: 8px; }
.action-btn { 
  background: rgba(255,255,255,0.03); 
  border: 1px solid rgba(255,255,255,0.08); 
  color: var(--color-text-secondary);
  width: 38px; 
  height: 38px; 
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover { color: #fff; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.action-btn.delete:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #ef4444; }

/* Analytics Styles */
.analytics-section { display: flex; flex-direction: column; }
.chart-container { 
  flex: 1; 
  padding: 30px 24px; 
  display: flex; 
  gap: 15px; 
  min-height: 250px;
}

.chart-y-axis { 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  font-size: 0.65rem; 
  color: var(--color-text-secondary);
  padding-bottom: 25px;
}

.chart-wrapper { 
  flex: 1; 
  display: flex; 
  align-items: flex-end; 
  justify-content: space-between; 
  position: relative;
  padding-top: 20px;
}

.bar-container { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 10px;
  position: relative;
  max-width: 40px;
}

.bar { 
  width: 100%; 
  min-height: 4px; 
  border-radius: 6px 6px 2px 2px; 
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-hint {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s;
}

.bar-container:hover .bar-hint {
  opacity: 1;
  transform: translateY(-5px);
}

.hint-value {
  background: #fff;
  color: #000;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.day-label { font-size: 0.7rem; color: var(--color-text-secondary); font-weight: 600; }

.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  border-radius: 50%;
  border: none;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.2s;
}
.fab:hover { transform: scale(1.1); filter: brightness(1.1); }

@media (max-width: 768px) {
  .dashboard-content-area { padding: 16px; gap: 16px; }
  .summary-cards-section { grid-template-columns: 1fr; }
  .navbar { padding: 16px; }
  .fab { display: flex; }
}
</style>
