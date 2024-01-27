<template>
    <v-container>
      <v-card style="margin-top: 100px;">
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab value="verus-staking">Verus Staking</v-tab>
          <v-tab value="verus-ids">Verus ID's</v-tab>
          <v-tab value="verus-currencies">Verus Currencies</v-tab>
        </v-tabs>
        
        <v-tab-item v-if="activeTab === 'verus-staking'">
          <VerusStaking/>
        </v-tab-item>
        
        <v-tab-item v-if="activeTab === 'verus-ids'">
          <VerusId/>
        </v-tab-item>
        
        <v-tab-item v-if="activeTab === 'verus-currencies'">
          <VerusCurrencies/>
        </v-tab-item>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import VerusCurrencies from './verus/VerusCurrencies.vue';
  import VerusStaking from './verus/VerusStaking.vue';
  import VerusId from './verus/VerusId.vue';
  
  export default {
    name: 'Verus',
    components: { VerusCurrencies, VerusStaking, VerusId },
    data() {
      return {
        activeTab: 'verus-staking', // Set the default active tab here
      };
    },
  };
  </script>
  