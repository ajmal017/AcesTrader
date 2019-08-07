// appSetPeekPrices

import axios from 'axios'
import iexData from '../iex.json'
import { resetPeekPrices, putPeekLastPrice, finishPeekPrices } from './appLastPeekPrice'


export const setPeekPrices = async (state) => {
    const BATCH_SIZE = 100
    const buysSymbols = state.buys.map((obj) => obj.symbol)
    const sellsSymbols = state.sells.map((obj) => obj.symbol)
    const longsSymbols = state.longs.map((obj) => obj.symbol)
    const shortsSymbols = state.shorts.map((obj) => obj.symbol)
    const trendbuysSymbols = state.trendbuys.map((obj) => obj.symbol)
    const trendlongsSymbols = state.trendlongs.map((obj) => obj.symbol)
    const symbols = [...buysSymbols, ...sellsSymbols, ...longsSymbols, ...shortsSymbols, ...trendbuysSymbols, ...trendlongsSymbols]

    resetPeekPrices() //reset the list of prices for new content now

    let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
    for (let i = 0; i < numberOfBatches; i++) {
        let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
        await updateDataForBatch(symbolsBatch)
    }
    finishPeekPrices() //this completes the list of prices for use in Charts dashboards

    async function updateDataForBatch(symbols) {

        // ****************************************************
        // const useSandbox = process.env.NODE_ENV === 'development' ? true : false // development gets junk ohlc values to test with, but free downloads. 
        const useSandbox = false // Set to false to use real ohlc values, but usage rates apply
        // ****************************************************

        const basehtml = useSandbox ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
        const token = useSandbox ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`
        const version = iexData.Version
        let filters = ['latestPrice', 'change', 'changePercent', 'marketCap']

        // console.log(`### appSetPeekPrices ###`)
        // debugger // pause for developer

        try {
            const request = axios
                .get(`${basehtml}${version}/stock/market/batch?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}&${token}`)
            let res = await request
            let values = res.data
            for (let symbol in values) {
                let data = values[symbol]
                if (typeof data !== 'undefined') {
                    putPeekLastPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
                }
            }
            return true // resolve promise
        } catch (error) {
            console.log('appSetPeekPrices.js axios error:' + error.message)
            // alert('Peek/index.js axios error: ' + error.message) //rude interruption to user
            debugger // pause for developer
        }
    }

}