<template>
  <v-container>
    <v-card style="margin-top: 100px;">
      <v-tabs v-model="activeTab" fixed-tabs>
        <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
          {{ tab.label }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <component :is="tab.component" />
        </v-window-item>
      </v-window>
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
      activeTab: 'verus-staking',
      tabs: [
        { label: 'Verus Staking', value: 'verus-staking', component: 'VerusStaking' },
        { label: "Verus ID's", value: 'verus-ids', component: 'VerusId' },
        { label: 'Verus Currencies', value: 'verus-currencies', component: 'VerusCurrencies' },
      ],
    };
  },
};
</script>
