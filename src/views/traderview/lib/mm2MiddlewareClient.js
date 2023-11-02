import axios from 'axios'
import { Client, Functions} from 'appwrite-cli';

const userpass = '7TgkO2FPOZfxGAEi1'
const client = new Client();
const apiEndpoint = 'https://api.coingecko.com/api/v3';

client
    .setEndpoint('https://helsinki.cakeshop.dev/v1')
    .setProject('651b194c4dc7f8e93cf9');
const func = new Functions(client);
//const mm2url = "http://" + process.env.MM2_IPV4_ADDR + ":" + process.env.MM2_RPC_PORT
//const BASE_URL = BASE_DOMAIN 


const cancelAllOrders = async () => {
  const objCancelAll = { type: 'All'};
  console.log("cancel_all_orders: " )
  const myRequestData = {
    jsonrpc: '2.0',
    method: "cancel_all_orders",
    cancel_by: objCancelAll,
    userpass: userpass,
    id: Date.now(),
    timeout: 3000,
  };

  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const cancelOrder = async (uuid) => {
  const myRequestData = {
    jsonrpc: '2.0',
    method: 'cancel_order',
    userpass: userpass,
    uuid: uuid,
    id: Date.now(),
    timeout: 3000,
  };

  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
const getWalletBalance = async (ticker) => {
  const myRequestData = {
    jsonrpc: '2.0',
    method: 'my_balance',
    ticker: ticker,
    userpass: userpass,
    id: Date.now(),
    timeout: 3000,
  };

  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }

};
async function getAllCoins() {
  try {
    const response = await axios.get(`${apiEndpoint}/coins/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin list:', error);
    return [];
  }
}

// Example usage to get the CoinGecko ID for a coin ticker
async function getCoinGeckoId(coinTicker) {
  const allCoins = await getAllCoins();
  const coin = allCoins.find((c) => c.symbol === coinTicker.toLowerCase());
  return coin ? coin.id : null;
}
async function getFiatCoinGecko(ticker) {
  const coinId = await getCoinGeckoId(ticker);
  if (coinId !== null) {
    try {
      const response = await axios.get(`${apiEndpoint}/coins/${coinId}`);
      const data = response.data;
      if (data.market_data && data.market_data.current_price) {
        const usdPrice = data.market_data.current_price.usd;
        if (usdPrice !== undefined) {
          return usdPrice;
        }
      }
      console.log(`USD price not available for ${ticker}`);
      return null;
    } catch (error) {
      console.error(`Error fetching CoinGecko data for ${ticker}:`, error);
      return null;
    }
  } else {
    console.log(`CoinGecko ID not found for ${ticker}`);
    return null;
  }

}




// export function getFiatCoinGecko(ticker){
//       return axios
//         .get(
//             process.env.VITE_VUE_APP_MMBOTURL +
//             "/getpricecoingecko?coin=" +
//             ticker
//         )
//         .then(response => {
//           if( response.data.error){
// // TODO handle this promise rejection better for caller
//             console.log("No fiat for this coin")
//             return new Error("No fiat for " + ticker)
//           } else {
//             return response
//           }
//         })
//         .catch(e => {
//           Promise.reject(e)
//         })
// }
const getEnabledCoins = async () => {
  console.log("GetEnabledCoins")
  const myRequestData = {
    jsonrpc: "2.0",
    method: "get_enabled_coins",
    userpass: userpass,
    id: Date.now(),
    timeout: 3000
  };
  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
const getMyOrders = async () => {
  const myRequestData = {
    jsonrpc: '2.0',
    method: 'my_orders',
    userpass: userpass,
    id: Date.now(),
    timeout: 3000,
  };

  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
const sellBase = async (base, rel, price, amount) =>
{
  console.log("buy (base,rel,price,amount): (" + base + "," + rel + "," + price + "," + amount + ")")
  const myRequestData = {
    jsonrpc: "2.0",
    method: "setprice",
    base: base,
    rel: rel,
    price: price,
    amount: amount,
    cancel_previous: false,
    userpass: userpass,
    id: Date.now(),
    timeout: 3000
  };
  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

const buyBase = async(base, rel, price, amount) =>
{
  console.log("buy (base,rel,price,amount): (" + base + "," + rel + "," + price + "," + amount + ")")
  const requestData = {
    jsonrpc: "2.0",
    method: "buy",
    base: base,
    rel: rel,
    price: price,
    amount: amount,
    userpass: userpass,
    id: Date.now(),
    timeout: 3000
  };
  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

const getMarket = async (base, rel) => {
  const myRequestData = {
    jsonrpc: '2.0',
    method: 'orderbooks',
    userpass: userpass,
    base: base,
    rel, rel,
    id: Date.now(),
    timeout: 3000,
  };

  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};


const recentSwaps = async (uuid = null, limit = 10) => {
  const myRequestData = {
    jsonrpc: '2.0',
    method: 'my_recent_swaps',
    userpass: userpass,
    uuid: uuid,
    id: Date.now(),
    timeout: 3000,
  };

  try {
    const response = await func.createExecution('651f009bd158d858dbf7', JSON.stringify(myRequestData));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}


export default {
  cancelAllOrders,
  cancelOrder,
  getFiatCoinGecko,
  getMyOrders,
  getMarket,
  getWalletBalance,
  buyBase,
  sellBase,
  recentSwaps,
  getEnabledCoins
}



// import axios from 'axios'

// const BASE_DOMAIN = import.meta.env.VUE_APP_MMBOTURL
// const BASE_URL = BASE_DOMAIN 

// export function cancelAllOrders() {
//       console.log("Cancel All Orders");
//       let requestData = {};
//       requestData["method"] = "cancel_all_orders";
//       requestData["cancel_by"] = { type: "All" };

//       return axios
//         .get(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "cancelAllOrders",
//           requestData
//         )
//         .then(response => {
//           console.log(JSON.stringify(response.data, null, 4))
//           this.myOrders = []
//         })
//         .catch(e => {
//           this.customerrors.push(e)
//         })
// }

// export function cancelOrder(uuid){
//       console.log("Cancel order: " + uuid)
//       let requestData = {};
//       requestData["method"] = "cancel_order";
//       requestData["uuid"] = uuid;

//       return axios
//         .post(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "cancelOrder?uuid="+requestData.uuid
//         )
//         .then(response => {
//           console.log("Order result: " + JSON.stringify(response.data, null, 4));
//           if( response.data.result === "success" ){
//             console.log("success cancel, get myOrders again")
//           }
//         })
//         .catch(e => {
//           this.customerrors.push(e);
//         });

// }

// export function getWalletBalance(ticker) {
//   console.log("mm2MiddlewareClient.getWalletBalance: " + ticker)
//       return axios
//         .get(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "getBalance?coin=" +
//             ticker
//         )
//         .then(response => {
//           console.log(response.data);
//           return response
//         })
//         .catch(e => {
//           this.customerrors.push(e);
//         })
// }

// export function getFiatCoinGecko(ticker){
//       return axios
//         .get(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "/getpricecoingecko?coin=" +
//             ticker
//         )
//         .then(response => {
//           if( response.data.error){
// // TODO handle this promise rejection better for caller
//             console.log("No fiat for this coin")
//             return new Error("No fiat for " + ticker)
//           } else {
//             return response
//           }
//         })
//         .catch(e => {
//           Promise.reject(e)
//         })
// }

// export function getMyOrders(){
//       return axios
//         .get(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "getOrders"
//         )
//         .then(response => {
//           console.log(
//             "My Orders: " +
// //              JSON.stringify(response.data.result.maker_orders, null, 4)
//               response.data.result.maker_orders
//           )
//           return response
//         })
//         .catch(e => {
//           Promise.reject(e)
//         })
// }

// export function sellBase(base, rel, price, amount){
//       let requestData = {}
//       requestData["base"] = base
//       requestData["rel"] = rel
//       requestData["method"] = "setprice"
//       requestData["volume"] = amount
//       requestData["price"] = price
//       console.log("Sell BASE: " + JSON.stringify(requestData, null, 4))

//       return axios
//         .post(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "doMaker?base="+requestData.base+"&rel="+requestData.rel+"&volume="+requestData.volume+"&price="+requestData.price
//         )
//         .then(response => {
//           console.log("mm2middleware response to sell base: " + JSON.stringify(response, null, 2))
//           return response
//         })
//         .catch(e => {
//           this.customerrors.push(e)
//         });
// }

// export function buyBase(base, rel, price, amount){
//       console.log(
//         "SingleOrder buy base: " +
//           base +
//           ", amount: " +
//           amount +
//           " @ " +
//           price +
//           " = " +
//           amount * price
//       )
//       let requestData = {}
//       requestData["rel"] = base //flipped for a buy because of underlying mm2 mechanism
//       requestData["base"] = rel //flipped for a buy because of underlying mm2 mechanism
//       requestData["method"] = "setprice"
//       requestData["volume"] = (price*amount).toString()
//       requestData["price"] = (1/price).toString()  // 1/price for a buy & needs to be a string for the makerbot api

//       console.log("Buy BASE: " + JSON.stringify(requestData, null, 4))
//       return axios
//         .post(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "doMaker?base="+requestData.base+"&rel="+requestData.rel+"&volume="+requestData.volume+"&price="+requestData.price
//         )
//         .then(response => {
//           console.log("mm2middleware response to buy base: " + JSON.stringify(response.data, null, 2))
//           return response
//         })
//         .catch(e => {
//           this.customerrors.push(e)
//         })
// }

// export function getMarket(base, rel){
//       console.log("Show market:" + base + "/" + rel);
//       return axios
//         .post(
//             import.meta.env.VUE_APP_MMBOTURL +
//             "getMarket?base=" +
//             base +
//             "&rel=" +
//             rel
//         )
//         .then(response => {
//           return response
//         })
//         .catch(e => {
//           this.customerrors.push(e)
//         })
// }

// export function recentSwaps(limit = 10){
//      return axios
//        .get( import.meta.env.VUE_APP_MMBOTURL + "recentswaps")
//        .then(response => {
//          if (response.data !== undefined) {
//            return response
//          }
//        })
//        .catch(e => {
//          this.customerrors.push(e)
//        })
// }

// export function withdraw(ticker,amount){
//   console.log("mm2MiddlewareClient.withdraw - Not Supported Yet")
// // TODO
// //    withdraw: function(ticker, amount) {
// //      console.log("Withdraw: " + ticker);
// //      let requestData = {};
// //      requestData["coin"] = this.withdrawTicker;
// //      requestData["to"] = this.withdrawAddress;
// //      requestData["amount"] = this.withdrawAmount;
// //      requestData["method"] = "withdraw";
// //      requestData["userpass"] = process.env.VUE_APP_USERPASS;
// //
// //      axios
// //        .post(
// //          "http://" +
// //            process.env.VUE_APP_WEBHOST +
// //            ":" +
// //            process.env.VUE_APP_WEBPORT +
// //            "/" +
// //            process.env.VUE_APP_MMBOTHOST +
// //            ":" +
// //            process.env.VUE_APP_MMBOTPORT +
// //            "/api/v1/legacy/mm2/withdraw",
// //          requestData
// //        )
// //        .then(response => {
// //          console.log(JSON.stringify(response.data, null, 4));
// //          let requestData = {};
// //          requestData["coin"] = this.withdrawTicker;
// //          requestData["tx_hex"] = response.data.tx_hex;
// //          requestData["method"] = "send_raw_transaction";
// //          requestData["userpass"] = process.env.VUE_APP_USERPASS;
// //
// //          axios
// //            .post(
// //              "http://" +
// //                process.env.VUE_APP_MMBOTHOST +
// //                ":" +
// //                process.env.VUE_APP_MMBOTPORT +
// //                "/api/v1/legacy/mm2/send_raw_transaction",
// //              requestData
// //            )
// //            .then(response => {
// //              console.log(JSON.stringify(response, null, 4));
// //              this.hideWithdrawOverlay();
// //            })
// //            .catch(e => {
// //              this.customerrors.push(e);
// //            });
// //        })
// //        .catch(e => {
// //          this.customerrors.push(e);
// //        });
// //    }
// }

// export default {
//   cancelAllOrders,
//   cancelOrder,
//   getFiatCoinGecko,
//   getMyOrders,
//   getMarket,
//   getWalletBalance,
//   buyBase,
//   sellBase,
//   recentSwaps,
//   withdraw
// }