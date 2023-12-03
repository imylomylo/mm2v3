<template>
    <v-main>
    <h1 style="margin-top: 100px;">
        Verus Currencies
    </h1>
    </v-main>
  </template>
<script>
import {GetCurrencyRequest} from './verus-typescript-primitives/src/api/classes/GetCurrency/GetCurrencyRequest.ts'
import {ApiRequest} from './verus-typescript-primitives/src/api/ApiRequest.ts'

export default{
    name: 'VerusCurrencies',
    mounted() {
// Create an instance of GetCurrencyRequest
const request = new GetCurrencyRequest("VRSC", "Bridge.vETH");

// Call getParams method and log the result
const params = request.getParams();
console.log("Params:", params);

// Create a sample JSON object
const sampleJson = { chain: "VRSC", currencyname: "Bridge.vETH" };

// Call fromJson method and log the result
const fromJsonInstance = GetCurrencyRequest.fromJson(sampleJson);
console.log("fromJson Result:", fromJsonInstance);

// Call toJson method and log the result
const toJsonResult = request.toJson();
console.log("toJson Result:", request);
    }

}

</script>
