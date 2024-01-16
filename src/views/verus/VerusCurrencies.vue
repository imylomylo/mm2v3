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
  <tr v-for="(currency, index) in reservedcurrencies" :key="index">
    <td>{{ getTickerByCurrencyId(currency.currencyName) }}</td>
    <td>{{ getReserveDaiPrice(currency.amount) }} DAI</td>
    <td>{{ getReserveVrscPrice(currency.amount) }} VRSC</td>
    <td>{{ getReserveMkrPrice(currency.amount) }} MKR</td>
    <td>{{ getReserveEthPrice(currency.amount) }} ETH</td>
    <td>{{ getBridgeReserve(currency) }}</td>
    <td>{{ parseFloat(currency.amount) }}</td>
    <td>{{ parseFloat(currency.weight) }}</td>
  </tr>
</tbody>

    </v-table>
    
    <h3>VRSC Mempool: Unconfirmed transactions</h3>
    <div v-if="mempool_res.length > 0">
      <ul>
        <v-list-item v-for="res in mempool_res">
          <a :href="explorertx + res">{{ res }}</a> | <a target="_blank" :href="explorertx + res">new tab</a>
        </v-list-item>
      </ul>
    </div>
    <div v-else>
      No transactions waiting.
    </div>
  </div>
</template>
<script>
import { VerusdRpcInterface } from 'verusd-rpc-ts-client';
import { ref, onMounted, computed } from 'vue';

const verusd = new VerusdRpcInterface("iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq", "https://api.verus.services");

