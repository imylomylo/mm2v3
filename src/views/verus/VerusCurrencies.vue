<template>
    <v-main>
    <h1 style="margin-top: 100px;">
        Verus Currencies
    </h1>
    <h2> {{ currencies.at(1) }}</h2>
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
        //const res = await fetchCurrency("Bridge.vEth");
        const info = await fetchInfo();
        const getCon = await fetchConversion();
 
        //console.log(res);
        console.log(info);
        console.log(getCon);
        this.currencies = getCon.currencies
      } catch (error) {
        // Handle errors if needed
        console.log("Cannot get data")
      }
    },
  }
}

</script>
