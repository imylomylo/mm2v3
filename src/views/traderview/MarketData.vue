<template>
  <v-card max-width="max-width" class="mx-auto" outlined>
    <v-toolbar flat dense color="indigo">
      <v-toolbar-title>
        <span class="subheading">AtomicDEX order book</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-chip
        class="ma-2"
        color="white"
        outlined
        @click="refreshMarket()"
      >
        <v-icon left>mdi-server-plus</v-icon>Refresh
      </v-chip>
    </v-toolbar>
    <div v-if="marketdata.asks">
      <div>
        <v-layout>
          <v-flex md lg>
            <v-card-title>Asks</v-card-title>
            <div class="table-container">
            <v-data-table
              dense
              :sort-by="['price']"
              :sort-desc="[true]"
              :headers="asksHeaders"
              :items="marketdata.asks"
              :rows-per-page="-1"
              :disable-pagination="true"
              class="elevation-1"
            >
              <template v-slot:column.price="{ header }">
                <!-- {{ header.text.toUpperCase() }} -->
                Price ({{wallets.rel.ticker }})
              </template>

              <template v-slot:column.maxvolume="{ header }">
                <!-- {{ header.text.toUpperCase() }} -->
                Amount ({{wallets.base.ticker }})
              </template>

              <template v-slot:column.relamount="{ header }">
                <!-- {{ header.text.toUpperCase() }} -->
                Total ({{wallets.rel.ticker }})
              </template>

              <!-- Rounding from https://www.jacklmoore.com/notes/rounding-in-javascript/ -->
              <!-- Better to move to computed function for maintainability/non-repetitive -->
              <template v-slot:item.price="{ item }">
                {{ roundedPrice(item.columns.price) }}
              </template>

              <template v-slot:item.price2="{ item }">
                {{ roundedPrice(item.columns.price) }}
  <!-- Remaining code -->

<!--
better implementation handled in parent component on load of orders, then promise to set flag
                <v-chip v-if="hasMyOrder(item.price)" color="purple" dark>me</v-chip>
-->
                <v-chip v-if="item.myOrder" x-small color="purple" dark>*</v-chip>
              </template> 

              <template v-slot:item.maxvolume="{ item }">
                {{ roundedPrice(item.columns.maxvolume) }}
              </template>

              <template v-slot:item.relamount="{ item }">
                {{ roundedPrice(item.columns.price * item.columns.maxvolume) }}
              </template>
            </v-data-table>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div v-else>No current asks to display.</div>
    <h2 class="pl-3">{{ middlePriceSpreadData.middle }} Middle Price (Spread: {{ middlePriceSpreadData.spread}} %)</h2>

    <div v-if="marketdata.bids">
      <div>
        <v-layout>
          <v-flex md lg>
            <v-card-title>Bids</v-card-title>
            <div class="table-container">
            <v-data-table
               dense
              :sort-by="['price']"
              :sort-desc="[true]"
              :disable-pagination="true"
              :headers="bidsHeaders"
              :items="marketdata.bids"
              :items-per-page="-1"
            >

              <template v-slot:column.price="{ header }">
                <!-- {{ header.text.toUpperCase() }} -->
                Price ({{wallets.rel.ticker }})
              </template>

              <template v-slot:column.baseamount="{ header }">
                <!-- {{ header.text.toUpperCase() }} -->
                Amount ({{wallets.base.ticker }})
              </template>

              <template v-slot:column.maxvolume="{ header }">
                <!-- {{ header.text.toUpperCase() }} -->
                Total ({{wallets.rel.ticker }})
              </template>

              <!-- Rounding from https://www.jacklmoore.com/notes/rounding-in-javascript/ -->
              <!-- Better to move to computed function for maintainability/non-repetitive -->
              <template v-slot:item.price="{ item }">
                  {{ roundedPrice(item.columns.price) }}
              </template>
              
              <!-- For highlighting my orders, TODO need a price:uuid array before grouping by price in AppTraderview   -->
              <template v-slot:item.price2="{ item }">
                  {{ roundedPrice(item.columns.price) }}
<!--
better implementation in parent component
                <v-chip v-if="hasMyOrder(item.price)" color="purple" dark>me</v-chip>
