// apiGetIEXData.js

import axios from 'axios'
import iexData from '../iex.json'
// import fire from '../fire'

export const getIEXData = async function (symbol, range, closeOnly, useSandbox = false) {
    // if (process.env.NODE_ENV === 'development') {
    //   debugger
    // }

    const basehtml = useSandbox ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
    const token = useSandbox ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`
    // const basehtml = process.env.NODE_ENV === 'development' ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
    // const token = process.env.NODE_ENV === 'development' ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`
    const version = iexData.Version
    const query = closeOnly ? 'chartCloseOnly=true' : 'filter=date,open,high,low,close,volume'
    // console.log(`${basehtml}${version}/stock/${symbol}/chart/${range}?${query}&${token}`)
    // debugger // pause for developer
    try {
        const request = axios
            .get(`${basehtml}${version}/stock/${symbol}/chart/${range}?${query}&${token}`)

        // // ******* Use the free IEX api ********
        // range = '5y' // bump it
        // const IEX_BASE = 'https://api.iextrading.com/1.0/'
        // const filter = '?filter=date,minute,open,high,low,close,volume'
        // const request = axios
        //     .get(`${IEX_BASE}stock/${symbol}/chart/${range}${filter}`)
        // // ******* Use the free IEX api ********

        let res = await request
        let values = res.data
        let data = values.map((obj) => {
            let date = obj.date
            date = date + 'T15:00:00.000Z'
            obj.date = new Date(date)
            return obj
        })

        // // ******* Use the free IEX api ********
        // let myData = JSON.stringify(values)
        // fire
        //     .database()
        //     .ref(`symbols/${symbol}`)
        //     .set(myData, function (error) {
        //         if (error) {
        //             alert("Firebase: The database write failed while saving the symbol data. Error: " + error) //rude interruption to user
        //         }
        //     })
        // // ******* Use the free IEX api ********

        return data

    } catch (error) {
        console.log('getIEXData axios error:', error.message)
        // alert('getIEXData axios error: ' + error.message) //rude interruption to user
        debugger // pause for developer
    }
}


    //     .then((res) => {
    //         let values = res.data
    //         let data = values.map((obj) => {
    //             let date = obj.date
    //             date = date + 'T15:00:00.000Z'
    //             obj.date = new Date(date)
    //             return obj
    //         })
    //         return data
    //     })
    //     .catch((error) => {
    //         debugger // pause for developer
    //         return error
    //     })
    // return request //let caller handle the promise's .then/.catch completion}
