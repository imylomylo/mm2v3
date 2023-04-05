
<template>
   <main>
    <RouterView/>
    <DashboardWalletInfo>
    </DashboardWalletInfo>
    <AppStrategy></AppStrategy>
    <AppExport></AppExport>
    <RecentSwaps></RecentSwaps>
   </main>
</template>
<script>

import {RouterView} from "vue-router"
import DashboardWalletInfo from "./views/DashboardWalletInfo.vue"
import AppStrategy from "./views/AppStrategy.vue"
import AppExport from "./views/AppExport.vue"
import RecentSwaps from './views/RecentSwaps.vue'

export default {
  components: { 
   DashboardWalletInfo,
   AppStrategy,
   AppExport,
   RecentSwaps
 }
}
</script>