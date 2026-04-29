import { reactive } from 'vue'
import { auth, googleProvider } from '@/utils/firebase'
import { signInWithPopup, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth'
import router from '@/router'

export const authStore = reactive({
  user: null,
  isInitialized: false,
  initPromise: null,

  async loginWithGoogle() {
    try {
      console.log("Attempting Google Login...")
      // Ensure persistence is set before login
      await setPersistence(auth, browserLocalPersistence)
      const result = await signInWithPopup(auth, googleProvider)
      this.user = result.user
      console.log("Login successful:", this.user.displayName)
      router.push('/dashboard')
    } catch (error) {
      console.error("Login failed detailed error:", error)
      
      if (error.code === 'auth/operation-not-allowed') {
        alert("Google sign-in is not enabled in your Firebase Console. Please go to Authentication > Sign-in method and enable Google.")
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized. Please add 'localhost' to your Authorized Domains in the Firebase Console (Authentication > Settings).")
      } else if (error.code === 'auth/popup-blocked') {
        alert("Sign-in popup was blocked by your browser. Please allow popups for this site.")
      } else {
        alert(`Login failed: ${error.message}`)
      }
    }
  },

  async logout() {
    try {
      await signOut(auth)
      this.user = null
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
})

// Initialize Auth
authStore.initPromise = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    authStore.user = user
    authStore.isInitialized = true
    console.log("Auth State Changed. User:", user ? user.displayName : "Logged Out")
    resolve(user)
  })
})
