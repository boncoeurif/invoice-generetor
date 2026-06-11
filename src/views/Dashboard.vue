<template>
  <div class="dashboard-main-content">
    <header class="navbar">
      <div class="navbar-left">
        <div class="greeting-box">
          <span class="user-greeting">{{ langStore.t('welcomeMessage') }}</span>
          <h1 class="user-name">{{ userName }}!</h1>
        </div>
      </div>
      <div class="navbar-right">
        <button class="btn-create-header" @click="goToCreateInvoice">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {{ langStore.t('new') }}
        </button>
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
          <section class="analytics-section glass-card">
            <div class="section-header">
              <div class="header-left">
                <h2>{{ langStore.t('analytics') }}</h2>
                <span class="subtitle">Revenue last 7 days</span>
              </div>
              <div v-if="revenueGrowth !== 0" :class="['growth-badge', revenueGrowth > 0 ? 'up' : 'down']">
                <svg v-if="revenueGrowth > 0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                {{ Math.abs(revenueGrowth) }}%
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-y-axis">
                <span>{{ maxValStr }}</span>
                <span>{{ midValStr }}</span>
                <span>0</span>
              </div>
              <div class="chart-wrapper">
                <div v-for="(day, index) in chartData" :key="index" class="bar-container">
                  <div class="bar-hint" :style="{ bottom: `calc(${day.height} + 12px)` }">
                    <span class="hint-value">{{ day.value }}</span>
                  </div>
                  <div 
                    class="bar-bg"
                  >
                    <div 
                      class="bar-fill"
                      :style="{ 
                        height: day.height, 
                        background: day.active ? 'linear-gradient(180deg, var(--primary-green) 0%, var(--primary-dark) 100%)' : '#E2E8F0' 
                      }"
                    ></div>
                  </div>
                  <span class="day-label">{{ day.label }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="recent-invoices-section glass-card">
            <div class="section-header">
              <div class="header-left">
                <h2>{{ langStore.t('recentInvoices') }}</h2>
                <span class="subtitle">Latest business activity</span>
              </div>
              <router-link to="/history" class="view-all-btn">{{ langStore.t('actions') }}</router-link>
            </div>
            <div v-if="recentInvoices.length > 0" class="invoice-list">
              <div v-for="invoice in recentInvoices" :key="invoice.id" class="invoice-item">
                <div class="invoice-meta" @click="$router.push(`/edit/${invoice.id}`)">
                  <div class="invoice-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div class="invoice-details">
                    <span class="invoice-customer">{{ invoice.clientName }}</span>
                    <span class="invoice-date">#{{ invoice.id.slice(-4).toUpperCase() }} • {{ invoice.date }}</span>
                  </div>
                </div>
                <div class="invoice-right">
                  <div class="invoice-amount">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</div>
                  <div class="invoice-actions">
                    <button class="mini-btn" @click.stop="downloadInvoice(invoice)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
               <p>{{ langStore.t('noInvoices') }}</p>
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
    label: langStore.t('totalEarnings'), 
    color: 'var(--primary-green)' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', 
    value: invoiceStore.invoices.length, 
    label: langStore.t('totalInvoices'), 
    color: '#3B82F6' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>', 
    value: `${revenueGrowth.value}%`, 
    label: 'Growth', 
    color: revenueGrowth.value >= 0 ? '#10B981' : '#EF4444' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', 
    value: recentInvoices.value.length, 
    label: 'Activity', 
    color: '#F59E0B' 
  }
]);

const recentInvoices = computed(() => [...invoiceStore.invoices].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 6));

const daysRaw = computed(() => {
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
  return days;
});

const maxVal = computed(() => Math.max(...daysRaw.value.map(d => d.total), 100));
const maxValStr = computed(() => `${langStore.currency}${Math.round(maxVal.value).toLocaleString()}`);
const midValStr = computed(() => `${langStore.currency}${Math.round(maxVal.value / 2).toLocaleString()}`);

