<template>
    <v-main>
    <h1 style="margin-top: 100px;">
        Verus Currencies
    </h1>
    </v-main>
  </template>
<script>

import {ApiRequest} from './verus-typescript-primitives/src/api/ApiRequest.ts'
import {GetInfoRequest} from './verus-typescript-primitives/src/api/classes/GetInfo/GetInfoRequest.ts'


export default{
    name: 'VerusCurrencies',
    mounted() {
    const infoRequest = new GetInfoRequest('VRSC');

    // Log the result of the toJson() method to the console
    console.log(infoRequest.toJson());
}
}
</script>