export default {
  setup() {
    const explorertx = "https://insight.verus.io/tx/";
    const latestblock = ref([]);
    const reservedcurrencies = ref([]);
    const mempool_res = ref([]);
    const rawtransaction = ref([]);
    const decodedrawtransaction = ref([]);
    const mempool_count = ref(0);
    const currencies = ref([]);
    const res = ref([]);
    const arr_currencies = [
      { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC", "symbol": "VRSC" },
      { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH", "symbol": "vETH" },
      { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH", "symbol": "MKR.vETH" },
      { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH", "symbol": "DAI.vETH" }
    ];

    const getConversionData = async () => {
      try {
        const res = await verusd.getCurrency('bridge.veth');
        const info = await verusd.getInfo();
        const bestState = res.result.bestcurrencystate;
        const bridgeSupply = bestState.supply;
        const daiKey = Object.keys(res?.result?.currencynames).find((key) => res.result.currencynames !== undefined && res.result.currencynames[key] === 'DAI.vETH');
        const daiAmount = bestState.reservecurrencies.find((c) => c.currencyid === daiKey).reserves;

        let conversions = [
          { symbol: 'vrsc', price: 0 },
          { symbol: 'eth', price: 0 },
          { symbol: 'mkr', price: 0 },
          { symbol: 'dai', price: 0 }
        ];

        try {
          // Fetch conversion data for each currency
          const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
          conversions = await Promise.all(
            arr_currencies.map(async (currency) => {
              const url = `${apiUrl}?vs_currency=usd&ids=${currency.symbol}`;
              try {
                const response = await fetch(url);
                const data = await response.json();
                return {
                  symbol: currency.symbol,
                  price: data[0]?.current_price || 0,
                };
              } catch (error) {
                console.error('Error fetching prices:', error);
                return { symbol: currency.symbol, price: 0 };
              }
            })
          );
        } catch (error) {
          console.error('Error fetching conversion data:', error);
        }

        const list = bestState.reservecurrencies.map((token) => {
          const currencyName = res.result.currencynames[token.currencyid];
          const conversion = conversions.find((c) => c.symbol === currencyName);
          return {
            name: res.result.currencynames[token.currencyid],
            amount: token.reserves,
            daiPrice: daiAmount / token.reserves,
            price: conversion ? conversion.price : 0,
            weight: res.result.weights
          };
        });

        console.log('Currency Names:', res.result.currencynames);
        console.log('Currencies:', bestState.reservecurrencies);
        console.log('Conversion Prices:', conversions);

        currencies.value = list;
        reservedcurrencies.value = list;

        console.log('Reserve Currencies:', reservedcurrencies.value);
        console.log('Conversion Prices:', currencies.value);
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };
    const getBridgeReserve = (currency) => {
      console.log('Currency:', currency);

// Assuming that 'currency.price' is the conversion price
const conversionPrice = parseFloat(currency.price);

// Assuming that 'currency.amount' is the reserve amount
const reserveAmount = parseFloat(currency.amount);

// Check values for debugging
console.log('Conversion Price:', conversionPrice);
console.log('Reserve Amount:', reserveAmount);

// Calculate Bridge/Reserve value
const bridgeReserve = conversionPrice * reserveAmount;
return bridgeReserve.toFixed(6);
    };
    const getReserveDaiPrice = (reserves) => {
      const daiCurrency = currencies.value.find(currency => currency.name === 'DAI.vETH');
      if (daiCurrency) {
        return parseFloat((daiCurrency.amount / reserves).toFixed(6));
      }
      return "Currency not found";
    };

    const getReserveVrscPrice = (reserves) => {
      const vrscCurrency = currencies.value.find(currency => currency.name === 'VRSC');
      if (vrscCurrency) {
        return parseFloat((vrscCurrency.amount / reserves).toFixed(6));
      }
      return "Currency not found";
    };

    const getReserveMkrPrice = (reserves) => {
      const mkrCurrency = currencies.value.find(currency => currency.name === 'MKR.vETH');
      if (mkrCurrency) {
        return parseFloat((mkrCurrency.amount / reserves).toFixed(6));
      }
      return "Currency not found";
    };

    const getReserveEthPrice = (reserves) => {
      const ethCurrency = currencies.value.find(currency => currency.name === 'vETH');
      if (ethCurrency) {
        return parseFloat((ethCurrency.amount / reserves).toFixed(6));
      }
      return "Currency not found";
    };

    const getConversionPrice = (symbol) => {
      const currency = currencies.value.find(curr => curr.name === symbol);
      if (currency) {
        return currency.price;
      }
      return "Price not found";
    };

    const getTickerByCurrencyId = (currencyId) => {
      const currency = arr_currencies.find(item => item.currencyid === currencyId);
      if (currency) {
        return currency.ticker;
      }
      return "Currency not found";
    };

    // Fetch data on component creation
    onMounted(async () => {
      await getConversionData();
      await getMempoolData();
    });

    const renderedCurrencies = computed(() => {
  if (reservedcurrencies.value.length === 0) {
    return [{ currencyid: 'loading' }];
  }
  return reservedcurrencies.value;
});

    const getMempoolData = async () => {
    try {
  const mempoolResponse = await verusd.getMempoolData();
      const mempoolTransactions = mempoolResponse.result;

      // // Filter VRSC transactions
      // const vrscMempool = mempoolTransactions.filter((tx) => {
      //   // Check if the transaction involves VRSC
      //   return tx.vout.some((output) => output.scriptPubKey?.asset === 'VRSC');
      // });

      // // Extract transaction IDs
      // const vrscTxIds = vrscMempool.map((tx) => tx.txid);

      // // Update mempool_res
      // mempool_res.value = vrscTxIds;
      console.log(mempoolTransactions)
    } catch (error) {
      console.error('Error fetching mempool data:', error);
    }};

    return {
      explorertx,
      latestblock,
      reservedcurrencies,
      mempool_res,
      rawtransaction,
      decodedrawtransaction,
      mempool_count,
      currencies,
      res,
      arr_currencies,
      getReserveDaiPrice,
      getReserveVrscPrice,
      getReserveMkrPrice,
      getReserveEthPrice,
      getConversionPrice,
      getTickerByCurrencyId,
      getBridgeReserve,
      renderedCurrencies,
    };
  },
};
</script>
