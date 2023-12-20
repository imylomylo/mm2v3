<template>
  <div id="verusvueapp">
    <h2> Bridge.vETH</h2>
    <v-table class="custom-font">
      <thead>
        <tr>
          <th>Reserve Currency</th>
          <th>Reserve / DAI</th>
          <th>Reserve / VRSC </th>
          <th>Reserve / MKR </th>
          <th>Reserve / ETH </th>
          <th>Bridge / Reserve</th>
          <th>Reserves</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(currency, index) in currencies" :key="index">
          <td>{{ getTickerByCurrencyId(currency.currencyid) }}</td>
          <td>{{ getReserveDaiPrice(currency.reserves) }} DAI</td>
          <td>{{ getReserveVrscPrice(currency.reserves) }} VRSC</td>
          <td>{{ getReserveMkrPrice(currency.reserves) }} MKR</td>
          <td>{{ getReserveEthPrice(currency.reserves) }} ETH</td>
          <td>{{ parseFloat(currency.priceinreserve.toFixed(6)) }}</td>
          <td>{{ parseFloat(currency.reserves.toFixed(3)) }}</td>
          <td>{{ currency.weight }}</td>
        </tr>
      </tbody>
    </v-table>
    <!-- Other components or sections -->
  </div>
</template>

<script>
import { ref } from 'vue';
import { fetchConversion } from './utils/proxyGet';

export default {
  data() {
    return {
      currencies: ref([]),
      arr_currencies: [
        { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
        { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
        { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
        { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" }
      ],
      // Other data properties...
    };
  },
  methods: {
    getTickerByCurrencyId(currencyId) {
    const currency = this.arr_currencies.find(item => item.currencyid === currencyId);
    if (currency) {
      return currency.ticker;
    }
    return "Currency not found";
  },
    async getConversionData() {
      try {
        const conversionData = await fetchConversion();
        this.currencies = conversionData.currencies;
      } catch (error) {
        console.error('Error fetching conversion data:', error);
      }
    },
    getReservePrice( reserves) {
    if (Array.isArray(reserves)) {
      const currency = reserves.find(item => item.currencyid);
      if (currency) {
        return currency.reserves;
      }
    }
    // Handle the case when reserves is not an array or the item is not found
    return null; // or any other appropriate value
  },

  getReserveDaiPrice(reserves) {
    return this.getReservePrice("iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", reserves);
  },

  getReserveVrscPrice(reserves) {
    return this.getReservePrice("i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", reserves);
  },

  getReserveMkrPrice(reserves) {
    return this.getReservePrice("iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", reserves);
  },

  getReserveEthPrice(reserves) {
    return this.getReservePrice("i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", reserves);
  },
  // Handle the case when reserves is not an array or the item is not found
},
    
  async mounted() {
    // Call your method to fetch conversion data on component mount
   await this.getConversionData();
  },
};
</script>

<style scoped>
/* Your styles... */
</style>

<!-- <template>
    <v-main>
    <h1 style="margin-top: 100px;">
        Verus Currencies
    </h1>
    <div v-for="currency in currencies" :key="currency.currencyid">
      <h2>{{ currency.currencyid }}</h2>
      <p>Price in Reserve: {{ currency.priceinreserve }}</p>
      <p>Reserves: {{ currency.reserves }}</p>
      <p>Weight: {{ currency.weight }}</p>
    </div>
    </v-main>
  </template>
<script>
import { fetchInfo, fetchConversion } from "./utils/proxyGet"; 
import {ref} from 'vue'

export default {
  data(){
    return{
      currencies : ref([])
    }
  },
  name: 'VerusCurrencies',
  async mounted() {
    await this.getConsole();
  },
  methods: {
    async getConsole() {
     try {
        const getCon = await fetchConversion();
        this.currencies = getCon.currencies;
        console.log(getCon)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  }
}

</script> -->
