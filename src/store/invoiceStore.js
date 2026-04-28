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
    })
  },

  async addInvoice(invoice) {
    if (!authStore.user) throw new Error("Not authenticated")
    const newInvoice = {
      ...invoice,
      userId: authStore.user.uid,
      createdAt: Date.now(),
      isDeleted: false,
      date: new Date().toLocaleDateString('en-GB')
    }
    const docRef = await addDoc(collection(db, "invoices"), newInvoice)
    return { id: docRef.id, ...newInvoice }
  },

  async updateInvoice(updatedInvoice) {
    const { id, ...data } = updatedInvoice
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