const chartData = computed(() => {
  return daysRaw.value.map(day => {
    const percentage = (day.total / maxVal.value) * 100;
    return { 
      label: day.label, 
      height: `${Math.max(percentage, 5)}%`, 
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
</script>

<style scoped>
.dashboard-main-content { position: relative; min-height: 100vh; padding-bottom: 100px; }

.navbar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 30px 40px; 
  background: transparent;
}

.greeting-box { display: flex; flex-direction: column; gap: 4px; }
.user-greeting { font-size: 0.9rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.user-name { font-size: 2.25rem; font-weight: 900; color: var(--text-primary); margin: 0; letter-spacing: -0.03em; }

.btn-create-header {
  background: var(--text-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.btn-create-header:hover {
  transform: translateY(-2px);
  background: var(--primary-green);
  box-shadow: var(--shadow-lg);
}

.dashboard-content-area { padding: 0 40px 40px; display: flex; flex-direction: column; gap: 40px; max-width: 1600px; margin: 0 auto; }

.summary-cards-section { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
  gap: 16px; 
}

@media (max-width: 480px) {
  .summary-cards-section {
    grid-template-columns: 1fr;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 32px;
}

@media (max-width: 1200px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  padding: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h2 { font-size: 1.25rem; margin: 0 0 4px 0; color: var(--text-primary); font-weight: 900; letter-spacing: -0.02em; }
.subtitle { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }

.view-all-btn { 
  font-size: 0.85rem; 
  color: var(--primary-green); 
  text-decoration: none; 
  font-weight: 800; 
  padding: 8px 16px;
  background: var(--primary-light);
  border-radius: 10px;
  transition: all 0.2s;
}
.view-all-btn:hover { background: var(--primary-green); color: white; }

.invoice-list { display: flex; flex-direction: column; gap: 12px; }
.invoice-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 16px; 
  border-radius: 18px; 
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid transparent;
}
.invoice-item:hover { 
  background: white; 
  border-color: var(--primary-light);
  transform: translateX(8px);
  box-shadow: var(--shadow-sm);
}

.invoice-meta { cursor: pointer; display: flex; align-items: center; gap: 16px; flex: 1; }
.invoice-icon {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}
.invoice-item:hover .invoice-icon { background: var(--primary-light); color: var(--primary-green); }

.invoice-details { display: flex; flex-direction: column; gap: 2px; }
.invoice-customer { font-weight: 800; color: var(--text-primary); font-size: 1rem; }
.invoice-date { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }

.invoice-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.invoice-amount { font-weight: 900; color: var(--text-primary); font-size: 1.1rem; letter-spacing: -0.02em; }

.invoice-actions { opacity: 0; transition: opacity 0.2s; }
.invoice-item:hover .invoice-actions { opacity: 1; }
.mini-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}
.mini-btn:hover { color: var(--primary-green); background: var(--primary-light); }

/* Analytics Styles */
.growth-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
}
.growth-badge.up { background: #DCFCE7; color: #059669; }
.growth-badge.down { background: #FEE2E2; color: #DC2626; }

.chart-container { 
  display: flex; 
  gap: 20px; 
  height: 280px;
  margin-top: 20px;
}

.chart-y-axis { 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  font-size: 0.7rem; 
  color: var(--text-secondary);
  padding: 10px 0 35px 0;
  font-weight: 800;
  min-width: 50px;
}

.chart-wrapper { 
  flex: 1; 
  display: flex; 
  align-items: flex-end; 
  justify-content: space-between; 
  padding: 10px 0;
  border-bottom: 2px solid #E2E8F0;
}

.bar-container { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 12px;
  position: relative;
  max-width: 45px;
  height: 100%;
  justify-content: flex-end;
}

.bar-bg {
  width: 100%;
  height: calc(100% - 20px);
  background: rgba(226, 232, 240, 0.3);
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill { 
  width: 100%; 
  border-radius: 12px; 
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bar-container:hover .bar-fill {
  filter: brightness(1.1);
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
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.day-label { font-size: 0.7rem; color: var(--text-secondary); font-weight: 800; text-transform: uppercase; }

@media (max-width: 768px) {
  .dashboard-content-area { padding: 0 16px 16px; gap: 24px; }
  .navbar { padding: 24px 16px; }
  .user-name { font-size: 1.75rem; }
  .glass-card { padding: 20px; }
  .chart-container { height: 220px; }
}
</style>
