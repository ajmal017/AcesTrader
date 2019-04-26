// appCleanSymbolData.js

export const cleanSymbolData = function (data) {
    let open, high, low, close, volume
    let closeOnly
    if (data[0].open === undefined && data[0].high === undefined && data[0].low === undefined && data[0].close > 0) {
        closeOnly = true
    } else {
        closeOnly = false
    }
    let cleanData = []
    if (closeOnly) {
        for (let k = 0; k < data.length; k++) {
            // data is array of daily price objects with only Close price information
            if (data[k].close > 0) {
                // this day's price object is valid, so save its data for possible use tomorrow
                close = data[k].close
                volume = data[k].volume
                cleanData.push(data[k])
            } else if (close) {
                // this day's price object is bad, and yesterday's data is available
                // so we create a dummy object for today with the saved data
                // keeping the last saved valid data available
                data[k].close = close
                data[k].volume = volume
                cleanData.push(data[k])
            }
            // bad data is in first object in the array
            // no replacement data is available
        }
    } else {
        for (let k = 0; k < data.length; k++) {
            // data is array of daily price objects with OHLC price information
            if (data[k].open > 0 && data[k].high > 0 && data[k].low > 0 && data[k].close > 0) {
                // this day's price object is valid, so save its data for possible use tomorrow
                open = data[k].open
                high = data[k].high
                low = data[k].low
                close = data[k].close
                volume = data[k].volume
                cleanData.push(data[k])
            } else if (close) {
                // this day's price object is bad, and yesterday's data is available
                // so we create a dummy object for today with the saved data
                // keeping the last saved valid data available
                data[k].open = open
                data[k].high = high
                data[k].low = low
                data[k].close = close
                data[k].volume = volume
                cleanData.push(data[k])
            }
            // bad data is in first object in the array
            // no replacement data is available
        }
    }
    return cleanData
}
