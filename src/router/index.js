import { createRouter, createWebHistory } from 'vue-router'
import AppDashboard from '@/AppDashboard.vue'
import DashboardWalletInfo from '../views/DashboardWalletInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
