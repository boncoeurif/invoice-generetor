import { reactive, watch } from 'vue'
import { db } from '@/utils/firebase'
import { authStore } from '@/store/authStore'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'

export const profileStore = reactive({
  profile: {
    businessName: '',
    email: '',
    phone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    logoUrl: '',
    invoicePrefix: 'INV',
    currency: 'USD'
  },
  isLoading: true,
  unsubscribe: null,

  async init() {
    if (this.unsubscribe) this.unsubscribe()
    
    if (!authStore.user) {
      this.isLoading = false
      return
    }

    const docRef = doc(db, "profiles", authStore.user.uid)
    
    this.unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        this.profile = { ...this.profile, ...snapshot.data() }
      } else {
        // Set default email from auth if no profile exists
        this.profile.email = authStore.user.email
        this.profile.businessName = authStore.user.displayName || ''
      }
      this.isLoading = false
    }, (error) => {
      console.error("Firestore [profiles] Listener Error:", error.message)
      this.isLoading = false
    })
  },

  async saveProfile(updatedProfile) {
    if (!authStore.user) return
    const docRef = doc(db, "profiles", authStore.user.uid)
    await setDoc(docRef, { ...updatedProfile, updatedAt: Date.now() }, { merge: true })
  }
})

// Sync with auth state
watch(() => authStore.user, (user) => {
  profileStore.init()
}, { immediate: true })
