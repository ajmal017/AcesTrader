// appGetSymbolData.js

import { getIEXData } from '../lib/apiGetIEXData'
import { loadLocalDatabase, saveLocalDatabase } from '../lib/localDatabaseStorage'
import { setTheLocalDatabase } from '../lib/appSetTheLocalDatabase'
let cloneDeep = require('lodash.clonedeep')

export const getSymbolData = async function (symbol, range, closeOnly, useSandbox) {

    // Allow for different versions of the symbol's price file
    const symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
    const date = new Date() // today's date

    // await clearLocalDatabase() //<==TEMP ===== use this to reset the DB content ==========

    // //******************************** */
    // // const KEY1 = "testKey1"
    // // const VALUE1 = [{ date: "2019-5-7" }, { close: 111 }]
    // // await set(KEY1, VALUE1)
    // // const value1 = await get(KEY1)
    // // debugger
    // const KEY2 = "testKey2"
    // const VALUE2 = [{ date: "2010-5-7", close: 222 }, { date: "2010-9-7", close: 333 }]
    // await saveLocalDatabase(KEY2, VALUE2)
    // const value2 = await loadLocalDatabase(KEY2)
    // debugger
    // //******************************** */

    // // ******************************** */
    // const MetaKey = "MetaKey-DateObject"
    // // const theDay = date.getDay()
    // const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
    // const defaultMetaData = { "date": theDate } // a fresh metaData object with today's date
    // await saveLocalDatabase(MetaKey, defaultMetaData)
    // let metaData = await loadLocalDatabase(MetaKey) // get existing date marker if any
    // const metaDate = metaData.date
    // debugger
    // //******************************** */


    setTheLocalDatabase(date) // ensure the local DB will contain last trading day symbol price data
    try {
        let symbolData = await loadLocalDatabase(symbolKey) // get price series from the cache
        debugger //BCM
        if (symbolData) {
            // symbol price data is available for yesterday's end-of-day prices
            // this data may have a constructed daily bar for today's prices (under development)
            let values = cloneDeep(symbolData)
            // formate the dates for expected charting format
            let data = values.map((obj) => {
                let date = obj.date
                obj.date = new Date(date)
                return obj
            })
            return data
        }
    } catch (err) {
        alert(`loadLocalDatabase(${symbolKey}) failed in getSymbolData`)
        debugger
    }
    // Download an end-of-day price series for yesterday
    try {
        let symbolData = await downloadSymbolData(symbol, range, closeOnly, useSandbox)
        await saveLocalDatabase(symbolKey, symbolData) // added data for today
        // let testing = await loadLocalDatabase(symbolKey) // test get object back ==== BCM
        // debugger //BCM
        return symbolData
    } catch (err) {
        alert(`saveLocalDatabase(${symbolKey}, data) failed in getSymbolData`)
        debugger
    }
}

const downloadSymbolData = async function (symbol, range, closeOnly, useSandbox) {
    // get the symbol price series data from the IEX cloud
    let data = getIEXData(symbol, range, closeOnly, useSandbox)
    try {
        let symbolData = await data
        return symbolData
    } catch (err) {
        alert(`getIEXData(${symbol}) failed in getSymbolData`)
        debugger
    }
}
