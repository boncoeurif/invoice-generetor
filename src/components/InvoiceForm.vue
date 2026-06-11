<template>
  <div class="invoice-experience-container">
    <div class="experience-header">
      <div class="header-text">
        <span class="badge">{{ isEdit ? langStore.t('edit') : langStore.t('new') }}</span>
        <h1>{{ isEdit ? langStore.t('editInvoice') : langStore.t('createInvoice') }}</h1>
      </div>
      <div class="header-actions">
        <button type="button" @click="$router.push('/dashboard')" class="btn-secondary">
          {{ langStore.t('cancel') }}
        </button>
        <button type="submit" form="invoice-form" class="btn-primary" :disabled="isProcessing">
          <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          {{ isProcessing ? langStore.t('processing') : langStore.t('save') }}
        </button>
      </div>
    </div>

    <div class="live-doc-workspace">
      <form id="invoice-form" @submit.prevent="handleSubmit" class="live-doc">
        <!-- Document Header -->
        <header class="doc-header">
          <div class="doc-logo-section">
            <div class="doc-logo-box">
              <img src="/logo.svg" alt="Logo">
            </div>
            <div class="doc-brand">Invoxa Pro</div>
          </div>
          <div class="doc-meta">
            <div class="meta-item">
              <span class="meta-label">{{ langStore.t('date') }}</span>
              <span class="meta-value">{{ new Date().toLocaleDateString() }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">ID</span>
              <span class="meta-value">#NEW-DRAFT</span>
            </div>
          </div>
        </header>

        <div class="doc-divider"></div>

        <!-- Billing Info -->
        <section class="doc-section billing-grid">
          <div class="billing-col">
            <label class="section-label">Bill To</label>
            <div class="client-input-wrapper">
              <input 
                v-model="form.clientName" 
                required 
                :placeholder="langStore.t('clientName')" 
                class="client-name-input"
              />
              <div class="input-underline"></div>
            </div>
          </div>
          <div class="billing-col align-right">
            <label class="section-label">From</label>
            <div class="sender-info">
              <strong>Your Business</strong><br>
              <span class="small-text">Verified Account</span>
            </div>
          </div>
        </section>

        <!-- Items Table -->
        <section class="doc-section items-table-section">
          <div class="table-header">
            <span class="col-desc">{{ langStore.t('description') }}</span>
            <span class="col-qty">{{ langStore.t('qty') }}</span>
            <span class="col-unit">{{ langStore.t('unit') }}</span>
            <span class="col-price">{{ langStore.t('price') }}</span>
            <span class="col-total">Total</span>
            <span class="col-action"></span>
          </div>

          <transition-group name="list" tag="div" class="items-list">
            <div v-for="(item, index) in form.items" :key="index" class="item-row">
              <div class="col-desc">
                <input v-model="item.name" required placeholder="Description..." class="doc-input" />
              </div>
              <div class="col-qty">
                <input type="number" v-model.number="item.quantity" required min="1" class="doc-input centered" placeholder="1" />
              </div>
              <div class="col-unit">
                <input v-model="item.unit" required class="doc-input centered" placeholder="pcs" />
              </div>
              <div class="col-price">
                <div class="price-input-wrapper">
                  <span class="currency-symbol">{{ langStore.currency }}</span>
                  <input type="number" v-model.number="item.price" required min="0" step="0.01" class="doc-input" placeholder="0.00" />
                </div>
              </div>
              <div class="col-total">
                <span class="row-total">{{ langStore.currency }} {{ (item.quantity * item.price).toLocaleString() }}</span>
              </div>
              <div class="col-action">
                <button type="button" @click="removeItem(index)" class="btn-row-remove" v-if="form.items.length > 1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          </transition-group>

          <button type="button" class="btn-add-item" @click="addItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {{ langStore.t('addItem') }}
          </button>
        </section>

        <!-- Doc Footer / Total -->
        <footer class="doc-footer">
          <div class="footer-left">
            <div class="payment-note">
              <label class="section-label">Notes / Payment Info</label>
              <p>Automatically generated by Invoxa. Payments are due within 30 days.</p>
            </div>
          </div>
          <div class="footer-right">
            <div class="total-block">
              <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
              </div>
              <div class="total-row grand-total">
                <span class="total-label">{{ langStore.t('total') }}</span>
                <span class="total-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </footer>
      </form>
      
      <!-- Workspace Decoration -->
      <div class="doc-shadow-decor"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { invoiceStore } from '@/store/invoiceStore'
import { langStore } from '@/store/languageStore'
import { generateInvoicePDF } from '@/utils/pdfGenerator'
import { notificationStore } from '@/store/notificationStore'

const props = defineProps({
  invoice: { type: Object, default: null }
})

const router = useRouter()
const isEdit = computed(() => !!props.invoice)
const isProcessing = ref(false)

const form = reactive({
  clientName: '',
  items: [{ name: '', quantity: null, unit: '', price: null }]
})

const addItem = () => form.items.push({ name: '', quantity: null, unit: '', price: null })
const removeItem = (index) => form.items.splice(index, 1)

const totalAmount = computed(() => 
  form.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0)
)

