import { reactive, computed, watch } from 'vue'
import { db } from '@/utils/firebase'
import { authStore } from '@/store/authStore'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where
} from 'firebase/firestore'

import { notificationStore } from '@/store/notificationStore'
import { langStore } from '@/store/languageStore'

export const invoiceStore = reactive({
  invoices: [],
  deletedInvoices: [],
  isLoading: true,
  isInitialized: false,
  unsubscribe: null,

  init() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    
    if (!authStore.user) {
      this.invoices = []
      this.isLoading = false
      this.isInitialized = true
      return
    }

    const q = query(collection(db, "invoices"), where("userId", "==", authStore.user.uid))
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      this.invoices = allData.filter(inv => !inv.isDeleted)
      this.deletedInvoices = allData.filter(inv => inv.isDeleted)
      this.isLoading = false
      this.isInitialized = true

      // Perform cleanup and notifications after data loads
      this.performAutoCleanup()
    }, (error) => {
      console.error("Firestore [invoices] Listener Error:", error.message)
      this.isLoading = false
    })
  },

  async performAutoCleanup() {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
    const WARNING_MS = 6 * 24 * 60 * 60 * 1000 // 6 days
    const now = Date.now()
    
    let warningIssued = false

    for (const inv of this.deletedInvoices) {
      if (!inv.deletedAt) continue
      
      const timeInBin = now - inv.deletedAt
      
      if (timeInBin >= SEVEN_DAYS_MS) {
        console.log(`Auto-cleaning invoice: ${inv.id}`)
        await this.permanentlyDeleteInvoice(inv.id)
      } else if (timeInBin >= WARNING_MS && !warningIssued) {
        // Only show one general warning notification per session
        notificationStore.warning(langStore.t('recycleBinWarning') || 'Some invoices in the Recycle Bin will be permanently deleted soon.')
        warningIssued = true
      }
    }
  },

  async addInvoice(invoice) {
    if (!authStore.user) throw new Error("Not authenticated")
    
    // Ensure we are working with a plain object (removes Vue reactivity)
    const plainInvoice = JSON.parse(JSON.stringify(invoice))
    
    const newInvoice = {
      ...plainInvoice,
      userId: authStore.user.uid,
      createdAt: Date.now(),
      isDeleted: false,
      date: new Date().toLocaleDateString('en-GB')
    }
    
    const docRef = await addDoc(collection(db, "invoices"), newInvoice)
    return { id: docRef.id, ...newInvoice }
  },

  async updateInvoice(updatedInvoice) {
    const plainInvoice = JSON.parse(JSON.stringify(updatedInvoice))
    const { id, ...data } = plainInvoice
    if (!id) throw new Error("Missing invoice ID")
    await updateDoc(doc(db, "invoices", id), data)
  },

  async deleteInvoice(id) {
    await updateDoc(doc(db, "invoices", id), { isDeleted: true, deletedAt: Date.now() })
  },

  async restoreInvoice(id) {
    await updateDoc(doc(db, "invoices", id), { isDeleted: false, deletedAt: null })
  },

  async permanentlyDeleteInvoice(id) {
    await deleteDoc(doc(db, "invoices", id))
  }
})

// Initialize immediately, but wait for user
watch(() => authStore.user, (user) => {
  invoiceStore.init()
}, { immediate: true })
