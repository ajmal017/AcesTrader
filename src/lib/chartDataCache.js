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

/**
 * This is envisioned as neccessary if the user
 * switches log-ins between live trading and
 * paper trading, since the price data is kept
 * by symbol with a selection of bar periods
 * which may not be in sync between these
 * two trading options. It forces a reload
 * of the symbol data at log-in.
 */
export const resetDataCache = () => {
  dataCache.pricesWeekly = {}
  dataCache.prices = {}
  dataCache.ema20 = {}
  dataCache.ema50 = {}
  dataCache.sma40 = {}
  dataCache.sma200 = {}
  dataCache.last20Closes = {}
}

var dataCache = {
  // keyed by data category

  pricesWeekly: {
    // object with one key/value pair
    // key=symbol, value=boolean: true=weekly bars, false=daily bars
  },
  dailyPrices: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,open,high,low,close,volume}, ...]
  },
  weeklyPrices: {
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
  last20Closes: {
    // dictionary of key/value pairs
    // key=symbol, value=array of the last 20 close objects [{close,date}...]
  },
}

export const putLast20Closes = (symbol, data) => {
  dataCache.last20Closes[symbol] = cloneDeep(data)
}

export const getLast20Closes = (symbol) => {
  if (dataCache.last20Closes[symbol]) {
    let last20Closes = cloneDeep(dataCache.last20Closes[symbol])
    return last20Closes
  } else {
    return null
  }
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

export const putDailyPriceData = (symbol, data) => {
  dataCache.dailyPrices[symbol] = cloneDeep(data)
}
export const getDailyPriceData = (symbol) => {
  let dailyPriceData = cloneDeep(dataCache.dailyPrices[symbol])
  return dailyPriceData
}
export const putWeeklyPriceData = (symbol, data) => {
  dataCache.weeklyPrices[symbol] = cloneDeep(data)
}
export const getWeeklyPriceData = (symbol) => {
  let weeklyPriceData = cloneDeep(dataCache.weeklyPrices[symbol])
  return weeklyPriceData
}

// Note the below is just a boolean switch
export const setPricesWeekly = (symbol, isWeekly) => {
  dataCache.pricesWeekly[symbol] = isWeekly
}
export const arePricesWeekly = (symbol) => {
  return dataCache.pricesWeekly[symbol]
}
