// apiGetFillPrice.js

import axios from 'axios'
import { getReference, referenceLocaltrader } from './dbReference'
// import { getReference, referenceLocaltrader, referenceRealtrader, referencePapertrader,referenceDebugtrader } from './dbReference'

let reference = getReference() //indicates which storage to use for app state

const getFillPrice = (symbol) => {
  if (reference === referenceLocaltrader) {
    // Call into the free IEX api
    const self = this
    const IEX_BASE = 'https://api.iextrading.com/1.0/'
    const request = axios
      .get(`${IEX_BASE}tops/last?symbols=${symbol}`)
      .then((res) => {
        self.value = res.data[0].price
        return self.value
      })
      .catch((error) => {
        return error
      })
    return request //let caller handle the promise's .then/.catch completion
  } else {
    // Call into the Ameritrade api as soon as is ready,
    // but for now call into the free IEX api
    const self = this
    const IEX_BASE = 'https://api.iextrading.com/1.0/'
    const request = axios
      .get(`${IEX_BASE}tops/last?symbols=${symbol}`)
      .then((res) => {
        self.value = res.data[0].price
        return self.value
      })
      .catch((error) => {
        return error
      })
    return request //let caller handle the promise's .then/.catch completion
  }
}

export default getFillPrice
