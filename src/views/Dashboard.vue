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
                <div class="invoice-detail-amount">{{ Number(invoice.total || 0).toLocaleString() }} {{ langStore.currency }}</div>
              </div>
              <div class="invoice-actions">
                <button class="action-btn download" @click.stop="downloadInvoice(invoice)">PDF</button>
                <button class="action-btn delete" @click.stop="confirmDelete(invoice.id)">🗑️</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
             <p>No invoices found.</p>
          </div>
        </section>

        <section class="analytics-section rounded-card">
          <h2>Analytics</h2>
          <div class="chart-wrapper">
            <div class="chart">
              <div v-for="(day, index) in chartData" :key="index" class="bar-container">
                <div class="bar" :style="{ height: day.height, backgroundColor: day.color }"></div>
                <span class="day-label">{{ day.label }}</span>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>

    <!-- Floating Action Button (Mobile Only) -->
    <button class="fab mobile-only" @click="goToCreateInvoice">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
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

const userName = computed(() => authStore.user?.displayName?.split(' ')[0] || 'User');
const summaryData = computed(() => [
  { icon: '📄', value: invoiceStore.invoices.length, label: langStore.t('totalInvoices'), color: 'rgba(34, 197, 94, 0.1)' },
  { icon: '💰', value: invoiceStore.invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0), label: langStore.t('totalEarnings'), color: 'rgba(37, 99, 235, 0.1)' },
]);

const recentInvoices = computed(() => [...invoiceStore.invoices].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5));
const chartData = computed(() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({ label: day, height: `${Math.random() * 80 + 20}%`, color: '#22C55E' }));
});

const goToCreateInvoice = () => router.push('/create');
const downloadInvoice = (invoice) => generateInvoicePDF(invoice, langStore.t);
const confirmDelete = async (id) => { if (confirm("Delete?")) await invoiceStore.deleteInvoice(id); };
</script>

<style scoped>
.dashboard-main-content { position: relative; min-height: 100vh; padding-bottom: 80px; }
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.2s;
}
.fab:hover { transform: scale(1.1); }
.navbar { display: flex; justify-content: space-between; padding: 16px 24px; background: var(--color-surface); border-radius: 0 0 20px 20px; }
.navbar-logo { height: 30px; }
.dashboard-content-area { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
.summary-cards-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
.recent-invoices-section { padding: 20px; background: var(--color-surface); }
.invoice-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.02); margin-bottom: 10px; border-radius: 12px; }
.invoice-info { cursor: pointer; flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; align-items: center; }
.invoice-actions { display: flex; gap: 10px; }
.action-btn { background: none; border: none; cursor: pointer; padding: 5px; }
.analytics-section { padding: 20px; background: var(--color-surface); }
.chart-wrapper { height: 150px; display: flex; align-items: flex-end; justify-content: space-around; }
.bar { width: 30px; border-radius: 6px 6px 0 0; }
.day-label { font-size: 0.7rem; margin-top: 8px; color: var(--color-text-secondary); }
</style>
