<template>
  <div class="invoice-form-container">
    <div class="form-header">
      <h2>{{ isEdit ? langStore.t('editInvoice') : langStore.t('createInvoice') }}</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="styled-form">
      <section class="form-section">
        <label class="field-label">{{ langStore.t('clientName') }}</label>
        <div class="input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <input v-model="form.clientName" required :placeholder="langStore.t('clientName')" />
        </div>
      </section>

      <section class="items-section">
        <div class="items-header">
          <span>{{ langStore.t('items') || 'Item Details' }}</span>
        </div>

        <div v-for="(item, index) in form.items" :key="index" class="item-card">
          <div class="item-card-header">
            <span class="item-number">Item #{{ index + 1 }}</span>
            <button type="button" class="btn-remove" @click="removeItem(index)" v-if="form.items.length > 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Remove
            </button>
          </div>
          
          <div class="item-grid">
            <div class="input-group description">
              <label>Description</label>
              <input v-model="item.name" required placeholder="e.g. Website Design" />
            </div>

            <div class="input-group qty">
              <label>Qty</label>
              <input type="number" v-model.number="item.quantity" required min="1" placeholder="1" />
            </div>

            <div class="input-group unit">
              <label>Unit</label>
              <input v-model="item.unit" required placeholder="pcs" />
            </div>

            <div class="input-group price">
              <label>Price ({{ langStore.currency }})</label>
              <input type="number" v-model.number="item.price" required min="0" step="0.01" placeholder="0.00" />
            </div>
          </div>
        </div>

        <button type="button" class="btn-add" @click="addItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Another Item
        </button>
      </section>

      <div class="summary-card-footer">
        <div class="summary-row total-row">
          <span class="summary-label">{{ langStore.t('total') }}</span>
          <span class="summary-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="isProcessing">
          <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          {{ isProcessing ? langStore.t('processing') : langStore.t('save') }}
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
  items: [{ name: '', quantity: 1, unit: 'pcs', price: 0 }]
})

const addItem = () => form.items.push({ name: '', quantity: 1, unit: 'pcs', price: 0 })
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
  const data = { ...form, total: totalAmount.value, mode: langStore.businessMode, currency: langStore.currency }
  try {
    if (isEdit.value) {
      await invoiceStore.updateInvoice({ ...props.invoice, ...data })
      router.push('/')
    } else {
      const addedInvoice = await invoiceStore.addInvoice(data)
      showSuccess.value = true
      setTimeout(() => {
        generateInvoicePDF(addedInvoice, langStore.t)
        setTimeout(() => router.push('/'), 1500)
      }, 500)
    }
  } catch (error) {
    alert("Error saving invoice.")
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.invoice-form-container { max-width: 800px; margin: 0 auto; padding: 20px 15px; padding-bottom: 100px; }
.form-header h2 { color: #fff; font-size: 1.75rem; margin-bottom: 2rem; }

.form-section { margin-bottom: 24px; }
.field-label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--color-text-secondary); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 16px; color: var(--color-text-secondary); pointer-events: none; }
.input-wrapper input { 
  width: 100%; 
  background: var(--color-surface); 
  border: 1px solid rgba(255,255,255,0.1); 
  color: #fff; 
  padding: 14px 14px 14px 48px; 
  border-radius: 14px; 
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input-wrapper input:focus { border-color: var(--color-primary); outline: none; }

.items-section { display: flex; flex-direction: column; gap: 20px; margin-top: 2rem; }
.items-header { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
.items-header span { font-size: 0.8rem; font-weight: 800; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

.item-card { 
  background: rgba(255,255,255,0.02); 
  padding: 24px; 
  border-radius: 20px; 
  border: 1px solid rgba(255,255,255,0.05); 
  transition: all 0.2s;
}
.item-card:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); }

.item-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.item-number { font-weight: 800; color: var(--color-primary); font-size: 0.9rem; }

.btn-remove { 
  background: rgba(239, 68, 68, 0.1); 
  color: #ef4444; 
  border: 1px solid rgba(239, 68, 68, 0.2); 
  font-size: 0.75rem; 
  font-weight: 700; 
  cursor: pointer; 
  padding: 6px 12px; 
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.btn-remove:hover { background: rgba(239, 68, 68, 0.2); }

.item-grid { 
  display: grid; 
  grid-template-columns: 2fr 0.6fr 0.6fr 1fr; 
  gap: 16px; 
}

@media (max-width: 600px) {
  .item-grid { grid-template-columns: 1fr 1fr; }
  .description { grid-column: span 2; }
}

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 0.7rem; color: var(--color-text-secondary); font-weight: 700; text-transform: uppercase; }
.input-group input { 
  width: 100%; 
  background: rgba(0,0,0,0.2); 
  border: 1px solid rgba(255,255,255,0.1); 
  color: #fff; 
  padding: 12px; 
  border-radius: 10px; 
  font-size: 0.95rem;
}
.input-group input:focus { border-color: var(--color-primary); outline: none; }

.btn-add { 
  background: rgba(34, 197, 94, 0.1); 
  color: var(--color-primary); 
  border: 1px dashed var(--color-primary); 
  padding: 16px; 
  border-radius: 16px; 
  font-weight: 700; 
  cursor: pointer; 
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
}
.btn-add:hover { background: rgba(34, 197, 94, 0.15); transform: translateY(-2px); }

.summary-card-footer { 
  background: var(--color-surface); 
  padding: 24px; 
  border-radius: 20px; 
  margin: 32px 0; 
  border: 1px solid rgba(34, 197, 94, 0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.summary-row { display: flex; justify-content: space-between; align-items: center; }
.summary-label { color: var(--color-text-secondary); font-weight: 700; text-transform: uppercase; font-size: 0.9rem; }
.summary-value { font-weight: 900; font-size: 1.75rem; color: #fff; }

.form-actions { display: flex; flex-direction: column; gap: 12px; }
.btn-save { 
  background: var(--color-primary); 
  color: #fff; 
  border: none; 
  padding: 18px; 
  border-radius: 16px; 
  font-weight: 800; 
  cursor: pointer; 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  transition: all 0.2s;
}
.btn-save:hover { transform: translateY(-2px); filter: brightness(1.1); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-cancel { 
  background: rgba(255,255,255,0.05); 
  color: var(--color-text-secondary); 
  border: none; 
  padding: 16px; 
  border-radius: 16px; 
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.1); color: #fff; }
</style>
