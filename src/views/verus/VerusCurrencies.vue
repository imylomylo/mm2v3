<template>
    <v-main>
    <h1 style="margin-top: 100px;">
        Verus Currencies
    </h1>
    </v-main>
  </template>
<script>

import {VerusdRpcInterface} from './verusd-rpc-ts-client/src/index.ts'

export default{
    name: 'VerusCurrencies',
    mounted(){
        const verusd = new VerusdRpcInterface("iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq", "http://127.0.0.1:8000")

        console.log(verusd.getInfo())
    }
}

</script>