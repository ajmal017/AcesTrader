// appGetSymbolCompanyData.js

import iexData from '../iex.json'
import axios from 'axios'

export const getSymbolCompanyData = function(symbolList) {
  const version = iexData.Version
  const token = `token=${iexData.PublishableToken}`
  const basehtml = iexData.BasehtmlCloud

  let promiseArray = symbolList.map((symbol, i) => {
    return axios({ method: 'get', timeout: 2000, url: `${basehtml}${version}/stock/${symbol}/company?${token}` })
  })

  // console.log(`### appGetSymbolCompanyData ###`)
  // debugger // pause for developer

  console.log(`IEX getSymbolCompanyData`) // BCM IEX
  return axios
    .all(promiseArray)
    .then(function(arr) {
      return {
        arr,
      }
    })
    .catch(function(error) {
      return {
        error: error,
      }
    })
}

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
