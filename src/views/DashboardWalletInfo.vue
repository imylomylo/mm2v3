<template>
<v-main>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>
        <span class="subheading">Wallets</span>
      </v-toolbar-title>
      <span class="ma-5 mt-11"><v-checkbox v-model="hideZero" :disabled="hideZeroDisable" label="Hide Zero Balance" ></v-checkbox></span>
      <v-chip
        class="ma-2"
        :disabled="hideZeroDisable"
        outlined
        @click="updateBalances()"
      >
        <v-icon left>mdi-server-plus</v-icon>
        <template v-if="hideZeroDisable">Loading {{allwallets.length}} Wallets</template>
        <template v-else>Refresh</template>
      </v-chip>
    </v-toolbar>
    <v-divider class="mx-4"></v-divider>
    <div>
    <v-table style="max-width: 700px;" bordered>
      <thead>
        <tr>
          <th>TICKER</th>
          <th class="text-left">Balance</th>
          <th class="text-left">Address</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody v-if="allwallets">
        <template v-if="hideZero">
        <tr v-for="row in visible">
<td>{{row.ticker}}</td>
<td>{{row.balance}}</td>
<td>{{row.address}}</td>
          <td>
            <div class="text-left">
<!-- mePrivate and mePublic are set in .env* files of the root of the webapp project and read in at runtime -->
<div v-if="mePrivate == 'true' && mePublic == 'false'">
              <v-chip class="ma-2" @click="deposit(row.ticker, row.address)">
                <v-icon left>mdi-server-plus</v-icon>Deposit
              </v-chip>
              <v-chip class="ma-2" dark @click="showWithdrawOverlay(row.ticker)">
                <v-icon left>mdi-server-plus</v-icon>Withdraw
              </v-chip>
</div>
<div v-else>
              <v-chip class="ma-2" @click="deposit(row.ticker, row.address)">
                <v-icon left>mdi-server-plus</v-icon>Donate
              </v-chip>
</div>
            </div>
          </td>
        </tr>
        </template>
        <template v-else >
        <tr v-for="row in allwallets" v-bind:key="row.ticker">
          <td>{{ row.ticker }}</td>
          <td>{{ row.balance }}</td>
          <td>{{ row.address }}</td>
          <td>
            <div class="text-left">
<!-- mePrivate and mePublic are set in .env* files of the root of the webapp project and read in at runtime -->
<div v-if="mePrivate == 'true' && mePublic == 'false'">
              <v-chip class="ma-2" @click="deposit(row.ticker, row.address, true)">
                <v-icon left>mdi-server-plus</v-icon>Deposit
              </v-chip>
              <v-chip class="ma-2" dark @click="showWithdrawOverlay(row.ticker)">
                <v-icon left>mdi-server-plus</v-icon>Withdraw
              </v-chip>
</div>
<div v-else>
              <v-chip class="ma-2" @click="deposit(row.ticker, row.address, true)">
                <v-icon left>mdi-server-plus</v-icon>Donate
              </v-chip>
</div>
            </div>
          </td>
        </tr>
        </template>
      </tbody>
      <tbody v-else>
        <tr>
          <td>Waiting for wallet info</td>
        </tr>
      </tbody>
    </v-table>
    </div>
    <v-overlay opacity="0.88" :absolute="false" :model-value="depositOverlay" persistent class="align-center justify-center">
      {{ depositTicker }}: {{ depositAddress }}
      <div style="align-items: center; margin: auto;">
      <qrcode-vue :value="depositAddress" :size="depositOverlaySize" level="L"></qrcode-vue>
      </div>
      <v-btn color="success" @click="hideDepositOverlay(false)">Dismiss</v-btn>
    </v-overlay>
  </v-container>
  </v-main>
</template>
<script>
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import {ref} from 'vue'

export default {
  components: { QrcodeVue },
  props: [ 'wallets' ],
  data: function() {
    return {
      mePrivate: import.meta.env.VITE_VUE_APP_MEPRIVATE,
      mePublic: import.meta.env.VITE_VUE_APP_MEPUBLIC,
      depositOverlay: ref(false),
      depositOverlaySize: 400,
      depositTicker: "",
      depositAddress: "",
      hideZero: ref(false),
      hideZeroDisable: ref(true),
      customerrors: [],
    };
  },
  methods: {
    updateAllWallets() {
      this.$emit('update-allwallets', this.allwallets);
    },
    isEnabled: function(ticker) {
      console.log("isEnabled(): Checking " + ticker);
      if (this.activeCoins.some(e => e.ticker === ticker)) {
        return true;
      }
    },
    updateBalances: function() {
      this.hideZeroDisable = true
      let lastticker=this.allwallets[this.allwallets.length-1].ticker
      this.allwallets.forEach(function(item, index) {
        console.log("Updating [" + index + "]" + item.ticker)
      axios
        .get(
            import.meta.env.VITE_VUE_APP_MMBOTURL +
            "/getBalance?coin=" +
            item.ticker
        )
        .then((response) => {
          item.balance = response.data.balance;
          item.address = response.data.address;
          this.allwallets[index].balance = item.balance
          console.log(JSON.stringify(this.allwallets[index], null, 2))
          if( lastticker == item.ticker ){
            console.log("All updated")
            this.hideZeroDisable = false
          }
        })
        .catch(function(e) {
          console.log("update balance error" + e)
        })
      }.bind(this))
      this.$forceUpdate()
      //this.hideZeroDisable = false
    },
    hideDepositOverlay: function(v) {
      (this.depositOverlay = v),
        (this.depositTicker = ""),
        (this.depositAddress = "");
    },
    deposit: function(ticker, address,v) {
      console.log("Deposit: " + ticker + " @ " + address);
      this.depositTicker = ticker;
      this.depositAddress = address;
      this.depositOverlay = v;
    },
    withdraw: function(ticker) {
      console.log("Withdraw: " + ticker);
    }
  },
  computed:  {
    allwallets: function(){
      return this.wallets
    },
    visible() {
      let result = {}
      for( let i in this.allwallets) {
        if(this.allwallets[i].balance == 0){
          continue
        }
        else {
          result[i] = this.allwallets[i]
        }
      }
      return result
    }
  },
  created: function() {
    console.log("DashboardWalletInfo Created");
    console.log("DashboardWalletInfo Finished");
  },
  watch: {
    allwallets: {
      deep: true,
      handler(newval, oldval) {
      console.log(
        "Old val & new val: " +
          JSON.stringify(oldval + " *** " + JSON.stringify(newval))
      )
      this.updateBalances()
      }
    }
  }
}
</script>
<style scoped>
tr:hover{
  background-color: lightgray;
}

</style>