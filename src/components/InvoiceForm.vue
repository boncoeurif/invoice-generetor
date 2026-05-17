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
.form-header h2 { color: var(--text-primary); font-size: 2rem; margin-bottom: 2.5rem; font-weight: 900; }

.form-section { margin-bottom: 32px; }
.field-label { display: block; font-size: 0.8rem; font-weight: 800; color: var(--text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 20px; color: var(--text-secondary); pointer-events: none; width: 20px; height: 20px; }
.input-wrapper input { 
  width: 100%; 
  background: var(--surface-white); 
  border: 1.5px solid var(--border-color); 
  color: var(--text-primary); 
  padding: 16px 20px 16px 56px; 
  border-radius: 16px; 
  font-size: 1.05rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.input-wrapper input:focus { border-color: var(--primary-green); outline: none; background: #fff; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1); }

.items-section { display: flex; flex-direction: column; gap: 24px; margin-top: 3rem; }
.items-header { border-bottom: 2px solid var(--border-color); padding-bottom: 15px; }
.items-header span { font-size: 0.9rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; }

.item-card { 
  background: var(--surface-white); 
  padding: 24px; 
  border-radius: 20px; 
  border: 1px solid var(--border-color); 
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.item-card:hover { border-color: var(--primary-green); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.item-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.item-number { font-weight: 800; color: var(--primary-green); font-size: 1rem; }

.btn-remove { 
  background: #fff; 
  color: #ef4444; 
  border: 1px solid #fee2e2; 
  font-size: 0.75rem; 
  font-weight: 800; 
  cursor: pointer; 
  padding: 8px 14px; 
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.btn-remove:hover { background: #fef2f2; transform: translateY(-1px); }

.item-grid { 
  display: grid; 
  grid-template-columns: 2.5fr 0.8fr 0.8fr 1.2fr; 
  gap: 16px; 
}

@media (max-width: 768px) {
  .invoice-form-container { padding: 15px 6px; width: 100%; }
  .item-card { padding: 16px; border-radius: 16px; }

  .item-grid { 
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 0.75rem; color: var(--text-secondary); font-weight: 800; text-transform: uppercase; }
.input-group input { 
  width: 100%; 
  background: #fff; 
  border: 1.5px solid var(--border-color); 
  color: var(--text-primary); 
  padding: 14px; 
  border-radius: 12px; 
  font-size: 1rem;
  font-weight: 600;
  transition: border-color 0.2s;
}
.input-group input:focus { border-color: var(--primary-green); outline: none; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1); }

.btn-add { 
  background: #fff; 
  color: var(--primary-green); 
  border: 2px dashed var(--border-color); 
  padding: 18px; 
  border-radius: 16px; 
  font-weight: 800; 
  cursor: pointer; 
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  transition: all 0.2s;
}
.btn-add:hover { border-color: var(--primary-green); background: #f0fdf4; transform: translateY(-2px); }

.summary-card-footer { 
  background: var(--surface-white); 
  padding: 28px; 
  border-radius: 20px; 
  margin: 40px 0; 
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}
.summary-row { display: flex; justify-content: space-between; align-items: center; }
.summary-label { color: var(--text-secondary); font-weight: 800; text-transform: uppercase; font-size: 0.9rem; }
.summary-value { font-weight: 900; font-size: 2rem; color: var(--text-primary); }

.form-actions { display: flex; flex-direction: column; gap: 12px; }
.btn-save { 
  background: var(--primary-green); 
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
  font-size: 1.15rem;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
  transition: all 0.2s;
}
.btn-save:hover { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-cancel { 
  background: #fff; 
  color: var(--text-secondary); 
  border: 1px solid var(--border-color); 
  padding: 16px; 
  border-radius: 16px; 
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.2s;
}
.btn-cancel:hover { background: #f8fafc; color: var(--text-primary); border-color: var(--text-secondary); }
</style>
