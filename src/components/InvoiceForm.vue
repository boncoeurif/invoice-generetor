<template>
  <div class="invoice-form-container">
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
      <h2>{{ isEdit ? langStore.t('editInvoice') : langStore.t('createInvoice') }}</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="styled-form">
      <!-- Client Section -->
      <section class="form-section">
        <label class="field-label">{{ langStore.t('clientName') }}</label>
        <div class="input-wrapper">
          <input v-model="form.clientName" required :placeholder="langStore.t('clientName')" />
        </div>
      </section>

      <!-- Items Section -->
      <section class="form-section items-section">
        <div class="items-header">
          <span class="col-name">Item Description</span>
          <span class="col-qty">Qty</span>
          <span class="col-unit">Unit</span>
          <span class="col-price">Price</span>
          <span class="col-action"></span>
        </div>

        <div v-for="(item, index) in form.items" :key="index" class="item-row">
          <div class="item-inputs">
            <div class="input-group col-name">
              <input v-model="item.name" required placeholder="e.g. Website Design" />
            </div>
            <div class="input-group col-qty">
              <input type="number" v-model.number="item.quantity" required min="1" placeholder="1" />
            </div>
            <div class="input-group col-unit">
              <input v-model="item.unit" required placeholder="pcs" />
            </div>
            <div class="input-group col-price">
              <input type="number" v-model.number="item.price" required min="0" step="0.01" :placeholder="'0.00 ' + langStore.currency" />
            </div>
            <div class="col-action">
              <button type="button" class="btn-remove" @click="removeItem(index)" v-if="form.items.length > 1" title="Remove Item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </div>

        <button type="button" class="btn-add" @click="addItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Another Item
        </button>
      </section>

      <!-- Summary Section -->
      <div class="summary-card">
        <div class="summary-row">
          <span class="summary-label">Subtotal</span>
          <span class="summary-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">{{ langStore.t('total') }}</span>
          <span class="summary-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Footer Actions -->
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
  items: [
    { name: '', quantity: 1, unit: 'pcs', price: 0 }
  ],
  mode: langStore.businessMode
})

const addItem = () => {
  form.items.push({ name: '', quantity: 1, unit: 'pcs', price: 0 })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const totalAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0)
})

onMounted(() => {
  if (props.invoice) { 
    // Migrate old invoices to new items structure if needed
    if (props.invoice.itemName) {
      form.clientName = props.invoice.clientName
      form.items = [{ 
        name: props.invoice.itemName, 
        quantity: props.invoice.quantity || 1, 
        unit: props.invoice.unit || 'pcs', 
        price: props.invoice.price || 0 
      }]
    } else {
      Object.assign(form, props.invoice)
    }
  }
})

const handleSubmit = async () => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  const data = { 
    ...form, 
    total: totalAmount.value,
    mode: langStore.businessMode, 
    currency: langStore.currency 
  }
  
  try {
    if (isEdit.value) {
      await invoiceStore.updateInvoice({ ...props.invoice, ...data })
      router.push('/')
    } else {
      const addedInvoice = await invoiceStore.addInvoice(data)
      showSuccess.value = true
      
      setTimeout(() => {
        generateInvoicePDF(addedInvoice, langStore.t)
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }, 500)
    }
  } catch (error) {
    console.error("Failed to save invoice:", error)
    alert("Error saving invoice. Please try again.")
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.invoice-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-header h2 {
  font-size: 1.75rem;
  color: #fff;
  font-weight: 800;
}

.form-section {
  margin-bottom: 2rem;
}

.field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 16px;
  border-radius: 14px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  border-color: var(--color-primary);
  background: rgba(255,255,255,0.02);
  outline: none;
}

/* Items Table Layout */
.items-section {
  background: var(--color-surface);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.05);
}

.items-header {
  display: flex;
  gap: 12px;
  padding: 0 0 12px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 15px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.item-row {
  margin-bottom: 12px;
}

.item-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.col-name { flex: 3; }
.col-qty { flex: 0 0 70px; }
.col-unit { flex: 0 0 80px; }
.col-price { flex: 1.5; }
.col-action { flex: 0 0 32px; }

.input-group input {
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.95rem;
}

.input-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.btn-remove {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #ef4444;
  color: #fff;
}

.btn-add {
  margin-top: 15px;
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-primary);
  border: 1px dashed var(--color-primary);
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-add:hover {
  background: var(--color-primary);
  color: #fff;
  border-style: solid;
}

/* Summary Card */
.summary-card {
  background: var(--color-surface);
  padding: 24px;
  border-radius: 20px;
  margin: 2rem 0;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
}

.total-row {
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.05);
  color: #fff;
}

.total-row .summary-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-primary);
}

/* Actions */
.form-actions {
  display: flex;
  gap: 15px;
}

.btn-save {
  flex: 2;
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.btn-cancel {
  flex: 1;
  background: rgba(255,255,255,0.05);
  color: var(--color-text-secondary);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
}

.mr-1 { margin-right: 8px; }

/* Responsive Mobile */
@media (max-width: 600px) {
  .items-header { display: none; }
  .item-inputs {
    flex-wrap: wrap;
    background: rgba(255,255,255,0.02);
    padding: 15px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .col-name { flex: 0 0 100%; }
  .col-qty { flex: 1; }
  .col-unit { flex: 1; }
  .col-price { flex: 2; }
  .form-actions { flex-direction: column; }
}

/* Transitions */
.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
