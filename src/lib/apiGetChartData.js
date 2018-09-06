// apiGetChartData.js

import axios from 'axios'
import { getReference, referenceLocaltrader } from './dbReference'
// import { getReference, referenceLocaltrader, referenceRealtrader, referencePapertrader } from './dbReference'

let reference = getReference() //indicates which storage to use for app state

const getChartData = (symbol, range) => {
  if (reference === referenceLocaltrader) {
    // Call into the free IEX api
    const self = this
    const IEX_BASE = 'https://api.iextrading.com/1.0/'
    const filter = '?filter=date,open,high,low,close,volume'
    const request = axios
      .get(`${IEX_BASE}stock/${symbol}/chart/${range}${filter}`)
      .then((res) => {
        self.values = res.data
        let data = self.values.map((obj) => {
          let date = obj.date
          date = date + 'T05:00:00.000Z'
          obj.date = new Date(date)
          return obj
        })
        return data
      })
      .catch((error) => {
        return error
      })
    return request //let caller handle the promise's .then/.catch completion
  } else {
    // Call into the Ameritrade api
  }
}
export default getChartData

//     .catch(function(error) {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(error.response.data)
//         console.log(error.response.status)
//         console.log(error.response.headers)
//         console.log(`${IEX_BASE}stock/${symbol}/chart/1y`)
//         // debugger //testing
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(error.request)
//         debugger //testing
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', error.message)
//         debugger //testing
//       }
//       console.log(error.config)
//       debugger //testing
//     })
