<template>
  <div class="invoice-form-container">
    <div class="form-header">
      <h2>{{ isEdit ? langStore.t('editInvoice') : langStore.t('createInvoice') }}</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="styled-form">
      <section class="form-section">
        <label class="field-label">{{ langStore.t('clientName') }}</label>
        <div class="input-wrapper">
          <input v-model="form.clientName" required :placeholder="langStore.t('clientName')" />
        </div>
      </section>

      <section class="items-section">
        <div class="items-header">
          <span>Item Details</span>
        </div>

        <div v-for="(item, index) in form.items" :key="index" class="item-card">
          <div class="item-card-header">
            <span class="item-number">Item #{{ index + 1 }}</span>
            <button type="button" class="btn-remove" @click="removeItem(index)" v-if="form.items.length > 1">Remove</button>
          </div>
          
          <div class="input-group">
            <label>Description</label>
            <input v-model="item.name" required placeholder="e.g. Website Design" />
          </div>

          <div class="form-row">
            <div class="input-group">
              <label>Qty</label>
              <input type="number" v-model.number="item.quantity" required min="1" placeholder="1" />
            </div>
            <div class="input-group">
              <label>Unit</label>
              <input v-model="item.unit" required placeholder="pcs" />
            </div>
          </div>

          <div class="input-group">
            <label>Price ({{ langStore.currency }})</label>
            <input type="number" v-model.number="item.price" required min="0" step="0.01" placeholder="0.00" />
          </div>
        </div>

        <button type="button" class="btn-add" @click="addItem">+ Add Another Item</button>
      </section>

      <div class="summary-card">
        <div class="summary-row total-row">
          <span class="summary-label">{{ langStore.t('total') }}</span>
          <span class="summary-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="isProcessing">
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
.invoice-form-container { max-width: 500px; margin: 0 auto; padding: 20px 15px; }
.form-header h2 { color: #fff; font-size: 1.5rem; margin-bottom: 1.5rem; }
.field-label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--color-text-secondary); margin-bottom: 8px; text-transform: uppercase; }
.input-wrapper input { width: 100%; background: var(--color-surface); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 14px; border-radius: 12px; }

.items-section { display: flex; flex-direction: column; gap: 15px; margin-top: 1rem; }
.items-header span { font-size: 0.75rem; font-weight: 800; color: var(--color-text-secondary); text-transform: uppercase; }

.item-card { background: var(--color-surface); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
.item-card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.item-number { font-weight: 800; color: var(--color-primary); }

.input-group { margin-bottom: 10px; }
.input-group label { display: block; font-size: 0.7rem; color: var(--color-text-secondary); margin-bottom: 4px; }
.input-group input { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px; border-radius: 10px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn-remove { background: none; color: #ef4444; border: none; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
.btn-add { background: var(--color-primary); color: #fff; border: none; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 10px; }

.summary-card { background: var(--color-surface); padding: 20px; border-radius: 16px; margin: 2rem 0; border: 1px solid var(--color-primary); }
.summary-row { display: flex; justify-content: space-between; font-weight: 800; font-size: 1.2rem; color: #fff; }

.form-actions { display: flex; flex-direction: column; gap: 10px; }
.btn-save { background: var(--color-primary); color: #fff; border: none; padding: 16px; border-radius: 14px; font-weight: 700; cursor: pointer; }
.btn-cancel { background: rgba(255,255,255,0.05); color: var(--color-text-secondary); border: none; padding: 16px; border-radius: 14px; cursor: pointer; }
</style>
