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
      <section class="form-section">
        <label class="field-label">{{ langStore.t('clientName') }}</label>
        <div class="input-wrapper">
          <input v-model="form.clientName" required :placeholder="langStore.t('clientName')" />
        </div>
      </section>

      <section class="form-section">
        <label class="field-label">Items</label>
        <div v-for="(item, index) in form.items" :key="index" class="item-row rounded-card">
          <div class="form-row">
            <div class="input-group flex-2">
              <input v-model="item.name" required placeholder="Item name" />
            </div>
            <div class="input-group flex-1">
              <input type="number" v-model.number="item.quantity" required min="1" placeholder="Qty" />
            </div>
            <div class="input-group flex-1">
              <input type="number" v-model.number="item.price" required min="0" placeholder="Price" />
            </div>
            <button type="button" class="btn-remove" @click="removeItem(index)" v-if="form.items.length > 1">×</button>
          </div>
        </div>
        <button type="button" class="btn-add" @click="addItem">+ Add Item</button>
      </section>

      <div class="summary-card">
        <span class="summary-label">{{ langStore.t('total') }}</span>
        <span class="summary-value">{{ langStore.currency }} {{ totalAmount.toLocaleString() }}</span>
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
  items: [{ name: '', quantity: 1, price: 0 }]
})

const addItem = () => form.items.push({ name: '', quantity: 1, price: 0 })
const removeItem = (index) => form.items.splice(index, 1)

const totalAmount = computed(() => 
  form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
)

onMounted(() => {
  if (props.invoice) { 
    // Migrate old invoices to new items structure if needed
    if (props.invoice.itemName) {
      form.clientName = props.invoice.clientName
      form.items = [{ name: props.invoice.itemName, quantity: props.invoice.quantity, price: props.invoice.price }]
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
        setTimeout(() => router.push('/'), 1500)
      }, 500)
    }
  } catch (error) {
    console.error(error)
    alert("Error saving invoice.")
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.invoice-form-container { max-width: 600px; margin: 0 auto; padding: 1rem; }
.form-header { margin-bottom: 2rem; }
.form-section { margin-bottom: 1.5rem; }
.field-label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 8px; text-transform: uppercase; }
.input-wrapper input { width: 100%; background: var(--color-surface); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 14px; border-radius: 12px; }
.item-row { padding: 15px; margin-bottom: 10px; background: rgba(255,255,255,0.03); }
.form-row { display: flex; gap: 10px; align-items: center; }
.input-group input { width: 100%; background: var(--color-surface); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px; border-radius: 8px; }
.btn-remove { background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; }
.btn-add { background: var(--color-primary); color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; margin-top: 10px; }
.summary-card { background: var(--color-surface); padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; margin: 2rem 0; border: 1px solid rgba(255,255,255,0.05); }
.summary-value { font-size: 1.5rem; font-weight: 800; color: #fff; }
.form-actions { display: flex; flex-direction: column; gap: 12px; }
.btn-save { background: var(--color-primary); color: #fff; border: none; padding: 16px; border-radius: 14px; font-weight: 700; cursor: pointer; }
.btn-cancel { background: rgba(255,255,255,0.05); color: var(--color-text-secondary); border: none; padding: 14px; border-radius: 14px; cursor: pointer; }
</style>
