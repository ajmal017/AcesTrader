// appGetWatchedPrices.js
import { putWatchedPrice, finishWatchedPrices, resetWatchedPrices } from '../lib/appWatchedPrice'
const BASE_URL = 'https://api.iextrading.com/1.0/stock/market/batch'

const getWatchedPrices = (symbols) => {
  resetWatchedPrices() //reset the list of prices for use in Charts dashboards
  let filters = ['latestPrice']
  //   let filters = ['latestPrice', 'change', 'changePercent', 'marketCap']
  let url = `${BASE_URL}?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}`
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      symbols.forEach((symbol) => {
        let data = json[symbol]
        if (typeof data === 'undefined') return
        putWatchedPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
      })
      finishWatchedPrices() //this is the complete list of prices for use in Charts dashboards
    })
}
export default getWatchedPrices
