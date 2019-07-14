// appGetSymbolPriceData.js

import { getIEXData } from '../lib/apiGetIEXData'
import { loadLocalDatabase, saveLocalDatabase } from '../lib/localDatabaseStorage'
import { setTheLocalDatabase } from '../lib/appSetTheLocalDatabase'
// import { clearLocalDatabase } from '../lib/localDatabaseStorage'
let cloneDeep = require('lodash.clonedeep')

export const getSymbolPriceData = async function (symbol, range, closeOnly, useSandbox) {

    // Allow for different versions of the symbol's price file
    const symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
    const date = new Date() // today's date

    // await clearLocalDatabase() //<==TEMP ===== use this to reset the DB content ==========
    // alert('Cleared The Local Database')
    // debugger

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

    await setTheLocalDatabase(date) // ensure the local DB will contain last trading day symbol price data
    try {
        // Get the price series from the local database cache if available
        let symbolData = await loadLocalDatabase(symbolKey)
        if (symbolData) {
            // symbol price data is available for yesterday's end-of-day prices
            // this data may have a constructed daily bar for today's prices (under development)
            let values = cloneDeep(symbolData)
            // format the dates for the required charting format
            let data = values.map((obj) => {
                let date = obj.date
                obj.date = new Date(date)
                return obj
            })
            return data
        } else {
            // Download the end-of-day price series for yesterday from IEX cloud
            let symbolData = await downloadSymbolData(symbol, range, closeOnly, useSandbox)
            await saveLocalDatabase(symbolKey, symbolData) // add new data for today
            // let testing = await loadLocalDatabase(symbolKey) //BCM test getting same object back
            // debugger //BCM
            return symbolData
        }
    } catch (err) {
        alert(`getSymbolPriceData(${symbolKey}) failed. Error=${err.message}`)
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
        alert(`getIEXData(${symbol}) failed in getSymbolPriceData. Error=${err.message}`)
        debugger
    }
}