-->
                <v-chip v-if="item.myOrder" x-small color="purple" dark>*</v-chip>
              </template> 
              <template
                v-slot:item.baseamount="{ item }"
              >{{ roundedPrice(item.columns.maxvolume / item.columns.price) }}</template>
              <template
                v-slot:item.maxvolume="{ item }"
              >{{ roundedPrice(item.columns.maxvolume) }}</template>
            </v-data-table>
            </div>
          </v-flex>
        </v-layout>
        
      </div>
    </div>
    <div v-else>No current bids to display.</div>
  </v-card>
</template>
<script>
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: "MarketData",
  props: ['wallets', 'marketdata', 'myOrdersThisMarket'],
  components: {
    VDataTable
  },
  data: function() {
    return {
      cexprice: "",
      myOrders: "",
      takerDialog: false,
      makerDialog: false,
      activeCoins: [],
      walletBalance: { base: 0, rel: 0 },
      trade: { base: "", rel: "", price: "", amount: "0" },
      appName: "MarketData",
      customerrors: [],
      asksHeaders: [
        {
          title: "Price (rel)",
          align: "left",
          sortable: true,
          key: "price"
        },
        { title: "Amount (base)", align: "left", key: "maxvolume" },
        { title: "Total (rel))", align: "right", key: "relamount" }
      ],
      bidsHeaders: [
        {
          title: "Price (rel)",
          align: "left",
          sortable: true,
          key: "price"
        },
        { title: "Base Amount", align: "left", key: "baseamount" },
        { title: "Can Cancel", align: "right", key: "maxvolume" }
      ]
    }
  },
  methods: {
    refreshMarket: function() {
      this.$emit("refresh-market")
    },
    objectArrayByKeys: function(obj) {
      let toArray = [];
      Object.keys(obj).forEach(function(key) {
        toArray.push(obj[key]);
      });
      return toArray;
    },
    hasMyOrder: function(price){
      return this.myOrdersThisMarket.find(x => x.price == price)
    }
  },
  created: function() {
    console.log(this.appName + " Created");
    // original prod code
//    this.showDEXMarket(this.wallets.base.ticker, this.wallets.rel.ticker)
    // working fake data
    // this.marketdata = this.fakeData
    // test grouping
    // this.marketdata.asks = this.groupByPrice2(this.fakeData.asks, "price");
    // this.marketdata.bids = this.groupByPrice2(this.fakeData.bids, "price");
    //this.getCEXprice(this.wallets.base.ticker, this.wallets.rel.ticker);
    console.log(this.appName + " Finished Created");
  },
  computed: {
    coinCount: function() {
      return this.activeCoins.length;
    },
    roundedPrice() {
        return price => {
          return Number((Math.round(price * 1e8) / 1e8).toFixed(8))
        }
      },
    middlePriceSpreadData: function(lowAsk, highBid) {
      // middlePriceSpreadData.middle & middlePriceSpreadData.spread
      let middlePriceSpreadData = {}
      middlePriceSpreadData.middle = "No"
      middlePriceSpreadData.spread = 0
      if( this.marketdata.asks === undefined || this.marketdata.bids === undefined){
        return middlePriceSpreadData
      }
      if( this.marketdata.asks.length > 0 && this.marketdata.bids.length > 0) {
        let lowestAsk = this.marketdata.asks.sort((a,b) => a.price - b.price)[0].price 
        let highestBid = this.marketdata.bids.sort((a,b) => b.price - a.price)[0].price
        let spread = (parseFloat(lowestAsk) - parseFloat(highestBid))
        let middle = parseFloat(parseFloat(highestBid) + (parseFloat(lowestAsk) - parseFloat(highestBid))/2)
        middlePriceSpreadData.middle = middle.toFixed(8) + " Approx. "
        middlePriceSpreadData.spread = (parseFloat(spread/middle) * 100).toFixed(1)
        return middlePriceSpreadData 
      }
      else {
        return middlePriceSpreadData
      }
    }
  }
};
</script>
<style>
.table-container{
  widows: 100%;
  overflow-x: auto;
}

</style>
