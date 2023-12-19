<template>
    <v-main>
    <h1 style="margin-top: 100px;">
        Verus Currencies
    </h1>
    </v-main>
  </template>
<script>
import { fetchInfo, fetchConversion } from "./utils/proxyGet"; 

export default {
  name: 'VerusCurrencies',
  async mounted() {
    await this.getConsole();
  },
  methods: {
    async getConsole() {
      try {
        //const res = await fetchCurrency("Bridge.vEth");
        const info = await fetchInfo();
        const getCon = await fetchConversion();
 
        //console.log(res);
        console.log(info);
        console.log(getCon);
      } catch (error) {
        // Handle errors if needed
        console.log("Cannot get data")
      }
    },
  }
}

</script>
