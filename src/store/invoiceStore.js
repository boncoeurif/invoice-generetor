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
  where,
  orderBy
} from 'firebase/firestore'

export const invoiceStore = reactive({
  invoices: [],
  deletedInvoices: [],
  isLoading: true,
  isInitialized: false,
  unsubscribe: null,

  // Initialize and sync with Firestore
  init() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    
    if (!authStore.user) {
      console.log("InvoiceStore: No user, clearing data.")
      this.invoices = []
      this.deletedInvoices = []
      this.isLoading = false
      this.isInitialized = false
      return
    }

    console.log("InvoiceStore: Initializing for user", authStore.user.uid)
    this.isLoading = true

    // Use a simpler query first to ensure it works
    const q = query(
      collection(db, "invoices"), 
      where("userId", "==", authStore.user.uid)
    )
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("InvoiceStore: Received snapshot, docs count:", snapshot.docs.length)
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Update reactive arrays
      this.invoices = allData.filter(inv => !inv.isDeleted)
      this.deletedInvoices = allData.filter(inv => inv.isDeleted)
      
      this.isLoading = false
      this.isInitialized = true
    }, (error) => {
      console.error("InvoiceStore: Firestore snapshot error:", error)
      this.isLoading = false
    })
  },

  async addInvoice(invoice) {
    if (!authStore.user) throw new Error("User not authenticated")
    
    const now = Date.now()
    const newInvoice = {
      ...invoice,
      userId: authStore.user.uid,
      createdAt: now,
      isDeleted: false,
      date: new Date().toLocaleDateString('en-GB'), // Use consistent format
      total: Number(invoice.quantity || 0) * Number(invoice.price || 0)
    }
    
    console.log("InvoiceStore: Adding invoice", newInvoice)
    const docRef = await addDoc(collection(db, "invoices"), newInvoice)
    console.log("InvoiceStore: Invoice added with ID", docRef.id)
    
    return { id: docRef.id, ...newInvoice }
  },

  async updateInvoice(updatedInvoice) {
    const { id, ...data } = updatedInvoice
    const docRef = doc(db, "invoices", id)
    data.total = Number(data.quantity || 0) * Number(data.price || 0)
    await updateDoc(docRef, data)
  },

  async deleteInvoice(id) {
    const docRef = doc(db, "invoices", id)
    await updateDoc(docRef, { 
      isDeleted: true,
      deletedAt: Date.now() 
    })
  },

  async restoreInvoice(id) {
    const docRef = doc(db, "invoices", id)
    await updateDoc(docRef, { 
      isDeleted: false, 
      deletedAt: null 
    })
  },

  async permanentlyDeleteInvoice(id) {
    const docRef = doc(db, "invoices", id)
    await deleteDoc(docRef)
  },

  cleanupDeletedInvoices() {
    // Keep it for App.vue call
  }
})

// Re-initialize store when user changes
watch(() => authStore.user, (user) => {
  invoiceStore.init()
}, { immediate: true })

// Helper computed properties
export const allInvoices = computed(() => {
  return [...invoiceStore.invoices].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})
