import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import AppDashboard from '../views/AppDashboard.vue'
import DashboardWalletInfo from '../views/DashboardWalletInfo.vue'
import AppCoins from '../views/AppCoins.vue'
import AppWithdraw from '../views/AppWithdraw.vue'
import AppOrderbooks from '../views/AppOrderbooks.vue'
import AppHistory from '../views/AppHistory.vue'
import AppSettings from '../views/AppSettings.vue'
import AppBinance from '../views/AppBinance.vue'
import AppPaprika from '../views/AppPaprika.vue'
import AppHome from '../views/AppHome.vue'
import AppTraderView from '../views/traderview/AppTraderView.vue'
import RecentSwaps from '../views/RecentSwaps.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
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
    {
      path: '/coins',
      name: 'Coins',
      component: AppCoins
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      component: AppWithdraw
    },
    {
      path: '/orderbooks',
      name: 'Orderbooks',
      component: AppOrderbooks
    },
    {
      path: '/completedswaps',
      name: 'History',
      component: AppHistory
    },
    {
      path: '/settings',
      name: 'Settings',
      component: AppSettings
    },
    {
      path: '/cexprices',
      name: 'Binance',
      component: AppBinance
    },
    {
      path: '/aggregatorprices',
      name: 'Paprika',
      component: AppPaprika
    },
    {
      path: '/api',
      name: 'Api',
      component: AppHome
    },
    {
      path: '/help',
      name: 'Help',
      component: AppHome
    },
    {
      path: '/recentswaps',
      name: 'RecentSwaps',
      component: RecentSwaps
    },
    {
      path: '/traderview/:base/:rel',
      name: 'Traderview',
      component: AppTraderView
    }
  ]
})

export default router
