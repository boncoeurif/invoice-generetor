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
               <p>{{ langStore.t('noInvoices') }}</p>
            </div>
          </section>

          <section class="analytics-section rounded-card">
            <div class="section-header">
              <h2>{{ langStore.t('analytics') }}</h2>
              <div v-if="revenueGrowth !== 0" :class="['growth-badge', revenueGrowth > 0 ? 'up' : 'down']">
                <svg v-if="revenueGrowth > 0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                {{ Math.abs(revenueGrowth) }}%
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-y-axis">
                <span>MAX</span>
                <span>MID</span>
                <span>0</span>
              </div>
              <div class="chart-wrapper">
                <div v-for="(day, index) in chartData" :key="index" class="bar-container">
                  <div class="bar-hint" :style="{ bottom: `calc(${day.height} + 10px)` }">
                    <span class="hint-value">{{ day.value }}</span>
                  </div>
                  <div 
                    class="bar" 
                    :style="{ 
                      height: day.height, 
                      background: day.active ? 'linear-gradient(180deg, var(--color-primary) 0%, #16a34a 100%)' : '#f1f5f9' 
                    }"
                  ></div>
                  <span class="day-label">{{ day.label }}</span>
                </div>
              </div>
            </div>
          </section>
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
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', 
    value: `${langStore.currency} ${invoiceStore.invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0).toLocaleString()}`, 
    label: langStore.t('totalEarnings') || 'Total Revenue', 
    color: 'var(--color-primary)' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', 
    value: invoiceStore.invoices.length, 
    label: langStore.t('totalInvoices') || 'Total Invoices', 
    color: '#3b82f6' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>', 
    value: `${revenueGrowth}%`, 
    label: langStore.t('growth') || 'Growth (7d)', 
    color: revenueGrowth >= 0 ? '#10b981' : '#ef4444' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', 
    value: recentInvoices.value.length, 
    label: langStore.t('recentActivity') || 'Recent Activity', 
    color: '#f59e0b' 
  }
]);

const recentInvoices = computed(() => [...invoiceStore.invoices].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5));

const chartData = computed(() => {
  const days = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    days.push({
      dateStr: d.toLocaleDateString('en-GB'),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      total: 0
    });
  }

  invoiceStore.invoices.forEach(inv => {
    const day = days.find(d => d.dateStr === inv.date);
    if (day) day.total += Number(inv.total || 0);
  });

  const maxTotal = Math.max(...days.map(d => d.total), 1);

  return days.map(day => {
    const percentage = (day.total / maxTotal) * 100;
    return { 
      label: day.label, 
      height: `${Math.max(percentage, 8)}%`, 
      value: `${langStore.currency}${day.total.toLocaleString()}`,
      active: day.total > 0
    }
  });
});

const revenueGrowth = computed(() => {
  const now = new Date();
  const last7DaysTotal = invoiceStore.invoices
    .filter(inv => {
      const diff = (now - new Date(inv.createdAt)) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  const prev7DaysTotal = invoiceStore.invoices
    .filter(inv => {
      const diff = (now - new Date(inv.createdAt)) / (1000 * 60 * 60 * 24);
      return diff > 7 && diff <= 14;
    })
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  if (prev7DaysTotal === 0) return last7DaysTotal > 0 ? 100 : 0;
  return Math.round(((last7DaysTotal - prev7DaysTotal) / prev7DaysTotal) * 100);
});

const goToCreateInvoice = () => router.push('/create');
const downloadInvoice = (invoice) => generateInvoicePDF(invoice, langStore.t);
const confirmDelete = async (id) => { if (confirm("Delete?")) await invoiceStore.deleteInvoice(id); };
</script>

<style scoped>
.dashboard-main-content { position: relative; min-height: 100vh; padding-bottom: 80px; background: var(--bg-light); }

.navbar { 
  display: flex; 
  justify-content: space-between; 
  padding: 20px 24px; 
  background: var(--surface-white); 
  border-bottom: 1px solid var(--border-color);
}

.greeting-text { display: flex; flex-direction: column; }
.user-greeting { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }
.user-name { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }

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
  background: var(--surface-white);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 { font-size: 1rem; margin: 0; color: var(--text-primary); font-weight: 800; }
.view-all { font-size: 0.85rem; color: var(--primary-green); text-decoration: none; font-weight: 700; }

.invoice-list { padding: 8px; }
.invoice-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 14px 16px; 
  border-radius: 12px; 
  transition: all 0.2s;
  border: 1px solid transparent;
}
.invoice-item:hover { 
  background: #f8fafc; 
  border-color: var(--border-color);
}

.invoice-info { cursor: pointer; flex: 1; display: flex; justify-content: space-between; align-items: center; margin-right: 20px; }
.invoice-customer-box { display: flex; flex-direction: column; gap: 2px; }
.invoice-id { font-size: 0.65rem; font-weight: 800; color: var(--primary-green); text-transform: uppercase; letter-spacing: 0.05em; }
.invoice-customer { font-weight: 600; color: var(--text-primary); font-size: 0.95rem; }
.invoice-detail-amount { font-weight: 800; color: var(--text-primary); font-size: 1rem; }

.invoice-actions { display: flex; gap: 8px; }
.action-btn { 
  background: #f1f5f9; 
  border: 1px solid var(--border-color); 
  color: var(--text-secondary);
  width: 36px; 
  height: 36px; 
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover { color: var(--text-primary); background: #e2e8f0; }
.action-btn.delete:hover { background: #fee2e2; border-color: #fecaca; color: #ef4444; }

/* Analytics Styles */
.growth-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
}
.growth-badge.up { background: #dcfce7; color: #166534; }
.growth-badge.down { background: #fee2e2; color: #991b1b; }

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
  font-size: 0.6rem; 
  color: var(--text-secondary);
  padding-bottom: 25px;
  font-weight: 800;
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
  max-width: 36px;
}

.bar { 
  width: 100%; 
  min-height: 4px; 
  border-radius: 8px; 
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-container:hover .bar {
  filter: brightness(0.95);
  transform: scaleX(1.1);
}

.bar-hint {
  position: absolute;
  width: auto;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}

.bar-container:hover .bar-hint {
  opacity: 1;
  transform: translateY(0);
}

.hint-value {
  background: var(--text-primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
}

.day-label { font-size: 0.65rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; }

@media (max-width: 768px) {
  .dashboard-content-area { padding: 16px; gap: 16px; }
  .summary-cards-section { grid-template-columns: 1fr; }
  .navbar { padding: 16px; }
}
</style>
