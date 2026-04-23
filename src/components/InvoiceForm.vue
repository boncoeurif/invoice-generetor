<template>
  <div class="invoice-form-container">
    <!-- Success Notification overlay -->
    <transition name="pop">
      <div v-if="showSuccess" class="success-overlay">
        <div class="success-card">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3>{{ langStore.t('invoiceCreated') }}</h3>
          <p>{{ langStore.t('downloading') }}</p>
        </div>
      </div>
    </transition>

    <div class="form-header">
      <div class="form-icon-container" :class="langStore.businessMode">
        <svg v-if="langStore.businessMode === 'medical'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
        <svg v-else-if="langStore.businessMode === 'service'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <svg v-else-if="langStore.businessMode === 'restaurant'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
        <svg v-else-if="langStore.businessMode === 'hardware'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"></path><path d="M3 21v-3l9-9"></path><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z"></path><path d="m9.5 15.5 3 3"></path><path d="m10.5 14.5 3 3"></path><path d="m11.5 13.5 3 3"></path><path d="m12.5 12.5 3 3"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      </div>
      <h2>{{ isEdit ? langStore.t('editInvoice') : langStore.t('createInvoice') }}</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="styled-form">
      <section class="form-section">
        <label class="field-label">{{ langStore.t('clientName') }}</label>
        <div class="input-wrapper">
          <input v-model="form.clientName" required :placeholder="langStore.t('clientName')" />
        </div>
      </section>

      <section class="form-section">
        <label class="field-label">
          {{ 
            langStore.businessMode === 'medical' ? langStore.t('medicineName') : 
            (langStore.businessMode === 'service' ? langStore.t('serviceName') : 
            (langStore.businessMode === 'restaurant' ? langStore.t('dishName') : 
            (langStore.businessMode === 'hardware' ? langStore.t('toolName') : langStore.t('itemName')))) 
          }}
        </label>
        
        <div class="input-wrapper">
          <input v-model="form.itemName" required :placeholder="langStore.t('itemName')" />
        </div>

        <div v-if="langStore.businessMode === 'hardware'" class="mode-fields">
          <div class="form-row">
            <div class="input-group">
              <label>{{ langStore.t('condition') }}</label>
              <select v-model="form.condition">
                <option value="new">{{ langStore.t('new') }}</option>
                <option value="used">{{ langStore.t('used') }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ langStore.t('warranty') }}</label>
              <input type="number" v-model.number="form.warranty" placeholder="0" />
            </div>
          </div>
        </div>

        <div v-if="langStore.businessMode === 'medical'" class="mode-fields">
          <div class="input-group">
            <label>{{ langStore.t('dosage') }}</label>
            <input v-model="form.dosage" placeholder="e.g. 500mg" />
          </div>
          <div class="input-group">
            <label>{{ langStore.t('instructions') }}</label>
            <input v-model="form.instructions" placeholder="e.g. 1-0-1" />
          </div>
        </div>

        <div v-if="langStore.businessMode === 'restaurant'" class="mode-fields">
           <div class="form-row">
            <div class="input-group">
              <label>{{ langStore.t('tableNumber') }}</label>
              <input v-model="form.tableNumber" placeholder="e.g. 5" />
            </div>
            <div class="input-group">
              <label>{{ langStore.t('orderType') }}</label>
              <select v-model="form.orderType">
                <option value="dine-in">{{ langStore.t('dineIn') }}</option>
                <option value="takeaway">{{ langStore.t('takeaway') }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-row mt-1">
          <div class="input-group flex-2">
            <label>{{ langStore.businessMode === 'service' ? langStore.t('hours') : langStore.t('quantity') }}</label>
            <input type="number" v-model.number="form.quantity" required min="1" />
          </div>
          <div v-if="langStore.businessMode !== 'service'" class="input-group flex-1">
            <label>{{ langStore.t('unit') }}</label>
            <input v-model="form.unit" required placeholder="pcs" />
          </div>
        </div>

        <div class="input-group mt-1">
          <label>{{ langStore.businessMode === 'service' ? langStore.t('rate') : langStore.t('price') }} ({{ langStore.currency }})</label>
          <input type="number" step="0.01" v-model.number="form.price" required min="0" />
        </div>
      </section>

      <div class="summary-card">
        <span class="summary-label">{{ langStore.t('total') }}</span>
        <span class="summary-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="isProcessing">
          <span v-if="isProcessing">{{ langStore.t('processing') }}</span>
          <span v-else>{{ langStore.t('save') }}</span>
        </button>
        <button type="button" @click="$router.push('/')" class="btn-cancel" :disabled="isProcessing">
          {{ langStore.t('cancel') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { invoiceStore } from '@/store/invoiceStore'
import { langStore } from '@/store/languageStore'
import { generateInvoicePDF } from '@/utils/pdfGenerator'

const props = defineProps({
  invoice: { type: Object, default: null }
})

const router = useRouter()
const isEdit = computed(() => !!props.invoice)
const isProcessing = ref(false)
const showSuccess = ref(false)

const form = reactive({
  clientName: '',
  itemName: '',
  quantity: 1,
  unit: 'pcs',
  price: 0,
  displayDuration: 1440,
  dosage: '',
  instructions: '',
  tableNumber: '',
  waiterName: '',
  orderType: 'dine-in',
  condition: 'new',
  warranty: 0,
  mode: langStore.businessMode
})

const totalAmount = computed(() => (form.quantity || 0) * (form.price || 0))

onMounted(() => {
  if (props.invoice) { Object.assign(form, props.invoice) }
})

const handleSubmit = async () => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  const data = { ...form, mode: langStore.businessMode, currency: langStore.currency }
  
  try {
    if (isEdit.value) {
      await invoiceStore.updateInvoice({ ...props.invoice, ...data })
      router.push('/')
    } else {
      // 1. Save the invoice and WAIT for it to finish
      const addedInvoice = await invoiceStore.addInvoice(data)
      
      // 2. Show Success Overlay
      showSuccess.value = true
      
      // 3. Generate PDF with the REAL data
      setTimeout(() => {
        generateInvoicePDF(addedInvoice, langStore.t)
        
        // 4. Redirect after a brief delay
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }, 500)
    }
  } catch (error) {
    console.error("Failed to save invoice:", error)
    alert("Error saving invoice. Please try again.")
  } finally {
    if (isEdit.value) isProcessing.value = false
  }
}
</script>

<style scoped>
.invoice-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 2rem;
  position: relative;
}

/* Success Overlay */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.success-card {
  background: var(--color-surface);
  padding: 3rem 2rem;
  border-radius: 24px;
  text-align: center;
  border: 1px solid rgba(34, 197, 94, 0.2);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  max-width: 300px;
  width: 90%;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

.success-card h3 { color: #fff; margin: 0 0 0.5rem 0; font-size: 1.25rem; }
.success-card p { color: var(--color-text-secondary); margin: 0; font-size: 0.9rem; }

.form-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
}

.form-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
}

.form-icon-container.medical { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.form-icon-container.service { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.form-icon-container.restaurant { color: #f97316; background: rgba(249, 115, 22, 0.1); }
.form-icon-container.hardware { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.form-section {
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper input, .input-group input, .input-group select {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-wrapper input:focus, .input-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.form-row {
  display: flex;
  gap: 12px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.mode-fields {
  margin-top: 12px;
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.05);
}

.summary-card {
  background: var(--color-surface);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  border: 1px solid rgba(255,255,255,0.05);
}

.summary-label { color: var(--color-text-secondary); font-weight: 600; }
.summary-value { font-size: 1.5rem; font-weight: 800; color: #fff; }

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-save {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-cancel {
  background: rgba(255,255,255,0.05);
  color: var(--color-text-secondary);
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
}

.mt-1 { margin-top: 12px; }
.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

/* Pop animation */
.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { animation: pop-in 0.3s reverse ease-in; }
@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 480px) {
  .invoice-form-container {
    padding: 0.5rem;
  }
}
</style>