onMounted(() => {
  if (props.invoice) {
    if (props.invoice.itemName) {
      form.clientName = props.invoice.clientName
      form.items = [{ name: props.invoice.itemName, quantity: props.invoice.quantity || 1, unit: props.invoice.unit || 'pcs', price: props.invoice.price || 0 }]
    } else {
      Object.assign(form, props.invoice)
    }
  }
})

const handleSubmit = async () => {
  if (isProcessing.value) return
  isProcessing.value = true
  
  const total = Number(totalAmount.value) || 0
  const data = { 
    ...form, 
    total, 
    mode: langStore.businessMode, 
    currency: langStore.currency 
  }

  try {
    if (isEdit.value) {
      await invoiceStore.updateInvoice({ ...props.invoice, ...data })
      notificationStore.success(langStore.t('invoiceUpdated') || 'Invoice updated!')
      router.push('/dashboard')
    } else {
      const addedInvoice = await invoiceStore.addInvoice(data)
      notificationStore.success(langStore.t('invoiceCreated') || 'Invoice created!')
      
      try {
        generateInvoicePDF(addedInvoice, langStore.t)
      } catch (pdfError) {
        console.error("PDF generation failed:", pdfError)
      }

      setTimeout(() => {
        router.push('/dashboard')
      }, 1200)
    }
  } catch (error) {
    console.error("SAVE ERROR:", error);
    notificationStore.error(`${langStore.t('errorSaving')}: ${error.message}`);
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.invoice-experience-container {
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 120px;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 10px;
}

.header-text { display: flex; flex-direction: column; gap: 8px; }
.header-text h1 { font-size: 2.25rem; font-weight: 900; margin: 0; color: var(--text-primary); letter-spacing: -0.03em; }
.badge { 
  display: inline-block; 
  align-self: flex-start;
  padding: 4px 12px; 
  background: var(--primary-light); 
  color: var(--primary-green); 
  border-radius: 8px; 
  font-size: 0.75rem; 
  font-weight: 800; 
  text-transform: uppercase;
}

.header-actions { display: flex; gap: 12px; }

.btn-primary {
  background: var(--text-primary);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); background: var(--primary-green); box-shadow: var(--shadow-lg); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  background: white;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--text-primary); color: var(--text-primary); }

.live-doc-workspace {
  position: relative;
  display: flex;
  justify-content: center;
}

.live-doc {
  width: 100%;
  max-width: 850px;
  background: white;
  padding: 60px 70px;
  border-radius: 4px; /* Paper look */
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.08);
  position: relative;
  z-index: 2;
  min-height: 1000px;
}

.doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
.doc-logo-section { display: flex; align-items: center; gap: 16px; }
.doc-logo-box { width: 50px; height: 50px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.doc-logo-box img { height: 28px; }
.doc-brand { font-size: 1.25rem; font-weight: 900; color: var(--text-primary); }

.doc-meta { text-align: right; display: flex; flex-direction: column; gap: 8px; }
.meta-item { display: flex; flex-direction: column; }
.meta-label { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; }
.meta-value { font-weight: 800; font-size: 0.95rem; color: var(--text-primary); }

.doc-divider { height: 1.5px; background: #f1f5f9; margin-bottom: 40px; }

.doc-section { margin-bottom: 50px; }
.section-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; margin-bottom: 15px; display: block; letter-spacing: 0.05em; }

.billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.client-input-wrapper { position: relative; width: 100%; }
.client-name-input { 
  width: 100%; 
  border: none; 
  font-size: 1.5rem; 
  font-weight: 800; 
  color: var(--text-primary); 
  padding: 0 0 8px 0;
  background: transparent;
  outline: none;
}
.client-name-input::placeholder { color: #cbd5e1; }
.input-underline { height: 2px; background: #f1f5f9; width: 100%; transition: background 0.3s; }
.client-name-input:focus + .input-underline { background: var(--primary-green); }

.sender-info { color: var(--text-primary); font-size: 1rem; }
.small-text { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }
.align-right { text-align: right; }

/* Table Section */
.table-header { display: grid; grid-template-columns: 2fr 0.6fr 0.6fr 1fr 1.2fr 40px; padding: 12px 0; border-bottom: 2px solid #f1f5f9; margin-bottom: 12px; }
.table-header span { font-size: 0.7rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; }

.item-row { display: grid; grid-template-columns: 2fr 0.6fr 0.6fr 1fr 1.2fr 40px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; align-items: center; transition: all 0.3s ease; }
.item-row:hover { background: #f8fafc; margin-left: -10px; margin-right: -10px; padding-left: 10px; padding-right: 10px; border-radius: 8px; }

.doc-input { width: 100%; border: none; background: transparent; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); outline: none; padding: 8px 4px; }
.doc-input.centered { text-align: center; }
.price-input-wrapper { display: flex; align-items: center; gap: 4px; }
.currency-symbol { font-weight: 800; color: var(--text-secondary); font-size: 0.9rem; }
.row-total { font-weight: 800; color: var(--text-primary); display: block; text-align: right; }

.col-total { text-align: right; }
.col-action { display: flex; justify-content: flex-end; }

.btn-row-remove { background: none; border: none; color: #ef4444; opacity: 0; cursor: pointer; transition: opacity 0.2s; padding: 4px; }
.item-row:hover .btn-row-remove { opacity: 1; }

.btn-add-item { 
  margin-top: 24px; 
  background: #f8fafc; 
  color: var(--primary-green); 
  border: 2px dashed #e2e8f0; 
  padding: 12px 20px; 
  border-radius: 12px; 
  font-weight: 800; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 0.9rem;
  transition: all 0.2s;
}
.btn-add-item:hover { border-color: var(--primary-green); background: white; transform: translateY(-2px); }

.doc-footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 40px; border-top: 2px solid #f1f5f9; }
.footer-left { flex: 1; }
.payment-note p { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; line-height: 1.6; max-width: 300px; }

.footer-right { min-width: 300px; }
.total-block { display: flex; flex-direction: column; gap: 12px; }
.total-row { display: flex; justify-content: space-between; align-items: center; }
.total-label { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); }
.total-value { font-size: 1rem; font-weight: 800; color: var(--text-primary); }
.grand-total { margin-top: 8px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.grand-total .total-label { font-size: 1.1rem; font-weight: 900; color: var(--text-primary); }
.grand-total .total-value { font-size: 1.75rem; font-weight: 900; color: var(--primary-green); letter-spacing: -0.04em; }

.doc-shadow-decor { 
  position: absolute; 
  top: 10px; 
  left: 10px; 
  right: -10px; 
  bottom: -10px; 
  background: #e2e8f0; 
  z-index: 1; 
  border-radius: 4px; 
  opacity: 0.5;
}

/* Animations */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(10px); }

@media (max-width: 768px) {
  .invoice-experience-container { padding: 10px; padding-bottom: 150px; }
  .experience-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header-actions { width: 100%; display: flex; flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; padding: 18px; font-size: 1.1rem; }
  
  .live-doc { padding: 30px 16px; border-radius: 20px; }
  .billing-grid { grid-template-columns: 1fr; gap: 30px; }
  .table-header { display: none; }
  
  /* Mobile Item Row Overhaul */
  .item-row { 
    display: flex; 
    flex-direction: column; 
    gap: 16px; 
    padding: 24px 16px; 
    position: relative; 
    background: #f8fafc;
    border-radius: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--border-color);
  }
  .item-row:hover { background: #f8fafc; margin-left: 0; margin-right: 0; padding-left: 16px; padding-right: 16px; }
  
  .col-desc, .col-qty, .col-unit, .col-price, .col-total { width: 100%; text-align: left !important; }
  
  /* Force clear inputs on mobile */
  .doc-input {
    background: white;
    border: 1px solid var(--border-color);
    padding: 16px;
    border-radius: 12px;
    font-size: 16px !important; /* Prevent iOS zoom */
    font-weight: 600;
  }
  .doc-input:focus { border-color: var(--primary-green); box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1); }
  
  /* Add pseudo-labels for mobile items */
  .col-desc::before { content: "Item Description"; display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
  .col-qty::before { content: "Quantity"; display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
  .col-price::before { content: "Price"; display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
  
  .row-total { text-align: right; font-size: 1.25rem; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  .btn-row-remove { position: absolute; top: -12px; right: -12px; opacity: 1; background: #fee2e2; border-radius: 50%; padding: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  
  .doc-footer { flex-direction: column; gap: 40px; padding-top: 30px; margin-top: 40px; }
  .footer-right { min-width: 0; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid var(--border-color); }
  .grand-total .total-label { font-size: 1rem; }
  .grand-total .total-value { font-size: 1.5rem; }
}
</style>
