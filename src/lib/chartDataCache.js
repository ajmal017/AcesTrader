// chartDataCache.js

// This is a static data store for charting data
// This is intialized each start up and does not need
// to be changed during a typical use of the program,
// since the price data changes only once a day.
// Symbols added via the List menu will be added here when first charted.
// To refresh to a newer day's data just restart the program.

// If symbols are added during use of the program then
// the new symbol's data will be obtained at that time.

var cloneDeep = require('lodash.clonedeep')

var dataCache = {
  // keyed by data category
  pricesWeekly: {
    // dictionary of key/value pairs
    // key=symbol, value=boolean true=weekly bars, false=daily bars
  },
  prices: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,open,high,low,close,volume}, ...]
  },
  ema20: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,ma-value}, ...]
  },
  ema50: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,ma-value}, ...]
  },
  sma40: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,ma-value}, ...]
  },
  sma200: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,ma-value}, ...]
  },
}

export const putSma40Data = (symbol, data) => {
  dataCache.sma40[symbol] = cloneDeep(data)
}
export const getSma40Data = (symbol) => {
  if (dataCache.sma40[symbol]) {
    let smaData = cloneDeep(dataCache.sma40[symbol])
    return smaData
  } else {
    return null
  }
}

export const getLastSma40Price = (symbol) => {
  if (dataCache.sma40[symbol]) {
    let sma40Array = dataCache.sma40[symbol]
    let lastSma40 = sma40Array[sma40Array.length - 1]
    return lastSma40
  } else {
    return null
  }
}

export const putPriceData = (symbol, data) => {
  dataCache.prices[symbol] = cloneDeep(data)
}
export const getPriceData = (symbol) => {
  let priceData = cloneDeep(dataCache.prices[symbol])
  return priceData
}
export const setPricesWeekly = (symbol, isWeekly) => {
  dataCache.pricesWeekly[symbol] = isWeekly
}
export const arePricesWeekly = (symbol) => {
  return dataCache.pricesWeekly[symbol]
}

export const resetCache = () => {
  localStorage.removeItem('dataCache') //clear old cache
}
