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
          <span>{{ langStore.t('itemDetails') }}</span>
        </div>

        <div v-for="(item, index) in form.items" :key="index" class="item-card">
          <div class="item-card-header">
            <span class="item-number">{{ langStore.t('item') }} #{{ index + 1 }}</span>
            <button type="button" class="btn-remove" @click="removeItem(index)" v-if="form.items.length > 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              {{ langStore.t('remove') }}
            </button>
          </div>
          
          <div class="item-grid">
            <div class="input-group description">
              <label>{{ langStore.t('description') }}</label>
              <input v-model="item.name" required placeholder="e.g. Website Design" />
            </div>

            <div class="input-group qty">
              <label>{{ langStore.t('qty') }}</label>
              <input type="number" v-model.number="item.quantity" required min="1" placeholder="1" />
            </div>

            <div class="input-group unit">
              <label>{{ langStore.t('unit') }}</label>
              <input v-model="item.unit" required placeholder="pcs" />
            </div>

            <div class="input-group price">
              <label>{{ langStore.t('price') }} ({{ langStore.currency }})</label>
              <input type="number" v-model.number="item.price" required min="0" step="0.01" placeholder="0.00" />
            </div>
          </div>
        </div>

        <button type="button" class="btn-add" @click="addItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {{ langStore.t('addItem') }}
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
          <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
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

import { notificationStore } from '@/store/notificationStore'

const handleSubmit = async () => {
  if (isProcessing.value) return
  isProcessing.value = true
  const data = { ...form, total: totalAmount.value, mode: langStore.businessMode, currency: langStore.currency }
  try {
    if (isEdit.value) {
      await invoiceStore.updateInvoice({ ...props.invoice, ...data })
      notificationStore.success(langStore.t('invoiceUpdated') || 'Invoice updated successfully!')
      router.push('/')
    } else {
      const addedInvoice = await invoiceStore.addInvoice(data)
      notificationStore.success(langStore.t('invoiceCreated') || 'Invoice created successfully!')
      setTimeout(() => {
        generateInvoicePDF(addedInvoice, langStore.t)
        setTimeout(() => router.push('/'), 1500)
      }, 500)
    }
  } catch (error) {
    notificationStore.error(langStore.t('errorSaving') || 'Error saving invoice.')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.invoice-form-container { max-width: 900px; margin: 0 auto; padding: 30px 20px; padding-bottom: 120px; }
.form-header h2 { color: #fff; font-size: 2.25rem; margin-bottom: 2.5rem; font-weight: 900; }

.form-section { margin-bottom: 32px; }
.field-label { display: block; font-size: 0.9rem; font-weight: 800; color: var(--color-text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 20px; color: var(--color-text-secondary); pointer-events: none; width: 22px; height: 22px; }
.input-wrapper input { 
  width: 100%; 
  background: var(--color-surface); 
  border: 2px solid rgba(255,255,255,0.08); 
  color: #fff; 
  padding: 18px 20px 18px 56px; 
  border-radius: 18px; 
  font-size: 1.15rem;
  font-weight: 600;
  transition: all 0.3s;
}
.input-wrapper input:focus { border-color: var(--color-primary); outline: none; background: rgba(34, 197, 94, 0.03); box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.1); }

.items-section { display: flex; flex-direction: column; gap: 28px; margin-top: 3rem; }
.items-header { border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
.items-header span { font-size: 1rem; font-weight: 900; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.1em; }

.item-card { 
  background: rgba(255,255,255,0.03); 
  padding: 32px; 
  border-radius: 28px; 
  border: 1px solid rgba(255,255,255,0.05); 
  transition: all 0.3s;
}
.item-card:hover { border-color: rgba(34, 197, 94, 0.2); background: rgba(255,255,255,0.05); }

.item-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.item-number { font-weight: 900; color: var(--color-primary); font-size: 1.1rem; }

.btn-remove { 
  background: rgba(239, 68, 68, 0.08); 
  color: #ef4444; 
  border: 1px solid rgba(239, 68, 68, 0.15); 
  font-size: 0.85rem; 
  font-weight: 800; 
  cursor: pointer; 
  padding: 8px 16px; 
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-remove:hover { background: rgba(239, 68, 68, 0.15); transform: scale(1.05); }

.item-grid { 
  display: grid; 
  grid-template-columns: 2.5fr 0.8fr 0.8fr 1.2fr; 
  gap: 20px; 
}

@media (max-width: 768px) {
  .invoice-form-container { padding: 15px 6px; width: 100%; }
  .item-card { padding: 16px 12px; border-radius: 16px; margin-bottom: 5px; }

  .item-grid { 
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .description, .qty, .unit, .price { grid-column: auto; }
  
  /* Force larger inputs on mobile */
  .input-wrapper input, .input-group input {
    font-size: 1.25rem !important; /* Even larger font */
    padding: 18px !important;
    height: 65px !important;
    width: 100% !important;
  }
  
  .input-wrapper .input-icon {
    left: 16px;
  }
  
  .input-wrapper input {
    padding-left: 54px !important;
  }

  .field-label {
    font-size: 0.85rem;
  }
}

.input-group { display: flex; flex-direction: column; gap: 10px; }
.input-group label { font-size: 0.8rem; color: var(--color-text-secondary); font-weight: 800; text-transform: uppercase; }
.input-group input { 
  width: 100%; 
  background: rgba(0,0,0,0.25); 
  border: 1.5px solid rgba(255,255,255,0.1); 
  color: #fff; 
  padding: 16px; 
  border-radius: 14px; 
  font-size: 1.1rem;
  font-weight: 600;
  transition: border-color 0.2s;
}
.input-group input:focus { border-color: var(--color-primary); outline: none; }

.btn-add { 
  background: rgba(34, 197, 94, 0.1); 
  color: var(--color-primary); 
  border: 2px dashed rgba(34, 197, 94, 0.4); 
  padding: 20px; 
  border-radius: 20px; 
  font-weight: 800; 
  cursor: pointer; 
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.1rem;
  transition: all 0.3s;
}
.btn-add:hover { background: rgba(34, 197, 94, 0.15); border-color: var(--color-primary); transform: translateY(-3px); }

.summary-card-footer { 
  background: var(--color-surface); 
  padding: 32px; 
  border-radius: 28px; 
  margin: 40px 0; 
  border: 2px solid rgba(34, 197, 94, 0.25);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}
.summary-row { display: flex; justify-content: space-between; align-items: center; }
.summary-label { color: var(--color-text-secondary); font-weight: 800; text-transform: uppercase; font-size: 1rem; }
.summary-value { font-weight: 900; font-size: 2.25rem; color: #fff; }

.form-actions { display: flex; flex-direction: column; gap: 15px; }
.btn-save { 
  background: var(--color-primary); 
  color: #fff; 
  border: none; 
  padding: 22px; 
  border-radius: 20px; 
  font-weight: 900; 
  cursor: pointer; 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 1.25rem;
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
  transition: all 0.3s;
}
.btn-save:hover { transform: translateY(-4px); filter: brightness(1.1); box-shadow: 0 12px 30px rgba(34, 197, 94, 0.5); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-cancel { 
  background: rgba(255,255,255,0.05); 
  color: var(--color-text-secondary); 
  border: 1px solid rgba(255,255,255,0.08); 
  padding: 18px; 
  border-radius: 18px; 
  cursor: pointer;
  font-weight: 800;
  font-size: 1rem;
  transition: all 0.2s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
</style>
