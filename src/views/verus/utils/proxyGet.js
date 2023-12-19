// proxyVerusd.js
import { VerusdRpcInterface } from 'verusd-rpc-ts-client'

const verusd = new VerusdRpcInterface("iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq", "https://api.verustest.net");

export const fetchConversion = async () => {
  const res = await verusd.getCurrency('bridge.veth')
  const info = await verusd.getInfo()

  const block = info.result.longestchain

  const bestState = res.result.bestcurrencystate
  const currencyNames = res.result.currencynames
  const currencies = bestState.reservecurrencies
  const count = currencies.length
  const { supply } = bestState
  const daiKey = Object.keys(res?.result?.currencynames).find((key) => currencyNames !== undefined && currencyNames[key] === 'DAI.vETH')
  const daiAmount = currencies.find(c => c.currencyid === daiKey).reserves

  let list = currencies.map((token) => ({ name: currencyNames[token.currencyid], amount: token.reserves, daiPrice: daiAmount / token.reserves }))
  const bridge = { name: 'Bridge.vETH', amount: supply, daiPrice: (daiAmount * count) / supply }

  let conversions = [
    { symbol: 'vrsc', price: 0 },
    { symbol: 'eth', price: 0 },
    { symbol: 'mkr', price: 0 },
    { symbol: 'dai', price: 0 }
  ]

  try {
    conversions = await Promise.all(
      urls.map(async (url) => fetch(url)
        .then((res) => res.json())
        .then((c) => ({
          symbol: c.symbol,
          price: c.market_data.current_price.usd
        })))
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('%s: fetching prices %s', Date().toString(), error)
  }
  list = list.map((token) => {
    switch (token.name) {
      case 'VRSCTEST':
      case 'VRSC':
        return {
          ...token,
          price:
            conversions.find((c) => c.symbol === 'vrsc')?.price
        }
      case 'vETH':
        return {
          ...token,
          price: conversions.find((c) => c.symbol === 'eth')?.price
        }
      case 'DAI.vETH':
        return {
          ...token,
          price: 1
        }
      case 'MKR.vETH':
        return {
          ...token,
          price: conversions.find((c) => c.symbol === 'mkr')?.price
        }
      // return { ...token, price: vrscPrice }
      default:
        return { ...token }
    }
  })
  return { list, bridge, currencies }
}

export const fetchCurrency = async (currency) => {
  try {
    const response = await verusd.getCurrency(currency);
    return response;
  } catch (error) {
    console.error("Error fetching currency:", error);
    throw error;
  }
};

export const fetchInfo = async () => {
  try {
    const response = await verusd.getInfo();
    return response;
  } catch (error) {
    console.error("Error fetching info:", error);
    throw error;
  }
};

// You can add more proxy methods here if needed

