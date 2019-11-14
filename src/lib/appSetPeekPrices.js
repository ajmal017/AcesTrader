// appSetPeekPrices

import { resetPeekPrices, putPeekLastPrice, finishPeekPrices } from './appLastPeekPrice'
import { getIEXBatchData } from './apiGetIEXBatchData'

export const setPeekPrices = async (state) => {
  resetPeekPrices() //reset the list of prices for new content now
  const options = { peekData: true, priceData: false }
  await getIEXBatchData(state, options)
  finishPeekPrices() //this completes the list of prices for use in Charts dashboards
}
