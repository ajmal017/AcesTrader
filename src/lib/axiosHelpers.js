// axiosHelpers.js

import { putPeekPrice, resetPeekPrices } from './appLastPeekPrice'
var axios = require('axios')

// Note: we use the free IEX api to test for a valid symbol
// axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/company`)

// var axiosHelpers = {
export const verifySymbolLookups = function(symbolList) {
  let promiseArray = symbolList.map((symbol, i) => {
    return axios({ method: 'get', timeout: 2000, url: `https://api.iextrading.com/1.0/stock/${symbol}/company` })
    // return axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/company`)
  })
  return axios
    .all(promiseArray)
    .then(function(arr) {
      return {
        companies: arr[0].data,
      }
    })
    .catch(function(error) {
      return {
        error: error,
      }
    })
}
export const getSymbolPrices = function(symbolList) {
  let promiseArray = symbolList.map((symbol, i) => {
    return axios({ method: 'get', timeout: 2000, url: `https://api.iextrading.com/1.0/tops/last?symbols=${symbol}` })
  })
  return axios
    .all(promiseArray)
    .then(function(arr) {
      //need to format data into peek storage area
      resetPeekPrices()
      for (let i = 0; i < arr.length; i++) {
        let symbol = arr[i].data[0].symbol
        let price = arr[i].data[0].price
        putPeekPrice(symbol, price)
      }
      return {
        firstdata: arr[0].data,
      }
    })
    .catch(function(error) {
      return {
        error: error,
      }
    })
}
// }

// Below is the original code from the example of promise.all,
// left here for reference
// function getRepos(username) {
//   return axios.get('https://api.github.com/users/' + username + '/repos')
// }
// function getUserInfo(username) {
//   return axios.get('https://api.github.com/users/' + username)
// }
// var helpers = {
//   getGithubInfo: function(username) {
//     return axios
//       .all([getRepos(username), getUserInfo(username)])
//       .then(function(arr) {
//         return {
//           repos: arr[0].data,
//           bio: arr[1].data,
//         }
//       })
//       .catch(function(error) {
//         return {
//           error: error,
//         }
//       })
//   },
// }

// export default axiosHelpers
