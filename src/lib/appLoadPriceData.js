// appLoadPriceData.js

import { getIEXBatchData } from './apiGetIEXBatchData'

// Supply the copied state to this function as it mutates the data BCM
export const loadPriceData = async function(state) {
  // Get all the price data series files from IEX and put in the state
  const options = { peekData: false, priceData: true }
  const priceDataArray = await getIEXBatchData(state, options)
  debugger // BCM ====

  do {
    console.log(JSON.stringify(priceDataArray, null, 2)) // a readable log of the state's json
    // note: you can Right click > Copy All in the Console panel to copy to clipboard
  } while (false) // BCM BCM
  debugger // BCM ====

  return priceDataArray
}
