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
  <tr v-for="(currency, index) in renderedCurrencies" :key="index">
    <td>{{ getTickerByCurrencyId(currency.currencyid) }}</td>
    <td>{{ getReserveDaiPrice(currency.amount) }} DAI</td>
    <td>{{ getReserveVrscPrice(currency.amount) }} VRSC</td>
    <td>{{ getReserveMkrPrice(currency.amount) }} MKR</td>
    <td>{{ getReserveEthPrice(currency.amount) }} ETH</td>
    <td>{{ parseFloat(currency.price) }}</td>
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
            name: currencyName,
            amount: token.reserves,
            daiPrice: daiAmount / token.reserves,
            price: conversion ? conversion.price : 0,
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

    const getReserveDaiPrice = (reserves) => {
      const daiCurrency = currencies.value.find(currency => currency.name === 'DAI.vETH');
      if (daiCurrency) {
        return parseFloat((daiCurrency.amount / reserves).toFixed(6)) + ' DAI';
      }
      return "Currency not found";
    };

    const getReserveVrscPrice = (reserves) => {
      const vrscCurrency = currencies.value.find(currency => currency.name === 'VRSC');
      if (vrscCurrency) {
        return parseFloat((vrscCurrency.amount / reserves).toFixed(6)) + ' VRSC';
      }
      return "Currency not found";
    };

    const getReserveMkrPrice = (reserves) => {
      const mkrCurrency = currencies.value.find(currency => currency.name === 'MKR.vETH');
      if (mkrCurrency) {
        return parseFloat((mkrCurrency.amount / reserves).toFixed(6)) + ' MKR';
      }
      return "Currency not found";
    };

    const getReserveEthPrice = (reserves) => {
      const ethCurrency = currencies.value.find(currency => currency.name === 'vETH');
      if (ethCurrency) {
        return parseFloat((ethCurrency.amount / reserves).toFixed(6)) + ' ETH';
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
    });

    const renderedCurrencies = computed(() => {
      if (reservedcurrencies.value.length === 0) {
        return [{ currencyid: 'loading' }];
      }
      return reservedcurrencies.value;
    });

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
      renderedCurrencies,
    };
  },
};
</script>

<!-- 
<script>
import { VerusdRpcInterface } from 'verusd-rpc-ts-client';
import { ref } from 'vue';

const verusd = new VerusdRpcInterface("iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq", "https://api.verus.services");

export default {
  data() {
    return {
      explorertx: "https://insight.verus.io/tx/",
      latestblock: ref([]),
      reservedcurrencies: ref([]),
      mempool_res: ref([]),
      rawtransaction: ref([]),
      decodedrawtransaction: ref([]),
      mempool_count: ref(0),
      currencies: ref([]),
      res: ref([]),
      arr_currencies: [
       { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC", "symbol": "VRSC" },
       { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH", "symbol": "vETH" },
       { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH", "symbol": "MKR.vETH" },
       { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH", "symbol": "DAI.vETH" }
      ],
    };
  },

  methods: {
    async getConversionData() {
  try {
    const res = await verusd.getCurrency('bridge.veth');
        const info = await verusd.getInfo();
        const bestState = res.result.bestcurrencystate;
        const currencies = bestState.reservecurrencies;
        const count = currencies.length;
        const { supply } = bestState;
        const daiKey = Object.keys(res?.result?.currencynames).find((key) => res.result.currencynames !== undefined && res.result.currencynames[key] === 'DAI.vETH');
        const daiAmount = currencies.find((c) => c.currencyid === daiKey).reserves;

        let list = currencies.map((token) => ({ name: res.result.currencynames[token.currencyid], amount: token.reserves, daiPrice: daiAmount / token.reserves }));
        const bridge = { name: 'Bridge.vETH', amount: supply, daiPrice: (daiAmount * count) / supply };

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
        this.arr_currencies.map(async (currency) => {
          
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

    // Log the data to ensure everything is defined
    console.log('Currency Names:', res.result.currencynames);
    console.log('Currencies:', currencies);
    console.log('Conversion Prices:', conversions);
    this.currencies = list;
    this.reservedcurrencies = list;
    // Example: Add these log statements in your code
    console.log('Reserve Currencies:', this.reservedcurrencies);
    console.log('Conversion Prices:', this.currencies);

    // Use default values for currencies without conversion data
    const defaultConversion = { symbol: '', price: 0 };

    // Update the list with conversion data
    this.reservedcurrencies = list.map((token) => {
      const conversion = conversions.find((c) => c.symbol === token.symbol) || defaultConversion;
      return {
        ...token,
        price: conversion.price,
      };
    });

    this.reservedcurrencies = list;
  } catch (error) {
    console.error('Error fetching currency data:', error);
  }
},

    getReserveDaiPrice(reserves) {
      const daiCurrency = this.currencies.find(currency => currency.name === 'DAI.vETH');
      if (daiCurrency) {
        return parseFloat((daiCurrency.amount / reserves).toFixed(6)) + ' DAI';
      }
      return "Currency not found";
    },

    getReserveVrscPrice(reserves) {
      const vrscCurrency = this.currencies.find(currency => currency.name === 'VRSC');
      if (vrscCurrency) {
        return parseFloat((vrscCurrency.amount / reserves).toFixed(6)) + ' VRSC';
      }
      return "Currency not found";
    },

    getReserveMkrPrice(reserves) {
      const mkrCurrency = this.currencies.find(currency => currency.name === 'MKR.vETH');
      if (mkrCurrency) {
        return parseFloat((mkrCurrency.amount / reserves).toFixed(6)) + ' MKR';
      }
      return "Currency not found";
    },

    getReserveEthPrice(reserves) {
      const ethCurrency = this.currencies.find(currency => currency.name === 'vETH');
      if (ethCurrency) {
        return parseFloat((ethCurrency.amount / reserves).toFixed(6)) + ' ETH';
      }
      return "Currency not found";
    },
    getConversionPrice(symbol) {
      const currency = this.currencies.find(curr => curr.name === symbol);
      if (currency) {
        return currency.price; // Assuming that the 'price' property is available in the currency object
      }
      return "Price not found";
    },

    getTickerByCurrencyId(currencyId) {
      const currency = this.arr_currencies.find(item => item.currencyid === currencyId);
      if (currency) {
        return currency.ticker;
      }
      return "Currency not found";
    },

    // ... other methods
  },

  computed: {
    renderedCurrencies() {
      // Return a loading state if data is still being fetched
      if (this.reservedcurrencies.length === 0) {
        return [{ currencyid: 'loading' }];
      }

      // Otherwise, return the actual data
      return this.reservedcurrencies;
    },
  },

  async created() {
    await this.getConversionData();
  }
};
</script> -->
