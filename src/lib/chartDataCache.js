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

export const resetDataCache = () => {
  dataCache.staleCharts = true
  dataCache.dailyPrices = {}
  dataCache.weeklyPrices = {}
  dataCache.monthlyPrices = {}
  dataCache.ema20 = {}
  dataCache.ema50 = {}
  dataCache.sma10 = {}
  dataCache.sma40 = {}
  dataCache.sma200 = {}
  dataCache.smaTrading = {}
  dataCache.last20Closes = {}
  dataCache.tradeMarkers = {}
  dataCache.legendItems = {}
  dataCache.equityCharts = {}
}

var dataCache = {
  // keyed by data category
  staleCharts: true, //boolean set to force chart data update
  dailyPrices: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,open,high,low,close,volume}, ...]
  },
  weeklyPrices: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,open,high,low,close,volume}, ...]
  },
  monthlyPrices: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,open,high,low,close,volume}, ...]
  },
  sma200: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,sma-value}, ...]
  },
  sma40: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,sma-value}, ...]
  },
  sma10: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,sma-value}, ...]
  },
  last20Closes: {
    // dictionary of key/value pairs
    // key=symbol, value=array of the last 20 daily close objects [{date,close}...]
  },
  tradeMarkers: {
    // dictionary of key/value pairs
    // key=symbol, value=array of MG.data_graphic marker objects [{date,label}...]
  },
  legendItems: {
    // dictionary of key/value pairs
    // key=symbol, value=array of legend objects [{date,label}...]
  },
  equityCharts: {
    // dictionary of key/value pairs
    // key=symbol, value=array of objects [{date,close}, ...]
  },
}

export const setStaleCharts = (status) => {
  dataCache.staleCharts = status
}
export const getStaleCharts = () => {
  return dataCache.staleCharts
}

export const putEquityChart = (symbol, data) => {
  dataCache.equityCharts[symbol] = cloneDeep(data)
}
export const getEquityChart = (symbol) => {
  if (dataCache.equityCharts[symbol]) {
    let equityCharts = cloneDeep(dataCache.equityCharts[symbol])
    return equityCharts
  } else {
    return null
  }
}

export const putTradeMarker = (symbol, data) => {
  dataCache.tradeMarkers[symbol] = cloneDeep(data) // data is an array of marker objects [{date,label}...]
}
export const getTradeMarkers = (symbol) => {
  if (dataCache.tradeMarkers[symbol]) {
    let tradeMarkers = cloneDeep(dataCache.tradeMarkers[symbol])
    return tradeMarkers
  } else {
    return null
  }
}

export const putLegendItem = (symbol, data) => {
  dataCache.legendItems[symbol] = cloneDeep(data) // data is an array of legend objects [{date,label}...]
}
export const getLegendItems = (symbol) => {
  if (dataCache.legendItems[symbol]) {
    let legendItems = cloneDeep(dataCache.legendItems[symbol])
    return legendItems
  } else {
    return null
  }
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

export const putSmaTradingData = (symbol, data) => {
  dataCache.smaTrading[symbol] = cloneDeep(data)
}
export const getSmaTradingData = (symbol) => {
  if (dataCache.smaTrading[symbol]) {
    let smaData = cloneDeep(dataCache.smaTrading[symbol])
    return smaData
  } else {
    return null
  }
}
export const getLastSmaTradingPrice = (symbol) => {
  if (dataCache.smaTrading[symbol]) {
    let smaTradingArray = dataCache.smaTrading[symbol]
    let lastTradingPrice = smaTradingArray[smaTradingArray.length - 1]
    return lastTradingPrice.close
  } else {
    return null
  }
}



export const putSma200Data = (symbol, data) => {
  dataCache.sma200[symbol] = cloneDeep(data)
}
export const getSma200Data = (symbol) => {
  if (dataCache.sma200[symbol]) {
    let smaData = cloneDeep(dataCache.sma200[symbol])
    return smaData
  } else {
    return null
  }
}
export const getLastSma200Price = (symbol) => {
  if (dataCache.sma200[symbol]) {
    let sma200Array = dataCache.sma200[symbol]
    let lastSma200 = sma200Array[sma200Array.length - 1]
    return lastSma200
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

export const putSma10Data = (symbol, data) => {
  dataCache.sma10[symbol] = cloneDeep(data)
}
export const getSma10Data = (symbol) => {
  if (dataCache.sma10[symbol]) {
    let smaData = cloneDeep(dataCache.sma10[symbol])
    return smaData
  } else {
    return null
  }
}
export const getLastSma10Price = (symbol) => {
  if (dataCache.sma10[symbol]) {
    let sma10Array = dataCache.sma10[symbol]
    let lastSma10 = sma10Array[sma10Array.length - 1]
    return lastSma10
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
export const putMonthlyPriceData = (symbol, data) => {
  dataCache.monthlyPrices[symbol] = cloneDeep(data)
}
export const getMonthlyPriceData = (symbol) => {
  let monthlyPriceData = cloneDeep(dataCache.monthlyPrices[symbol])
  return monthlyPriceData
}

// // Note the below is just a boolean switch
// export const setPricesWeekly = (symbol, isWeekly) => {
//   dataCache.pricesWeekly[symbol] = isWeekly
// }
// export const arePricesWeekly = (symbol) => {
//   return dataCache.pricesWeekly[symbol]
// }
