// appLoadPriceData.js

import { getIEXBatchData } from './apiGetIEXBatchData'

export const LoadPriceData = async function(state) {
  // Get all the price data series files from IEX and put in the state
  const options = { peekData: false, priceData: true }
  await getIEXBatchData(state, options)
}
