import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import AppDashboard from '../views/AppDashboard.vue'
import DashboardWalletInfo from '../views/DashboardWalletInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: App
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: AppDashboard
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: DashboardWalletInfo
    },
  ]
})

export default router
