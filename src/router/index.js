import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import CreateInvoice from '@/views/CreateInvoice.vue'
import EditInvoice from '@/views/EditInvoice.vue'
import RecycleBin from '@/views/RecycleBin.vue'
import History from '@/views/History.vue'
import Reports from '@/views/Reports.vue'
import Login from '@/views/Login.vue'
import { authStore } from '@/store/authStore'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/history', name: 'History', component: History, meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/create', name: 'CreateInvoice', component: CreateInvoice, meta: { requiresAuth: true } },
  { path: '/edit/:id', name: 'EditInvoice', component: EditInvoice, meta: { requiresAuth: true } },
  { path: '/recycle-bin', name: 'RecycleBin', component: RecycleBin, meta: { requiresAuth: true } },
  { path: '/help', name: 'Helppage', component: () => import('@/views/Helppage.vue'), meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: () => import('@/views/Settings.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Auth Guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Wait for Firebase to initialize if it hasn't yet
  if (!authStore.isInitialized) {
    await authStore.initPromise
  }

  if (requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.path === '/login' && authStore.user) {
    next('/dashboard')
  } else {
    // We REMOVED the auto-redirect from '/' to '/dashboard' 
    // so you can actually see the Home page.
    next()
  }
})

export default router
